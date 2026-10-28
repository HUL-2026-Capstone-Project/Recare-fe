import { create } from 'zustand';

import { authApi } from '@/api/authApi';
import type { SignUpRequest } from '@/api/authApi';
import { TERMS_ITEMS, buildTermsAgreements } from '@/features/auth/constants/terms';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import { useAuthStore } from './authStore';

type SignupDraft = {
  name: string;
  loginId: string;
  password: string;
  residentFront: string;
  residentGenderDigit: string;
  carrier: string; // 서버 코드(SKT|KT|LGU|MVNO), UI 라벨이 아님
  phone: string;
};

// 약관 동의 체크 상태. TERMS_ITEMS와 같은 순서·같은 길이의 배열이라 약관이 늘어도 길이를 따로 고치지 않는다.
const initialTermsAgree = () => TERMS_ITEMS.map(() => false);

type SignupState = {
  draft: SignupDraft | null;
  // 2단계 약관 동의 화면과 약관 상세 화면을 오가도 체크 상태가 유지되도록 스토어에 둔다.
  // 체크 상태는 가입 제출 시 요청의 termsAgreements로 함께 보낸다(POST /users/terms는 쓰지 않는다).
  termsAgree: boolean[];
  setStep1: (draft: SignupDraft) => void;
  setTermsAgree: (next: boolean[]) => void;
  checkLoginIdAvailability: (loginId: string) => Promise<boolean>;
  submitSignup: (address: string, email?: string) => Promise<void>;
  reset: () => void;
};

export const useSignupStore = create<SignupState>((set, get) => ({
  draft: null,
  termsAgree: initialTermsAgree(),

  setStep1: (draft) => set({ draft }),

  setTermsAgree: (next) => set({ termsAgree: next }),

  checkLoginIdAvailability: async (loginId) => {
    const res = await authApi.checkLoginId(loginId);
    return res.available;
  },

  submitSignup: async (address, email) => {
    const draft = get().draft;
    if (!draft) {
      throw new Error('signup draft is empty');
    }

    const payload: SignUpRequest = {
      name: draft.name,
      loginId: draft.loginId,
      password: draft.password,
      residentFront: draft.residentFront,
      residentGenderDigit: draft.residentGenderDigit,
      carrier: draft.carrier,
      phone: draft.phone,
      address,
      ...(email ? { email } : {}),
      termsAgreements: buildTermsAgreements(get().termsAgree),
    };

    const res = await authApi.signup(payload);
    await tokenStorage.setTokens(res.accessToken, res.refreshToken, res.tokenType);
    useAuthStore.setState({ status: 'authenticated' });
    // 가입 성공 후 메모리에 있던 입력값(비밀번호, 주민번호, 약관 체크 상태 포함)을 비운다.
    set({ draft: null, termsAgree: initialTermsAgree() });
  },

  reset: () => set({ draft: null, termsAgree: initialTermsAgree() }),
}));
