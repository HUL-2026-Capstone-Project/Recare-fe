import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/shared/constants/colors';
import { VerifiedCheckIcon } from './icons';

export function ProfileHero({ name, loginId, isVerified }: { name: string; loginId: string; isVerified: boolean }) {
  return (
    <View className="items-center" style={{ paddingTop: 8, paddingBottom: 22 }}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ fontSize: 28, fontWeight: '800', color: '#fff', letterSpacing: -0.5 }}>
          {name.charAt(0)}
        </Text>
      </LinearGradient>

      <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text1, letterSpacing: -0.5, marginTop: 12 }}>
        {name}
      </Text>
      <Text style={{ fontSize: 13, color: colors.text2, letterSpacing: -0.2, marginTop: 4 }}>@{loginId}</Text>

      <View style={{ marginTop: 10 }}>
        {isVerified ? (
          <View
            className="flex-row items-center"
            style={{ gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, backgroundColor: colors.chip.greenBg }}
          >
            <VerifiedCheckIcon size={11} />
            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.chip.greenFg }}>본인인증 완료</Text>
          </View>
        ) : (
          <View
            style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 50, backgroundColor: colors.chip.orangeBg }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.chip.orangeFg }}>본인인증 필요</Text>
          </View>
        )}
      </View>
    </View>
  );
}
