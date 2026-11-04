import { useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { DiagnosisResultResponse } from '@/api/diagnosisApi';
import { colors } from '@/shared/constants/colors';
import { Card } from '@/features/home/components/Card';
import { DocSpinner } from '@/features/case/components/DocSpinner';
import { DIAGNOSIS_QUESTIONS } from '../constants';
import { DocGlyph, PulseIcon } from './DiagnosisIcons';
import { Choice, DgBtn, DgFoot, DgHead, DgTextBtn, Progress } from './DiagnosisParts';

// 상태바 자리(시안 44)는 기기 상단 안전영역으로 대체한다.
function Screen({ bg = '#fff', children }: { bg?: string; children: React.ReactNode }) {
  const { top } = useSafeAreaInsets();
  return (
    <View className="flex-1" style={{ backgroundColor: bg, paddingTop: top }}>
      {children}
    </View>
  );
}

export function StartView({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  return (
    <Screen>
      <DgHead title="산재 자가진단" onBack={onBack} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 36, paddingHorizontal: 20 }}>
        <View className="items-center justify-center" style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: colors.primaryLight }}>
          <PulseIcon />
        </View>
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text1, letterSpacing: -0.6, lineHeight: 24 * 1.35, marginTop: 20 }}>
          내 상황을 간단히 확인해 볼까요?
        </Text>
        <Text style={{ fontSize: 14, fontWeight: '500', color: colors.text2, letterSpacing: -0.3, lineHeight: 14 * 1.55, marginTop: 10 }}>
          질문 4개에 답하면 받을 수 있는 급여와 준비할 서류를 알려드려요. 1분이면 끝나요.
        </Text>
        <View style={{ marginTop: 28, backgroundColor: colors.bg, borderRadius: 16, padding: 16 }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: colors.text2, letterSpacing: -0.2, lineHeight: 12 * 1.5 }}>
            답변은 진단을 끝까지 마쳤을 때만 저장돼요.
          </Text>
        </View>
      </ScrollView>
      <DgFoot>
        <DgBtn onPress={onStart}>시작하기</DgBtn>
      </DgFoot>
    </Screen>
  );
}

type QuestionViewProps = {
  index: number;
  pick: number | null;
  onPick: (optionIndex: number) => void;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
};

export function QuestionView({ index, pick, onPick, onBack, onClose, onNext }: QuestionViewProps) {
  const question = DIAGNOSIS_QUESTIONS[index];
  const last = index === DIAGNOSIS_QUESTIONS.length - 1;
  return (
    <Screen>
      <DgHead title={`${index + 1}/${DIAGNOSIS_QUESTIONS.length}`} onBack={onBack} onClose={onClose} />
      <Progress n={index + 1} total={DIAGNOSIS_QUESTIONS.length} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 28, paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text1, letterSpacing: -0.5, lineHeight: 22 * 1.35 }}>{question.title}</Text>
        {!!question.description && (
          <Text style={{ fontSize: 13, fontWeight: '500', color: colors.text2, letterSpacing: -0.3, lineHeight: 13 * 1.5, marginTop: 8 }}>{question.description}</Text>
        )}
        <View style={{ gap: 8, marginTop: 24 }}>
          {question.options.map((option, optionIndex) => (
            <Choice key={option.value} title={option.title} sub={option.description} on={pick === optionIndex} onPress={() => onPick(optionIndex)} />
          ))}
        </View>
      </ScrollView>
      <DgFoot>
        <DgBtn off={pick == null} onPress={onNext}>
          {last ? '결과 보기' : '다음'}
        </DgBtn>
      </DgFoot>
    </Screen>
  );
}

export function LoadingView() {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center" style={{ gap: 16, paddingBottom: 60 }}>
        <DocSpinner color={colors.primary} size={32} />
        <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text2, letterSpacing: -0.3 }}>결과를 확인하고 있어요</Text>
      </View>
    </Screen>
  );
}

export function FailView({ onRetry, onClose }: { onRetry: () => void; onClose: () => void }) {
  return (
    <Screen>
      <View className="flex-1 items-center justify-center" style={{ paddingHorizontal: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text1, letterSpacing: -0.4, marginBottom: 28 }}>결과를 가져오지 못했어요</Text>
        <View style={{ width: '100%' }}>
          <DgBtn onPress={onRetry}>다시 시도</DgBtn>
          <DgTextBtn onPress={onClose}>닫기</DgTextBtn>
        </View>
      </View>
    </Screen>
  );
}

function ResultCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card style={{ padding: 14, marginBottom: 10 }}>
      <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text1, letterSpacing: -0.3, marginBottom: 6 }}>{title}</Text>
      {children}
    </Card>
  );
}

const BODY_STYLE = { fontSize: 14, fontWeight: '500', color: colors.text2, letterSpacing: -0.3, lineHeight: 14 * 1.55 } as const;

type ResultViewProps = { result: DiagnosisResultResponse | null; onClose: () => void; onRegister: () => void };

export function ResultView({ result, onClose, onRegister }: ResultViewProps) {
  // 케이스 등록으로 넘어갈 때 스토어의 결과를 먼저 지우므로, 화면이 사라지는 동안 내용이 비지 않게 마지막 결과를 이 화면의 메모리에만 들고 있는다.
  const lastResult = useRef<DiagnosisResultResponse | null>(null);
  if (result) lastResult.current = result;
  const shown = lastResult.current;

  return (
    <Screen bg={colors.bg}>
      <DgHead title="진단 결과" onClose={onClose} />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 8, paddingHorizontal: 20 }}>
        {!!shown?.resultSummary && (
          <ResultCard title="진단 요약">
            <Text style={BODY_STYLE}>{shown.resultSummary}</Text>
          </ResultCard>
        )}
        {!!shown?.recommendedAction && (
          <ResultCard title="이렇게 해 보세요">
            <Text style={BODY_STYLE}>{shown.recommendedAction}</Text>
          </ResultCard>
        )}
        {!!shown?.requiredDocuments.length && (
          <ResultCard title="준비할 서류">
            {shown.requiredDocuments.map((name, index) => (
              <View
                key={`${index}-${name}`}
                className="flex-row items-center"
                style={{ minHeight: 36, gap: 10, borderBottomWidth: index < shown.requiredDocuments.length - 1 ? 1 : 0, borderBottomColor: colors.input }}
              >
                <View className="items-center justify-center" style={{ width: 24, height: 28, borderRadius: 5, backgroundColor: colors.primaryLight }}>
                  <DocGlyph />
                </View>
                <Text className="flex-1" style={{ fontSize: 14, fontWeight: '600', color: colors.text1, letterSpacing: -0.3 }}>
                  {name}
                </Text>
              </View>
            ))}
          </ResultCard>
        )}
        {!!shown?.nextActions.length && (
          <ResultCard title="다음 행동">
            <View style={{ gap: 8 }}>
              {shown.nextActions.map((action, index) => (
                <View key={`${index}-${action}`} className="flex-row items-center" style={{ gap: 10 }}>
                  <View className="items-center justify-center" style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primaryLight }}>
                    <Text style={{ fontSize: 12, fontWeight: '800', color: colors.primary }}>{index + 1}</Text>
                  </View>
                  <Text className="flex-1" style={{ fontSize: 14, fontWeight: '600', color: colors.text1, letterSpacing: -0.3 }}>
                    {action}
                  </Text>
                </View>
              ))}
            </View>
          </ResultCard>
        )}
      </ScrollView>
      <DgFoot>
        <DgBtn onPress={onRegister}>케이스 등록하기</DgBtn>
        <DgTextBtn onPress={onClose}>홈으로</DgTextBtn>
      </DgFoot>
    </Screen>
  );
}
