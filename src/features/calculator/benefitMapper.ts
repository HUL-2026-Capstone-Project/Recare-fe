import type { BenefitHistoryResponse, BenefitInputRequest } from '@/api/benefitApi';
import type { CalculationHistoryItem } from './components/CalculationHistoryCard';
import { digitsToDate, formatDigitsWithDots } from './utils/date';

export type CalculatorInputs = {
  averageWageDigits: string;
  careStartDigits: string;
  careEndDigits: string;
  excludedDaysDigits: string;
};

// 평균 임금 입력은 월 기준 금액으로 보고(백엔드 답변: 월급을 받으면 ×3), REGULAR에는 3개월 총액을 보낸다.
// 화면 라벨은 "평균 임금"뿐이라 월 기준이라는 표시는 코드에서만 가정한다. wagePeriodDays는 보내지 않는다.
const MONTHS_IN_WAGE_TOTAL = 3;

function digitsToIsoDate(digits: string): string | undefined {
  if (!digitsToDate(digits)) return undefined;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

// 서버 date(YYYY-MM-DD) → 화면 입력용 숫자 문자열(YYYYMMDD).
export function isoDateToDigits(iso: string | null | undefined): string {
  if (!iso) return '';
  const digits = iso.slice(0, 10).replace(/-/g, '');
  return digits.length === 8 ? digits : '';
}

// 화면 입력(숫자 문자열) → 요청 본문. 비어 있거나 올바르지 않은 값은 보내지 않는다(제외일수만 비면 0).
// 케이스 기반 calculate와 preview가 같이 쓴다. 일용직(dailyWage) 입력은 화면에 없어 만들지 않는다.
export function buildBenefitRequest(inputs: CalculatorInputs): BenefitInputRequest {
  const request: BenefitInputRequest = {};

  if (inputs.averageWageDigits !== '') {
    request.wageInputType = 'REGULAR';
    request.wageTotal = Number(inputs.averageWageDigits) * MONTHS_IN_WAGE_TOTAL;
  }

  const treatmentStartDate = digitsToIsoDate(inputs.careStartDigits);
  if (treatmentStartDate) request.treatmentStartDate = treatmentStartDate;

  const treatmentEndDate = digitsToIsoDate(inputs.careEndDigits);
  if (treatmentEndDate) request.treatmentEndDate = treatmentEndDate;

  // 제외일수를 비울 땐 0을 보낸다(저장값과 병합되는 calculate에서 이전 값을 지우기 위해).
  request.excludedDayCount = inputs.excludedDaysDigits === '' ? 0 : Number(inputs.excludedDaysDigits);

  return request;
}

// preview의 필수 값(wageInputType, wageTotal, 요양 시작/종료일)이 갖춰졌는지.
export function isBenefitRequestReady(request: BenefitInputRequest): boolean {
  const { wageInputType, wageTotal, treatmentStartDate, treatmentEndDate } = request;
  if (!wageInputType || !wageTotal || wageTotal <= 0) return false;
  if (!treatmentStartDate || !treatmentEndDate) return false;
  return treatmentStartDate <= treatmentEndDate;
}

// 금액은 원 단위이고 휴업급여는 하루 단위로 1원 미만을 버린 정수다(스웨거 info). 화면용 천 단위 문자열로 바꾼다.
export function formatWon(amount: number): string {
  return String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// createdAt(date-time)은 오프셋 없는 한국 시간(KST, 스웨거 info)이라 UTC로 해석하지 않고 날짜 부분만 쓴다.
function formatCreatedDate(createdAt: string | null | undefined): string {
  if (!createdAt) return '';
  return formatDigitsWithDots(createdAt.slice(0, 10).replace(/-/g, ''));
}

export function toHistoryItem(history: BenefitHistoryResponse): CalculationHistoryItem {
  return {
    id: String(history.id),
    title: '휴업급여',
    date: formatCreatedDate(history.createdAt),
    amount: history.estimatedAmount != null ? `₩ ${formatWon(history.estimatedAmount)}` : '',
  };
}
