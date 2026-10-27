import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { useToastStore } from '@/store/toastStore';

export default function SplashScreen() {
  const { top, bottom } = useSafeAreaInsets();
  // 비밀번호 변경 후 로그아웃되어 이 화면으로 올 때 보여주는 안내(기존 토스트 스토어 사용).
  const toastMessage = useToastStore((state) => state.message);

  return (
    <>
      <StatusBar style="light" />
      <LinearGradient
        colors={[colors.primaryDark, colors.primary]}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* 백그라운드 패턴 */}
        <Image
          source={require('@/shared/assets/icons/splash-pattern.png')}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width: '100%', height: '100%' }}
          resizeMode="cover"
        />

        {/* 중앙: 로고 + 서브타이틀 */}
        <View className="flex-1 items-center justify-center px-8">
          <View className="flex-row items-baseline">
            <Text
              className="text-[52px] text-white/85 font-normal"
              style={{ letterSpacing: -0.6, lineHeight: 56 }}
            >
              Re:
            </Text>
            <Text
              className="text-[52px] text-white font-extrabold"
              style={{ letterSpacing: -0.6, lineHeight: 56 }}
            >
              care
            </Text>
          </View>
          <Text
            className="text-white/90 text-[15px] font-medium text-center mt-1"
            style={{ letterSpacing: -0.3, lineHeight: 22 }}
          >
            금융과 건강의 한곳에서,{'\n'}다시 일어나세요
          </Text>
        </View>

        {/* 하단: 시작하기 버튼 + 회원가입 링크 */}
        <View
          className="px-5"
          style={{ paddingBottom: Math.max(bottom, 40) }}
        >
          <TouchableOpacity
            className="w-full h-[52px] bg-white rounded-xl items-center justify-center"
            activeOpacity={0.85}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text
              className="text-primary text-base font-bold"
              style={{ letterSpacing: -0.3 }}
            >
              시작하기
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4 items-center"
            activeOpacity={0.7}
            onPress={() => router.push('/(auth)/signup-info')}
          >
            <Text
              className="text-white/85 text-[13px]"
              style={{ letterSpacing: -0.2 }}
            >
              Re:care가 처음이에요?{' '}
              <Text className="font-bold underline">회원가입</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {toastMessage && (
          <View
            pointerEvents="none"
            className="absolute left-5 right-5 rounded-xl items-center"
            style={{ top: top + 16, backgroundColor: colors.text1, paddingVertical: 12 }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff', letterSpacing: -0.3 }}>{toastMessage}</Text>
          </View>
        )}
      </LinearGradient>
    </>
  );
}
