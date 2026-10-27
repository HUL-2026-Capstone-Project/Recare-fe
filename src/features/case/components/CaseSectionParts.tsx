import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { Card } from '@/features/home/components/Card';
import { PlusIcon } from './SheetIcons';

export function SectionTitle({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <View className="flex-row items-center justify-between" style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text1, letterSpacing: -0.3 }}>{title}</Text>
      {right}
    </View>
  );
}

// 제목 줄 오른쪽 "추가". 세로 마진 -12, 오른쪽 마진 -8로 줄 높이는 그대로 두고 터치 영역만 44로 키운다.
export function AddButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-row items-center"
      style={{ height: 44, paddingHorizontal: 8, marginVertical: -12, marginRight: -8, gap: 4 }}
    >
      <PlusIcon size={14} />
      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary, letterSpacing: -0.3 }}>추가</Text>
    </Pressable>
  );
}

export function SectionCard({ padding = 16, children }: { padding?: number; children: ReactNode }) {
  return (
    <Card style={{ borderRadius: 20, padding, marginBottom: 24 }}>{children}</Card>
  );
}

const EMPTY_TEXT_STYLE = { fontSize: 14, fontWeight: '500', color: colors.text3, letterSpacing: -0.3 } as const;

export function SectionSkeleton() {
  return (
    <SectionCard>
      <View style={{ gap: 12 }}>
        {['100%', '82%', '60%'].map((width) => (
          <View key={width} style={{ width: width as `${number}%`, height: 14, borderRadius: 6, backgroundColor: colors.input }} />
        ))}
      </View>
    </SectionCard>
  );
}

export function SectionEmpty({ text, cta }: { text: string; cta?: { label: string; onPress: () => void } }) {
  return (
    <SectionCard padding={0}>
      <Text className="text-center" style={{ ...EMPTY_TEXT_STYLE, paddingTop: 28, paddingBottom: cta ? 0 : 28, paddingHorizontal: 16 }}>
        {text}
      </Text>
      {cta && (
        <View className="items-center" style={{ marginTop: 16, marginBottom: 28 }}>
          <Pressable
            onPress={cta.onPress}
            className="items-center justify-center"
            style={{ height: 44, paddingHorizontal: 20, borderRadius: 12, backgroundColor: colors.primary }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.3 }}>{cta.label}</Text>
          </Pressable>
        </View>
      )}
    </SectionCard>
  );
}

export function SectionError({ onRetry }: { onRetry: () => void }) {
  return (
    <SectionCard padding={0}>
      <View className="items-center" style={{ paddingTop: 20, paddingBottom: 8, paddingHorizontal: 16 }}>
        <Text style={{ ...EMPTY_TEXT_STYLE, marginTop: 4 }}>불러오지 못했어요</Text>
        <Pressable onPress={onRetry} className="items-center justify-center" style={{ height: 44, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>다시 시도</Text>
        </Pressable>
      </View>
    </SectionCard>
  );
}

// 타임라인·할 일 칩 공통: 줄 높이를 글자 크기(11)와 같게 하고 위아래 패딩 4로 높이 19.
export function Chip({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <View style={{ paddingVertical: 4, paddingHorizontal: 8, borderRadius: 999, backgroundColor: bg, flexShrink: 0 }}>
      <Text style={{ fontSize: 11, lineHeight: 11, fontWeight: '600', letterSpacing: -0.2, color: fg }}>{label}</Text>
    </View>
  );
}
