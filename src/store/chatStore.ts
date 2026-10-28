import { create } from 'zustand';

import { chatApi, streamChat } from '@/api/chatApi';
import type { ChatStreamEvent } from '@/api/chatApi';
import type { ChatMessage } from '@/features/chat/mocks';
import { INITIAL_GREETING, INITIAL_QUICK_REPLIES } from '@/features/chat/mocks';

// 서버 응답이 이 시간 동안 아무 데이터도 없으면 실패로 본다.
const STREAM_IDLE_TIMEOUT_MS = 60000;
// 상태 문구가 오기 전에 보여주는 고정 문구(시안)
const DEFAULT_STATUS_TEXT = '관련 조문과 판례를 찾는 중입니다';

function formatNowLabel() {
  const now = new Date();
  const period = now.getHours() < 12 ? '오전' : '오후';
  const hour12 = now.getHours() % 12 === 0 ? 12 : now.getHours() % 12;
  const minute = String(now.getMinutes()).padStart(2, '0');
  return `오늘 · ${period} ${hour12}:${minute}`;
}

let seq = 0;
function nextId(prefix: string) {
  seq += 1;
  return `${prefix}-${seq}`;
}

function buildInitialMessages(): ChatMessage[] {
  return [
    { id: nextId('date'), type: 'date', text: formatNowLabel() },
    { id: nextId('bot'), type: 'bot', text: INITIAL_GREETING },
    { id: nextId('quick'), type: 'quickReplies', items: INITIAL_QUICK_REPLIES },
  ];
}

const splitLines = (text: string) => text.split('\n').filter((line) => line.trim() !== '');

type ChatState = {
  messages: ChatMessage[];
  sessionId: string | null;
  isStreaming: boolean;
  showQuickReplies: boolean;
  send: (question: string) => Promise<void>;
  // 실패한 답변을 같은 질문으로 다시 요청한다(질문 말풍선은 새로 만들지 않는다).
  retry: (answerId: string) => Promise<void>;
  reset: () => void;
};

// 진행 중인 스트림. 로그아웃(reset)이나 새 스트림 시작 때 중단하고, 이전 스트림의 늦은 이벤트는 generation으로 버린다.
let activeController: AbortController | null = null;
let streamGeneration = 0;

// 질문·답변은 개인 상황이 담길 수 있어 메모리(zustand)에만 두고 저장소·로그에 남기지 않는다. 앱을 껐다 켜면 새 대화로 시작한다.
export const useChatStore = create<ChatState>((set, get) => {
  type Answer = Extract<ChatMessage, { type: 'answer' }>;

  const updateAnswer = (answerId: string, update: (answer: Answer) => Answer) =>
    set((state) => ({ messages: state.messages.map((m) => (m.id === answerId && m.type === 'answer' ? update(m) : m)) }));

  const runStream = async (answerId: string, question: string) => {
    const generation = ++streamGeneration;
    const controller = new AbortController();
    activeController = controller;
    set({ isStreaming: true });

    const isCurrent = () => generation === streamGeneration;
    let finished = false;

    const fail = () => {
      if (!isCurrent()) return;
      finished = true;
      updateAnswer(answerId, (a) => ({ ...a, phase: 'error' }));
      set({ isStreaming: false });
    };

    const handle = (event: ChatStreamEvent) => {
      if (!isCurrent() || finished) return;
      switch (event.type) {
        case 'status':
          updateAnswer(answerId, (a) => (a.phase === 'waiting' ? { ...a, statusText: event.text } : a));
          break;
        case 'sources':
          updateAnswer(answerId, (a) => ({ ...a, sources: event.sources }));
          break;
        case 'token': {
          // 토큰은 문장·줄 단위라 조각마다 별도 줄로 쌓는다(조각 안에 \n이 있어도 줄로 나눈다).
          const pieces = splitLines(event.text);
          if (pieces.length === 0) break;
          updateAnswer(answerId, (a) => ({ ...a, phase: 'streaming', lines: [...a.lines, ...pieces] }));
          break;
        }
        case 'done':
          finished = true;
          // 전체 답변(answer)을 최종 텍스트로 확정하고 session_id를 저장한다.
          updateAnswer(answerId, (a) => ({ ...a, phase: 'done', lines: event.answer != null ? splitLines(event.answer) : a.lines }));
          set((state) => ({ isStreaming: false, sessionId: event.sessionId ?? state.sessionId }));
          break;
        case 'error':
          fail();
          break;
      }
    };

    try {
      await streamChat({ question, sessionId: get().sessionId, controller, idleTimeoutMs: STREAM_IDLE_TIMEOUT_MS, onEvent: handle });
      // done이나 error 없이 연결이 닫힌 경우
      if (isCurrent() && !finished) fail();
    } catch {
      fail();
    } finally {
      if (activeController === controller) activeController = null;
    }
  };

  const startAnswer = (answerId: string, question: string) => {
    updateAnswer(answerId, (a) => ({ ...a, phase: 'waiting', statusText: DEFAULT_STATUS_TEXT, lines: [], sources: [] }));
    return runStream(answerId, question);
  };

  return {
    messages: buildInitialMessages(),
    sessionId: null,
    isStreaming: false,
    showQuickReplies: true,

    send: async (question) => {
      const trimmed = question.trim();
      if (!trimmed || get().isStreaming) return;

      const answerId = nextId('answer');
      set((state) => ({
        messages: [
          ...state.messages,
          { id: nextId('user'), type: 'user', text: trimmed },
          { id: answerId, type: 'answer', question: trimmed, phase: 'waiting', statusText: DEFAULT_STATUS_TEXT, lines: [], sources: [] },
        ],
        showQuickReplies: false,
      }));
      await runStream(answerId, trimmed);
    },

    retry: async (answerId) => {
      if (get().isStreaming) return;
      const target = get().messages.find((m) => m.id === answerId);
      if (!target || target.type !== 'answer' || target.phase !== 'error') return;
      await startAnswer(answerId, target.question);
    },

    reset: () => {
      streamGeneration += 1;
      activeController?.abort();
      activeController = null;
      const sessionId = get().sessionId;
      set({ messages: buildInitialMessages(), sessionId: null, isStreaming: false, showQuickReplies: true });
      if (sessionId) {
        chatApi.deleteChatSession(sessionId).catch(() => {});
      }
    },
  };
});
