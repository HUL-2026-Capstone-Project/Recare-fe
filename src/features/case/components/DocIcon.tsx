import { Image, View } from 'react-native';

import { colors } from '@/shared/constants/colors';

export function DocIcon({ type }: { type: string }) {
  if (type === 'success') {
    return (
      <View
        style={{
          width: 34,
          height: 38,
          borderRadius: 7,
          backgroundColor: colors.chip.greenBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={require('@/shared/assets/icons/document-success.png')}
          style={{ width: 20, height: 20 }}
        />
      </View>
    );
  }
  if (type === 'danger') {
    return (
      <View
        style={{
          width: 34,
          height: 38,
          borderRadius: 7,
          backgroundColor: colors.chip.redBg,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={require('@/shared/assets/icons/document-danger.png')}
          style={{ width: 20, height: 20 }}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        width: 34,
        height: 38,
        borderRadius: 7,
        backgroundColor: colors.chip.blueBg,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        source={require('@/shared/assets/icons/document.png')}
        style={{ width: 20, height: 20, tintColor: colors.primary }}
      />
    </View>
  );
}
