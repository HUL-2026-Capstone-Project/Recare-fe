import { create } from 'zustand';

import type { TermsType } from '@/api/authApi';
import { userApi } from '@/api/userApi';
import type { TermsAgreementResponse } from '@/api/userApi';
import { TERMS_ITEMS } from '@/features/auth/constants/terms';

export type TermsLoadStatus = 'idle' | 'loading' | 'loaded' | 'error';

// 종류별 동의 시각(agreedAt). null이면 동의하지 않은 것이다.
export type TermsAgreements = Record<TermsType, string | null>;

const EMPTY_AGREEMENTS: TermsAgreements = { SERVICE: null, PRIVACY: null, SENSITIVE: null, MARKETING: null };

type TermsState = {
  status: TermsLoadStatus;
  agreements: TermsAgreements;
  fetchAgreements: () => Promise<void>;
  // 추가 동의. 성공하면 true. 처리 중이거나 이미 동의한 종류는 다시 보내지 않고 false를 돌려준다.
  agree: (termsType: TermsType) => Promise<boolean>;
  reset: () => void;
};

// 로그아웃·화면 이탈·늦게 도착한 응답을 걸러내기 위한 요청 식별값
let requestSeq = 0;
const inFlight = new Set<TermsType>();
let resetGeneration = 0;

const KNOWN_TYPES = TERMS_ITEMS.map((item) => item.termsType);

// 알 수 없는 종류는 무시한다. 같은 종류가 여러 건(이력)이면 가장 최근 기록(agreedAt이 가장 늦은 것, 같으면 id가 큰 것)만 보고,
// 그 기록의 agreed가 true일 때만 동의로 본다. 서버가 최신 1건만 주든 이력 전체를 주든 같은 결과다.
export function pickAgreements(list: TermsAgreementResponse[]): TermsAgreements {
  const latest: Partial<Record<TermsType, TermsAgreementResponse>> = {};
  for (const item of list) {
    const type = item.termsType as TermsType;
    if (!KNOWN_TYPES.includes(type)) continue;
    const current = latest[type];
    if (!current || item.agreedAt > current.agreedAt || (item.agreedAt === current.agreedAt && item.id > current.id)) latest[type] = item;
  }
  const agreements: TermsAgreements = { ...EMPTY_AGREEMENTS };
  for (const type of KNOWN_TYPES) {
    const item = latest[type];
    if (item && item.agreed === true) agreements[type] = item.agreedAt;
  }
  return agreements;
}

function todayLocalIso(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

// 약관 동의 기록은 개인 정보라 메모리(zustand)에만 두고 저장소·로그에 남기지 않는다.
export const useTermsStore = create<TermsState>((set, get) => ({
  status: 'idle',
  agreements: EMPTY_AGREEMENTS,

  fetchAgreements: async () => {
    const seq = ++requestSeq;
    // 이미 받아 둔 값이 있으면 다시 불러오는 동안에도 그대로 보여준다.
    if (get().status !== 'loaded') set({ status: 'loading' });
    try {
      const list = await userApi.getTermsAgreements();
      if (seq !== requestSeq) return;
      set({ status: 'loaded', agreements: pickAgreements(list) });
    } catch {
      if (seq !== requestSeq) return;
      // 받아 둔 값이 있으면 그대로 두고, 없을 때만 실패 상태로 둔다.
      if (get().status !== 'loaded') set({ status: 'error' });
    }
  },

  agree: async (termsType) => {
    if (inFlight.has(termsType) || get().agreements[termsType] !== null) return false;
    const item = TERMS_ITEMS.find((i) => i.termsType === termsType);
    if (!item) return false;

    const generation = resetGeneration;
    inFlight.add(termsType);
    try {
      await userApi.agreeToTerms({ termsType, termsVersion: item.termsVersion });
      if (generation !== resetGeneration) return true;
      // 아직 도착하지 않은 이전 조회 응답이 방금 동의를 지우지 않게 한다.
      requestSeq += 1;
      set((state) => ({ agreements: { ...state.agreements, [termsType]: todayLocalIso() } }));
      // 서버 값으로 맞추는 조용한 재조회(실패해도 현재 화면 유지)
      void get().fetchAgreements();
      return true;
    } catch {
      return false;
    } finally {
      inFlight.delete(termsType);
    }
  },

  reset: () => {
    resetGeneration += 1;
    requestSeq += 1;
    inFlight.clear();
    set({ status: 'idle', agreements: EMPTY_AGREEMENTS });
  },
}));
