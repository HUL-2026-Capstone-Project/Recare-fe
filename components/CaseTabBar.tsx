import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/constants/colors';

export function CaseTabBar() {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: bottom,
        height: 60 + bottom,
      }}
    >
      <TouchableOpacity
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}
        activeOpacity={0.7}
        onPress={() => router.push('/')}
      >
        <Image
          source={require('../assets/icons/tab-care-active.png')}
          style={{ width: 24, height: 24, marginBottom: 2 }}
        />
        <Text style={{ fontSize: 11, letterSpacing: -0.2, color: colors.primary, fontWeight: '500' }}>
          케어
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}
        activeOpacity={0.7}
        onPress={() => router.push('/map')}
      >
        <Image
          source={require('../assets/icons/tab-map-inactive.png')}
          style={{ width: 24, height: 24, marginBottom: 2 }}
        />
        <Text style={{ fontSize: 11, letterSpacing: -0.2, color: colors.text3, fontWeight: '500' }}>
          지도
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}
        activeOpacity={0.7}
        onPress={() => router.push('/my')}
      >
        <Image
          source={require('../assets/icons/tab-my-inactive.png')}
          style={{ width: 24, height: 24, marginBottom: 2 }}
        />
        <Text style={{ fontSize: 11, letterSpacing: -0.2, color: colors.text3, fontWeight: '500' }}>
          마이
        </Text>
      </TouchableOpacity>
    </View>
  );
}
