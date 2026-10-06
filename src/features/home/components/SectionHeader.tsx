import { Text, TouchableOpacity, View } from 'react-native';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onPressAction?: () => void;
};

export function SectionHeader({ title, actionLabel, onPressAction }: SectionHeaderProps) {
  return (
    <View className="flex-row justify-between items-center mb-3">
      <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
        {title}
      </Text>
      {actionLabel ? (
        <TouchableOpacity activeOpacity={0.7} onPress={onPressAction}>
          <Text className="text-[13px] text-text2 font-medium" style={{ letterSpacing: -0.2 }}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
