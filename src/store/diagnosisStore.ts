import { create } from 'zustand';

import { diagnosisApi } from '@/api/diagnosisApi';
import type { DiagnosisResultResponse } from '@/api/diagnosisApi';
import type { ApiError } from '@/api/types';
import {
  DIAGNOSIS_ANSWER_TYPE,
  DIAGNOSIS_ENTRY_POINT,
  DIAGNOSIS_PURPOSE,
  DIAGNOSIS_QUESTIONS,
} from '@/features/diagnosis/constants';

export type DiagnosisStep = 'start' | 'question' | 'calculating' | 'failed' | 'result';

// 완료 PATCH의 진행 상태. unknown은 요청은 보냈지만 성공 응답을 받지 못한 상태다.
type CompleteState = 'pending' | 'unknown' | 'done';

type DiagnosisState = {
  step: DiagnosisStep;
  questionIndex: number;
  // 질문별로 고른 보기 순서(고르지 않았으면 null)
  picks: (number | null)[];
  sessionId: number | null;
  sentKeys: Record<string, true>;
  completeState: CompleteState;
  result: DiagnosisResultResponse | null;
  submitting: boolean;

  begin: () => void;
  pick: (optionIndex: number) => void;
  next: () => void;
  previous: () => void;
  submit: () => Promise<void>;
  clearAnswers: () => void;
  reset: () => void;
};

const INITIAL = {
  step: 'start' as DiagnosisStep,
  questionIndex: 0,
  picks: DIAGNOSIS_QUESTIONS.map(() => null) as (number | null)[],
  sessionId: null as number | null,
  sentKeys: {} as Record<string, true>,
  completeState: 'pending' as CompleteState,
  result: null as DiagnosisResultResponse | null,
  submitting: false,
};

// 화면을 나가거나 로그아웃한 뒤에 늦게 도착한 응답이 상태를 되살리지 않도록 세대를 둔다.
let generation = 0;

const isNotCompleted = (e: unknown) => (e as ApiError)?.kind === 'server' && (e as ApiError).status === 400;

// 진단 답변은 건강정보일 수 있어 메모리(zustand)에만 두고 저장소·로그·라우트 파라미터에 남기지 않는다.
export const useDiagnosisStore = create<DiagnosisState>((set, get) => ({
  ...INITIAL,

  begin: () => set({ step: 'question', questionIndex: 0 }),

  pick: (optionIndex) =>
    set((state) => ({ picks: state.picks.map((value, index) => (index === state.questionIndex ? optionIndex : value)) })),

  next: () => set((state) => ({ questionIndex: Math.min(state.questionIndex + 1, DIAGNOSIS_QUESTIONS.length - 1) })),

  previous: () =>
    set((state) => (state.questionIndex === 0 ? { step: 'start' as DiagnosisStep } : { questionIndex: state.questionIndex - 1 })),

  // 세션 생성 → 답변을 한 개씩 순서대로(성공한 questionKey는 다시 보내지 않음) → 완료 → 결과 조회. 실패하면 실패 화면으로 가고,
  // 같은 함수를 다시 부르면 성공한 단계는 건너뛰고 이어서 진행한다.
  submit: async () => {
    if (get().submitting) return;
    const gen = generation;
    const alive = () => gen === generation;
    set({ step: 'calculating', submitting: true });

    try {
      let sessionId = get().sessionId;
      if (sessionId == null) {
        sessionId = (await diagnosisApi.createSession(DIAGNOSIS_ENTRY_POINT)).id;
        if (!alive()) return;
        set({ sessionId });
      }

      if (get().completeState === 'pending') {
        // 질문 화면은 보기를 고르기 전에는 다음으로 넘어가지 못하므로 picks는 모두 채워져 있다.
        const { picks } = get();
        const answers = [
          { questionKey: DIAGNOSIS_PURPOSE.questionKey, answerValue: DIAGNOSIS_PURPOSE.answerValue },
          ...DIAGNOSIS_QUESTIONS.map((question, index) => ({
            questionKey: question.questionKey,
            answerValue: question.options[picks[index] as number].value,
          })),
        ];
        for (const answer of answers) {
          if (get().sentKeys[answer.questionKey]) continue;
          await diagnosisApi.saveAnswer(sessionId, { ...answer, answerType: DIAGNOSIS_ANSWER_TYPE });
          if (!alive()) return;
          set((state) => ({ sentKeys: { ...state.sentKeys, [answer.questionKey]: true } }));
        }
      }

      let result: DiagnosisResultResponse | null = null;
      if (get().completeState === 'unknown') {
        // 이전 완료 요청의 결과를 모르면 결과부터 조회해 본다. 400(아직 완료되지 않음)일 때만 완료를 다시 요청한다.
        try {
          result = await diagnosisApi.getResult(sessionId);
          if (!alive()) return;
          set({ completeState: 'done' });
        } catch (e) {
          if (!alive()) return;
          if (!isNotCompleted(e)) throw e;
        }
      }
      if (get().completeState !== 'done') {
        set({ completeState: 'unknown' });
        await diagnosisApi.completeSession(sessionId);
        if (!alive()) return;
        set({ completeState: 'done' });
      }

      result = result ?? (await diagnosisApi.getResult(sessionId));
      if (!alive()) return;
      set({ result, step: 'result', submitting: false });
    } catch {
      if (!alive()) return;
      set({ step: 'failed', submitting: false });
    }
  },

  // 케이스 등록으로 넘어가기 직전에 답변과 결과를 지운다(화면 단계는 그대로 둔다).
  clearAnswers: () => {
    generation += 1;
    set({ picks: INITIAL.picks.slice(), sessionId: null, sentKeys: {}, completeState: 'pending', result: null, submitting: false });
  },

  reset: () => {
    generation += 1;
    set({ ...INITIAL, picks: INITIAL.picks.slice(), sentKeys: {} });
  },
}));
