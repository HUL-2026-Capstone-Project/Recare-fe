import { Pressable, Text, View } from 'react-native';

import type { CaseProgress, TimelineResponse, TimelineStepStatus } from '@/api/caseApi';
import { colors } from '@/shared/constants/colors';
import type { Section } from '@/store/caseProgressStore';
import { formatEventDate, getStepTypeLabel } from '../progressFormat';
import { TimelineCheck } from './CheckMarks';
import { AddButton, Chip, SectionCard, SectionEmpty, SectionError, SectionSkeleton, SectionTitle } from './CaseSectionParts';

const DOT_AREA_WIDTH = 24;
const LINE_GAP = 4;

function dotSize(status: TimelineStepStatus) {
  return status === 'IN_PROGRESS' ? 24 : 14;
}

// 점의 위 간격: 제목 한 줄의 가운데에 맞춘다(14px 점 20, 24px 점 15).
function dotTop(status: TimelineStepStatus) {
  return status === 'IN_PROGRESS' ? 15 : 20;
}

function Dot({ status }: { status: TimelineStepStatus }) {
  if (status === 'DONE') {
    return (
      <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' }}>
        <TimelineCheck />
      </View>
    );
  }
  if (status === 'IN_PROGRESS') {
    return (
      <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: colors.primary }} />
      </View>
    );
  }
  if (status === 'SKIPPED') {
    return (
      <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: colors.input, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 6, height: 1.5, borderRadius: 1, backgroundColor: colors.text3 }} />
      </View>
    );
  }
  return <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#fff', borderWidth: 2, borderColor: colors.border }} />;
}

function TimelineRow({ item, prev, isLast, onPress }: { item: TimelineResponse; prev: TimelineResponse | null; isLast: boolean; onPress: () => void }) {
  const top = dotTop(item.stepStatus);
  const size = dotSize(item.stepStatus);
  const kindLabel = getStepTypeLabel(item.stepType);
  const muted = item.stepStatus === 'PENDING' || item.stepStatus === 'SKIPPED';
  const date = formatEventDate(item.eventDate);

  return (
    // 행 전체를 누르면 단계 수정 시트가 열린다(눌림 시 시각 변화 없음).
    <Pressable onPress={onPress} className="flex-row" style={{ gap: 14, paddingBottom: isLast ? 0 : 16 }}>
      <View style={{ width: DOT_AREA_WIDTH, alignSelf: 'stretch' }}>
        {/* 이전 항목에서 내려온 선: 점 위 4px까지 */}
        {prev && top - LINE_GAP > 0 && (
          <View
            style={{ position: 'absolute', left: 11, top: 0, width: 2, height: top - LINE_GAP, backgroundColor: prev.stepStatus === 'DONE' ? colors.success : colors.border }}
          />
        )}
        <View style={{ position: 'absolute', top, left: (DOT_AREA_WIDTH - size) / 2 }}>
          <Dot status={item.stepStatus} />
        </View>
        {/* 다음 항목으로 내려가는 선: 점 아래 4px부터 행 끝까지 */}
        {!isLast && (
          <View
            style={{ position: 'absolute', left: 11, top: top + size + LINE_GAP, bottom: 0, width: 2, backgroundColor: item.stepStatus === 'DONE' ? colors.success : colors.border }}
          />
        )}
      </View>

      <View style={{ flex: 1 }}>
        {kindLabel && <Text style={{ fontSize: 11, lineHeight: 14, fontWeight: '600', color: colors.text3, letterSpacing: -0.2 }}>{kindLabel}</Text>}
        <View className="flex-row items-start" style={{ marginTop: 2, gap: 8 }}>
          <Text
            style={{
              flex: 1,
              fontSize: 14,
              lineHeight: 20,
              fontWeight: '700',
              letterSpacing: -0.3,
              color: muted ? colors.text3 : colors.text1,
              textDecorationLine: item.stepStatus === 'SKIPPED' ? 'line-through' : 'none',
            }}
          >
            {item.title}
          </Text>
          {item.stepStatus === 'IN_PROGRESS' && <Chip label="진행 중" bg={colors.primaryLight} fg={colors.primary} />}
          {item.stepStatus === 'SKIPPED' && <Chip label="건너뜀" bg={colors.input} fg={colors.text2} />}
        </View>
        {!!item.description && (
          <Text numberOfLines={3} ellipsizeMode="tail" style={{ marginTop: 4, fontSize: 12, lineHeight: 18, fontWeight: '500', color: colors.text2, letterSpacing: -0.2 }}>
            {item.description}
          </Text>
        )}
        {!!date && <Text style={{ marginTop: 4, fontSize: 11, fontWeight: '500', color: colors.text3 }}>{date}</Text>}
      </View>
    </Pressable>
  );
}

export function CaseTimelineSection({
  section,
  progress,
  onRetry,
  onAdd,
  onEdit,
}: {
  section: Section<TimelineResponse>;
  progress: CaseProgress;
  onRetry: () => void;
  onAdd: () => void;
  onEdit: (item: TimelineResponse) => void;
}) {
  let content;
  if (section.status === 'error') {
    content = <SectionError onRetry={onRetry} />;
  } else if (section.status !== 'loaded') {
    content = <SectionSkeleton />;
  } else if (section.items.length === 0) {
    content = <SectionEmpty text="아직 진행 상황이 없어요" cta={{ label: '첫 단계 추가하기', onPress: onAdd }} />;
  } else {
    content = (
      <SectionCard>
        <View className="flex-row items-center justify-between" style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text2, letterSpacing: -0.3 }}>{progress.statusLabel}</Text>
          <Text style={{ fontSize: 12, fontWeight: '600', color: colors.primary, letterSpacing: -0.2 }}>
            {progress.stage} / {progress.totalStages} 단계
          </Text>
        </View>
        {section.items.map((item, index) => (
          <TimelineRow
            key={item.id}
            item={item}
            prev={index > 0 ? section.items[index - 1] : null}
            isLast={index === section.items.length - 1}
            onPress={() => onEdit(item)}
          />
        ))}
      </SectionCard>
    );
  }

  return (
    <View style={{ marginTop: 20 }}>
      <SectionTitle title="진행 상황" right={<AddButton onPress={onAdd} />} />
      {content}
    </View>
  );
}
