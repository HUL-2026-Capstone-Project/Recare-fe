import { Image, View } from 'react-native';

import { colors } from '@/shared/constants/colors';

export type StepState = 'done' | 'current' | 'pending';

export function TimelineDot({ state }: { state: StepState }) {
  if (state === 'done') {
    return (
      <View
        style={{
          width: 14,
          height: 14,
          borderRadius: 7,
          backgroundColor: colors.success,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={require('@/shared/assets/icons/check-timeline.png')}
          style={{ width: 8, height: 8, tintColor: '#fff' }}
        />
      </View>
    );
  }
  if (state === 'current') {
    return (
      <View
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: colors.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: colors.primary }}
        />
      </View>
    );
  }
  return (
    <View
      style={{
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: colors.border,
      }}
    />
  );
}
