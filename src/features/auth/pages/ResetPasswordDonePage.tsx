import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/shared/constants/colors';

export default function ResetPasswordDoneScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <View className="h-[52px] items-center justify-center">
        <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
          비밀번호 재설정
        </Text>
      </View>

      <View className="px-5 flex-1">
        <View style={{ paddingTop: 24, paddingBottom: 20, flex: 1 }}>
          <View
            className="rounded-full items-center justify-center mb-4"
            style={{ width: 56, height: 56, backgroundColor: colors.chip.greenBg }}
          >
            <Image
              source={require('@/shared/assets/icons/check-circle.png')}
              style={{ width: 28, height: 28, tintColor: colors.success }}
            />
          </View>
          <Text className="text-[22px] font-extrabold text-text1" style={{ letterSpacing: -0.5, lineHeight: 30 }}>
            비밀번호가 변경되었어요
          </Text>
          <Text className="mt-2 text-[13px] text-text2 font-medium" style={{ letterSpacing: -0.3, lineHeight: 20 }}>
            새 비밀번호로 로그인해 주세요.
          </Text>
        </View>

        <View className="pb-4">
          <TouchableOpacity
            className="h-[52px] w-full bg-primary rounded-xl items-center justify-center"
            activeOpacity={0.85}
            // 스택에 남아 있는 find-pw 화면(휴대폰/이메일 인증 입력값 포함)까지 정리하기 위해 로그인 화면까지 되돌아간다.
            onPress={() => router.dismissTo('/(auth)/login')}
          >
            <Text className="text-white text-base font-bold" style={{ letterSpacing: -0.3 }}>
              로그인하러 가기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
