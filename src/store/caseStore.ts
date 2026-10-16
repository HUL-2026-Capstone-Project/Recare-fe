import { create } from 'zustand';

import { caseApi } from '@/api/caseApi';
import type { CaseResponse, CaseSummaryResponse } from '@/api/caseApi';
import { getErrorMessage } from '@/api/errorMessage';
import type { ApiError } from '@/api/types';

type CaseStatus = 'idle' | 'loading' | 'success' | 'error';

type CaseState = {
  cases: CaseSummaryResponse[];
  listStatus: CaseStatus;
  details: Record<number, CaseResponse>;
  errorMessage: string | null;
  fetchCases: () => Promise<void>;
  fetchCase: (id: number) => Promise<void>;
  reset: () => void;
};

// 요청이 겹칠 때 오래된 응답이 최신 상태를 덮어쓰지 않도록 목록/상세(id별)에 각각 요청 식별값을 둔다.
let listSeq = 0;
const detailSeqs: Record<number, number> = {};

// 케이스 내용은 개인 건강/사고 정보라 메모리(zustand)에만 두고 저장소·로그에 남기지 않는다.
export const useCaseStore = create<CaseState>((set) => ({
  cases: [],
  listStatus: 'idle',
  details: {},
  errorMessage: null,

  fetchCases: async () => {
    const seq = ++listSeq;
    set({ listStatus: 'loading', errorMessage: null });
    try {
      const cases = await caseApi.getCases();
      if (seq !== listSeq) return;
      set({ cases, listStatus: 'success' });
    } catch (e) {
      if (seq !== listSeq) return;
      // TODO(디자인 필요): 목록 화면에 로딩/오류/빈 상태 UI가 시안에 없어 상태값만 남긴다.
      set({ listStatus: 'error', errorMessage: getErrorMessage(e as ApiError) });
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

  reset: () => {
    listSeq += 1;
    for (const key of Object.keys(detailSeqs)) detailSeqs[Number(key)] += 1;
    set({ cases: [], listStatus: 'idle', details: {}, errorMessage: null });
  },
}));
