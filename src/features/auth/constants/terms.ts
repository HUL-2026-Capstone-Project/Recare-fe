import type { TermsAgreement, TermsType } from '@/api/authApi';

// termsType은 스웨거 TermsAgreementRequest의 enum(SERVICE|PRIVACY|MARKETING)과 같다.
// TODO: termsVersion("1.0")은 앱이 정한 값이다. 스웨거에는 허용 값 없이 최대 20자 문자열로만 적혀 있어 백엔드 확인이 필요하다.
export type TermsItem = {
  termsType: TermsType;
  termsVersion: string;
  required: boolean;
  title: string;
};

export const TERMS_ITEMS: TermsItem[] = [
  { termsType: 'SERVICE', termsVersion: '1.0', required: true, title: '서비스 이용약관 동의' },
  { termsType: 'PRIVACY', termsVersion: '1.0', required: true, title: '개인정보 수집 및 이용 동의' },
  { termsType: 'MARKETING', termsVersion: '1.0', required: false, title: '마케팅 정보 수신 동의' },
];

// 체크된 약관만 가입 요청의 termsAgreements로 보낸다(서버 항목에 동의 여부 필드가 없어 미동의 항목은 뺀다).
export function buildTermsAgreements(agree: boolean[]): TermsAgreement[] {
  return TERMS_ITEMS.filter((_, i) => agree[i]).map(({ termsType, termsVersion }) => ({ termsType, termsVersion }));
}
