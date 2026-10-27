import type { AccidentType, CaseResponse, CreateCaseRequest, UpdateCaseRequest } from '@/api/caseApi';
import { digitsToDate, formatDigitsWithDots } from '@/features/calculator/utils/date';

export type CaseFormType = 'accident' | 'disease' | 'commute';

// 시안의 폼 필드 이름. 날짜는 YYYY.MM.DD(점 표기), 없는 값은 빈 문자열이다.
export type CaseFormValues = {
  title: string;
  type: CaseFormType | '';
  subtype: string;
  date: string;
  place: string;
  work: string;
  paused: boolean;
  story: string;
  careStart: string;
  careEnd: string;
  dx: string;
  part: string;
  dxDate: string;
  hospital: string;
  receipt: string;
};

export const EMPTY_CASE_FORM: CaseFormValues = {
  title: '',
  type: '',
  subtype: '',
  date: '',
  place: '',
  work: '',
  paused: false,
  story: '',
  careStart: '',
  careEnd: '',
  dx: '',
  part: '',
  dxDate: '',
  hospital: '',
  receipt: '',
};

// 스웨거 maxLength(title 150, incidentPlace 255, jobType/accidentDetail/injuredBodyPart 100, diagnosisName/병원명 150,
// caseNumber 50). description은 스웨거에 한도가 없고 1,000자는 시안의 화면 표시 한도다.
// 100자 한도 두 곳(subtype, work)을 뺀 나머지는 오류 문구 없이 화면에서 입력을 막는 데 쓴다.
export const CASE_FORM_LIMITS = {
  title: 150,
  subtype: 100,
  place: 255,
  work: 100,
  story: 1000,
  dx: 150,
  part: 100,
  hospital: 150,
  receipt: 50,
} as const;

const TYPE_TO_SERVER: Record<CaseFormType, AccidentType> = {
  accident: 'ACCIDENT',
  disease: 'DISEASE',
  commute: 'COMMUTE',
};
const TYPE_FROM_SERVER: Record<AccidentType, CaseFormType> = {
  ACCIDENT: 'accident',
  DISEASE: 'disease',
  COMMUTE: 'commute',
};

// 폼 날짜(YYYY.MM.DD) → 서버 날짜(YYYY-MM-DD). 비어 있거나 올바르지 않은 값은 undefined(보내지 않는다).
export function formDateToIso(value: string): string | undefined {
  const digits = value.replace(/\D/g, '');
  if (!digitsToDate(digits)) return undefined;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

function isoToFormDate(iso: string | null | undefined): string {
  if (!iso) return '';
  const digits = iso.slice(0, 10).replace(/-/g, '');
  return digits.length === 8 ? formatDigitsWithDots(digits) : '';
}

// 서버 상세 → 폼 값. 없는 값은 빈 문자열.
export function fromCase(detail: CaseResponse): CaseFormValues {
  return {
    title: detail.title,
    type: TYPE_FROM_SERVER[detail.accidentType] ?? '',
    subtype: detail.accidentDetail ?? '',
    date: isoToFormDate(detail.accidentDate),
    place: detail.incidentPlace ?? '',
    work: detail.jobType ?? '',
    paused: detail.hasWorkStop,
    story: detail.description ?? '',
    careStart: isoToFormDate(detail.treatmentStartDate),
    careEnd: isoToFormDate(detail.treatmentEndDate),
    dx: detail.diagnosisName ?? '',
    part: detail.injuredBodyPart ?? '',
    dxDate: isoToFormDate(detail.diagnosisDate),
    hospital: detail.diagnosisHospitalName ?? '',
    receipt: detail.caseNumber ?? '',
  };
}

// 등록: 필수(title, accidentType, accidentDate) 외에 비어 있는 선택 필드는 보내지 않는다. 검증을 통과한 값이 전제다.
export function toCreateRequest(values: CaseFormValues): CreateCaseRequest {
  const request: CreateCaseRequest = {
    title: values.title.trim(),
    accidentType: TYPE_TO_SERVER[values.type as CaseFormType],
    accidentDate: formDateToIso(values.date) as string,
    hasWorkStop: values.paused,
  };

  const optionalTexts: [keyof CreateCaseRequest, string][] = [
    ['accidentDetail', values.subtype],
    ['incidentPlace', values.place],
    ['jobType', values.work],
    ['description', values.story],
    ['diagnosisName', values.dx],
    ['injuredBodyPart', values.part],
    ['diagnosisHospitalName', values.hospital],
  ];
  for (const [key, raw] of optionalTexts) {
    const text = raw.trim();
    if (text) (request as Record<string, unknown>)[key] = text;
  }

  const optionalDates: [keyof CreateCaseRequest, string][] = [
    ['treatmentStartDate', values.careStart],
    ['treatmentEndDate', values.careEnd],
    ['diagnosisDate', values.dxDate],
  ];
  for (const [key, raw] of optionalDates) {
    const iso = formDateToIso(raw);
    if (iso) (request as Record<string, unknown>)[key] = iso;
  }

  return request;
}

// 수정: 원래 값과 비교해 바뀐 필드만 보낸다.
// - 글자 필드를 비웠으면 ""를 보낸다(null은 "변경 없음"이라 지워지지 않아 null을 보내는 경로가 없다). title은 비울 수 없어 비면 보내지 않는다.
// - 날짜는 지우는 방식이 없어 비어 있으면 보내지 않고, 값이 바뀐 경우에만 보낸다.
export function toUpdateRequest(values: CaseFormValues, original: CaseResponse): UpdateCaseRequest {
  const before = fromCase(original);
  const request: UpdateCaseRequest = {};

  const title = values.title.trim();
  if (title && title !== before.title.trim()) request.title = title;

  if (values.type && values.type !== before.type) request.accidentType = TYPE_TO_SERVER[values.type];
  if (values.paused !== before.paused) request.hasWorkStop = values.paused;

  const texts: [keyof UpdateCaseRequest, string, string][] = [
    ['accidentDetail', values.subtype, before.subtype],
    ['incidentPlace', values.place, before.place],
    ['jobType', values.work, before.work],
    ['description', values.story, before.story],
    ['diagnosisName', values.dx, before.dx],
    ['injuredBodyPart', values.part, before.part],
    ['diagnosisHospitalName', values.hospital, before.hospital],
    ['caseNumber', values.receipt, before.receipt],
  ];
  for (const [key, next, prev] of texts) {
    const nextText = next.trim();
    if (nextText !== prev.trim()) (request as Record<string, unknown>)[key] = nextText;
  }

  const dates: [keyof UpdateCaseRequest, string, string][] = [
    ['accidentDate', values.date, before.date],
    ['treatmentStartDate', values.careStart, before.careStart],
    ['treatmentEndDate', values.careEnd, before.careEnd],
    ['diagnosisDate', values.dxDate, before.dxDate],
  ];
  for (const [key, next, prev] of dates) {
    const iso = formDateToIso(next);
    if (iso && next !== prev) (request as Record<string, unknown>)[key] = iso;
  }

  return request;
}

export function hasUpdateChanges(request: UpdateCaseRequest): boolean {
  return Object.keys(request).length > 0;
}
