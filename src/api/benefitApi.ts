import { apiClient } from './client';

// 스웨거 기준. BenefitInputRequest/Response 어디에도 required가 없고 오류 응답 스키마도 문서화돼 있지 않다.
export type WageInputType = 'REGULAR' | 'DAILY' | 'MULTIPLE_PART_TIME';

export type PartialWorkDay = { date: string; wage: number };

export type BenefitInputRequest = {
  wageInputType?: WageInputType;
  wageTotal?: number;
  wagePeriodDays?: number;
  dailyWage?: number;
  treatmentStartDate?: string;
  treatmentEndDate?: string;
  excludedDates?: string[];
  excludedDayCount?: number;
  partialWorkDays?: PartialWorkDay[];
};

export type BenefitResponse = {
  caseId?: number | null;
  wageInputType?: WageInputType | null;
  wageTotal?: number | null;
  wagePeriodDays?: number | null;
  dailyWage?: number | null;
  treatmentStartDate?: string | null;
  treatmentEndDate?: string | null;
  excludedDates?: string[] | null;
  excludedDayCount?: number | null;
  partialWorkDays?: PartialWorkDay[] | null;
  averageDailyWage?: number | null;
  estimatedAmount?: number | null;
  recognizedDays?: number | null;
  updatedAt?: string | null;
};

export type RuleDto = { code?: string | null; label?: string | null; basis?: string | null };

export type SegmentDto = {
  startDate?: string | null;
  endDate?: string | null;
  days?: number | null;
  kind?: 'FULL' | 'PARTIAL' | null;
  dailyAmount?: number | null;
  subtotal?: number | null;
  rules?: RuleDto[] | null;
};

export type BenefitCalculationResponse = {
  estimatedAmount?: number | null;
  averageDailyWage?: number | null;
  averageWageRule?: RuleDto | null;
  headlineRule?: RuleDto | null;
  totalDays?: number | null;
  excludedDays?: number | null;
  partialDays?: number | null;
  paidDays?: number | null;
  segments?: SegmentDto[] | null;
  appliedRules?: RuleDto[] | null;
  warnings?: string[] | null;
  notice?: string | null;
  calculatedAt?: string | null;
};

export type BenefitHistoryResponse = {
  id: number;
  estimatedAmount?: number | null;
  selectedDays?: number | null;
  recognizedDays?: number | null;
  formulaSnapshot?: string | null;
  createdAt?: string | null;
};

export const benefitApi = {
  async getBenefit(caseId: number): Promise<BenefitResponse> {
    const { data } = await apiClient.get<BenefitResponse>(`/api/v1/cases/${caseId}/benefit`);
    return data;
  },

  async getBenefitHistories(caseId: number): Promise<BenefitHistoryResponse[]> {
    const { data } = await apiClient.get<BenefitHistoryResponse[]>(`/api/v1/cases/${caseId}/benefit/histories`);
    return data;
  },

  async createBenefit(caseId: number, body: BenefitInputRequest): Promise<BenefitResponse> {
    const { data } = await apiClient.post<BenefitResponse>(`/api/v1/cases/${caseId}/benefit`, body);
    return data;
  },

  async updateBenefit(caseId: number, body: BenefitInputRequest): Promise<BenefitResponse> {
    const { data } = await apiClient.patch<BenefitResponse>(`/api/v1/cases/${caseId}/benefit`, body);
    return data;
  },

  // 본문을 보내면 서버가 저장 후 계산하고 이력을 남긴다(스웨거 summary). 호출할 때마다 이력이 쌓인다.
  async calculateBenefit(caseId: number, body: BenefitInputRequest): Promise<BenefitCalculationResponse> {
    const { data } = await apiClient.post<BenefitCalculationResponse>(`/api/v1/cases/${caseId}/benefit/calculate`, body);
    return data;
  },
};
