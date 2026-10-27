import { create } from 'zustand';

import { benefitApi } from '@/api/benefitApi';
import type {
  BenefitCalculationResponse,
  BenefitHistoryResponse,
  BenefitInputRequest,
  BenefitPreviewRequest,
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
  preview: (request: BenefitPreviewRequest) => Promise<void>;
  reset: () => void;
};

// 요청이 겹칠 때 오래된 응답이 최신 상태를 덮어쓰지 않도록 쓰는 요청 식별값.
let requestSeq = 0;

// 임금·요양기간·계산 금액은 메모리(zustand)에만 둔다. 저장소에 쓰지 않고 로그로도 남기지 않는다.
// 로그아웃(사용자/강제) 시 authStore가 reset()을 호출해 비운다.
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
      // 저장된 입력이 없는 케이스는 404다. 오류가 아니라 "저장된 입력 없음(빈 폼)"으로 보고 input을 null로 둔다.
      const [input, histories] = await Promise.all([
        benefitApi.getBenefit(caseId).catch((e: ApiError) => {
          if (e.status === 404) return null;
          throw e;
        }),
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

  // 케이스 없이 계산(저장·이력 없음). 결과만 보관하고 histories는 건드리지 않는다.
  preview: async (request) => {
    const seq = ++requestSeq;
    set({ status: 'loading', errorMessage: null });
    try {
      const result = await benefitApi.previewBenefit(request);
      if (seq !== requestSeq) return;
      set({ result, status: 'success' });
    } catch (e) {
      if (seq !== requestSeq) return;
      // TODO(디자인 필요): 계산기에 오류 UI가 시안에 없어 상태값만 남긴다.
      set({ status: 'error', errorMessage: getErrorMessage(e as ApiError) });
    }
  },

  reset: () => {
    requestSeq += 1;
    set({ input: null, result: null, histories: [], status: 'idle', errorMessage: null });
  },
}));
