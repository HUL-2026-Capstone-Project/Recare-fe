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
import { useToastStore } from '@/store/toastStore';

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
  const [currentError, setCurrentError] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [newFocused, setNewFocused] = useState(false);
  const [newVisible, setNewVisible] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  // 시안에 일반 실패 상태가 없어, 현재 비밀번호 불일치로 특정되지 않는 실패에 한해 최소한으로 추가한 안내 문구.
  const [generalError, setGeneralError] = useState<string | null>(null);

  const ruleTone: RuleTone = newPassword === '' ? 'muted' : PASSWORD_PATTERN.test(newPassword) ? 'success' : 'danger';
  const isWeak = ruleTone === 'danger';
  const isMismatch = confirmTouched && confirmPassword !== '' && confirmPassword !== newPassword;
  const ready = currentPassword !== '' && PASSWORD_PATTERN.test(newPassword) && confirmPassword !== '' && confirmPassword === newPassword;

  const clearErrors = () => {
    if (currentError) setCurrentError(false);
    if (generalError) setGeneralError(null);
  };

  const handleSubmit = async () => {
    if (!ready || isSubmitting) return;
    clearErrors();
    setIsSubmitting(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      useToastStore.getState().show('비밀번호가 변경되었어요');
      router.back();
    } catch (e) {
      // 현재 비밀번호 불일치를 구분하는 상태 코드/에러 코드가 스웨거에 없어, fieldErrors에 currentPassword 필드가
      // 오는 경우에만(관례상 가능성이 높은 형태) 전용 문구를 쓰고, 그 외에는 일반 오류로 처리한다. 실제 응답 형태는
      // 수동 테스트로 확인이 필요하다.
      const apiError = e as ApiError;
      const currentPasswordFieldError = apiError.fieldErrors?.find((fe) => fe.field === 'currentPassword');
      if (currentPasswordFieldError) {
        setCurrentError(true);
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
                현재 비밀번호가 맞지 않아요
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
