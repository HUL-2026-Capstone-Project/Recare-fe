import { create } from 'zustand';

import { benefitApi } from '@/api/benefitApi';
import type {
  BenefitCalculationResponse,
  BenefitHistoryResponse,
  BenefitInputRequest,
  BenefitResponse,
} from '@/api/benefitApi';
import { getErrorMessage } from '@/api/errorMessage';
import type { ApiError } from '@/api/types';

type BenefitStatus = 'idle' | 'loading' | 'success' | 'error';

type BenefitState = {
  input: BenefitResponse | null;
  result: BenefitCalculationResponse | null;
  histories: BenefitHistoryResponse[];
  status: BenefitStatus;
  errorMessage: string | null;
  fetchBenefit: (caseId: number) => Promise<void>;
  calculate: (caseId: number, request: BenefitInputRequest) => Promise<void>;
  reset: () => void;
};

// 요청이 겹칠 때 오래된 응답이 최신 상태를 덮어쓰지 않도록 쓰는 요청 식별값.
let requestSeq = 0;

// 임금·요양기간·계산 금액은 메모리(zustand)에만 둔다. 저장소에 쓰지 않고 로그로도 남기지 않는다.
// 로그아웃 시 reset()을 호출해야 한다(화면 연결 시 authStore.logout과 함께 처리 필요).
export const useBenefitStore = create<BenefitState>((set) => ({
  input: null,
  result: null,
  histories: [],
  status: 'idle',
  errorMessage: null,

  fetchBenefit: async (caseId) => {
    const seq = ++requestSeq;
    set({ status: 'loading', errorMessage: null });
    try {
      const [input, histories] = await Promise.all([
        benefitApi.getBenefit(caseId),
        benefitApi.getBenefitHistories(caseId),
      ]);
      if (seq !== requestSeq) return;
      set({ input, histories, status: 'success' });
    } catch (e) {
      if (seq !== requestSeq) return;
      // TODO(디자인 필요): 계산기에 로딩/오류 UI가 시안에 없어 상태값만 남긴다.
      set({ status: 'error', errorMessage: getErrorMessage(e as ApiError) });
    }
  },

  // 이미 입력값이 있어도 PATCH 후 계산하지 않고, calculate 본문에 현재 입력값을 담아 보낸다(서버가 저장 후 계산).
  calculate: async (caseId, request) => {
    const seq = ++requestSeq;
    set({ status: 'loading', errorMessage: null });
    try {
      const result = await benefitApi.calculateBenefit(caseId, request);
      if (seq !== requestSeq) return;
      // 계산 이력이 서버에 남으므로 목록을 다시 받아 최신순으로 맞춘다.
      const histories = await benefitApi.getBenefitHistories(caseId);
      if (seq !== requestSeq) return;
      set({ result, histories, status: 'success' });
    } catch (e) {
      if (seq !== requestSeq) return;
      set({ status: 'error', errorMessage: getErrorMessage(e as ApiError) });
    }
  },

  reset: () => {
    requestSeq += 1;
    set({ input: null, result: null, histories: [], status: 'idle', errorMessage: null });
  },
}));
