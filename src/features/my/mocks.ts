import { homeMock } from '@/features/home/components/mocks';

export const myMock = {
  user: {
    name: homeMock.user.name,
    phone: '010-0000-0000',
    email: 'hyungjin@recare.kr',
  },
  stats: [
    { value: '3', label: '진행 케이스' },
    { value: '12', label: '제출 서류' },
    { value: '5', label: '받은 알림' },
  ],
  accountMenu: [
    { label: '프로필 정보 수정', icon: 'user' as const },
    { label: '비밀번호 변경', icon: 'lock' as const },
    { label: '알림 설정', icon: 'bell' as const },
  ],
  policyMenu: ['서비스 이용약관', '개인정보 처리방침'],
};

export const APP_VERSION = 'v1.2.0';
