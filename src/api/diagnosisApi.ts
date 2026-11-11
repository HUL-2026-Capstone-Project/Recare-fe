import { apiClient } from './client';

// 스웨거 DiagnosisSessionResponse. status는 enum 표시가 없고 백엔드 답변은 IN_PROGRESS | COMPLETED.
export type DiagnosisSessionResponse = {
  id: number;
  status: string;
  entryPoint?: string | null;
  purposeType?: string | null;
  resultSummary?: string | null;
  recommendedAction?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type DiagnosisAnswerRequest = {
  questionKey: string;
  answerType: string;
  answerValue?: string;
};

export type DiagnosisAnswerResponse = {
  id: number;
  questionKey: string;
  answerType: string;
  answerValue?: string | null;
  createdAt: string;
};

// 스웨거 DiagnosisResultResponse. 모든 필드가 필수다.
export type DiagnosisResultResponse = {
  sessionId: number;
  resultSummary: string;
  recommendedAction: string;
  requiredDocuments: string[];
  nextActions: string[];
};

export const diagnosisApi = {
  async createSession(entryPoint: string): Promise<DiagnosisSessionResponse> {
    const { data } = await apiClient.post<DiagnosisSessionResponse>('/api/v1/diagnosis/sessions', { entryPoint });
    return data;
  },

  async saveAnswer(sessionId: number, body: DiagnosisAnswerRequest): Promise<DiagnosisAnswerResponse> {
    const { data } = await apiClient.post<DiagnosisAnswerResponse>(`/api/v1/diagnosis/sessions/${sessionId}/answers`, body);
    return data;
  },

  async completeSession(sessionId: number): Promise<DiagnosisSessionResponse> {
    const { data } = await apiClient.patch<DiagnosisSessionResponse>(`/api/v1/diagnosis/sessions/${sessionId}/complete`);
    return data;
  },

  async getResult(sessionId: number): Promise<DiagnosisResultResponse> {
    const { data } = await apiClient.get<DiagnosisResultResponse>(`/api/v1/diagnosis/sessions/${sessionId}/result`);
    return data;
  },
};
