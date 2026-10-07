import { create } from 'zustand';

import { authApi } from '@/api/authApi';
import type { ApiError } from '@/api/types';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import { setForceLogoutHandler } from './authEvents';

export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

type AuthState = {
  status: AuthStatus;
  hydrate: () => Promise<void>;
  login: (loginId: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

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
      set({ status: 'unauthenticated' });
    }
  },
}));

setForceLogoutHandler(() => {
  useAuthStore.setState({ status: 'unauthenticated' });
});
