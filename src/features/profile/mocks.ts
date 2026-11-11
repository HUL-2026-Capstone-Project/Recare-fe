export type Profile = {
  id: number;
  loginId: string;
  name: string;
  birthDate: string | null;
  gender: string | null;
  phone: string | null;
  carrier: string | null;
  email: string | null;
  address: string | null;
  language: string | null;
  isVerified: boolean;
};

export const NONE_LABEL = '미등록';

export const GENDER_LABELS: Record<string, string> = { M: '남성', F: '여성' };
export const LANGUAGE_LABELS: Record<string, string> = { KO: '한국어', EN: 'English' };

export function formatPhone(phone: string | null): string | null {
  if (!phone) return null;
  return phone.replace(/^(\d{3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
}

export function formatDate(date: string | null): string | null {
  if (!date) return null;
  return date.replace(/-/g, '.');
}

export function formatGender(gender: string | null): string | null {
  if (!gender) return null;
  return GENDER_LABELS[gender] ?? null;
}

export function formatLanguage(language: string | null): string | null {
  if (!language) return null;
  return LANGUAGE_LABELS[language] ?? language;
}

export type ProfileRow = { label: string; value: string | null; wrap?: boolean };
export type ProfileGroup = { title: string; rows: ProfileRow[] };

export function buildProfileGroups(p: Profile): ProfileGroup[] {
  return [
    {
      title: '기본 정보',
      rows: [
        { label: '이름', value: p.name },
        { label: '생년월일', value: formatDate(p.birthDate) },
        { label: '성별', value: formatGender(p.gender) },
      ],
    },
    {
      title: '연락처',
      rows: [
        { label: '휴대폰 번호', value: formatPhone(p.phone) },
        { label: '통신사', value: p.carrier },
        { label: '이메일', value: p.email },
        { label: '주소', value: p.address, wrap: true },
      ],
    },
    {
      title: '계정',
      rows: [
        { label: '아이디', value: p.loginId },
        { label: '언어', value: formatLanguage(p.language) },
      ],
    },
  ];
}
