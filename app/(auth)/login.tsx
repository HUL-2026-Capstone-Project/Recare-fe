import { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/constants/colors';

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white px-5">
      {/* 헤더: 로고 + 서브타이틀 */}
      <View style={{ paddingTop: top + 40, paddingBottom: 36 }}>
        <View className="flex-row items-baseline">
          <Text
            className="text-[32px] text-primary/85 font-normal"
            style={{ letterSpacing: -0.6, lineHeight: 36 }}
          >
            Re:
          </Text>
          <Text
            className="text-[32px] text-primary font-extrabold"
            style={{ letterSpacing: -0.6, lineHeight: 36 }}
          >
            care
          </Text>
        </View>
        <Text
          className="text-[14px] text-text2 font-medium mt-3"
          style={{ letterSpacing: -0.3 }}
        >
          서비스를 원활하게 사용하려면 로그인을 해야해요!
        </Text>
      </View>

      {/* 입력 필드 */}
      <View className="gap-2.5">
        {/* 아이디 */}
        <TextInput
          className="h-[52px] bg-input rounded-xl px-4 text-[15px] text-text1"
          placeholder="아이디를 입력해주세요"
          placeholderTextColor={colors.text3}
          autoCapitalize="none"
          autoCorrect={false}
          style={{ letterSpacing: -0.3 }}
        />

        {/* 비밀번호 */}
        <View className="h-[52px] bg-input rounded-xl px-4 flex-row items-center">
          <TextInput
            className="flex-1 text-[15px] text-text1"
            placeholder="비밀번호를 입력해주세요"
            placeholderTextColor={colors.text3}
            secureTextEntry={!passwordVisible}
            autoCapitalize="none"
            autoCorrect={false}
            style={{ letterSpacing: -0.3 }}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            activeOpacity={0.7}
          >
            <Image
              source={require('../../assets/icons/eye.png')}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* 로그인 버튼 */}
      <TouchableOpacity
        className="mt-4 h-[52px] bg-primary rounded-xl items-center justify-center"
        activeOpacity={0.85}
        onPress={() => router.replace('/(tabs)')}
      >
        <Text
          className="text-white text-base font-bold"
          style={{ letterSpacing: -0.3 }}
        >
          로그인
        </Text>
      </TouchableOpacity>

      {/* 하단 링크: 아이디 찾기 | 비밀번호 찾기 | 회원가입 */}
      <View className="mt-5 flex-row items-center justify-center">
        <TouchableOpacity
          className="px-3 py-2"
          activeOpacity={0.7}
          onPress={() => router.push('/(auth)/find-id')}
        >
          <Text
            className="text-[13px] text-text2"
            style={{ letterSpacing: -0.3 }}
          >
            아이디 찾기
          </Text>
        </TouchableOpacity>

        <View className="w-px h-3 bg-border" />

        <TouchableOpacity className="px-3 py-2" activeOpacity={0.7} onPress={() => router.push('/(auth)/find-pw')}>
          <Text
            className="text-[13px] text-text2"
            style={{ letterSpacing: -0.3 }}
          >
            비밀번호 찾기
          </Text>
        </TouchableOpacity>

        <View className="w-px h-3 bg-border" />

        <TouchableOpacity
          className="px-3 py-2"
          activeOpacity={0.7}
          onPress={() => router.push('/(auth)/signup-info')}
        >
          <Text
            className="text-[13px] text-primary font-semibold"
            style={{ letterSpacing: -0.3 }}
          >
            회원가입
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
