import { useCallback, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { useCaseStore } from '@/store/caseStore';
import { useChatStore } from '@/store/chatStore';
import { useMyStatsStore } from '@/store/myStatsStore';
import { useProfileStore } from '@/store/profileStore';
import { toHomeSubtitle, toRecoveryPeriod } from '@/features/case/caseMapper';
import { getStatusPresentation } from '@/features/case/statusMapper';
import { Header } from '../components/Header';
import { PeriodCard } from '../components/PeriodCard';
import { SectionHeader } from '../components/SectionHeader';
import { CaseCard } from '../components/CaseCard';
import { CaseEmptyCard } from '../components/CaseEmptyCard';
import { CalcEntryCard } from '../components/CalcEntryCard';
import { DiagEntryCard } from '../components/DiagEntryCard';
import { FaqItem } from '../components/FaqItem';
import { Card } from '../components/Card';
import { HOME_FAQ_QUESTIONS } from '../constants';

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const cases = useCaseStore((state) => state.cases);
  const listLoaded = useCaseStore((state) => state.listLoaded);
  const fetchCases = useCaseStore((state) => state.fetchCases);
  const unreadCount = useMyStatsStore((state) => state.stats?.notificationCount ?? 0);
  const fetchStats = useMyStatsStore((state) => state.fetchStats);

  // 대표 케이스 = 진행 중(progress.group이 ACTIVE)인 케이스 중 서버가 준 순서상 첫 번째(기본 정렬 createdAt 최신순).
  // 요양기간과 경위 요약은 목록 응답(summary)에 있어 상세를 따로 부르지 않는다.
  const activeCase = cases.find((c) => c.progress.group === 'ACTIVE');
  const presentation = activeCase ? getStatusPresentation(activeCase.status, activeCase.progress) : null;
  const period = activeCase ? toRecoveryPeriod(activeCase) : null;

  useEffect(() => {
    if (!profile) fetchProfile();
  }, [profile, fetchProfile]);

  // 탭 화면은 마운트된 채로 남으므로 포커스될 때마다 목록과 읽지 않은 알림 수(stats)를 새로 받는다.
  // stats를 아직 받지 못했거나 실패하면 stats가 null이라 벨에 배지를 켜지 않는다.
  useFocusEffect(
    useCallback(() => {
      fetchCases();
      fetchStats();
    }, [fetchCases, fetchStats])
  );

  // 질문을 채팅의 대기 질문으로 맡기고 채팅 탭으로 이동한다. 답변을 받는 중이면 이동만 한다.
  const openFaq = (question: string) => {
    useChatStore.getState().askQuestion(question);
    router.navigate('/(tabs)/chat');
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <Header hasUnread={unreadCount > 0} />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 2, paddingBottom: 24 }}
      >
        {profile && period && (
          <PeriodCard
            name={profile.name}
            startDate={period.startDate}
            endDate={period.endDate}
            remainingDays={period.remainingDays}
            progress={period.progress}
          />
        )}

        {activeCase && presentation && (
          <View className="mb-2">
            <SectionHeader
              title="내 사건 대시보드"
              actionLabel="전체보기 ›"
              onPressAction={() => router.push('/(tabs)/cases')}
            />
            <CaseCard
              caseNumber={activeCase.caseNumber ?? undefined}
              statusLabel={presentation.label}
              statusBg={presentation.badgeBg}
              statusFg={presentation.badgeFg}
              title={activeCase.title}
              subtitle={toHomeSubtitle(activeCase)}
              currentStep={presentation.step}
              totalSteps={presentation.totalSteps}
              onPressDetail={() => router.push(`/case-detail/${activeCase.id}`)}
            />
          </View>
        )}

        {!activeCase && listLoaded && (
          <View className="mb-2">
            <SectionHeader
              title="내 사건 대시보드"
              actionLabel={cases.length > 0 ? '전체보기 ›' : undefined}
              onPressAction={() => router.push('/(tabs)/cases')}
            />
            {cases.length > 0 ? (
              <CaseEmptyCard title="진행 중인 케이스가 없어요" description="종결된 케이스는 전체보기에서 확인할 수 있어요" />
            ) : (
              <CaseEmptyCard title="아직 등록된 케이스가 없어요" description="산재 케이스를 등록하면 진행 상황과 요양 기간을 한눈에 볼 수 있어요" />
            )}
          </View>
        )}

        <DiagEntryCard />

        {/* 케이스 영역, 자가진단 카드, 계산기 카드 사이는 8. 계산기 카드 아래(FAQ 제목까지)는 20. */}
        <View style={{ marginTop: 8, marginBottom: 20 }}>
          <CalcEntryCard />
        </View>

        <View>
          <SectionHeader title="자주 묻는 질문들이에요" />
          <Card className="p-1">
            {HOME_FAQ_QUESTIONS.map((question, index) => (
              <FaqItem
                key={question}
                question={question}
                isLast={index === HOME_FAQ_QUESTIONS.length - 1}
                onPress={() => openFaq(question)}
              />
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
