import { Image, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { colors } from '@/shared/constants/colors';

type CaseDetailHeaderProps = {
  title?: string;
  showChevronDown?: boolean;
};

export function CaseDetailHeader({ title = '케이스 상세', showChevronDown = false }: CaseDetailHeaderProps) {
  return (
    <View
      className="h-[52px] px-3 flex-row items-center justify-between bg-white"
      style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      <TouchableOpacity
        className="w-10 items-center justify-center"
        activeOpacity={0.7}
        onPress={() => router.back()}
      >
        <Image
          source={require('@/shared/assets/icons/chevron-left.png')}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
      <Text
        className="text-[17px] font-bold text-text1"
        style={{ letterSpacing: -0.3 }}
      >
        {title}
      </Text>
      {showChevronDown ? (
        <TouchableOpacity
          className="w-10 items-center justify-center"
          activeOpacity={0.7}
          // 이동 대상이 시안에 없어 스텁 처리 (TODO)
          onPress={() => {}}
        >
          <Image
            source={require('@/shared/assets/icons/chevron-right.png')}
            style={{ width: 20, height: 20, transform: [{ rotate: '90deg' }] }}
          />
        </TouchableOpacity>
      ) : (
        <View className="w-10" />
      )}
    </View>
  );
}
