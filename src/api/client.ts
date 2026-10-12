import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import { triggerForceLogout } from '@/store/authEvents';
import type { ApiError, ApiFieldError } from './types';

const SIGNIN_PATH = '/api/v1/auth/signin';
const REFRESH_PATH = '/api/v1/auth/token/refresh';
// 스웨거에서 security:[]로 표시된(인증 불필요) 엔드포인트 전체.
// 요청에 Authorization을 붙이지 않고, 401을 받아도 재발급+재시도 대상에서 제외한다.
const NO_AUTH_PATHS = [
  SIGNIN_PATH,
  REFRESH_PATH,
  '/api/v1/auth/check-id',
  '/api/v1/auth/signup',
  '/api/v1/auth/verify/send',
  '/api/v1/auth/verify/check',
  '/api/v1/auth/email/verify/send',
  '/api/v1/auth/email/verify/check',
  '/api/v1/auth/find-id/phone',
  '/api/v1/auth/find-id/email',
  '/api/v1/auth/password/reset/verify/phone',
  '/api/v1/auth/password/reset/verify/email',
  '/api/v1/auth/password/reset',
  '/api/v1/hospitals',
];

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const apiClient = axios.create({
  baseURL: env.apiUrl,
  timeout: env.apiTimeoutMs,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  const isNoAuthPath = NO_AUTH_PATHS.some((path) => config.url?.startsWith(path));
  if (!isNoAuthPath) {
    const accessToken = await tokenStorage.getAccessToken();
    if (accessToken) {
      const tokenType = await tokenStorage.getTokenType();
      config.headers.set('Authorization', `${tokenType} ${accessToken}`);
    }
  }
  return config;
});

type BackendErrorBody = {
  status: number;
  error: string;
  message: string;
  path: string;
  fieldErrors?: ApiFieldError[];
  timestamp: string;
};

// 백엔드 확정 에러 형식: { status, error, message, path, fieldErrors, timestamp }
function isBackendErrorBody(data: unknown): data is BackendErrorBody {
  if (typeof data !== 'object' || data === null) return false;
  const body = data as Record<string, unknown>;
  return (
    typeof body.status === 'number' &&
    typeof body.error === 'string' &&
    typeof body.message === 'string' &&
    typeof body.path === 'string' &&
    typeof body.timestamp === 'string'
  );
}

function normalizeError(error: AxiosError): ApiError {
  const response = error.response;

  if (response) {
    const data = response.data;
    if (isBackendErrorBody(data)) {
      return {
        status: data.status,
        error: data.error,
        message: data.message,
        path: data.path,
        fieldErrors: data.fieldErrors ?? [],
        timestamp: data.timestamp,
        kind: 'server',
      };
    }
    // 응답은 왔지만 확정 형식이 아님 (HTML 에러 페이지, 502/504 등) — status만 유지
    return { status: response.status, message: '', fieldErrors: [], kind: 'server' };
  }

  if (error.code === 'ECONNABORTED') {
    return { status: 0, message: '', fieldErrors: [], kind: 'timeout' };
  }

  if (error.request) {
    // 요청은 보냈지만 응답을 받지 못함
    return { status: 0, message: '', fieldErrors: [], kind: 'network' };
  }

  return { status: 0, message: '', fieldErrors: [], kind: 'unknown' };
}

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new Error('no refresh token');
  }
  const { data } = await apiClient.post<{ accessToken: string; tokenType: string }>(REFRESH_PATH, {
    refreshToken,
  });
  await tokenStorage.setAccessToken(data.accessToken, data.tokenType);
  return data.accessToken;
}

function getRefreshedAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;
    const isNoAuthCall = NO_AUTH_PATHS.some((path) => originalRequest?.url?.startsWith(path));
    const isUnauthorized = error.response?.status === 401;

    if (isUnauthorized && originalRequest && !originalRequest._retry && !isNoAuthCall) {
      originalRequest._retry = true;
      try {
        const accessToken = await getRefreshedAccessToken();
        const tokenType = await tokenStorage.getTokenType();
        originalRequest.headers.set('Authorization', `${tokenType} ${accessToken}`);
        return apiClient(originalRequest);
      } catch {
        await tokenStorage.clear();
        triggerForceLogout();
        return Promise.reject(normalizeError(error));
      }
    }

    return Promise.reject(normalizeError(error));
  }
);
