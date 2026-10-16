import { colors } from '@/shared/constants/colors';

export const TOTAL_STEPS = 5;

export type StatusPresentation = {
  label: string;
  // 화면의 N / 5 단계. 알 수 없는 status면 null(단계를 표시하지 않는다).
  step: number | null;
  badgeBg: string;
  badgeFg: string;
  progressColor: string;
  closed: boolean;
};

// TODO(가정): 백엔드가 status 8개의 공식 한글 라벨과 화면 5단계 매핑표를 아직 주지 않았다.
// 아래 표는 임시 가정이며, 답변이 오면 이 파일만 고치면 된다.
// 배지 색은 새로 만들지 않고 기존 chip 변형 중 가장 가까운 것을 쓴다(불승인=red, 알 수 없음=gray).
const BLUE = { badgeBg: colors.chip.blueBg, badgeFg: colors.chip.blueFg, progressColor: colors.primary };
const ORANGE = { badgeBg: colors.chip.orangeBg, badgeFg: colors.chip.orangeFg, progressColor: colors.primary };
const GREEN = { badgeBg: colors.chip.greenBg, badgeFg: colors.chip.greenFg, progressColor: colors.primary };
const RED = { badgeBg: colors.chip.redBg, badgeFg: colors.chip.redFg, progressColor: colors.primary };
const GRAY = { badgeBg: colors.chip.grayBg, badgeFg: colors.chip.grayFg, progressColor: colors.primary };

const PRESENTATIONS: Record<string, StatusPresentation> = {
  DRAFT: { label: '접수 중', step: 2, closed: false, ...BLUE },
  PREPARING: { label: '접수 중', step: 2, closed: false, ...BLUE },
  SUBMITTED: { label: '접수 중', step: 2, closed: false, ...BLUE },
  UNDER_REVIEW: { label: '심사 중', step: 3, closed: false, ...ORANGE },
  APPROVED: { label: '승인', step: 4, closed: false, ...GREEN },
  IN_TREATMENT: { label: '승인', step: 4, closed: false, ...GREEN },
  REJECTED: { label: '불승인', step: 3, closed: false, ...RED },
  CLOSED: { label: '종결', step: 5, closed: true, ...GREEN, progressColor: colors.success },
};

export function getStatusPresentation(status: string | null | undefined): StatusPresentation {
  const known = status ? PRESENTATIONS[status] : undefined;
  if (known) return known;
  return { label: status ?? '', step: null, closed: false, ...GRAY };
}

// "진행 중" = CLOSED가 아닌 모든 상태, "종결" = CLOSED (임시 가정). status 쿼리는 쓰지 않고 앱에서 나눈다.
export function isClosedStatus(status: string | null | undefined): boolean {
  return status === 'CLOSED';
}

// TODO(가정): 재해유형 표시 라벨도 백엔드 답변 전 임시 값이다.
export const ACCIDENT_TYPE_LABELS: Record<string, string> = {
  ACCIDENT: '업무상 사고',
  DISEASE: '직업성 질환',
  COMMUTE: '출퇴근 재해',
};
