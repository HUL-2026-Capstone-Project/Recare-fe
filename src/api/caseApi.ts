import { apiClient } from './client';

// 스웨거 기준. 응답 스키마에 required/nullable 표시와 오류 스키마가 없어 모든 응답 필드를 null 가능으로 방어한다.
export type CaseStatus =
  | 'DRAFT'
  | 'PREPARING'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'IN_TREATMENT'
  | 'CLOSED';

export type AccidentType = 'ACCIDENT' | 'DISEASE' | 'COMMUTE';

export type CaseSummaryResponse = {
  id: number;
  title?: string | null;
  caseNumber?: string | null;
  accidentType?: AccidentType | null;
  accidentDate?: string | null;
  status?: CaseStatus | null;
  hasWorkStop?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type CaseResponse = CaseSummaryResponse & {
  incidentPlace?: string | null;
  jobType?: string | null;
  treatmentStartDate?: string | null;
  treatmentEndDate?: string | null;
  description?: string | null;
  diagnosisSessionId?: number | null;
};

export const caseApi = {
  // 목록은 페이지네이션 없이 배열로 내려온다(스웨거). status 쿼리는 enum 하나만 받아 앱에서는 쓰지 않는다.
  async getCases(): Promise<CaseSummaryResponse[]> {
    const { data } = await apiClient.get<CaseSummaryResponse[]>('/api/v1/cases');
    return data;
  },

  async getCase(id: number): Promise<CaseResponse> {
    const { data } = await apiClient.get<CaseResponse>(`/api/v1/cases/${id}`);
    return data;
  },
};
