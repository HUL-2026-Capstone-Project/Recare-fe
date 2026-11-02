import { apiClient } from './client';

// 스웨거 CaseDocumentResponse.status(응답 스키마에는 enum 표시가 없어 string으로 받고 앱에서 5종으로 맞춘다)
export type DocumentStatus = 'UPLOADED' | 'PROCESSING' | 'REVIEW_REQUIRED' | 'APPROVED' | 'REJECTED';

export type DocumentTypeResponse = {
  id: number;
  code: string;
  name: string;
  simpleDescription?: string | null;
  requiredForStage?: string | null;
};

export type CaseDocumentResponse = {
  id: number;
  documentTypeId: number;
  documentTypeCode: string;
  documentTypeName: string;
  originalFileName?: string | null;
  contentType: string;
  fileSizeBytes: number;
  status: string;
  // 한국 시간(KST), 오프셋 없음
  uploadedAt: string;
};

export type UploadFile = { uri: string; name: string; type: string };

// 20MB 업로드를 위해 이 요청만 시간 제한을 늘린다(기본 10초).
const TRANSFER_TIMEOUT_MS = 120000;

export const documentApi = {
  async getDocumentTypes(): Promise<DocumentTypeResponse[]> {
    const { data } = await apiClient.get<DocumentTypeResponse[]>('/api/v1/document-types');
    return data;
  },

  // 페이지네이션 없이 전부 내려온다.
  async getDocuments(caseId: number): Promise<CaseDocumentResponse[]> {
    const { data } = await apiClient.get<CaseDocumentResponse[]>(`/api/v1/cases/${caseId}/documents`);
    return data;
  },

  // apiClient 기본 Content-Type이 application/json이라 이 요청만 multipart로 지정한다(axios가 FormData를 JSON으로 바꾸지 않게).
  // 경계 문자열은 RN이 붙인다. 401이면 apiClient 인터셉터가 토큰을 재발급하고 같은 FormData로 한 번 다시 보낸다.
  async uploadDocument(caseId: number, documentTypeId: number, file: UploadFile): Promise<CaseDocumentResponse> {
    const form = new FormData();
    form.append('file', { uri: file.uri, name: file.name, type: file.type } as unknown as Blob);
    const { data } = await apiClient.post<CaseDocumentResponse>(`/api/v1/cases/${caseId}/documents`, form, {
      params: { documentTypeId },
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: TRANSFER_TIMEOUT_MS,
    });
    return data;
  },

  // 소유자는 UPLOADED 또는 REVIEW_REQUIRED에서 PROCESSING으로만 바꿀 수 있다(백엔드 답변).
  async requestReview(caseId: number, documentId: number): Promise<CaseDocumentResponse> {
    const { data } = await apiClient.patch<CaseDocumentResponse>(`/api/v1/cases/${caseId}/documents/${documentId}/status`, {
      status: 'PROCESSING',
    });
    return data;
  },

  async deleteDocument(caseId: number, documentId: number): Promise<void> {
    await apiClient.delete(`/api/v1/cases/${caseId}/documents/${documentId}`);
  },

  // 인증 헤더가 필요한 binary 응답이라 apiClient(arraybuffer)로 받아 401 재발급을 그대로 쓴다.
  async downloadDocument(caseId: number, documentId: number): Promise<Uint8Array> {
    const { data } = await apiClient.get<ArrayBuffer>(`/api/v1/cases/${caseId}/documents/${documentId}/download`, {
      responseType: 'arraybuffer',
      timeout: TRANSFER_TIMEOUT_MS,
    });
    return new Uint8Array(data);
  },
};
