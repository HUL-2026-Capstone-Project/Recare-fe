import { Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { CARD_SHADOW } from '@/features/case/constants';
import type { SummaryTag } from '@/features/case/mocks';

type CaseSummaryCardProps = {
  caseNumber: string;
  status: string;
  statusBg: string;
  statusFg: string;
  title: string;
  info: { label: string; value: string }[];
  tags?: SummaryTag[];
};

export function CaseSummaryCard({
  caseNumber,
  status,
  statusBg,
  statusFg,
  title,
  info,
  tags,
}: CaseSummaryCardProps) {
  return (
    <View className="bg-white p-4" style={{ borderRadius: 20, ...CARD_SHADOW }}>
      <View className="flex-row justify-between items-center">
        <Text
          className="text-[11px] font-semibold"
          style={{ color: colors.text3, letterSpacing: 0.3 }}
        >
          CASE · {caseNumber}
        </Text>
        <View className="px-3 py-1.5 rounded-full" style={{ backgroundColor: statusBg }}>
          <Text
            className="text-[12px] font-semibold"
            style={{ color: statusFg, letterSpacing: -0.2 }}
          >
            {status}
          </Text>
        </View>
      </View>

      <Text
        className="text-[16px] font-extrabold text-text1 mt-3 mb-2.5"
        style={{ letterSpacing: -0.4 }}
      >
        {title}
      </Text>

      <View className="gap-2.5">
        {info.map((row) => (
          <View key={row.label} className="flex-row justify-between">
            <Text className="text-[12px]" style={{ color: colors.text2, letterSpacing: -0.2 }}>
              {row.label}
            </Text>
            <Text
              className="text-[12px] font-semibold text-text1"
              style={{ letterSpacing: -0.3 }}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>

      {tags && tags.length > 0 && (
        <View
          className="flex-row flex-wrap gap-1.5 mt-3 pt-3"
          style={{ borderTopWidth: 1, borderTopColor: colors.border }}
        >
          {tags.map((tag) => (
            <View
              key={tag.label}
              className="px-2 rounded-full"
              style={{ height: 18, justifyContent: 'center', backgroundColor: tag.bg }}
            >
              <Text
                className="text-[11px] font-semibold"
                style={{ color: tag.fg, letterSpacing: -0.2 }}
              >
                {tag.label}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
