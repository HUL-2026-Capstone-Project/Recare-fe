import { CASE_FORM_LIMITS, formDateToIso } from './formMapper';
import type { CaseFormValues } from './formMapper';

// 시안과 정확히 같은 문구.
export const CASE_FORM_MESSAGES = {
  titleRequired: '케이스 제목을 입력해 주세요',
  typeRequired: '재해유형을 선택해 주세요',
  dateRequired: '재해일자를 선택해 주세요',
  tooLong: '100자 이하로 입력해 주세요',
  careEndBeforeStart: '요양 종료일은 시작일 이후여야 해요',
  saveFailed: '저장하지 못했어요. 잠시 후 다시 시도해 주세요.',
} as const;

// 필드별 오류. 키는 폼 값 이름과 같다(오류가 없으면 키가 없다).
export type CaseFormErrors = Partial<Record<'title' | 'type' | 'date' | 'subtype' | 'work' | 'careEnd', string>>;

// 필수는 스웨거 CreateCaseRequest의 required(title, accidentType, accidentDate)와 같다.
export function validateCaseForm(values: CaseFormValues): CaseFormErrors {
  const errors: CaseFormErrors = {};

  if (!values.title.trim()) errors.title = CASE_FORM_MESSAGES.titleRequired;
  if (!values.type) errors.type = CASE_FORM_MESSAGES.typeRequired;
  if (!values.date) errors.date = CASE_FORM_MESSAGES.dateRequired;

  if (values.subtype.length > CASE_FORM_LIMITS.subtype) errors.subtype = CASE_FORM_MESSAGES.tooLong;
  if (values.work.length > CASE_FORM_LIMITS.work) errors.work = CASE_FORM_MESSAGES.tooLong;

  // 요양기간은 두 날짜가 모두 올바르게 채워져 있을 때만 순서를 본다.
  const start = formDateToIso(values.careStart);
  const end = formDateToIso(values.careEnd);
  if (start && end && end < start) errors.careEnd = CASE_FORM_MESSAGES.careEndBeforeStart;

  return errors;
}

export function hasFormErrors(errors: CaseFormErrors): boolean {
  return Object.keys(errors).length > 0;
}
