import { ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { CaseDetailHeader } from '@/features/case/components/CaseDetailHeader';
import { CaseSummaryCard } from '@/features/case/components/CaseSummaryCard';
import { NextStepBanner } from '@/features/case/components/NextStepBanner';
import { SettlementCard } from '@/features/case/components/SettlementCard';
import { ProgressTimeline } from '@/features/case/components/ProgressTimeline';
import { ChecklistCard } from '@/features/case/components/ChecklistCard';
import { HearingTestCard } from '@/features/case/components/HearingTestCard';
import { DocumentList } from '@/features/case/components/DocumentList';
import { DetailActionBar } from '@/features/case/components/DetailActionBar';
import { DownloadButton } from '@/features/case/components/DownloadButton';
import { getCaseDetail } from '@/features/case/mocks';

export default function CaseDetailScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { top, bottom } = useSafeAreaInsets();
  const detail = getCaseDetail(id);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <CaseDetailHeader showChevronDown={detail.headerChevronDown} />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: Math.max(bottom, 32) }}
      >
        <CaseSummaryCard {...detail.summary} />
        {detail.banner && <NextStepBanner {...detail.banner} />}
        {detail.settlement && <SettlementCard {...detail.settlement} />}
        <ProgressTimeline
          steps={detail.timeline}
          title={detail.timelineTitle}
          caption={detail.timelineCaption}
          captionRight={detail.timelineCaptionRight}
        />
        {detail.checklist && <ChecklistCard items={detail.checklist} />}
        {detail.hearing && <HearingTestCard {...detail.hearing} />}
        <DocumentList documents={detail.documents} title={detail.documentsTitle} />
        {detail.actions && <DetailActionBar actions={detail.actions} />}
        {detail.downloadLabel && <DownloadButton label={detail.downloadLabel} />}
      </ScrollView>
    </View>
  );
}
