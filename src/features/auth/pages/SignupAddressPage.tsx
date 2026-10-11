import { useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { getErrorMessage } from '@/api/errorMessage';
import type { ApiError } from '@/api/types';
import { useAuthStore } from '@/store/authStore';
import { useSignupStore } from '@/store/signupStore';
import { tokenStorage } from '@/shared/lib/tokenStorage';
import { TERMS_ITEMS } from '@/features/auth/constants/terms';

function TermsCheckCircle({ checked, size }: { checked: boolean; size: number }) {
  return (
    <Image
      source={require('@/shared/assets/icons/check-circle.png')}
      style={{ width: size, height: size, tintColor: checked ? colors.primary : colors.text3 }}
    />
  );
}

export default function SignUpAddressScreen() {
  const { top } = useSafeAreaInsets();
  const termsAgree = useSignupStore((state) => state.termsAgree);
  const setTermsAgree = useSignupStore((state) => state.setTermsAgree);

  const [addr, setAddr] = useState('');
  const [detail, setDetail] = useState('');
  const [detailFocused, setDetailFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const allAgreed = termsAgree.every(Boolean);
  const ready = addr.trim().length > 0 && TERMS_ITEMS.every((item, i) => !item.required || termsAgree[i]);

  // TODO: 주소 검색은 외부 우편번호 서비스(Daum/Kakao)를 WebView로 띄우는 방식인데,
  // react-native-webview가 설치돼 있지 않아 연동을 보류한다. 라이브러리 설치 후 선택 결과를 setAddr로 채우면 된다.
  const handleOpenAddressSearch = () => {};

  const handleToggleAll = () => {
    setTermsAgree(TERMS_ITEMS.map(() => !allAgreed));
  };

  const handleToggleOne = (index: number) => {
    const next = [...termsAgree];
    next[index] = !next[index];
    setTermsAgree(next);
  };

  const handleOpenDetail = (index: number) => {
    router.push({ pathname: '/(auth)/signup-terms', params: { index: String(index) } });
  };

  const handleSubmit = async () => {
    if (!ready || isSubmitting) return;
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const address = detail.trim() ? `${addr.trim()}, ${detail.trim()}` : addr.trim();
      await useSignupStore.getState().submitSignup(address);
      // TODO(임시): submitSignup이 성공 시 자동 로그인(토큰 저장)까지 수행하지만, 시안에 가입 완료 화면이 없어
      // 로그인 화면으로 보내기 위해 방금 발급된 토큰/인증 상태를 비운다.
      // 가입 완료 화면이 추가되면 이 처리는 제거하고 자동 로그인 상태를 유지해야 한다.
      useAuthStore.setState({ status: 'unauthenticated' });
      router.dismissTo('/(auth)/login');
      await tokenStorage.clear();
    } catch (e) {
      setErrorMessage(getErrorMessage(e as ApiError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: top }}>
      {/* NavBar */}
      <View className="h-[52px] px-3 flex-row items-center justify-between">
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
        <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
          회원가입
        </Text>
        <View className="w-10" />
      </View>

      <View className="px-5 flex-1">
        {/* 진행 바 */}
        <View className="flex-row gap-1.5" style={{ height: 4 }}>
          <View className="flex-1 bg-primary rounded-full" />
          <View className="flex-1 bg-primary rounded-full" />
        </View>

        {/* 타이틀 */}
        <View className="pt-7 pb-2">
          <Text
            className="text-[22px] font-extrabold text-text1"
            style={{ letterSpacing: -0.5, lineHeight: 30 }}
          >
            내가 사는 곳의 주소를 입력하세요
          </Text>
        </View>

        <ScrollView className="flex-1 pt-3" showsVerticalScrollIndicator={false}>
          <View className="gap-4">
            {/* 주소 */}
            <View>
              <Text
                className="text-[12px] font-semibold text-text2 mb-1.5"
                style={{ letterSpacing: -0.2 }}
              >
                주소
              </Text>
              <View className="flex-row items-center gap-2 mb-2">
                <TouchableOpacity
                  className="flex-1 h-[52px] bg-input rounded-xl px-4 justify-center"
                  activeOpacity={0.7}
                  onPress={handleOpenAddressSearch}
                >
                  <Text
                    className="text-[15px]"
                    style={{ color: addr ? colors.text1 : colors.text3, letterSpacing: -0.3, fontWeight: addr ? '500' : '400' }}
                  >
                    {addr || '주소를 검색해 주세요'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="h-[52px] px-4 rounded-xl bg-white items-center justify-center"
                  activeOpacity={0.85}
                  onPress={handleOpenAddressSearch}
                  style={{ borderWidth: 1.5, borderColor: colors.primary }}
                >
                  <Text className="text-primary text-[14px] font-bold" style={{ letterSpacing: -0.3 }}>
                    주소 검색
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                className="h-[52px] bg-input rounded-xl px-4 text-[15px] text-text1"
                placeholder="상세 주소 입력"
                placeholderTextColor={colors.text3}
                value={detail}
                onChangeText={setDetail}
                onFocus={() => setDetailFocused(true)}
                onBlur={() => setDetailFocused(false)}
                style={{
                  letterSpacing: -0.3,
                  backgroundColor: detailFocused ? '#fff' : colors.input,
                  borderWidth: detailFocused ? 1.5 : 0,
                  borderColor: colors.primary,
                }}
              />
            </View>

            {/* 약관 동의 */}
            <View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleToggleAll}
                className="rounded-xl flex-row items-center gap-2.5"
                style={{
                  height: 52,
                  paddingHorizontal: 14,
                  backgroundColor: allAgreed ? colors.primaryLight : colors.input,
                }}
              >
                <TermsCheckCircle checked={allAgreed} size={24} />
                <Text
                  className="text-[15px] font-bold"
                  style={{ color: allAgreed ? colors.primaryDark : colors.text1, letterSpacing: -0.3 }}
                >
                  전체 동의
                </Text>
              </TouchableOpacity>

              <View style={{ height: 1, backgroundColor: colors.border, marginTop: 10, marginBottom: 2 }} />

              {TERMS_ITEMS.map((item, i) => (
                <View key={item.termsType} className="flex-row items-center gap-2.5" style={{ height: 44, paddingHorizontal: 4 }}>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => handleToggleOne(i)}>
                    <TermsCheckCircle checked={termsAgree[i]} size={20} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleOpenDetail(i)}
                    className="flex-1 flex-row items-center gap-2.5"
                  >
                    <Text
                      className="text-[13px] font-semibold"
                      style={{ color: item.required ? colors.primary : colors.text3, letterSpacing: -0.2 }}
                    >
                      {item.required ? '필수' : '선택'}
                    </Text>
                    <Text
                      className="flex-1 text-[14px] font-medium text-text1"
                      style={{ letterSpacing: -0.3 }}
                    >
                      {item.title}
                    </Text>
                    <Image
                      source={require('@/shared/assets/icons/chevron-right.png')}
                      style={{ width: 16, height: 16, tintColor: colors.text3 }}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* 가입 완료 버튼 */}
        <View className="pb-4">
          {errorMessage ? (
            <View
              className="rounded-xl mb-2 px-3 py-2.5"
              style={{ backgroundColor: colors.chip.redBg }}
            >
              <Text className="text-[13px] font-medium" style={{ color: colors.danger, letterSpacing: -0.2 }}>
                {errorMessage}
              </Text>
            </View>
          ) : null}
          <TouchableOpacity
            className="h-[52px] w-full rounded-xl items-center justify-center"
            activeOpacity={0.85}
            onPress={handleSubmit}
            disabled={!ready || isSubmitting}
            style={{ backgroundColor: ready ? colors.primary : colors.primaryDisabled }}
          >
            {isSubmitting ? (
              <View className="flex-row items-center gap-2">
                <ActivityIndicator color="#fff" />
                <Text className="text-white text-base font-bold" style={{ letterSpacing: -0.3 }}>
                  처리 중
                </Text>
              </View>
            ) : (
              <Text className="text-white text-base font-bold" style={{ letterSpacing: -0.3 }}>
                가입 완료
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
