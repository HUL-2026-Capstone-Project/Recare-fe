import { useCallback, useEffect, useState } from 'react';
import { BackHandler } from 'react-native';
import { router, useFocusEffect } from 'expo-router';

import { DocDeleteModal } from '@/features/case/components/DocDeleteModal';
import { useDiagnosisStore } from '@/store/diagnosisStore';
import { FailView, LoadingView, QuestionView, ResultView, StartView } from '../components/DiagnosisViews';
import { DIAGNOSIS_QUESTIONS } from '../constants';

// 시작/질문/계산 중/실패/결과를 한 화면 안에서 단계(step)로 전환한다. 답변과 결과는 스토어(메모리)에만 있다.
export default function DiagnosisPage() {
  const step = useDiagnosisStore((state) => state.step);
  const questionIndex = useDiagnosisStore((state) => state.questionIndex);
  const picks = useDiagnosisStore((state) => state.picks);
  const result = useDiagnosisStore((state) => state.result);
  const { begin, pick, next, previous, submit } = useDiagnosisStore.getState();
  const [leaveVisible, setLeaveVisible] = useState(false);

  // 어떤 경로로 화면을 벗어나도 답변과 결과가 남지 않게 한다.
  useEffect(() => () => useDiagnosisStore.getState().reset(), []);

  const goHome = useCallback(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)');
  }, []);

  // Android 하드웨어 뒤로가기: 질문은 이전 질문(1번은 시작), 시작은 홈, 계산 중은 무시, 실패와 결과는 "닫기"와 같다.
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        const state = useDiagnosisStore.getState();
        if (state.step === 'question') state.previous();
        else if (state.step !== 'calculating') goHome();
        return true;
      });
      return () => subscription.remove();
    }, [goHome])
  );

  const handleRegister = () => {
    const sessionId = useDiagnosisStore.getState().sessionId;
    if (sessionId == null) return;
    useDiagnosisStore.getState().clearAnswers();
    router.replace({ pathname: '/case-form', params: { mode: 'create', diagnosisSessionId: String(sessionId) } });
  };

  if (step === 'calculating') return <LoadingView />;
  if (step === 'failed') return <FailView onRetry={submit} onClose={goHome} />;
  if (step === 'result') return <ResultView result={result} onClose={goHome} onRegister={handleRegister} />;

  if (step === 'question') {
    const last = questionIndex === DIAGNOSIS_QUESTIONS.length - 1;
    return (
      <>
        <QuestionView
          index={questionIndex}
          pick={picks[questionIndex]}
          onPick={pick}
          onBack={previous}
          onClose={() => setLeaveVisible(true)}
          onNext={last ? submit : next}
        />
        {leaveVisible && (
          <DocDeleteModal
            title="진단을 그만할까요?"
            message="지금 나가면 답변이 저장되지 않아요."
            cancelLabel="계속하기"
            confirmLabel="나가기"
            onCancel={() => setLeaveVisible(false)}
            onConfirm={() => {
              setLeaveVisible(false);
              goHome();
            }}
          />
        )}
      </>
    );
  }

  return <StartView onBack={goHome} onStart={begin} />;
}
