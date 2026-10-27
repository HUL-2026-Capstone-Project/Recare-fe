import type { TimelineStepStatus, TimelineStepType, TodoPriority, TodoStatus } from '@/api/caseApi';
import { colors } from '@/shared/constants/colors';

// 날짜 문자열(yyyy-MM-dd)은 Date로 파싱하지 않고 문자열로 직접 다룬다(시간대 문제).
const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})/;

function parseIso(value: string | null | undefined) {
  const match = value ? ISO_DATE.exec(value) : null;
  return match ? { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]), iso: match[0] } : null;
}

// "2026.10.02"
export function formatEventDate(value: string | null | undefined): string {
  const date = parseIso(value);
  return date ? date.iso.replace(/-/g, '.') : '';
}

// 기기의 현지 날짜(yyyy-MM-dd)
export function todayLocalIso(now: Date = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export type DueInfo = { text: string; color: string } | null;

// 마감일이 오늘이면 지난 것으로 보지 않는다. 올해가 아니면 연도를 붙인다.
export function getDueInfo(dueDate: string | null | undefined, done: boolean, todayIso: string): DueInfo {
  const due = parseIso(dueDate);
  if (!due) return null;
  if (!done && due.iso < todayIso) return { text: '마감일이 지났어요', color: colors.danger };

  const thisYear = Number(todayIso.slice(0, 4));
  const yearText = due.year === thisYear ? '' : `${due.year}년 `;
  return { text: `${yearText}${due.month}월 ${due.day}일까지`, color: done ? colors.text3 : colors.text2 };
}

// 앱이 정한 종류 라벨. 여기에 없는 값이 오면 라벨을 그리지 않는다.
const STEP_TYPE_LABELS: Record<TimelineStepType, string> = {
  DIAGNOSIS: '자가진단',
  DOCUMENT_PREP: '서류 준비',
  APPLICATION: '신청',
  REVIEW: '심사',
  DECISION: '결정',
  TREATMENT: '요양',
  BENEFIT: '급여 청구',
  CLOSED: '종결',
  ETC: '기타',
};

export function getStepTypeLabel(stepType: string): string | null {
  return (STEP_TYPE_LABELS as Record<string, string>)[stepType] ?? null;
}

export const PRIORITY_CHIPS: Record<TodoPriority, { label: string; bg: string; fg: string }> = {
  HIGH: { label: '높음', bg: colors.chip.redBg, fg: colors.chip.redFg },
  MEDIUM: { label: '보통', bg: colors.chip.orangeBg, fg: colors.chip.orangeFg },
  LOW: { label: '낮음', bg: colors.chip.grayBg, fg: colors.chip.grayFg },
};

// 편집 시트의 선택지(시안 순서). 종류 라벨은 STEP_TYPE_LABELS와 같다.
export const STEP_TYPE_OPTIONS: { value: TimelineStepType; label: string }[] = (
  ['DIAGNOSIS', 'DOCUMENT_PREP', 'APPLICATION', 'REVIEW', 'DECISION', 'TREATMENT', 'BENEFIT', 'CLOSED', 'ETC'] as const
).map((value) => ({ value, label: STEP_TYPE_LABELS[value] }));

export const STEP_STATUS_OPTIONS: { value: TimelineStepStatus; label: string }[] = [
  { value: 'PENDING', label: '대기' },
  { value: 'IN_PROGRESS', label: '진행 중' },
  { value: 'DONE', label: '완료' },
  { value: 'SKIPPED', label: '건너뜀' },
];

export const PRIORITY_OPTIONS: { value: TodoPriority; label: string }[] = [
  { value: 'HIGH', label: '높음' },
  { value: 'MEDIUM', label: '보통' },
  { value: 'LOW', label: '낮음' },
];

export const TODO_STATUS_OPTIONS: { value: TodoStatus; label: string }[] = [
  { value: 'TODO', label: '할 일' },
  { value: 'IN_PROGRESS', label: '진행 중' },
  { value: 'DONE', label: '완료' },
];

// 상태 변경 시트의 목록(시안 순서와 라벨)
export const CASE_STATUS_OPTIONS = [
  { value: 'DRAFT', label: '작성 중' },
  { value: 'PREPARING', label: '서류 준비 중' },
  { value: 'SUBMITTED', label: '접수 완료' },
  { value: 'UNDER_REVIEW', label: '심사 중' },
  { value: 'APPROVED', label: '승인' },
  { value: 'IN_TREATMENT', label: '요양 중' },
  { value: 'REJECTED', label: '불승인' },
  { value: 'CLOSED', label: '종결' },
] as const;
