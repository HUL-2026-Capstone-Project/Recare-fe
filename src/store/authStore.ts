import { create } from 'zustand';

import { authApi } from '@/api/authApi';
import { userApi } from '@/api/userApi';
import type { ApiError } from '@/api/types';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import { setForceLogoutHandler } from './authEvents';
import { useBenefitStore } from './benefitStore';
import { useCaseProgressStore } from './caseProgressStore';
import { useCaseStore } from './caseStore';
import { useChatStore } from './chatStore';
import { useHospitalStore } from './hospitalStore';
import { useMyStatsStore } from './myStatsStore';
import { useProfileStore } from './profileStore';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  hydrate: () => Promise<void>;
  login: (loginId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  withdraw: () => Promise<void>;
};

// 로그아웃(사용자/강제) 시 메모리에 남은 개인 정보가 다음 로그인으로 넘어가지 않도록 스토어를 비운다.
function clearSessionData() {
  useChatStore.getState().reset();
  useProfileStore.getState().reset();
  useCaseStore.getState().reset();
  useCaseProgressStore.getState().reset();
  useBenefitStore.getState().reset();
  useHospitalStore.getState().reset();
  useMyStatsStore.getState().reset();
}

export const useAuthStore = create<AuthState>((set) => ({
  status: 'loading',

  hydrate: async () => {
    const refreshToken = await tokenStorage.getRefreshToken();
    if (!refreshToken) {
      set({ status: 'unauthenticated' });
      return;
    }

    try {
      const res = await authApi.refresh(refreshToken);
      await tokenStorage.setAccessToken(res.accessToken, res.tokenType);
      set({ status: 'authenticated' });
    } catch (e) {
      const apiError = e as ApiError;
      const isClientRejection = apiError.status >= 400 && apiError.status < 500;
      if (isClientRejection) {
        await tokenStorage.clear();
      }
      // 네트워크 오류(status 0) 등 서버가 명시적으로 거부한 게 아니면 토큰은 유지한다.
      set({ status: 'unauthenticated' });
    }
  },

  login: async (loginId: string, password: string) => {
    const res = await authApi.signin(loginId, password);
    await tokenStorage.setTokens(res.accessToken, res.refreshToken, res.tokenType);
    set({ status: 'authenticated' });
  },

  logout: async () => {
    const refreshToken = await tokenStorage.getRefreshToken();
    try {
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch {
      // 서버 로그아웃 실패 여부와 무관하게 로컬 로그아웃은 진행한다.
    } finally {
      await tokenStorage.clear();
      clearSessionData();
      set({ status: 'unauthenticated' });
    }
  },

  // 탈퇴 성공 후에는 서버 로그아웃 호출 없이 로컬 토큰과 메모리 데이터만 정리한다. 실패하면 던져서 호출한 쪽이 처리한다.
  withdraw: async () => {
    await userApi.deleteUser();
    await tokenStorage.clear();
    clearSessionData();
    set({ status: 'unauthenticated' });
  },
}));

// 토큰 재발급 실패로 인한 강제 로그아웃은 logout()을 거치지 않으므로 같은 초기화를 직접 한다.
setForceLogoutHandler(() => {
  clearSessionData();
  useAuthStore.setState({ status: 'unauthenticated' });
});
