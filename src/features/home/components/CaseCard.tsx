import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/shared/constants/colors';
import { Card } from './Card';

type CaseCardProps = {
  caseNumber?: string;
  statusLabel: string;
  statusBg?: string;
  statusFg?: string;
  title: string;
  subtitle: string;
  currentStep?: number | null;
  totalSteps: number;
  onPressDetail?: () => void;
};

export function CaseCard({
  caseNumber,
  statusLabel,
  statusBg = colors.chip.orangeBg,
  statusFg = colors.chip.orangeFg,
  title,
  subtitle,
  currentStep,
  totalSteps,
  onPressDetail,
}: CaseCardProps) {
  return (
    <Card className="p-4">
      <View className="flex-row justify-between items-start mb-1.5">
        {caseNumber ? (
          <Text className="text-[11px] font-semibold" style={{ color: colors.text3, letterSpacing: 0.3 }}>
            CASE · {caseNumber}
          </Text>
        ) : (
          <View />
        )}
        <View className="flex-row items-center px-3 py-1.5 rounded-full" style={{ backgroundColor: statusBg }}>
          <Text className="text-[12px] font-semibold" style={{ color: statusFg, letterSpacing: -0.2, lineHeight: 14 }}>
            {statusLabel}
          </Text>
        </View>
      </View>
      <Text className="text-[15px] font-bold text-text1 mb-1" style={{ letterSpacing: -0.3 }}>
        {title}
      </Text>
      <Text className="text-[12px] text-text2 mb-2.5" numberOfLines={1} style={{ letterSpacing: -0.2 }}>
        {subtitle}
      </Text>
      <View className="flex-row justify-between items-center pt-2.5" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
        {currentStep != null ? (
          <Text className="text-[12px]" style={{ letterSpacing: -0.2 }}>
            <Text className="text-primary font-bold">{currentStep}</Text>
            <Text style={{ color: colors.text3 }}> / {totalSteps} 단계</Text>
          </Text>
        ) : (
          <View />
        )}
        <TouchableOpacity activeOpacity={0.7} onPress={onPressDetail}>
          <Text className="text-[13px] text-primary font-bold" style={{ letterSpacing: -0.3 }}>
            상세보기 ›
          </Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}
