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

export type LoginIdAvailabilityResponse = {
  loginId: string;
  available: boolean;
};

// 스웨거 enum: SIGNUP | FIND_ID | RESET_PASSWORD
export type VerifyPurpose = 'SIGNUP' | 'FIND_ID' | 'RESET_PASSWORD';

export type VerifySendRequest = { phone: string; purpose?: VerifyPurpose };
export type VerifyCheckRequest = { phone: string; code: string; purpose?: VerifyPurpose };
export type VerifyCheckResponse = { verified: boolean };

export type EmailVerifySendRequest = { email: string; purpose?: VerifyPurpose };
export type EmailVerifyCheckRequest = { email: string; code: string; purpose?: VerifyPurpose };

// carrier는 스웨거 패턴 ^(SKT|KT|LGU|MVNO)$
export type SignUpRequest = {
  name: string;
  loginId: string;
  password: string;
  residentFront: string;
  residentGenderDigit: string;
  carrier: string;
  phone: string;
  address: string;
  email?: string;
};

export type FindIdByPhoneRequest = { name: string; carrier: string; phone: string; code: string };
export type FindIdByEmailRequest = { name: string; email: string; code: string };
export type Account = { maskedLoginId: string; joinedAt: string };
export type FindIdResponse = { accounts: Account[] };

export type PasswordResetVerifyByPhoneRequest = { loginId: string; carrier: string; phone: string; code: string };
export type PasswordResetVerifyByEmailRequest = { loginId: string; email: string; code: string };
export type PasswordResetTokenResponse = { resetToken: string; expiresInSeconds: number };

export type PasswordResetRequest = { resetToken: string; newPassword: string };
export type PasswordChangeRequest = { currentPassword: string; newPassword: string };

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

  async checkLoginId(loginId: string): Promise<LoginIdAvailabilityResponse> {
    const { data } = await apiClient.get<LoginIdAvailabilityResponse>('/api/v1/auth/check-id', {
      params: { loginId },
    });
    return data;
  },

  async sendVerifyCode(payload: VerifySendRequest): Promise<void> {
    await apiClient.post('/api/v1/auth/verify/send', payload);
  },

  async checkVerifyCode(payload: VerifyCheckRequest): Promise<VerifyCheckResponse> {
    const { data } = await apiClient.post<VerifyCheckResponse>('/api/v1/auth/verify/check', payload);
    return data;
  },

  async signup(payload: SignUpRequest): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/api/v1/auth/signup', payload);
    return data;
  },

  async sendEmailVerifyCode(payload: EmailVerifySendRequest): Promise<void> {
    await apiClient.post('/api/v1/auth/email/verify/send', payload);
  },

  async checkEmailVerifyCode(payload: EmailVerifyCheckRequest): Promise<VerifyCheckResponse> {
    const { data } = await apiClient.post<VerifyCheckResponse>('/api/v1/auth/email/verify/check', payload);
    return data;
  },

  async findIdByPhone(payload: FindIdByPhoneRequest): Promise<FindIdResponse> {
    const { data } = await apiClient.post<FindIdResponse>('/api/v1/auth/find-id/phone', payload);
    return data;
  },

  async findIdByEmail(payload: FindIdByEmailRequest): Promise<FindIdResponse> {
    const { data } = await apiClient.post<FindIdResponse>('/api/v1/auth/find-id/email', payload);
    return data;
  },

  async verifyPasswordResetByPhone(payload: PasswordResetVerifyByPhoneRequest): Promise<PasswordResetTokenResponse> {
    const { data } = await apiClient.post<PasswordResetTokenResponse>(
      '/api/v1/auth/password/reset/verify/phone',
      payload
    );
    return data;
  },

  async verifyPasswordResetByEmail(payload: PasswordResetVerifyByEmailRequest): Promise<PasswordResetTokenResponse> {
    const { data } = await apiClient.post<PasswordResetTokenResponse>(
      '/api/v1/auth/password/reset/verify/email',
      payload
    );
    return data;
  },

  async resetPassword(payload: PasswordResetRequest): Promise<void> {
    await apiClient.post('/api/v1/auth/password/reset', payload);
  },

  // UI 연결 없음(화면 자체가 시안에 없음) — 함수만 준비
  async changePassword(payload: PasswordChangeRequest): Promise<void> {
    await apiClient.put('/api/v1/auth/password', payload);
  },
};
