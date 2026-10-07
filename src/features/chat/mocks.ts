export type ChatQuickReply = {
  id: string;
  label: string;
  primary?: boolean;
};

export type ChatMessage =
  | { id: string; type: 'date'; text: string }
  | { id: string; type: 'bot'; text: string }
  | { id: string; type: 'pending' }
  | { id: string; type: 'quickReplies'; items: ChatQuickReply[] }
  | { id: string; type: 'user'; text: string };

export const CHAT_STATUS = '응답 중';

export const INITIAL_GREETING =
  '안녕하세요! 산재 승인 후 회복 절차에 대해 안내해 드릴게요. 현재 진행 중인 케이스가 있다면 바로 확인해 드릴 수 있습니다.';

export const INITIAL_QUICK_REPLIES: ChatQuickReply[] = [
  { id: 'q1-1', label: '내 케이스부터 시작하기', primary: true },
  { id: 'q1-2', label: '휴업급여 신청서' },
  { id: 'q1-3', label: '상세 내역 확인하기' },
];
