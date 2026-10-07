import { Image, Text, TouchableOpacity } from 'react-native';

import { colors } from '@/shared/constants/colors';

export function DownloadButton({ label }: { label: string }) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      // 이동 대상이 시안에 없어 스텁 처리 (TODO)
      onPress={() => {}}
      className="flex-row items-center justify-center mt-3"
      style={{
        height: 48,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Image
        source={require('@/shared/assets/icons/download.png')}
        style={{ width: 16, height: 16, tintColor: colors.text1 }}
      />
      <Text
        className="text-[14px] font-bold text-text1 ml-2"
        style={{ letterSpacing: -0.3 }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
