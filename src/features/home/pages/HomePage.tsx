import { useCallback, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { useCaseStore } from '@/store/caseStore';
import { useProfileStore } from '@/store/profileStore';
import { toHomeSubtitle, toRecoveryPeriod } from '@/features/case/caseMapper';
import { getStatusPresentation } from '@/features/case/statusMapper';
import { Header } from '../components/Header';
import { PeriodCard } from '../components/PeriodCard';
import { SectionHeader } from '../components/SectionHeader';
import { CaseCard } from '../components/CaseCard';
import { CaseEmptyCard } from '../components/CaseEmptyCard';
import { ClaimItem } from '../components/ClaimItem';
import { FaqItem } from '../components/FaqItem';
import { Card } from '../components/Card';
import { homeMock } from '../components/mocks';

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const cases = useCaseStore((state) => state.cases);
  const listLoaded = useCaseStore((state) => state.listLoaded);
  const fetchCases = useCaseStore((state) => state.fetchCases);

  // 대표 케이스 = 진행 중(progress.group이 ACTIVE)인 케이스 중 서버가 준 순서상 첫 번째(기본 정렬 createdAt 최신순).
  // 요양기간과 경위 요약은 목록 응답(summary)에 있어 상세를 따로 부르지 않는다.
  const activeCase = cases.find((c) => c.progress.group === 'ACTIVE');
  const presentation = activeCase ? getStatusPresentation(activeCase.status, activeCase.progress) : null;
  const period = activeCase ? toRecoveryPeriod(activeCase) : null;

  useEffect(() => {
    if (!profile) fetchProfile();
  }, [profile, fetchProfile]);

  // 탭 화면은 마운트된 채로 남으므로 포커스될 때마다 목록을 새로 받는다.
  useFocusEffect(
    useCallback(() => {
      fetchCases();
    }, [fetchCases])
  );

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <Header />

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
          <View className="mb-6">
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
          <View className="mb-6">
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

        <View className="mb-6">
          <SectionHeader title="다음 신청서를 제출할 수 있어요" />
          <View className="gap-2">
            {homeMock.claims.map((claim) => (
              <ClaimItem
                key={claim.id}
                title={claim.title}
                description={claim.description}
                badgeLabel={claim.badgeLabel}
                variant={claim.variant}
                onPress={claim.id === 'absence-benefit' ? () => router.push('/calculator') : undefined}
              />
            ))}
          </View>
        </View>

        <View>
          <SectionHeader title="자주 묻는 질문들이에요" />
          <Card className="p-1">
            {homeMock.faqs.map((faq, index) => (
              <FaqItem
                key={faq.id}
                question={faq.question}
                isLast={index === homeMock.faqs.length - 1}
              />
            ))}
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
