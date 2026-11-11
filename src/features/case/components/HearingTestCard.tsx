import { Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { CARD_SHADOW } from '@/features/case/constants';
import type { HearingTestData } from '@/features/case/mocks';

const CHART_HEIGHT = 90;

export function HearingTestCard({
  frequencies,
  left,
  right,
  normalLabel,
  verdictLabel,
  verdictText,
}: HearingTestData) {
  return (
    <View className="mt-2.5">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
          청력 검사 결과
        </Text>
        <Text className="text-[12px]" style={{ color: colors.text2, letterSpacing: -0.2 }}>
          dB HL
        </Text>
      </View>

      <View className="bg-white p-3.5" style={{ borderRadius: 20, ...CARD_SHADOW }}>
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-1.5">
            <View
              style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary }}
            />
            <Text
              className="text-[11px] font-semibold"
              style={{ color: colors.text2, letterSpacing: -0.2 }}
            >
              좌측
            </Text>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View
              style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.danger }}
            />
            <Text
              className="text-[11px] font-semibold"
              style={{ color: colors.text2, letterSpacing: -0.2 }}
            >
              우측
            </Text>
          </View>
          <Text className="text-[11px]" style={{ color: colors.text3 }}>
            {normalLabel}
          </Text>
        </View>

        <View
          className="flex-row justify-between items-end mt-3"
          style={{ height: CHART_HEIGHT }}
        >
          {frequencies.map((freq, i) => (
            <View key={freq} className="flex-row items-end" style={{ gap: 3 }}>
              <View
                style={{
                  width: 10,
                  height: left[i] * 0.9,
                  backgroundColor: colors.primary,
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                }}
              />
              <View
                style={{
                  width: 10,
                  height: right[i] * 0.9,
                  backgroundColor: colors.danger,
                  borderTopLeftRadius: 2,
                  borderTopRightRadius: 2,
                }}
              />
            </View>
          ))}
        </View>
        <View style={{ height: 1, backgroundColor: colors.border, marginTop: 6 }} />
        <View className="flex-row justify-between mt-1.5">
          {frequencies.map((freq) => (
            <Text
              key={freq}
              className="text-[10px] font-semibold"
              style={{ color: colors.text3, letterSpacing: -0.2 }}
            >
              {freq}
            </Text>
          ))}
        </View>

        <View
          className="flex-row items-center mt-3 px-3 py-2.5"
          style={{ borderRadius: 12, backgroundColor: colors.chip.redBg }}
        >
          <Text
            className="text-[11px] font-bold"
            style={{ color: colors.chip.redFg, letterSpacing: -0.2 }}
          >
            {verdictLabel}
          </Text>
          <Text
            className="text-[12px] font-semibold text-text1 ml-2.5"
            style={{ letterSpacing: -0.3 }}
          >
            {verdictText}
          </Text>
        </View>
      </View>
    </View>
  );
}
