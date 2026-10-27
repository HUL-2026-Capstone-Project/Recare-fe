import { create } from 'zustand';

import { caseApi } from '@/api/caseApi';
import type { TimelineResponse, TodoResponse, TodoStatus } from '@/api/caseApi';

// loading은 보여줄 데이터가 없는 처음 로딩이다. 이미 받아 둔 데이터가 있으면 다시 불러오는 동안에도 loaded로 둔다.
export type SectionStatus = 'idle' | 'loading' | 'loaded' | 'error';
export type Section<T> = { status: SectionStatus; items: T[] };

export const EMPTY_SECTION = { status: 'idle', items: [] } as const;

type ToggleResult = 'done' | 'failed' | 'ignored';

type CaseProgressState = {
  timelines: Record<number, Section<TimelineResponse>>;
  todos: Record<number, Section<TodoResponse>>;
  loadTimeline: (caseId: number) => Promise<void>;
  loadTodos: (caseId: number) => Promise<void>;
  toggleTodo: (caseId: number, todoId: number) => Promise<ToggleResult>;
  reset: () => void;
};

// 같은 케이스·섹션의 요청이 겹치면 최신 요청만 반영하도록 케이스별 요청 식별값을 둔다.
const timelineSeqs: Record<number, number> = {};
const todoSeqs: Record<number, number> = {};
// 상태 변경 요청이 진행 중인 할 일. 같은 항목은 다시 누를 수 없고, 목록을 다시 받아도 이 항목은 화면 값을 유지한다.
const pendingTodos: Record<number, Set<number>> = {};
let resetGeneration = 0;

const bump = (seqs: Record<number, number>, caseId: number) => (seqs[caseId] = (seqs[caseId] ?? 0) + 1);

// 타임라인·할 일은 개인 건강/권리 정보라 메모리(zustand)에만 두고 저장소·로그에 남기지 않는다.
export const useCaseProgressStore = create<CaseProgressState>((set, get) => {
  const replaceTodo = (caseId: number, todoId: number, update: (todo: TodoResponse) => TodoResponse) =>
    set((state) => {
      const section = state.todos[caseId];
      if (!section) return state;
      return {
        todos: { ...state.todos, [caseId]: { ...section, items: section.items.map((t) => (t.id === todoId ? update(t) : t)) } },
      };
    });

  return {
    timelines: {},
    todos: {},

    loadTimeline: async (caseId) => {
      const seq = bump(timelineSeqs, caseId);
      if (get().timelines[caseId]?.status !== 'loaded') {
        set((state) => ({ timelines: { ...state.timelines, [caseId]: { status: 'loading', items: [] } } }));
      }
      try {
        const items = await caseApi.getTimeline(caseId);
        if (seq !== timelineSeqs[caseId]) return;
        set((state) => ({ timelines: { ...state.timelines, [caseId]: { status: 'loaded', items } } }));
      } catch {
        if (seq !== timelineSeqs[caseId]) return;
        // 받아 둔 데이터가 있으면 그대로 두고, 없을 때만 실패 상태로 둔다.
        set((state) =>
          state.timelines[caseId]?.status === 'loaded'
            ? state
            : { timelines: { ...state.timelines, [caseId]: { status: 'error', items: [] } } }
        );
      }
    },

    loadTodos: async (caseId) => {
      const seq = bump(todoSeqs, caseId);
      if (get().todos[caseId]?.status !== 'loaded') {
        set((state) => ({ todos: { ...state.todos, [caseId]: { status: 'loading', items: [] } } }));
      }
      try {
        const fetched = await caseApi.getTodos(caseId);
        if (seq !== todoSeqs[caseId]) return;
        set((state) => {
          const pending = pendingTodos[caseId];
          const local = state.todos[caseId]?.items ?? [];
          // 서버 순서를 따르되, 상태 변경이 진행 중인 항목은 화면에 보이는 값을 유지한다.
          const items = fetched.map((todo) => (pending?.has(todo.id) ? (local.find((t) => t.id === todo.id) ?? todo) : todo));
          return { todos: { ...state.todos, [caseId]: { status: 'loaded', items } } };
        });
      } catch {
        if (seq !== todoSeqs[caseId]) return;
        set((state) =>
          state.todos[caseId]?.status === 'loaded' ? state : { todos: { ...state.todos, [caseId]: { status: 'error', items: [] } } }
        );
      }
    },

    // TODO·IN_PROGRESS → DONE, DONE → TODO. 누르는 즉시 화면에 반영하고, 실패하면 되돌린다.
    toggleTodo: async (caseId, todoId) => {
      const target = get().todos[caseId]?.items.find((t) => t.id === todoId);
      if (!target) return 'ignored';
      const pending = (pendingTodos[caseId] ??= new Set());
      if (pending.has(todoId)) return 'ignored';

      const generation = resetGeneration;
      const next: TodoStatus = target.status === 'DONE' ? 'TODO' : 'DONE';
      pending.add(todoId);
      // 이미 날아간 목록 조회가 낙관적 값을 이전 값으로 덮어쓰지 못하게 한다.
      bump(todoSeqs, caseId);
      replaceTodo(caseId, todoId, (t) => ({ ...t, status: next }));

      try {
        const updated = await caseApi.changeTodoStatus(caseId, todoId, next);
        if (generation !== resetGeneration) return 'ignored';
        pending.delete(todoId);
        replaceTodo(caseId, todoId, () => updated);
        // 서버 순서를 따르기 위한 조용한 재조회. 실패해도 현재 값을 유지한다.
        void get().loadTodos(caseId);
        return 'done';
      } catch {
        if (generation !== resetGeneration) return 'ignored';
        pending.delete(todoId);
        replaceTodo(caseId, todoId, (t) => ({ ...t, status: target.status }));
        return 'failed';
      }
    },

    reset: () => {
      resetGeneration += 1;
      for (const key of Object.keys(timelineSeqs)) timelineSeqs[Number(key)] += 1;
      for (const key of Object.keys(todoSeqs)) todoSeqs[Number(key)] += 1;
      for (const key of Object.keys(pendingTodos)) delete pendingTodos[Number(key)];
      set({ timelines: {}, todos: {} });
    },
  };
});
