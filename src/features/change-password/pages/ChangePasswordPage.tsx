import { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import { router } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { authApi } from '@/api/authApi';
import type { ApiError } from '@/api/types';
import { svgAssetUri } from '@/shared/lib/svgAsset';
import { CaseDetailHeader } from '@/features/case/components/CaseDetailHeader';
import { useAuthStore } from '@/store/authStore';
import { useToastStore } from '@/store/toastStore';

const CURRENT_PASSWORD_MISMATCH_MESSAGE = '현재 비밀번호가 일치하지 않습니다.';
const CHANGED_NOTICE = '비밀번호가 변경됐어요. 다시 로그인해 주세요.';

// 스웨거 PasswordChangeRequest.newPassword pattern (비밀번호 재설정과 동일한 규칙)
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

type RuleTone = 'muted' | 'success' | 'danger';

function PwRuleHint({ tone }: { tone: RuleTone }) {
  const color = tone === 'success' ? colors.success : tone === 'danger' ? colors.danger : colors.text3;
  return (
    <View className="flex-row items-center gap-1.5 mt-2">
      {tone !== 'danger' && (
        <SvgUri
          uri={svgAssetUri(
            tone === 'success'
              ? require('@/shared/assets/icons-svg/check-green-xs.svg')
              : require('@/shared/assets/icons-svg/check-gray-xs.svg')
          )}
          width={10}
          height={10}
        />
      )}
      <Text style={{ fontSize: 12, color, fontWeight: tone === 'muted' ? '400' : '500', letterSpacing: -0.2 }}>
        영문, 숫자, 특수문자를 조합해 8자 이상
      </Text>
    </View>
  );
}

export default function ChangePasswordScreen() {
  const { top, bottom } = useSafeAreaInsets();

  const [currentPassword, setCurrentPassword] = useState('');
  const [currentFocused, setCurrentFocused] = useState(false);
  const [currentVisible, setCurrentVisible] = useState(false);
  // 서버가 준 오류 문구. 값이 있으면 해당 칸 아래에 보인다.
  const [currentError, setCurrentError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [newFocused, setNewFocused] = useState(false);
  const [newVisible, setNewVisible] = useState(false);
  const [newError, setNewError] = useState<string | null>(null);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  // 시안에 일반 실패 상태가 없어, 현재 비밀번호 불일치로 특정되지 않는 실패에 한해 최소한으로 추가한 안내 문구.
  const [generalError, setGeneralError] = useState<string | null>(null);

  const ruleTone: RuleTone = newPassword === '' ? 'muted' : PASSWORD_PATTERN.test(newPassword) ? 'success' : 'danger';
  const isWeak = ruleTone === 'danger' || newError !== null;
  const isMismatch = confirmTouched && confirmPassword !== '' && confirmPassword !== newPassword;
  const ready = currentPassword !== '' && PASSWORD_PATTERN.test(newPassword) && confirmPassword !== '' && confirmPassword === newPassword;

  const clearErrors = () => {
    if (currentError) setCurrentError(null);
    if (newError) setNewError(null);
    if (generalError) setGeneralError(null);
  };

  const handleSubmit = async () => {
    if (!ready || isSubmitting) return;
    clearErrors();
    setIsSubmitting(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      // 서버가 모든 기기의 refresh 토큰을 무효화하므로 서버 로그아웃 호출 없이 로컬 세션만 끝낸다.
      // 안내는 시작 화면에서 보인다(토스트 스토어는 로컬 정리로 초기화되지 않는다).
      useToastStore.getState().show(CHANGED_NOTICE);
      await useAuthStore.getState().endSessionLocally();
    } catch (e) {
      // 백엔드 답변 기준(스웨거에는 200 외 응답이 문서화돼 있지 않다):
      // - 400 + fieldErrors.newPassword: 새 비밀번호 칸에 서버 문구
      // - 401: 현재 비밀번호 칸에 서버 message(없으면 기본 문구). client.ts가 재발급 후 한 번 재시도한 뒤 같은 에러를 넘긴다.
      // - 현재 비밀번호 필드 오류(fieldErrors.currentPassword)도 같은 칸에 보인다. 그 외는 일반 오류.
      const apiError = e as ApiError;
      const fieldError = (field: string) => apiError.fieldErrors?.find((fe) => fe.field === field);
      const newPasswordFieldError = apiError.status === 400 ? fieldError('newPassword') : undefined;
      const currentPasswordFieldError = fieldError('currentPassword');
      if (newPasswordFieldError) {
        setNewError(newPasswordFieldError.message || '새 비밀번호를 확인해 주세요');
      } else if (apiError.status === 401) {
        setCurrentError(apiError.message || CURRENT_PASSWORD_MISMATCH_MESSAGE);
      } else if (currentPasswordFieldError) {
        setCurrentError(currentPasswordFieldError.message || CURRENT_PASSWORD_MISMATCH_MESSAGE);
      } else {
        setGeneralError('비밀번호 변경에 실패했어요. 잠시 후 다시 시도해주세요');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ paddingTop: top }}
    >
      <CaseDetailHeader title="비밀번호 변경" />

      <View className="flex-1 px-5" style={{ paddingTop: 20 }}>
        <View className="gap-4">
          <View>
            <Text className="text-[12px] font-semibold text-text2 mb-1.5" style={{ letterSpacing: -0.2 }}>
              현재 비밀번호
            </Text>
            <View
              className="flex-row items-center h-[52px] rounded-xl px-4 gap-2"
              style={{
                backgroundColor: currentFocused ? '#fff' : colors.input,
                borderWidth: currentFocused || currentError ? 1.5 : 0,
                borderColor: currentError ? colors.danger : colors.primary,
              }}
            >
              <TextInput
                className="flex-1 text-[15px] text-text1"
                placeholder="현재 비밀번호 입력"
                placeholderTextColor={colors.text3}
                value={currentPassword}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                  clearErrors();
                }}
                onFocus={() => setCurrentFocused(true)}
                onBlur={() => setCurrentFocused(false)}
                secureTextEntry={!currentVisible}
                autoCapitalize="none"
                autoCorrect={false}
                style={{ letterSpacing: -0.3 }}
              />
              <TouchableOpacity activeOpacity={0.7} onPress={() => setCurrentVisible((v) => !v)}>
                <Image source={require('@/shared/assets/icons/eye.png')} style={{ width: 20, height: 20 }} />
              </TouchableOpacity>
            </View>
            {currentError && (
              <Text className="mt-1 text-[12px] font-medium" style={{ color: colors.danger, letterSpacing: -0.2 }}>
                {currentError}
              </Text>
            )}
          </View>

          <View>
            <Text className="text-[12px] font-semibold text-text2 mb-1.5" style={{ letterSpacing: -0.2 }}>
              새 비밀번호
            </Text>
            <View
              className="flex-row items-center h-[52px] rounded-xl px-4 gap-2"
              style={{
                backgroundColor: newFocused ? '#fff' : colors.input,
                borderWidth: newFocused || isWeak ? 1.5 : 0,
                borderColor: isWeak ? colors.danger : colors.primary,
              }}
            >
              <TextInput
                className="flex-1 text-[15px] text-text1"
                placeholder="새 비밀번호 입력"
                placeholderTextColor={colors.text3}
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  clearErrors();
                }}
                onFocus={() => setNewFocused(true)}
                onBlur={() => setNewFocused(false)}
                secureTextEntry={!newVisible}
                autoCapitalize="none"
                autoCorrect={false}
                style={{ letterSpacing: -0.3 }}
              />
              <TouchableOpacity activeOpacity={0.7} onPress={() => setNewVisible((v) => !v)}>
                <Image source={require('@/shared/assets/icons/eye.png')} style={{ width: 20, height: 20 }} />
              </TouchableOpacity>
            </View>
            {newError && (
              <Text className="mt-1 text-[12px] font-medium" style={{ color: colors.danger, letterSpacing: -0.2 }}>
                {newError}
              </Text>
            )}
            <PwRuleHint tone={ruleTone} />
          </View>

          <View>
            <Text className="text-[12px] font-semibold text-text2 mb-1.5" style={{ letterSpacing: -0.2 }}>
              새 비밀번호 확인
            </Text>
            <View
              className="flex-row items-center h-[52px] rounded-xl px-4 gap-2"
              style={{
                backgroundColor: confirmFocused ? '#fff' : colors.input,
                borderWidth: confirmFocused || isMismatch ? 1.5 : 0,
                borderColor: isMismatch ? colors.danger : colors.primary,
              }}
            >
              <TextInput
                className="flex-1 text-[15px] text-text1"
                placeholder="비밀번호를 한 번 더 입력해주세요"
                placeholderTextColor={colors.text3}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  clearErrors();
                }}
                onFocus={() => setConfirmFocused(true)}
                onBlur={() => {
                  setConfirmFocused(false);
                  setConfirmTouched(true);
                }}
                secureTextEntry={!confirmVisible}
                autoCapitalize="none"
                autoCorrect={false}
                style={{ letterSpacing: -0.3 }}
              />
              <TouchableOpacity activeOpacity={0.7} onPress={() => setConfirmVisible((v) => !v)}>
                <Image source={require('@/shared/assets/icons/eye.png')} style={{ width: 20, height: 20 }} />
              </TouchableOpacity>
            </View>
            {isMismatch && (
              <Text className="mt-1 text-[12px] font-medium" style={{ color: colors.danger, letterSpacing: -0.2 }}>
                비밀번호가 일치하지 않아요
              </Text>
            )}
          </View>

          {generalError && (
            <Text className="text-[12px] font-medium" style={{ color: colors.danger, letterSpacing: -0.2 }}>
              {generalError}
            </Text>
          )}
        </View>
      </View>

      <View
        className="bg-white flex-row gap-2"
        style={{ paddingTop: 8, paddingHorizontal: 20, paddingBottom: Math.max(bottom, 12) }}
      >
        <TouchableOpacity
          className="flex-1 h-[52px] rounded-xl items-center justify-center"
          activeOpacity={0.85}
          onPress={() => router.back()}
          style={{ borderWidth: 1.5, borderColor: colors.border }}
        >
          <Text className="text-text1 text-[15px] font-bold" style={{ letterSpacing: -0.3 }}>
            취소
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-xl items-center justify-center"
          style={{ flex: 2, height: 52, backgroundColor: ready ? colors.primary : colors.primaryDisabled }}
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={!ready || isSubmitting}
        >
          {isSubmitting ? (
            <View className="flex-row items-center gap-2">
              <ActivityIndicator color="#fff" />
              <Text className="text-white text-[15px] font-bold" style={{ letterSpacing: -0.3 }}>
                처리 중
              </Text>
            </View>
          ) : (
            <Text className="text-white text-[15px] font-bold" style={{ letterSpacing: -0.3 }}>
              변경하기
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
