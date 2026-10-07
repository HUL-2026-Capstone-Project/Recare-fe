import { useState } from 'react';
import { ActivityIndicator, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { getErrorMessage } from '@/api/errorMessage';
import type { ApiError } from '@/api/types';

export default function LoginScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);
  const { top } = useSafeAreaInsets();

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await login(loginId, password);
    } catch (e) {
      setErrorMessage(getErrorMessage(e as ApiError));
    } finally {
      setIsSubmitting(false);
    }
  };

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
          value={loginId}
          onChangeText={setLoginId}
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
            value={password}
            onChangeText={setPassword}
            style={{ letterSpacing: -0.3 }}
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
            activeOpacity={0.7}
          >
            <Image
              source={require('@/shared/assets/icons/eye.png')}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        </View>

        {errorMessage ? (
          <Text className="text-danger text-[13px]" style={{ letterSpacing: -0.2 }}>
            {errorMessage}
          </Text>
        ) : null}
      </View>

      {/* 로그인 버튼 */}
      <TouchableOpacity
        className="mt-4 h-[52px] bg-primary rounded-xl items-center justify-center"
        activeOpacity={0.85}
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={{ opacity: isSubmitting ? 0.7 : 1 }}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            className="text-white text-base font-bold"
            style={{ letterSpacing: -0.3 }}
          >
            로그인
          </Text>
        )}
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
