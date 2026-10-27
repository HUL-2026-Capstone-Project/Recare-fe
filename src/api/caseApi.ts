import { apiClient } from './client';

// 스웨거 기준. required 표시가 있는 응답 필드는 항상 값이 있고, 없는 필드만 null일 수 있다.
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

// 서버가 정한 진행 단계 표시. group은 CLOSED만 종결, 나머지는 진행 중(ACTIVE).
export type CaseProgress = {
  statusLabel: string;
  stage: number;
  stageLabel: string;
  totalStages: number;
  group: 'ACTIVE' | 'CLOSED';
};

export type CaseSummaryResponse = {
  id: number;
  title: string;
  caseNumber?: string | null;
  accidentType: AccidentType;
  accidentTypeLabel: string;
  accidentDate: string;
  status: CaseStatus;
  progress: CaseProgress;
  hasWorkStop: boolean;
  treatmentStartDate?: string | null;
  treatmentEndDate?: string | null;
  // 사고 경위 앞 60자(넘치면 끝에 '…'), 경위가 없으면 null
  summary?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CaseResponse = {
  id: number;
  title: string;
  caseNumber?: string | null;
  accidentType: AccidentType;
  accidentTypeLabel: string;
  accidentDetail?: string | null;
  accidentDate: string;
  incidentPlace?: string | null;
  jobType?: string | null;
  status: CaseStatus;
  progress: CaseProgress;
  treatmentStartDate?: string | null;
  treatmentEndDate?: string | null;
  hasWorkStop: boolean;
  description?: string | null;
  diagnosisName?: string | null;
  injuredBodyPart?: string | null;
  diagnosisDate?: string | null;
  diagnosisHospitalName?: string | null;
  diagnosisSessionId?: number | null;
  createdAt: string;
  updatedAt: string;
};

export const caseApi = {
  // 목록은 페이지네이션 없이 전부 내려온다(스웨거). status/group/sort 쿼리는 쓰지 않고 앱에서 progress.group으로 나눈다.
  async getCases(): Promise<CaseSummaryResponse[]> {
    const { data } = await apiClient.get<CaseSummaryResponse[]>('/api/v1/cases');
    return data;
  },

  async getCase(id: number): Promise<CaseResponse> {
    const { data } = await apiClient.get<CaseResponse>(`/api/v1/cases/${id}`);
    return data;
  },
};
