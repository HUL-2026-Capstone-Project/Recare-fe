export type ApiFieldError = {
  field: string;
  message: string;
};

export type ApiErrorKind = 'server' | 'network' | 'timeout' | 'unknown';

/**
 * 백엔드 확정 형식: { status, error, message, path, fieldErrors, timestamp }
 * network/timeout/unknown일 때는 서버 응답 자체가 없어 error/path/timestamp가 비어 있을 수 있다.
 */
export type ApiError = {
  status: number;
  message: string;
  fieldErrors: ApiFieldError[];
  kind: ApiErrorKind;
  error?: string;
  path?: string;
  timestamp?: string;
};
