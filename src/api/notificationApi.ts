import { apiClient } from './client';

// 스웨거 NotificationResponse. link 형식은 스펙에 없어 문자열로만 받는다.
export type NotificationCategory = 'CASE' | 'DOC' | 'PAY' | 'INFO';

export type NotificationResponse = {
  id: number;
  category: NotificationCategory;
  title: string;
  message: string;
  read: boolean;
  // 한국 시간(KST), 오프셋 없음
  createdAt: string;
  link?: string | null;
};

export type NotificationListResponse = {
  items: NotificationResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  unreadCount: number;
};

export type MarkAllNotificationsReadResponse = { updatedCount: number };

export const notificationApi = {
  // 최신순 고정, 페이지 번호 방식(page는 0부터)
  async getNotifications(params: { page?: number; size?: number } = {}): Promise<NotificationListResponse> {
    const { data } = await apiClient.get<NotificationListResponse>('/api/v1/notifications', { params });
    return data;
  },

  async markRead(notificationId: number): Promise<NotificationResponse> {
    const { data } = await apiClient.patch<NotificationResponse>(`/api/v1/notifications/${notificationId}/read`);
    return data;
  },

  async markAllRead(): Promise<MarkAllNotificationsReadResponse> {
    const { data } = await apiClient.patch<MarkAllNotificationsReadResponse>('/api/v1/notifications/read-all');
    return data;
  },
};
