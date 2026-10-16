import { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { useCaseStore } from '@/store/caseStore';
import { CaseDetailHeader } from '@/features/case/components/CaseDetailHeader';
import { CaseSummaryCard } from '@/features/case/components/CaseSummaryCard';
import { toSummaryCardProps } from '@/features/case/caseMapper';

// 서버 상세로 채울 수 있는 요약 영역만 보여준다. 타임라인·할 일은 다음 작업에서 연결하고,
// 진단 의료기관/진단일자/부상 태그, 서류 목록, 정산, 청력검사, 결정문 다운로드, 다음 단계 배너는 서버 데이터가 없어 그리지 않는다.
export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const caseId = Number(id);
  const detail = useCaseStore((state) => state.details[caseId]);
  const fetchCase = useCaseStore((state) => state.fetchCase);

  useEffect(() => {
    if (Number.isFinite(caseId)) fetchCase(caseId);
  }, [caseId, fetchCase]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <CaseDetailHeader />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: Math.max(bottom, 32) }}
      >
        {detail && <CaseSummaryCard {...toSummaryCardProps(detail)} />}
      </ScrollView>
    </View>
  );
}
