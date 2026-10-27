import type { CaseResponse, CaseSummaryResponse } from '@/api/caseApi';
import { colors } from '@/shared/constants/colors';
import { diffInclusiveDays, digitsToDate, formatDigitsWithDots } from '@/features/calculator/utils/date';
import type { SummaryTag } from './mocks';
import { getStatusPresentation } from './statusMapper';

const isoToDigits = (iso: string) => iso.replace(/-/g, '');

// 서버 date(YYYY-MM-DD) → 화면 표시 형식(YYYY.MM.DD). 값이 없거나 형식이 달라도 깨지지 않게 빈 문자열로 둔다.
export function formatIsoDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const digits = isoToDigits(iso.slice(0, 10));
  return digits.length === 8 ? formatDigitsWithDots(digits) : '';
}

export function toSummaryCardProps(detail: CaseResponse) {
  const presentation = getStatusPresentation(detail.status, detail.progress);

  // 시안의 요약 행 순서: 재해일자, 재해유형, 발생장소, 진단일자, 진단 의료기관, 요양기간.
  // 재해유형은 서버가 주는 accidentTypeLabel을 그대로 쓴다. accidentDetail(자유 입력)은 시안 문구 형식과 길이를 보장할 수 없어 쓰지 않는다.
  const info: { label: string; value: string }[] = [
    { label: '재해일자', value: formatIsoDate(detail.accidentDate) },
    { label: '재해유형', value: detail.accidentTypeLabel },
  ];
  if (detail.incidentPlace) info.push({ label: '발생장소', value: detail.incidentPlace });
  const diagnosisDate = formatIsoDate(detail.diagnosisDate);
  if (diagnosisDate) info.push({ label: '진단일자', value: diagnosisDate });
  if (detail.diagnosisHospitalName) info.push({ label: '진단 의료기관', value: detail.diagnosisHospitalName });
  const start = formatIsoDate(detail.treatmentStartDate);
  const end = formatIsoDate(detail.treatmentEndDate);
  if (start || end) info.push({ label: '요양기간', value: `${start || '-'} ~ ${end || '-'}` });

  // 업종/작업(jobType, "업종 · 작업" 형태 그대로)은 기존 업종 태그 자리에, 부상 부위·진단명은 시안의 회색 태그로 표시한다.
  const tags: SummaryTag[] = [];
  if (detail.jobType) tags.push({ label: detail.jobType, bg: colors.primaryLight, fg: colors.primary });
  if (detail.injuredBodyPart) tags.push({ label: detail.injuredBodyPart, bg: colors.input, fg: colors.text2 });
  if (detail.diagnosisName) tags.push({ label: detail.diagnosisName, bg: colors.input, fg: colors.text2 });

  return {
    caseNumber: detail.caseNumber ?? undefined,
    status: presentation.label,
    statusBg: presentation.badgeBg,
    statusFg: presentation.badgeFg,
    title: detail.title,
    info,
    tags,
  };
}

// 홈 카드 부제: "재해일 YYYY.MM.DD · 경위 요약". 요약(summary, 서버가 앞 60자로 자름)이 없으면 재해일만 보여준다.
export function toHomeSubtitle(item: Pick<CaseSummaryResponse, 'accidentDate' | 'summary'>): string {
  const date = formatIsoDate(item.accidentDate);
  return [date ? `재해일 ${date}` : '', item.summary ?? ''].filter(Boolean).join(' · ');
}

export type RecoveryPeriod = {
  startDate: string;
  endDate: string;
  remainingDays: number;
  progress: number;
};

// 요양기간 카드용 값. 시작/종료일이 올바르지 않으면 null(카드를 그리지 않는다).
// TODO(가정): 남은 기간 = 오늘 이후 종료일까지의 일수, 진행률 = 시작일부터 오늘까지 / 전체 기간(0~1).
export function toRecoveryPeriod(
  detail: Pick<CaseSummaryResponse, 'treatmentStartDate' | 'treatmentEndDate'>,
  today: Date = new Date()
): RecoveryPeriod | null {
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
