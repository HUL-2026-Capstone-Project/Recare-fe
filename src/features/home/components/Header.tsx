import { Image, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { SvgUri } from 'react-native-svg';

import { svgAssetUri } from '@/shared/lib/svgAsset';

export function Header({ hasUnread }: { hasUnread: boolean }) {
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
      <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/notifications')}>
        {hasUnread ? (
          <Image source={require('@/shared/assets/icons/bell-badge.png')} style={{ width: 28, height: 28 }} />
        ) : (
          <SvgUri uri={svgAssetUri(require('@/shared/assets/icons-svg/bell.svg'))} width={28} height={28} />
        )}
      </TouchableOpacity>
    </View>
  );
}
