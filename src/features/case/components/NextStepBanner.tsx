import { Image, Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/shared/constants/colors';

type NextStepBannerProps = {
  title: string;
  description: string;
};

export function NextStepBanner({ title, description }: NextStepBannerProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      // 이동 대상이 시안에 없어 스텁 처리 (TODO: 목적지 확정 시 연결)
      onPress={() => {}}
      className="flex-row items-center gap-3 mt-3 px-3 py-3"
      style={{ borderRadius: 18, backgroundColor: colors.primaryLight }}
    >
      <View
        className="items-center justify-center"
        style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: colors.primary }}
      >
        <Image
          source={require('@/shared/assets/icons/check-callout.png')}
          style={{ width: 18, height: 18, tintColor: '#fff' }}
        />
      </View>
      <View className="flex-1">
        <Text
          className="text-[12px] font-bold"
          style={{ color: colors.primaryDark, letterSpacing: -0.3 }}
        >
          {title}
        </Text>
        <Text
          className="text-[11px] mt-0.5"
          style={{ color: colors.text2, letterSpacing: -0.2 }}
        >
          {description}
        </Text>
      </View>
      <Image
        source={require('@/shared/assets/icons/chevron-right.png')}
        style={{ width: 16, height: 16, tintColor: colors.primary }}
      />
    </TouchableOpacity>
  );
}
