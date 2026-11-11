import { create } from 'zustand';

import { caseApi } from '@/api/caseApi';
import type { CaseResponse, CaseStatus as CaseStatusCode, CaseSummaryResponse, CreateCaseRequest, UpdateCaseRequest } from '@/api/caseApi';
import { getErrorMessage } from '@/api/errorMessage';
import type { ApiError } from '@/api/types';

type CaseStatus = 'idle' | 'loading' | 'success' | 'error';

type SaveStatus = 'idle' | 'saving' | 'error';

const SUMMARY_MAX_LENGTH = 60;

// 상세 응답으로 목록 항목을 만든다. summary는 상세에 없어 스웨거 설명대로(경위 앞 60자, 넘치면 끝에 '…') 직접 만든다.
// 다음 목록 조회(fetchCases)가 서버 값으로 바로잡는다.
function toSummaryItem(detail: CaseResponse): CaseSummaryResponse {
  const description = detail.description ?? '';
  return {
    id: detail.id,
    title: detail.title,
    caseNumber: detail.caseNumber,
    accidentType: detail.accidentType,
    accidentTypeLabel: detail.accidentTypeLabel,
    accidentDate: detail.accidentDate,
    status: detail.status,
    progress: detail.progress,
    hasWorkStop: detail.hasWorkStop,
    treatmentStartDate: detail.treatmentStartDate,
    treatmentEndDate: detail.treatmentEndDate,
    summary: description
      ? description.length > SUMMARY_MAX_LENGTH
        ? `${description.slice(0, SUMMARY_MAX_LENGTH)}…`
        : description
      : null,
    createdAt: detail.createdAt,
    updatedAt: detail.updatedAt,
  };
}

type CaseState = {
  cases: CaseSummaryResponse[];
  listStatus: CaseStatus;
  // 마지막 목록 조회가 성공했는지. 다시 불러오는 동안은 이전 값을 유지하고, 실패하거나 reset되면 false다(빈 상태를 깜빡이지 않고 그리기 위함).
  listLoaded: boolean;
  details: Record<number, CaseResponse>;
  errorMessage: string | null;
  saveStatus: SaveStatus;
  fetchCases: () => Promise<void>;
  fetchCase: (id: number) => Promise<void>;
  createCase: (request: CreateCaseRequest) => Promise<CaseResponse | null>;
  updateCase: (id: number, request: UpdateCaseRequest) => Promise<CaseResponse | null>;
  // 케이스 상태 변경. 응답(progress 포함)을 상세와 목록에 반영한다. 성공하면 true.
  changeStatus: (id: number, status: CaseStatusCode) => Promise<boolean>;
  reset: () => void;
};

// 요청이 겹칠 때 오래된 응답이 최신 상태를 덮어쓰지 않도록 목록/상세(id별)에 각각 요청 식별값을 둔다.
let listSeq = 0;
const detailSeqs: Record<number, number> = {};
let saveSeq = 0;
let resetGeneration = 0;

// 케이스 내용은 개인 건강/사고 정보라 메모리(zustand)에만 두고 저장소·로그에 남기지 않는다.
export const useCaseStore = create<CaseState>((set) => ({
  cases: [],
  listStatus: 'idle',
  listLoaded: false,
  details: {},
  errorMessage: null,
  saveStatus: 'idle',

  fetchCases: async () => {
    const seq = ++listSeq;
    set({ listStatus: 'loading', errorMessage: null });
    try {
      const cases = await caseApi.getCases();
      if (seq !== listSeq) return;
      set({ cases, listStatus: 'success', listLoaded: true });
    } catch (e) {
      if (seq !== listSeq) return;
      // TODO(디자인 필요): 목록 화면에 로딩/오류/빈 상태 UI가 시안에 없어 상태값만 남긴다.
      set({ listStatus: 'error', listLoaded: false, errorMessage: getErrorMessage(e as ApiError) });
    }
  },

  fetchCase: async (id) => {
    const seq = (detailSeqs[id] = (detailSeqs[id] ?? 0) + 1);
    try {
      const detail = await caseApi.getCase(id);
      if (seq !== detailSeqs[id]) return;
      set((state) => ({ details: { ...state.details, [id]: detail } }));
    } catch (e) {
      if (seq !== detailSeqs[id]) return;
      // TODO(디자인 필요): 상세 화면에 오류 UI가 시안에 없어 이전 값을 그대로 둔다.
      set({ errorMessage: getErrorMessage(e as ApiError) });
    }
  },

  // 저장 실패 시 요청·응답 내용은 남기지 않고 상태만 error로 둔다(문구는 화면이 고정 문구로 보여준다).
  createCase: async (request) => {
    const seq = ++saveSeq;
    set({ saveStatus: 'saving' });
    try {
      const created = await caseApi.createCase(request);
      if (seq !== saveSeq) return null;
      // 진행 중인 상세 조회가 저장 이전 값으로 덮어쓰지 않게 무효화한다(목록은 listStatus가 loading에 걸리지 않게 그대로 둔다).
      detailSeqs[created.id] = (detailSeqs[created.id] ?? 0) + 1;
      set((state) => ({
        cases: [toSummaryItem(created), ...state.cases.filter((item) => item.id !== created.id)],
        details: { ...state.details, [created.id]: created },
        saveStatus: 'idle',
      }));
      return created;
    } catch {
      if (seq === saveSeq) set({ saveStatus: 'error' });
      return null;
    }
  },

  updateCase: async (id, request) => {
    const seq = ++saveSeq;
    set({ saveStatus: 'saving' });
    try {
      const updated = await caseApi.updateCase(id, request);
      if (seq !== saveSeq) return null;
      detailSeqs[id] = (detailSeqs[id] ?? 0) + 1;
      set((state) => ({
        cases: state.cases.map((item) => (item.id === id ? toSummaryItem(updated) : item)),
        details: { ...state.details, [id]: updated },
        saveStatus: 'idle',
      }));
      return updated;
    } catch {
      if (seq === saveSeq) set({ saveStatus: 'error' });
      return null;
    }
  },

  changeStatus: async (id, status) => {
    const generation = resetGeneration;
    try {
      const updated = await caseApi.changeCaseStatus(id, status);
      if (generation !== resetGeneration) return true;
      // 진행 중인 상세 조회가 변경 이전 값으로 덮어쓰지 않게 무효화한다.
      detailSeqs[id] = (detailSeqs[id] ?? 0) + 1;
      set((state) => ({
        cases: state.cases.map((item) => (item.id === id ? toSummaryItem(updated) : item)),
        details: { ...state.details, [id]: updated },
      }));
      return true;
    } catch {
      return false;
    }
  },

  reset: () => {
    resetGeneration += 1;
    saveSeq += 1;
    listSeq += 1;
    for (const key of Object.keys(detailSeqs)) detailSeqs[Number(key)] += 1;
    set({ cases: [], listStatus: 'idle', listLoaded: false, details: {}, errorMessage: null, saveStatus: 'idle' });
  },
}));
