import { Image, Text, TouchableOpacity, View } from 'react-native';
import { colors } from '@/shared/constants/colors';
import { Card } from './Card';

type ClaimItemProps = {
  title: string;
  description: string;
  badgeLabel: string;
  variant: 'primary' | 'neutral';
  onPress?: () => void;
};

export function ClaimItem({ title, description, badgeLabel, variant, onPress }: ClaimItemProps) {
  const isPrimary = variant === 'primary';
  const iconBg = isPrimary ? colors.chip.blueBg : colors.input;
  const iconTint = isPrimary ? colors.primary : colors.text2;
  const chipBg = isPrimary ? colors.chip.blueBg : colors.input;
  const chipFg = isPrimary ? colors.chip.blueFg : colors.text2;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <Card className="p-3">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: iconBg }}>
            <Image source={require('@/shared/assets/icons/document.png')} style={{ width: 20, height: 20, tintColor: iconTint }} />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center gap-1.5">
              <Text className="text-[14px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
                {title}
              </Text>
              <View className="px-2 py-1 rounded-full" style={{ backgroundColor: chipBg }}>
                <Text className="text-[11px] font-semibold" style={{ color: chipFg, letterSpacing: -0.2 }}>
                  {badgeLabel}
                </Text>
              </View>
            </View>
            <Text className="text-[12px] text-text2 mt-0.5" style={{ letterSpacing: -0.2 }}>
              {description}
            </Text>
          </View>
          <Image source={require('@/shared/assets/icons/chevron-right.png')} style={{ width: 16, height: 16, tintColor: colors.text3 }} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}
