import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/shared/constants/colors';
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

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <Header />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 2, paddingBottom: 24 }}
      >
        <PeriodCard
          name={homeMock.user.name}
          startDate={homeMock.period.startDate}
          endDate={homeMock.period.endDate}
          remainingDays={homeMock.period.remainingDays}
          progress={homeMock.period.progress}
        />

        <View className="mb-6">
          <SectionHeader
            title="내 사건 대시보드"
            actionLabel="전체보기 ›"
            onPressAction={() => router.push('/(tabs)/cases')}
          />
          <CaseCard
            caseNumber={homeMock.activeCase.caseNumber}
            statusLabel={homeMock.activeCase.statusLabel}
            title={homeMock.activeCase.title}
            subtitle={homeMock.activeCase.subtitle}
            currentStep={homeMock.activeCase.currentStep}
            totalSteps={homeMock.activeCase.totalSteps}
          />
        </View>

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
