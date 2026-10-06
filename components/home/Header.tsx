import { Image, Text, TouchableOpacity, View } from 'react-native';

export function Header() {
  return (
    <View className="h-14 px-5 flex-row items-center justify-between">
      <View className="flex-row items-baseline">
        <Text className="text-[22px] text-primary" style={{ letterSpacing: -0.6, lineHeight: 28 }}>
          Re:
        </Text>
        <Text className="text-[22px] text-primary font-extrabold" style={{ letterSpacing: -0.6, lineHeight: 28 }}>
          care
        </Text>
      </View>
      <TouchableOpacity activeOpacity={0.7}>
        <Image
          source={require('../../assets/icons/bell-badge.png')}
          style={{ width: 28, height: 28 }}
        />
      </TouchableOpacity>
    </View>
  );
}
