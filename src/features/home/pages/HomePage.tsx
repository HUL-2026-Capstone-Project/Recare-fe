import { useCallback, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { useCaseStore } from '@/store/caseStore';
import { useProfileStore } from '@/store/profileStore';
import { toHomeSubtitle, toRecoveryPeriod } from '@/features/case/caseMapper';
import { TOTAL_STEPS, getStatusPresentation, isClosedStatus } from '@/features/case/statusMapper';
import { Header } from '../components/Header';
import { PeriodCard } from '../components/PeriodCard';
import { SectionHeader } from '../components/SectionHeader';
import { CaseCard } from '../components/CaseCard';
import { ClaimItem } from '../components/ClaimItem';
import { FaqItem } from '../components/FaqItem';
import { Card } from '../components/Card';
import { homeMock } from '../components/mocks';

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const cases = useCaseStore((state) => state.cases);
  const details = useCaseStore((state) => state.details);
  const fetchCases = useCaseStore((state) => state.fetchCases);
  const fetchCase = useCaseStore((state) => state.fetchCase);

  // TODO(가정): 대표 케이스 = CLOSED가 아닌 케이스 중 서버가 준 순서상 첫 번째. 백엔드 기준이 정해지면 바꾼다.
  const activeCase = cases.find((c) => !isClosedStatus(c.status));
  const activeCaseId = activeCase?.id;
  const activeDetail = activeCaseId != null ? details[activeCaseId] : undefined;
  const presentation = getStatusPresentation(activeCase?.status);
  const period = activeDetail ? toRecoveryPeriod(activeDetail) : null;

  useEffect(() => {
    if (!profile) fetchProfile();
  }, [profile, fetchProfile]);

  // 탭 화면은 마운트된 채로 남으므로 포커스될 때마다 목록을 새로 받는다.
  useFocusEffect(
    useCallback(() => {
      fetchCases();
    }, [fetchCases])
  );

  // 경위 한 줄과 요양기간은 상세 응답에만 있어 대표 케이스에 한해 상세를 한 번 불러온다.
  useEffect(() => {
    if (activeCaseId != null) fetchCase(activeCaseId);
  }, [activeCaseId, fetchCase]);

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

        {activeCase && (
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
              title={activeCase.title ?? ''}
              subtitle={activeDetail ? toHomeSubtitle(activeDetail) : ''}
              currentStep={presentation.step}
              totalSteps={TOTAL_STEPS}
              onPressDetail={() => router.push(`/case-detail/${activeCase.id}`)}
            />
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
