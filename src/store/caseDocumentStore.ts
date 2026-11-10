import { Directory, File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { create } from 'zustand';

import { documentApi } from '@/api/documentApi';
import type { CaseDocumentResponse, DocumentTypeResponse, UploadFile } from '@/api/documentApi';
import type { ApiError } from '@/api/types';
import { downloadFileName, sortDocuments } from '@/features/case/documentFormat';
import type { Section } from './caseProgressStore';

export type UploadResult = 'ok' | 'size' | 'format' | 'failed';

type CaseDocumentState = {
  documentTypes: Section<DocumentTypeResponse>;
  documents: Record<number, Section<CaseDocumentResponse>>;
  // 종류 목록을 받아 두었으면 true. 못 받았으면 한 번 더 불러본다.
  loadDocumentTypes: () => Promise<boolean>;
  loadDocuments: (caseId: number) => Promise<void>;
  // 성공하면 목록을 다시 불러온다.
  upload: (caseId: number, documentTypeId: number, file: UploadFile) => Promise<UploadResult>;
  // 성공하면 응답으로 해당 항목을 바꾼다.
  requestReview: (caseId: number, documentId: number) => Promise<boolean>;
  remove: (caseId: number, documentId: number) => Promise<boolean>;
  // 받은 파일을 캐시에 쓰고 공유 시트로 연다. 공유할 수 없으면 실패다.
  download: (caseId: number, doc: CaseDocumentResponse) => Promise<boolean>;
  reset: () => void;
};

// 같은 케이스의 목록 요청이 겹치면 최신 요청만 반영하고, reset(로그아웃) 뒤에 도착한 응답은 버린다.
const documentSeqs: Record<number, number> = {};
let typesSeq = 0;
let resetGeneration = 0;

// 내려받은 서류 파일은 캐시 폴더 안의 이 전용 하위 폴더에만 쓴다. 정리할 때 이 폴더만 지워 다른 캐시 파일은 건드리지 않는다.
const DOWNLOAD_DIR_NAME = 'case-documents';
const getDownloadDir = () => new Directory(Paths.cache, DOWNLOAD_DIR_NAME);

// 삭제 실패는 무시한다(새 다운로드와 로그아웃을 막지 않는다).
function clearDownloadedDocuments() {
  try {
    const dir = getDownloadDir();
    if (dir.exists) dir.delete();
  } catch {
    // 정리는 최선 노력이다.
  }
}

const bump = (caseId: number) => (documentSeqs[caseId] = (documentSeqs[caseId] ?? 0) + 1);

// 서류 정보와 내려받은 파일은 개인 정보라 메모리(zustand)와 캐시 파일로만 다루고 로그에 남기지 않는다.
export const useCaseDocumentStore = create<CaseDocumentState>((set, get) => ({
  documentTypes: { status: 'idle', items: [] },
  documents: {},

  loadDocumentTypes: async () => {
    const seq = ++typesSeq;
    if (get().documentTypes.status !== 'loaded') set({ documentTypes: { status: 'loading', items: [] } });
    try {
      const items = await documentApi.getDocumentTypes();
      if (seq !== typesSeq) return get().documentTypes.status === 'loaded';
      set({ documentTypes: { status: 'loaded', items } });
      return true;
    } catch {
      if (seq !== typesSeq) return get().documentTypes.status === 'loaded';
      if (get().documentTypes.status !== 'loaded') set({ documentTypes: { status: 'error', items: [] } });
      return get().documentTypes.status === 'loaded';
    }
  },

  loadDocuments: async (caseId) => {
    const seq = bump(caseId);
    if (get().documents[caseId]?.status !== 'loaded') {
      set((state) => ({ documents: { ...state.documents, [caseId]: { status: 'loading', items: [] } } }));
    }
    try {
      const items = sortDocuments(await documentApi.getDocuments(caseId));
      if (seq !== documentSeqs[caseId]) return;
      set((state) => ({ documents: { ...state.documents, [caseId]: { status: 'loaded', items } } }));
    } catch {
      if (seq !== documentSeqs[caseId]) return;
      // 받아 둔 목록이 있으면 그대로 두고, 없을 때만 실패 상태로 둔다.
      set((state) =>
        state.documents[caseId]?.status === 'loaded'
          ? state
          : { documents: { ...state.documents, [caseId]: { status: 'error', items: [] } } }
      );
    }
  },

  upload: async (caseId, documentTypeId, file) => {
    const generation = resetGeneration;
    try {
      await documentApi.uploadDocument(caseId, documentTypeId, file);
    } catch (e) {
      const status = (e as ApiError).status;
      if (status === 413) return 'size';
      if (status === 400) return 'format';
      return 'failed';
    }
    if (generation === resetGeneration) await get().loadDocuments(caseId);
    return 'ok';
  },

  requestReview: async (caseId, documentId) => {
    const generation = resetGeneration;
    try {
      const updated = await documentApi.requestReview(caseId, documentId);
      if (generation === resetGeneration) {
        bump(caseId);
        set((state) => {
          const section = state.documents[caseId];
          if (!section) return state;
          return {
            documents: {
              ...state.documents,
              [caseId]: { ...section, items: section.items.map((d) => (d.id === documentId ? updated : d)) },
            },
          };
        });
      }
      return true;
    } catch {
      return false;
    }
  },

  remove: async (caseId, documentId) => {
    const generation = resetGeneration;
    try {
      await documentApi.deleteDocument(caseId, documentId);
      if (generation === resetGeneration) {
        bump(caseId);
        set((state) => {
          const section = state.documents[caseId];
          if (!section) return state;
          return {
            documents: { ...state.documents, [caseId]: { ...section, items: section.items.filter((d) => d.id !== documentId) } },
          };
        });
      }
      return true;
    } catch {
      return false;
    }
  },

  download: async (caseId, doc) => {
    try {
      if (!(await Sharing.isAvailableAsync())) return false;
      // 공유 직후에는 받는 앱이 파일을 읽는 중일 수 있어 지우지 않고, 이전 다운로드 파일은 새 다운로드 직전에 지운다.
      clearDownloadedDocuments();
      const bytes = await documentApi.downloadDocument(caseId, doc.id);
      const dir = getDownloadDir();
      dir.create({ intermediates: true, idempotent: true });
      const file = new File(dir, downloadFileName(doc));
      if (file.exists) file.delete();
      file.create();
      file.write(bytes);
      await Sharing.shareAsync(file.uri, { mimeType: doc.contentType });
      return true;
    } catch {
      return false;
    }
  },

  reset: () => {
    clearDownloadedDocuments();
    resetGeneration += 1;
    typesSeq += 1;
    for (const key of Object.keys(documentSeqs)) documentSeqs[Number(key)] += 1;
    set({ documentTypes: { status: 'idle', items: [] }, documents: {} });
  },
}));
