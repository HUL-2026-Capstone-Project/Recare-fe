import { useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { useCaseStore } from '@/store/caseStore';
import { EMPTY_SECTION, useCaseProgressStore } from '@/store/caseProgressStore';
import { CaseDetailHeader } from '@/features/case/components/CaseDetailHeader';
import { CaseSummaryCard } from '@/features/case/components/CaseSummaryCard';
import { ActionToast } from '@/features/case/components/ActionToast';
import { CaseTimelineSection } from '@/features/case/components/CaseTimelineSection';
import { CaseTodoSection } from '@/features/case/components/CaseTodoSection';
import { CaseStatusSheet } from '@/features/case/components/CaseStatusSheet';
import { TimelineEditSheet } from '@/features/case/components/TimelineEditSheet';
import { TodoEditSheet } from '@/features/case/components/TodoEditSheet';
import type { TimelineResponse, TodoResponse } from '@/api/caseApi';
import { toSummaryCardProps } from '@/features/case/caseMapper';

// 서버 상세로 채울 수 있는 요약 영역만 보여준다. 타임라인·할 일은 다음 작업에서 연결하고,
// 진단 의료기관/진단일자/부상 태그, 서류 목록, 정산, 청력검사, 결정문 다운로드, 다음 단계 배너는 서버 데이터가 없어 그리지 않는다.
export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const caseId = Number(id);
  const detail = useCaseStore((state) => state.details[caseId]);
  const fetchCase = useCaseStore((state) => state.fetchCase);

  const timeline = useCaseProgressStore((state) => state.timelines[caseId]) ?? EMPTY_SECTION;
  const todos = useCaseProgressStore((state) => state.todos[caseId]) ?? EMPTY_SECTION;
  const loadTimeline = useCaseProgressStore((state) => state.loadTimeline);
  const loadTodos = useCaseProgressStore((state) => state.loadTodos);
  const toggleTodo = useCaseProgressStore((state) => state.toggleTodo);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // 열려 있는 시트. 열 때마다 새로 마운트되어 입력값이 매번 초기화된다(item이 null이면 추가).
  const [timelineSheet, setTimelineSheet] = useState<{ item: TimelineResponse | null } | null>(null);
  const [todoSheet, setTodoSheet] = useState<{ item: TodoResponse | null } | null>(null);
  const [statusSheetOpen, setStatusSheetOpen] = useState(false);

  useEffect(() => {
    if (!Number.isFinite(caseId)) return;
    fetchCase(caseId);
    // 두 섹션은 서로 독립이다. 이미 받아 둔 값이 있으면 보여주면서 다시 불러온다.
    loadTimeline(caseId);
    loadTodos(caseId);
  }, [caseId, fetchCase, loadTimeline, loadTodos]);

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    []
  );

  const showFailureToast = useCallback(() => {
    setToastMessage('변경하지 못했어요. 잠시 후 다시 시도해 주세요.');
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const handleToggle = useCallback(
    async (todoId: number) => {
      const result = await toggleTodo(caseId, todoId);
      if (result === 'failed') showFailureToast();
    },
    [caseId, toggleTodo, showFailureToast]
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <CaseDetailHeader
        right={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push({ pathname: '/case-form', params: { mode: 'edit', id: String(caseId) } })}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.primary, letterSpacing: -0.3 }}>수정</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: Math.max(bottom, 32) }}
      >
        {detail && (
          <>
            <CaseSummaryCard {...toSummaryCardProps(detail)} onPressStatus={() => setStatusSheetOpen(true)} />
            <CaseTimelineSection
              section={timeline}
              progress={detail.progress}
              onRetry={() => loadTimeline(caseId)}
              onAdd={() => setTimelineSheet({ item: null })}
              onEdit={(item) => setTimelineSheet({ item })}
            />
            <CaseTodoSection
              section={todos}
              onToggle={handleToggle}
              onRetry={() => loadTodos(caseId)}
              onAdd={() => setTodoSheet({ item: null })}
              onEdit={(item) => setTodoSheet({ item })}
            />
          </>
        )}
      </ScrollView>
      <ActionToast message={toastMessage} />
      {timelineSheet && <TimelineEditSheet caseId={caseId} item={timelineSheet.item} onClose={() => setTimelineSheet(null)} />}
      {todoSheet && <TodoEditSheet caseId={caseId} item={todoSheet.item} onClose={() => setTodoSheet(null)} onDeleteFailed={showFailureToast} />}
      {statusSheetOpen && detail && <CaseStatusSheet caseId={caseId} current={detail.status} onClose={() => setStatusSheetOpen(false)} />}
    </View>
  );
}
