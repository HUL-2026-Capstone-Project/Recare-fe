import { fetch } from 'expo/fetch';

import { env } from '@/config/env';
import { aiClient } from './aiClient';
import { createSseParser } from './sse';

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

// POST /chat/stream 이벤트. status·sources·token·done·error 외의 이벤트는 무시한다.
export type ChatStreamEvent =
  | { type: 'status'; text: string }
  | { type: 'sources'; sources: Source[] }
  | { type: 'token'; text: string }
  | { type: 'done'; sessionId: string | null; answer: string | null }
  | { type: 'error' };

function parseData(data: string): unknown {
  try {
    return JSON.parse(data);
  } catch {
    return data;
  }
}

function toStreamEvent(event: string, data: string): ChatStreamEvent | null {
  const value = parseData(data);
  switch (event) {
    case 'status':
      return { type: 'status', text: typeof value === 'string' ? value : data };
    case 'token':
      return { type: 'token', text: typeof value === 'string' ? value : data };
    case 'sources':
      return { type: 'sources', sources: Array.isArray(value) ? (value as Source[]) : [] };
    case 'done': {
      const done = (value && typeof value === 'object' ? value : {}) as { session_id?: unknown; answer?: unknown };
      return {
        type: 'done',
        sessionId: typeof done.session_id === 'string' ? done.session_id : null,
        answer: typeof done.answer === 'string' ? done.answer : null,
      };
    }
    case 'error':
      // 서버가 준 오류 내용(detail)은 화면에도 로그에도 쓰지 않는다.
      return { type: 'error' };
    default:
      return null;
  }
}

// 질문 글과 session_id만 AI 서버로 보낸다. 메인 API의 apiClient(JWT 자동 첨부)를 쓰지 않고, Authorization 등 어떤 인증 정보도 붙이지 않는다.
// done이나 error 이벤트를 받으면 읽기를 멈추고 돌아온다. 연결이 먼저 닫히면 그냥 돌아오고, 네트워크 오류·중단은 throw한다.
// idleTimeoutMs 동안 아무 데이터도 없으면 controller.abort()로 끊는다.
export async function streamChat(params: {
  question: string;
  sessionId: string | null;
  controller: AbortController;
  idleTimeoutMs: number;
  onEvent: (event: ChatStreamEvent) => void;
}): Promise<void> {
  const { question, sessionId, controller, idleTimeoutMs, onEvent } = params;
  let idleTimer: ReturnType<typeof setTimeout> | null = null;
  const armIdleTimer = () => {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => controller.abort(), idleTimeoutMs);
  };

  armIdleTimer();
  try {
    const body: ChatRequest = { question, session_id: sessionId };
    const response = await fetch(`${env.aiApiUrl}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'text/event-stream' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok || !response.body) throw new Error('chat stream request failed');

    let finished = false;
    const parser = createSseParser((sse) => {
      if (finished) return;
      const event = toStreamEvent(sse.event, sse.data);
      if (!event) return;
      if (event.type === 'done' || event.type === 'error') finished = true;
      onEvent(event);
    });

    const reader = response.body.getReader();
    // stream 모드로 디코딩해서 한글(3바이트)이 청크 경계에서 잘려도 다음 청크와 이어 붙여 해석한다.
    const decoder = new TextDecoder('utf-8');
    while (!finished) {
      const { done, value } = await reader.read();
      if (done) break;
      armIdleTimer();
      parser.push(decoder.decode(value, { stream: true }));
    }
    if (!finished) {
      parser.push(decoder.decode());
      parser.flush();
    }
    await reader.cancel().catch(() => {});
  } finally {
    if (idleTimer) clearTimeout(idleTimer);
  }
}

export const chatApi = {
  async deleteChatSession(sessionId: string): Promise<void> {
    await aiClient.delete(`/sessions/${encodeURIComponent(sessionId)}`);
  },
};
