// TODO: 서버 termsType 값이 스웨거(POST /users/terms, GET /users/termscheck)에 enum으로 명시돼 있지 않아
// 임시 코드를 사용한다. 실제 서버 값이 확인되면 termsType을 맞춰야 한다.
export type TermsItem = {
  termsType: string;
  termsVersion: string;
  required: boolean;
  title: string;
};

export const TERMS_ITEMS: TermsItem[] = [
  { termsType: 'SERVICE', termsVersion: '1.0', required: true, title: '서비스 이용약관 동의' },
  { termsType: 'PRIVACY', termsVersion: '1.0', required: true, title: '개인정보 수집 및 이용 동의' },
  { termsType: 'MARKETING', termsVersion: '1.0', required: false, title: '마케팅 정보 수신 동의' },
];
