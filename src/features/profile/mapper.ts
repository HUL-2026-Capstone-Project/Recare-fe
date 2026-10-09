import type { UserResponse } from '@/api/userApi';
import type { Profile } from './mocks';

// 서버 필드명 차이(verified → isVerified 등)는 이 함수 안에서만 흡수한다.
export function mapUserResponseToProfile(res: UserResponse): Profile {
  return {
    id: res.id,
    loginId: res.loginId,
    name: res.name,
    birthDate: res.birthDate ?? null,
    gender: res.gender ?? null,
    phone: res.phone ?? null,
    carrier: res.carrier ?? null,
    email: res.email ?? null,
    address: res.address ?? null,
    language: res.language ?? null,
    isVerified: res.verified ?? false,
  };
}
