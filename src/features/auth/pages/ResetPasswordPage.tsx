import { useState } from 'react';
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import { router } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { authApi } from '@/api/authApi';
import { svgAssetUri } from '@/shared/lib/svgAsset';
import { useResetPasswordStore } from '@/store/resetPasswordStore';

// 스웨거 PasswordResetRequest.newPassword pattern (SignUpRequest.password와 동일한 규칙)
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

function ErrorBox({ message, action }: { message: string; action?: { label: string; onPress: () => void } }) {
  return (
    <View className="rounded-xl p-3 mb-4" style={{ backgroundColor: colors.chip.redBg }}>
      <Text
        className="text-[13px] font-medium"
        style={{ color: colors.danger, letterSpacing: -0.2, marginBottom: action ? 10 : 0 }}
      >
        {message}
      </Text>
      {action && (
        <TouchableOpacity
          onPress={action.onPress}
          activeOpacity={0.85}
          className="items-center justify-center self-start rounded-xl px-4"
          style={{ height: 44, borderWidth: 1.5, borderColor: colors.danger }}
        >
          <Text className="text-[13px] font-bold" style={{ color: colors.danger, letterSpacing: -0.3 }}>
            {action.label}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function ResetPasswordScreen() {
  const { top } = useSafeAreaInsets();
  const resetToken = useResetPasswordStore((state) => state.resetToken);

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmFocused, setConfirmFocused] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 서버가 "본인 확인 만료"를 구분해 알려주는 응답 필드가 스웨거에 없어, resetToken이 비어 있는 경우(본인 확인을 거치지 않고
  // 들어온 경우 등)에만 만료로 간주한다. 제출 중 발생하는 실패는 전부 아래 일반 오류 문구로 처리한다.
  const expired = !resetToken;
  const ruleTone: RuleTone = newPassword === '' ? 'muted' : PASSWORD_PATTERN.test(newPassword) ? 'success' : 'danger';
  const isWeak = ruleTone === 'danger';
  const isMismatch = confirmTouched && confirmPassword !== '' && confirmPassword !== newPassword;
  const ready = PASSWORD_PATTERN.test(newPassword) && confirmPassword !== '' && confirmPassword === newPassword;

  const handleChangeNewPassword = (text: string) => {
    setNewPassword(text);
    if (errorMessage) setErrorMessage(null);
  };

  const handleChangeConfirm = (text: string) => {
    setConfirmPassword(text);
    if (errorMessage) setErrorMessage(null);
  };

  const handleRestart = () => {
    useResetPasswordStore.getState().clear();
    setNewPassword('');
    setConfirmPassword('');
    router.replace('/(auth)/find-pw');
  };

  const handleSubmit = async () => {
    if (!ready || isSubmitting || !resetToken) return;
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      await authApi.resetPassword({ resetToken, newPassword });
      useResetPasswordStore.getState().clear();
      setNewPassword('');
      setConfirmPassword('');
      router.replace('/(auth)/reset-password-done');
    } catch {
      // 임시 문구, 디자인 필요: 서버 실패 응답에서 원인(토큰 만료/서버 오류 등)을 구분할 근거가 스웨거에 없어 일반 문구로 처리
      setErrorMessage('비밀번호 변경에 실패했어요. 잠시 후 다시 시도해주세요');
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
      <View className="h-[52px] px-3 flex-row items-center justify-between">
        <TouchableOpacity className="w-10 items-center justify-center" activeOpacity={0.7} onPress={() => router.back()}>
          <Image source={require('@/shared/assets/icons/chevron-left.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
          비밀번호 재설정
        </Text>
        <View className="w-10" />
      </View>

      <View className="px-5 flex-1">
        <View style={{ paddingTop: 28, paddingBottom: 20 }}>
          <Text className="text-[22px] font-extrabold text-text1" style={{ letterSpacing: -0.5, lineHeight: 30 }}>
            새 비밀번호를 입력해주세요
          </Text>
          <Text className="mt-2 text-[13px] text-text2 font-medium" style={{ letterSpacing: -0.3, lineHeight: 20 }}>
            다른 곳에서 쓰지 않는 비밀번호를 추천해요.
          </Text>
        </View>

        {expired ? (
          <ErrorBox
            message="본인 확인 시간이 지났어요. 처음부터 다시 진행해주세요"
            action={{ label: '다시 인증하기', onPress: handleRestart }}
          />
        ) : (
          <>
            {errorMessage && <ErrorBox message={errorMessage} />}
            <View className="gap-[14px]">
              <View>
                <Text className="text-[12px] font-semibold text-text2 mb-1.5" style={{ letterSpacing: -0.2 }}>
                  새 비밀번호
                </Text>
                <View
                  className="flex-row items-center h-[52px] rounded-xl px-4 gap-2"
                  style={{
                    backgroundColor: newPasswordFocused ? '#fff' : colors.input,
                    borderWidth: newPasswordFocused || isWeak ? 1.5 : 0,
                    borderColor: isWeak ? colors.danger : colors.primary,
                  }}
                >
                  <TextInput
                    className="flex-1 text-[15px] text-text1"
                    placeholder="새 비밀번호 입력"
                    placeholderTextColor={colors.text3}
                    value={newPassword}
                    onChangeText={handleChangeNewPassword}
                    onFocus={() => setNewPasswordFocused(true)}
                    onBlur={() => setNewPasswordFocused(false)}
                    secureTextEntry={!newPasswordVisible}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{ letterSpacing: -0.3 }}
                  />
                  <TouchableOpacity activeOpacity={0.7} onPress={() => setNewPasswordVisible((v) => !v)}>
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
                    onChangeText={handleChangeConfirm}
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
            </View>
          </>
        )}
      </View>

      <View className="px-5 pb-4">
        <TouchableOpacity
          className="h-[52px] w-full rounded-xl items-center justify-center"
          activeOpacity={0.85}
          onPress={handleSubmit}
          disabled={!ready || isSubmitting || expired}
          style={{ backgroundColor: ready && !expired ? colors.primary : colors.primaryDisabled }}
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
              비밀번호 변경
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
