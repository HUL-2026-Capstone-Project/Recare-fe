import type { CaseResponse } from '@/api/caseApi';
import { colors } from '@/shared/constants/colors';
import { diffInclusiveDays, digitsToDate, formatDigitsWithDots } from '@/features/calculator/utils/date';
import type { SummaryTag } from './mocks';
import { ACCIDENT_TYPE_LABELS, getStatusPresentation } from './statusMapper';

const isoToDigits = (iso: string) => iso.replace(/-/g, '');

// 서버 date(YYYY-MM-DD) → 화면 표시 형식(YYYY.MM.DD). 값이 없거나 형식이 달라도 깨지지 않게 빈 문자열로 둔다.
export function formatIsoDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const digits = isoToDigits(iso.slice(0, 10));
  return digits.length === 8 ? formatDigitsWithDots(digits) : '';
}

export function toSummaryCardProps(detail: CaseResponse) {
  const presentation = getStatusPresentation(detail.status);

  const info: { label: string; value: string }[] = [];
  const accidentDate = formatIsoDate(detail.accidentDate);
  if (accidentDate) info.push({ label: '재해일자', value: accidentDate });
  if (detail.accidentType) {
    info.push({ label: '재해유형', value: ACCIDENT_TYPE_LABELS[detail.accidentType] ?? detail.accidentType });
  }
  if (detail.incidentPlace) info.push({ label: '발생장소', value: detail.incidentPlace });
  const start = formatIsoDate(detail.treatmentStartDate);
  const end = formatIsoDate(detail.treatmentEndDate);
  if (start || end) info.push({ label: '요양기간', value: `${start || '-'} ~ ${end || '-'}` });

  // 업종/작업(jobType)은 시안의 업종 태그 자리에 그대로 표시한다.
  const tags: SummaryTag[] = detail.jobType
    ? [{ label: detail.jobType, bg: colors.primaryLight, fg: colors.primary }]
    : [];

  return {
    caseNumber: detail.caseNumber ?? undefined,
    status: presentation.label,
    statusBg: presentation.badgeBg,
    statusFg: presentation.badgeFg,
    title: detail.title ?? '',
    info,
    tags,
  };
}

// 홈 카드 부제: "재해일 YYYY.MM.DD · 경위 한 줄". 값이 없는 부분은 생략한다.
export function toHomeSubtitle(detail: CaseResponse): string {
  const date = formatIsoDate(detail.accidentDate);
  const firstLine = detail.description?.split('\n')[0]?.trim();
  return [date ? `재해일 ${date}` : '', firstLine ?? ''].filter(Boolean).join(' · ');
}

export type RecoveryPeriod = {
  startDate: string;
  endDate: string;
  remainingDays: number;
  progress: number;
};

// 요양기간 카드용 값. 시작/종료일이 올바르지 않으면 null(카드를 그리지 않는다).
// TODO(가정): 남은 기간 = 오늘 이후 종료일까지의 일수, 진행률 = 시작일부터 오늘까지 / 전체 기간(0~1).
export function toRecoveryPeriod(detail: CaseResponse, today: Date = new Date()): RecoveryPeriod | null {
  if (!detail.treatmentStartDate || !detail.treatmentEndDate) return null;
  const start = digitsToDate(isoToDigits(detail.treatmentStartDate.slice(0, 10)));
  const end = digitsToDate(isoToDigits(detail.treatmentEndDate.slice(0, 10)));
  if (!start || !end || start.getTime() > end.getTime()) return null;

  const totalDays = diffInclusiveDays(start, end);
  const clampedToday = new Date(Math.min(Math.max(today.getTime(), start.getTime()), end.getTime()));
  const elapsedDays = diffInclusiveDays(start, clampedToday);

  return {
    startDate: formatIsoDate(detail.treatmentStartDate),
    endDate: formatIsoDate(detail.treatmentEndDate),
    remainingDays: Math.max(0, diffInclusiveDays(clampedToday, end) - 1),
    progress: totalDays > 0 ? elapsedDays / totalDays : 0,
  };
}
