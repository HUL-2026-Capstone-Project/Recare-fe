import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { Card } from '@/features/home/components/Card';

export function SectionTitle({ title, right }: { title: string; right?: string }) {
  return (
    <View className="flex-row items-center justify-between" style={{ marginBottom: 12 }}>
      <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text1, letterSpacing: -0.3 }}>{title}</Text>
      {right != null && <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text2, letterSpacing: -0.2 }}>{right}</Text>}
    </View>
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

export function SectionEmpty({ text }: { text: string }) {
  return (
    <SectionCard padding={0}>
      <Text className="text-center" style={{ ...EMPTY_TEXT_STYLE, paddingVertical: 28, paddingHorizontal: 16 }}>
        {text}
      </Text>
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
