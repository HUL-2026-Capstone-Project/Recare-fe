import type { TermsType } from '@/api/authApi';

// 화면에 보여주는 문서 종류. PRIVACY_POLICY는 동의 대상이 아닌 공개 문서(마이페이지)라서 서버 약관 종류(TermsType)에는 없다.
export type DisplayTermsType = TermsType | 'PRIVACY_POLICY';

// 마이페이지 약관 화면용 이름. 가입 화면의 이름("…동의")과 달리 동의 문구가 붙지 않는다.
export const TERMS_DISPLAY_NAMES: Record<DisplayTermsType, string> = {
  SERVICE: '서비스 이용약관',
  PRIVACY: '개인정보 수집 및 이용',
  MARKETING: '마케팅 정보 수신',
  PRIVACY_POLICY: '개인정보 처리방침',
};
