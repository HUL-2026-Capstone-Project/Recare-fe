import { create } from 'zustand';

import { chatApi } from '@/api/chatApi';
import { getErrorMessage } from '@/api/errorMessage';
import type { ApiError } from '@/api/types';
import type { ChatMessage } from '@/features/chat/mocks';
import { INITIAL_GREETING, INITIAL_QUICK_REPLIES } from '@/features/chat/mocks';

const PENDING_ID = 'pending';

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

type ChatState = {
  messages: ChatMessage[];
  sessionId: string | null;
  isSending: boolean;
  showQuickReplies: boolean;
  send: (question: string) => Promise<void>;
  reset: () => void;
};

export const useChatStore = create<ChatState>((set, get) => ({
  messages: buildInitialMessages(),
  sessionId: null,
  isSending: false,
  showQuickReplies: true,

  send: async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || get().isSending) return;

    const userMessage: ChatMessage = { id: nextId('user'), type: 'user', text: trimmed };
    set((state) => ({
      messages: [...state.messages, userMessage, { id: PENDING_ID, type: 'pending' }],
      isSending: true,
      showQuickReplies: false,
    }));

    try {
      const res = await chatApi.sendChat({ question: trimmed, sessionId: get().sessionId });
      set((state) => ({
        messages: state.messages
          .filter((m) => m.id !== PENDING_ID)
          .concat({ id: nextId('bot'), type: 'bot', text: res.answer }),
        sessionId: res.sessionId,
        isSending: false,
      }));
    } catch (e) {
      const message = getErrorMessage(e as ApiError);
      set((state) => ({
        messages: state.messages
          .filter((m) => m.id !== PENDING_ID)
          .concat({ id: nextId('bot'), type: 'bot', text: message }),
        isSending: false,
      }));
    }
  },

  reset: () => {
    const sessionId = get().sessionId;
    set({
      messages: buildInitialMessages(),
      sessionId: null,
      isSending: false,
      showQuickReplies: true,
    });
    if (sessionId) {
      chatApi.deleteChatSession(sessionId).catch(() => {});
    }
  },
}));
