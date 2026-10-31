import type { NotificationCategory, NotificationResponse } from '@/api/notificationApi';
import { formatEventDate } from '@/features/case/progressFormat';
import type { Notification, NotificationIcon } from './types';

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  CASE: '케이스 진행',
  DOC: '서류',
  PAY: '보상금·지급',
  INFO: '안내',
};

// 기존 check 아이콘은 서버 카테고리에 대응하는 값이 없어 쓰지 않는다.
const CATEGORY_ICONS: Record<NotificationCategory, NotificationIcon> = {
  CASE: 'case',
  DOC: 'doc',
  PAY: 'money',
  INFO: 'info',
};

// createdAt은 오프셋 없는 한국 시간이라 시간대 변환 없이 문자열 그대로 "YYYY.MM.DD HH:mm"로 만든다.
export function formatNotificationTime(createdAt: string | null | undefined): string {
  const date = formatEventDate(createdAt);
  if (!date) return '';
  const time = /[T ](\d{2}):(\d{2})/.exec(createdAt ?? '');
  return time ? `${date} ${time[1]}:${time[2]}` : date;
}

export function toNotification(res: NotificationResponse): Notification {
  return {
    id: String(res.id),
    read: res.read,
    type: CATEGORY_LABELS[res.category] ?? '안내',
    icon: CATEGORY_ICONS[res.category] ?? 'info',
    title: res.title,
    message: res.message,
    time: formatNotificationTime(res.createdAt),
  };
}
