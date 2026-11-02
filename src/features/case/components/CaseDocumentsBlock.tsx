import { useEffect, useState } from 'react';

import { EMPTY_SECTION } from '@/store/caseProgressStore';
import { useCaseDocumentStore } from '@/store/caseDocumentStore';
import { DOC_MESSAGES } from '../documentFormat';
import { DocDeleteModal } from './DocDeleteModal';
import { DocumentDetailSheet } from './DocumentDetailSheet';
import { DocumentsSection } from './DocumentsSection';
import { UploadSheet } from './UploadSheet';

type Sheet = { kind: 'upload' } | { kind: 'detail'; id: number } | { kind: 'delete'; id: number } | null;

type Props = {
  caseId: number;
  // 시트와 모달이 닫힌 뒤 화면 토스트로 알린다.
  showToast: (message: string) => void;
};

// 케이스 상세의 서류 섹션과 거기서 여는 시트·모달. 시트는 열 때마다 새로 마운트되어 입력값이 매번 초기화된다.
export function CaseDocumentsBlock({ caseId, showToast }: Props) {
  const section = useCaseDocumentStore((state) => state.documents[caseId]) ?? EMPTY_SECTION;
  const documentTypes = useCaseDocumentStore((state) => state.documentTypes);
  const loadDocuments = useCaseDocumentStore((state) => state.loadDocuments);
  const loadDocumentTypes = useCaseDocumentStore((state) => state.loadDocumentTypes);
  const requestReview = useCaseDocumentStore((state) => state.requestReview);
  const remove = useCaseDocumentStore((state) => state.remove);
  const download = useCaseDocumentStore((state) => state.download);

  const [sheet, setSheet] = useState<Sheet>(null);
  const [deleting, setDeleting] = useState(false);

  // 케이스 상세에 들어올 때 서류 목록과 종류 목록을 함께 불러온다(받아 둔 값이 있으면 보여주면서 다시 불러온다).
  useEffect(() => {
    loadDocuments(caseId);
    loadDocumentTypes();
  }, [caseId, loadDocuments, loadDocumentTypes]);

  const handleAdd = async () => {
    // 종류 목록을 못 받았으면 한 번 다시 불러보고, 그래도 안 되면 시트를 열지 않는다.
    const ready = documentTypes.status === 'loaded' || (await loadDocumentTypes());
    if (ready) setSheet({ kind: 'upload' });
    else showToast(DOC_MESSAGES.loadFailed);
  };

  const closeWithToast = (message: string) => {
    setSheet(null);
    showToast(message);
  };

  const doc = sheet && sheet.kind !== 'upload' ? section.items.find((item) => item.id === sheet.id) : undefined;

  return (
    <>
      <DocumentsSection section={section} onAdd={handleAdd} onRetry={() => loadDocuments(caseId)} onOpen={(item) => setSheet({ kind: 'detail', id: item.id })} />

      {sheet?.kind === 'upload' && <UploadSheet caseId={caseId} types={documentTypes.items} onClose={() => setSheet(null)} onToast={showToast} />}

      {sheet?.kind === 'detail' && doc && (
        <DocumentDetailSheet
          doc={doc}
          onClose={() => setSheet(null)}
          onDownload={async () => {
            const ok = await download(caseId, doc);
            if (!ok) closeWithToast(DOC_MESSAGES.downloadFailed);
            return ok;
          }}
          onReview={async () => {
            const ok = await requestReview(caseId, doc.id);
            if (ok) setSheet(null);
            else closeWithToast(DOC_MESSAGES.changeFailed);
            return ok;
          }}
          onDelete={() => setSheet({ kind: 'delete', id: doc.id })}
        />
      )}

      {sheet?.kind === 'delete' && doc && (
        <DocDeleteModal
          deleting={deleting}
          onCancel={() => setSheet({ kind: 'detail', id: doc.id })}
          onConfirm={async () => {
            setDeleting(true);
            const ok = await remove(caseId, doc.id);
            setDeleting(false);
            if (ok) setSheet(null);
            else closeWithToast(DOC_MESSAGES.changeFailed);
          }}
        />
      )}
    </>
  );
}
