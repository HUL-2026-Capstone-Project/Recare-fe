import axios, { AxiosError } from 'axios';

import { env } from '@/config/env';
import type { ApiError } from './types';

// 메인 API 인스턴스와 완전히 분리된 AI 서버 전용 클라이언트.
// 인증이 없는 서버이므로 Authorization 헤더나 401 재발급 로직을 절대 넣지 않는다.
export const aiClient = axios.create({
  baseURL: env.aiApiUrl,
  timeout: env.aiApiTimeoutMs,
  headers: { 'Content-Type': 'application/json' },
});

function normalizeAiError(error: AxiosError): ApiError {
  const response = error.response;

  if (response) {
    if (response.status === 422) {
      // detail 배열에 사용자 질문(input)이 그대로 들어있을 수 있어 절대 노출/로깅하지 않는다.
      return { status: 422, message: '질문을 다시 확인해주세요.', fieldErrors: [], kind: 'server' };
    }
    return { status: response.status, message: '', fieldErrors: [], kind: 'server' };
  }

  if (error.code === 'ECONNABORTED') {
    return { status: 0, message: '', fieldErrors: [], kind: 'timeout' };
  }

  if (error.request) {
    return { status: 0, message: '', fieldErrors: [], kind: 'network' };
  }

  return { status: 0, message: '', fieldErrors: [], kind: 'unknown' };
}

aiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(normalizeAiError(error))
);
