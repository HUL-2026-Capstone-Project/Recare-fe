import type { CaseProgress } from '@/api/caseApi';
import { colors } from '@/shared/constants/colors';

// 상태 라벨, 단계(N/총 단계), 진행 중/종결 구분은 서버가 주는 progress를 그대로 쓴다.
// 이 파일에는 서버에 없는 배지 색(status 기준, 기존 colors.chip 변형)만 남긴다.
export type StatusPresentation = {
  label: string;
  step: number;
  totalSteps: number;
  closed: boolean;
  badgeBg: string;
  badgeFg: string;
  progressColor: string;
};

const BLUE = { badgeBg: colors.chip.blueBg, badgeFg: colors.chip.blueFg };
const ORANGE = { badgeBg: colors.chip.orangeBg, badgeFg: colors.chip.orangeFg };
const GREEN = { badgeBg: colors.chip.greenBg, badgeFg: colors.chip.greenFg };
const RED = { badgeBg: colors.chip.redBg, badgeFg: colors.chip.redFg };
const GRAY = { badgeBg: colors.chip.grayBg, badgeFg: colors.chip.grayFg };

// 새 색을 만들지 않고 기존 chip 변형 중 가장 가까운 것을 쓴다. 알 수 없는 status는 gray.
const BADGE_COLORS: Record<string, { badgeBg: string; badgeFg: string }> = {
  DRAFT: BLUE,
  PREPARING: BLUE,
  SUBMITTED: BLUE,
  UNDER_REVIEW: ORANGE,
  APPROVED: GREEN,
  IN_TREATMENT: GREEN,
  REJECTED: RED,
  CLOSED: GREEN,
};

export function getStatusPresentation(status: string, progress: CaseProgress): StatusPresentation {
  const closed = progress.group === 'CLOSED';
  return {
    label: progress.statusLabel,
    step: progress.stage,
    totalSteps: progress.totalStages,
    closed,
    ...(BADGE_COLORS[status] ?? GRAY),
    progressColor: closed ? colors.success : colors.primary,
  };
}
