import { apiClient } from './client';

export type UserResponse = {
  id: number;
  loginId: string;
  name: string;
  birthDate?: string | null;
  gender?: string | null;
  phone?: string | null;
  carrier?: string | null;
  email?: string | null;
  address?: string | null;
  language?: string | null;
  verified?: boolean;
};

export type UserUpdateRequest = Partial<{
  name: string;
  gender: string;
  language: string;
  address: string;
  carrier: string;
  email: string;
}>;

// 스웨거 MyStatsResponse. 세 항목 모두 required이고 없으면 null이 아니라 0이다(서류·알림은 기능이 생기기 전까지 항상 0).
export type MyStatsResponse = {
  activeCaseCount: number;
  submittedDocumentCount: number;
  notificationCount: number;
};

export const userApi = {
  async getMyProfile(): Promise<UserResponse> {
    const { data } = await apiClient.get<UserResponse>('/api/v1/users/my');
    return data;
  },

  async updateProfile(payload: UserUpdateRequest): Promise<UserResponse> {
    const { data } = await apiClient.patch<UserResponse>('/api/v1/users/infochange', payload);
    return data;
  },

  // 스웨거: 요청 body 없음, 응답 200(본문 없음). 문서화된 오류 응답은 없다.
  async deleteUser(): Promise<void> {
    await apiClient.patch('/api/v1/users/deleteuser');
  },

  async getMyStats(): Promise<MyStatsResponse> {
    const { data } = await apiClient.get<MyStatsResponse>('/api/v1/users/my/stats');
    return data;
  },
};
