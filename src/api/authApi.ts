import { apiClient } from './client';

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
};

export type TokenRefreshResponse = {
  accessToken: string;
  tokenType: string;
};

export const authApi = {
  async signin(loginId: string, password: string): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/api/v1/auth/signin', { loginId, password });
    return data;
  },

  async refresh(refreshToken: string): Promise<TokenRefreshResponse> {
    const { data } = await apiClient.post<TokenRefreshResponse>('/api/v1/auth/token/refresh', { refreshToken });
    return data;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post('/api/v1/auth/logout', { refreshToken });
  },
};
