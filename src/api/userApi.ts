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

export const userApi = {
  async getMyProfile(): Promise<UserResponse> {
    const { data } = await apiClient.get<UserResponse>('/api/v1/users/my');
    return data;
  },

  async updateProfile(payload: UserUpdateRequest): Promise<UserResponse> {
    const { data } = await apiClient.patch<UserResponse>('/api/v1/users/infochange', payload);
    return data;
  },
};
