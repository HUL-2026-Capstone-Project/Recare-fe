import type { ApiError } from './types';

export function getErrorMessage(error: ApiError): string {
  switch (error.kind) {
    case 'server':
      if (error.status >= 500) {
        return '일시적인 오류가 발생했어요. 잠시 후 다시 시도해주세요.';
      }
      return error.message || '요청을 처리할 수 없습니다.';
    case 'network':
      return '네트워크 연결을 확인해주세요.';
    case 'timeout':
      return '응답이 늦어지고 있어요. 잠시 후 다시 시도해주세요.';
    default:
      return '알 수 없는 오류가 발생했어요.';
  }
}
