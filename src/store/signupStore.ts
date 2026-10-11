import { create } from 'zustand';

import { authApi } from '@/api/authApi';
import type { SignUpRequest } from '@/api/authApi';
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

type SignupState = {
  draft: SignupDraft | null;
  setStep1: (draft: SignupDraft) => void;
  // TODO: 아이디 중복 확인 버튼이 시안에 없어 호출 지점을 연결하지 않음
  checkLoginIdAvailability: (loginId: string) => Promise<boolean>;
  // TODO: 주소 입력 화면이 없어 아직 어디서도 호출하지 않음. 입력 UI가 생기면 address(, email)와 함께 호출
  submitSignup: (address: string, email?: string) => Promise<void>;
  reset: () => void;
};

export const useSignupStore = create<SignupState>((set, get) => ({
  draft: null,

  setStep1: (draft) => set({ draft }),

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
    };

    const res = await authApi.signup(payload);
    await tokenStorage.setTokens(res.accessToken, res.refreshToken, res.tokenType);
    useAuthStore.setState({ status: 'authenticated' });
    // 가입 성공 후 메모리에 있던 입력값(비밀번호, 주민번호 포함)을 비운다.
    set({ draft: null });
  },

  reset: () => set({ draft: null }),
}));
