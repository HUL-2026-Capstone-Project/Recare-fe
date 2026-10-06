import { Image, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/shared/constants/colors';

type FaqItemProps = {
  question: string;
  isLast?: boolean;
  onPress?: () => void;
};

export function FaqItem({ question, isLast, onPress }: FaqItemProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between px-3 py-2.5"
      activeOpacity={0.7}
      onPress={onPress}
      style={!isLast ? { borderBottomWidth: 1, borderBottomColor: colors.border } : undefined}
    >
      <View className="flex-row items-center gap-2.5 flex-1 min-w-0">
        <View className="w-[22px] h-[22px] rounded-full items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.chip.blueBg }}>
          <Text className="text-[11px] font-extrabold" style={{ color: colors.primary }}>Q</Text>
        </View>
        <Text className="text-[14px] text-text1 font-medium flex-1" style={{ letterSpacing: -0.3 }}>
          {question}
        </Text>
      </View>
      <Image source={require('@/shared/assets/icons/chevron-right.png')} style={{ width: 16, height: 16, tintColor: colors.text3 }} />
    </TouchableOpacity>
  );
}
