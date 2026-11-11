export type NotificationIcon = 'money' | 'doc' | 'check' | 'case' | 'info';

// 화면(NotificationItem)이 쓰는 알림 한 건. 서버 응답은 mapper.ts에서 이 모양으로 바꾼다.
export type Notification = {
  id: string;
  read: boolean;
  // 제목 위의 작은 라벨(카테고리 한글 이름)
  type: string;
  icon: NotificationIcon;
  title: string;
  message: string;
  time: string;
};
