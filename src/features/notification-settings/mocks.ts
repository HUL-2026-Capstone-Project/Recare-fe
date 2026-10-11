export type NotificationCategory = {
  key: string;
  title: string;
  description: string;
  defaultOn: boolean;
};

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  { key: 'case', title: '케이스 진행 상태', description: '접수·심사·승인 등 단계가 바뀔 때', defaultOn: true },
  { key: 'doc', title: '서류 요청 · 마감', description: '추가 서류 요청, 제출 마감 하루 전', defaultOn: true },
  { key: 'pay', title: '보상금 · 지급', description: '지급 확정과 입금 완료 소식', defaultOn: true },
  { key: 'chat', title: '챗봇 답변', description: '상담 답변이 도착했을 때', defaultOn: false },
];
