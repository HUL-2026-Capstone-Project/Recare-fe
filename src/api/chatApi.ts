import { aiClient } from './aiClient';

export type Source = {
  law?: string | null;
  article?: string | null;
  title?: string | null;
  source?: string | null;
};

export type ChatRequest = {
  question: string;
  session_id?: string | null;
};

export type ChatResponse = {
  session_id: string;
  answer: string;
  sources?: Source[];
  turn: number;
};

export const chatApi = {
  async sendChat(params: { question: string; sessionId?: string | null }) {
    const { data } = await aiClient.post<ChatResponse>('/chat', {
      question: params.question,
      session_id: params.sessionId ?? null,
    } satisfies ChatRequest);

    return {
      sessionId: data.session_id,
      answer: data.answer,
      sources: data.sources ?? [],
      turn: data.turn,
    };
  },

  async deleteChatSession(sessionId: string): Promise<void> {
    await aiClient.delete(`/sessions/${encodeURIComponent(sessionId)}`);
  },
};
