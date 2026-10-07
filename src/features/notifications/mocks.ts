export type NotificationIcon = 'money' | 'doc' | 'check' | 'case' | 'info';

export type Notification = {
  id: string;
  read: boolean;
  type: string;
  icon: NotificationIcon;
  title: string;
  message: string;
  time: string;
};

export const notifications: Notification[] = [
  {
    id: 'n1',
    read: false,
    type: '지급 완료',
    icon: 'money',
    title: '휴업급여가 지급되었어요',
    message: '1차 휴업급여 1,500,000원이 등록 계좌로 입금되었습니다.',
    time: '2024.03.15 · 지급완료',
  },
  {
    id: 'n2',
    read: false,
    type: '서류 요청',
    icon: 'doc',
    title: '추가 서류 제출이 필요해요',
    message: '진료비 영수증 첨부가 필요합니다. 빠른 처리를 위해 확인 부탁드려요.',
    time: '2024.03.14 · 14:22',
  },
  {
    id: 'n3',
    read: false,
    type: '심사 결과',
    icon: 'check',
    title: '심사 결과가 도착했어요',
    message: '산재 신청이 승인되었습니다. 상세 내역을 확인해주세요.',
    time: '2024.03.12 · 09:30',
  },
  {
    id: 'n4',
    read: true,
    type: '케이스 업데이트',
    icon: 'case',
    title: '서류 검토가 시작되었어요',
    message: '의사 소견서가 접수되어 검토 단계로 이동했습니다.',
    time: '2024.03.08 · 11:05',
  },
  {
    id: 'n5',
    read: true,
    type: '안내',
    icon: 'info',
    title: '맞춤 지정병원을 추천해드려요',
    message: '근처에 새로운 산재 지정병원 3곳이 등록되었어요.',
    time: '2024.03.05 · 16:48',
  },
];
