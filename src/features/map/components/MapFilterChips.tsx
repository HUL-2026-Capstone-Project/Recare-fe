import { Pressable, ScrollView, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { MAP_FILTER_CHIPS } from '../filters';
import type { MapFilterKey } from '../filters';
import { RefreshIcon } from './icons';

// 검색창(top 12, 높이 48) 아래 4px
const CHIPS_TOP = 12 + 48 + 4;
const CHIPS_HEIGHT = 44;
// 검색창과 필터 칩이 지도 위쪽을 덮는 높이(지도 위쪽 가장자리 기준).
export const MAP_TOP_OVERLAY_HEIGHT = CHIPS_TOP + CHIPS_HEIGHT;

export function MapFilterChips({
  selected,
  onToggle,
  onReset,
}: {
  selected: MapFilterKey[];
  onToggle: (key: MapFilterKey) => void;
  onReset: () => void;
}) {
  return (
    <View style={{ position: 'absolute', top: CHIPS_TOP, left: 0, right: 0, height: CHIPS_HEIGHT }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center', gap: 8, paddingLeft: 20, paddingRight: 20 }}
      >
        {selected.length >= 2 && (
          <>
            <Pressable onPress={onReset} className="flex-row items-center" style={{ height: 44, flexShrink: 0, gap: 4 }}>
              <RefreshIcon size={14} />
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text2, letterSpacing: -0.3 }}>초기화</Text>
            </Pressable>
            <View style={{ width: 1, height: 16, backgroundColor: colors.border }} />
          </>
        )}
        {MAP_FILTER_CHIPS.map((chip) => {
          const on = selected.includes(chip.key);
          return (
            <Pressable
              key={chip.key}
              onPress={() => onToggle(chip.key)}
              style={{
                height: 36,
                paddingHorizontal: 14,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: on ? colors.primaryLight : colors.surface,
                borderWidth: 1.5,
                borderColor: on ? colors.primary : colors.border,
              }}
            >
              <Text style={{ fontSize: 13, fontWeight: on ? '700' : '600', letterSpacing: -0.3, color: on ? colors.primary : colors.text1 }}>
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
