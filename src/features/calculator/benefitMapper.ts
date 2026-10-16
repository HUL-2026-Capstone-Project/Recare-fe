import type { BenefitHistoryResponse, BenefitInputRequest } from '@/api/benefitApi';
import type { CalculationHistoryItem } from './components/CalculationHistoryCard';
import { digitsToDate, formatDigitsWithDots } from './utils/date';

export type CalculatorInputs = {
  averageWageDigits: string;
  careStartDigits: string;
  careEndDigits: string;
  excludedDaysDigits: string;
};

// TODO(가정): 화면은 "평균 임금" 하나만 받는데, 스웨거에는 이 값을 wageInputType/wageTotal/wagePeriodDays/dailyWage 중
// 어떻게 보내야 하는지 설명이 없다(백엔드 질문 중). 가장 단순한 해석으로, 입력값을 "한 달 임금 총액"으로 보고
// REGULAR + wageTotal + 30일로 보낸다. 서버 답변에 따라 이 상수와 아래 변환을 바꿔야 한다.
const ASSUMED_WAGE_PERIOD_DAYS = 30;

function digitsToIsoDate(digits: string): string | undefined {
  if (!digitsToDate(digits)) return undefined;
  return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
}

// 화면 입력(숫자 문자열) → 요청 본문. 비어 있거나 올바르지 않은 값은 보내지 않는다.
export function buildBenefitRequest(inputs: CalculatorInputs): BenefitInputRequest {
  const request: BenefitInputRequest = {};

  if (inputs.averageWageDigits !== '') {
    request.wageInputType = 'REGULAR';
    request.wageTotal = Number(inputs.averageWageDigits);
    request.wagePeriodDays = ASSUMED_WAGE_PERIOD_DAYS;
  }

  const treatmentStartDate = digitsToIsoDate(inputs.careStartDigits);
  if (treatmentStartDate) request.treatmentStartDate = treatmentStartDate;

  const treatmentEndDate = digitsToIsoDate(inputs.careEndDigits);
  if (treatmentEndDate) request.treatmentEndDate = treatmentEndDate;

  if (inputs.excludedDaysDigits !== '') {
    request.excludedDayCount = Number(inputs.excludedDaysDigits);
  }

  return request;
}

// 금액은 원 단위 number로 가정(서버 단위·반올림 규칙 미확인)하고 화면용 천 단위 문자열로 바꾼다.
export function formatWon(amount: number): string {
  return String(Math.round(amount)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// createdAt(date-time)의 날짜 부분만 쓴다. 타임존 처리는 서버 답변 전까지 하지 않는다.
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
