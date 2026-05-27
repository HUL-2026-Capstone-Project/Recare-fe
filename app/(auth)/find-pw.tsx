import { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/constants/colors';

const CARRIERS = ['SKT', 'KT', 'LG U+', '알뜰폰'] as const;
type Carrier = (typeof CARRIERS)[number];
type Tab = 'phone' | 'email';

export default function FindPwScreen() {
  const { top } = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>('phone');

  // phone tab state
  const [phoneUserId, setPhoneUserId] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier>('SKT');
  const [phone, setPhone] = useState('');
  const [phoneTimerActive, setPhoneTimerActive] = useState(false);
  const [phoneSeconds, setPhoneSeconds] = useState(180);

  // email tab state
  const [emailUserId, setEmailUserId] = useState('');
  const [email, setEmail] = useState('');
  const [emailTimerActive, setEmailTimerActive] = useState(false);
  const [emailSeconds, setEmailSeconds] = useState(180);

  useEffect(() => {
    if (!phoneTimerActive) return;
    const id = setInterval(() => {
      setPhoneSeconds(s => {
        if (s <= 1) { clearInterval(id); setPhoneTimerActive(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phoneTimerActive]);

  useEffect(() => {
    if (!emailTimerActive) return;
    const id = setInterval(() => {
      setEmailSeconds(s => {
        if (s <= 1) { clearInterval(id); setEmailTimerActive(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [emailTimerActive]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ paddingTop: top }}
    >
      {/* NavBar */}
      <View className="h-[52px] px-3 flex-row items-center justify-between">
        <TouchableOpacity
          className="w-10 items-center justify-center"
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Image source={require('../../assets/icons/chevron-left.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
          비밀번호 찾기
        </Text>
        <View className="w-10" />
      </View>

      {/* 탭 */}
      <View className="flex-row mx-5" style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
        {(['phone', 'email'] as Tab[]).map(t => (
          <TouchableOpacity
            key={t}
            className="flex-1 items-center py-3.5"
            activeOpacity={0.7}
            onPress={() => setTab(t)}
            style={{
              borderBottomWidth: 2,
              borderBottomColor: tab === t ? colors.text1 : 'transparent',
              marginBottom: -1,
            }}
          >
            <Text
              className="text-[14px]"
              style={{
                letterSpacing: -0.3,
                fontWeight: tab === t ? '700' : '500',
                color: tab === t ? colors.text1 : colors.text3,
              }}
            >
              {t === 'phone' ? '휴대폰 인증' : '이메일 인증'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* 타이틀 */}
        <View className="pt-7 pb-5">
          <Text
            className="text-[20px] font-extrabold text-text1"
            style={{ letterSpacing: -0.5, lineHeight: 28 }}
          >
            {tab === 'phone'
              ? '아이디와 본인 인증으로\n비밀번호를 재설정해요'
              : '아이디와 이메일 인증으로\n비밀번호를 재설정해요'}
          </Text>
          <Text
            className="mt-2 text-[13px] text-text2 font-medium"
            style={{ letterSpacing: -0.3, lineHeight: 20 }}
          >
            {tab === 'phone'
              ? '가입 시 등록한 휴대폰 번호로 인증해 주세요.'
              : '가입 시 등록한 이메일로 인증해 주세요.'}
          </Text>
        </View>

        <View className="gap-3.5">
          {/* 아이디 */}
          <View>
            <Text className="text-[12px] font-semibold text-text2 mb-1.5" style={{ letterSpacing: -0.2 }}>
              아이디
            </Text>
            <TextInput
              className="h-[52px] bg-input rounded-xl px-4 text-[15px] text-text1"
              placeholder="아이디를 입력해주세요"
              placeholderTextColor={colors.text3}
              value={tab === 'phone' ? phoneUserId : emailUserId}
              onChangeText={tab === 'phone' ? setPhoneUserId : setEmailUserId}
              autoCapitalize="none"
              autoCorrect={false}
              style={{ letterSpacing: -0.3 }}
            />
          </View>

          {tab === 'phone' ? (
            /* 휴대폰 번호 섹션 */
            <View>
              <Text className="text-[12px] font-semibold text-text2 mb-1.5" style={{ letterSpacing: -0.2 }}>
                휴대폰 번호
              </Text>

              {/* 통신사 칩 */}
              <View className="flex-row gap-1.5 mb-2">
                {CARRIERS.map(carrier => (
                  <TouchableOpacity
                    key={carrier}
                    onPress={() => setSelectedCarrier(carrier)}
                    activeOpacity={0.7}
                    className="px-2 py-1 rounded-full"
                    style={{ backgroundColor: carrier === selectedCarrier ? colors.primaryLight : colors.input }}
                  >
                    <Text
                      className="text-[11px] font-semibold"
                      style={{
                        letterSpacing: -0.2,
                        color: carrier === selectedCarrier ? colors.primary : colors.text2,
                      }}
                    >
                      {carrier}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* 전화번호 + 인증 요청 */}
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <TextInput
                    className="h-[52px] bg-input rounded-xl px-4 text-[15px] text-text1"
                    placeholder="010 - 0000 - 0000"
                    placeholderTextColor={colors.text3}
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                    style={{ letterSpacing: -0.3 }}
                  />
                </View>
                <TouchableOpacity
                  className="h-[52px] px-4 rounded-xl bg-white items-center justify-center"
                  activeOpacity={0.85}
                  onPress={() => { setPhoneSeconds(180); setPhoneTimerActive(true); }}
                  style={{ borderWidth: 1.5, borderColor: colors.primary }}
                >
                  <Text className="text-primary text-[14px] font-bold" style={{ letterSpacing: -0.3 }}>
                    인증 요청
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 인증번호 + 확인 */}
              <View className="flex-row gap-2 mt-2">
                <View className="flex-1">
                  <TextInput
                    className="h-[52px] bg-input rounded-xl px-4 text-[15px] text-text1"
                    placeholder="인증번호 입력"
                    placeholderTextColor={colors.text3}
                    keyboardType="number-pad"
                    style={{ letterSpacing: -0.3, paddingRight: phoneTimerActive ? 64 : 16 }}
                  />
                  {phoneTimerActive && (
                    <View className="absolute right-3.5 top-0 bottom-0 justify-center" pointerEvents="none">
                      <Text className="text-[13px] font-semibold text-primary" style={{ letterSpacing: -0.2 }}>
                        {formatTime(phoneSeconds)}
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  className="h-[52px] px-4 rounded-xl bg-white items-center justify-center"
                  activeOpacity={0.85}
                  style={{ borderWidth: 1.5, borderColor: colors.primary }}
                >
                  <Text className="text-primary text-[14px] font-bold" style={{ letterSpacing: -0.3 }}>
                    확인
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 안내 박스 */}
              <View
                className="mt-1 rounded-[10px] p-3 flex-row gap-2 items-start"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <Image
                  source={require('../../assets/icons/info-circle.png')}
                  style={{ width: 14, height: 14, marginTop: 1, tintColor: colors.primary }}
                />
                <Text
                  className="flex-1 text-[11px] font-medium"
                  style={{ color: colors.primaryDark, letterSpacing: -0.2, lineHeight: 16 }}
                >
                  인증번호가 오지 않는다면 입력하신 정보가 가입 시 등록한 정보와 일치하는지 다시 확인해 주세요.
                </Text>
              </View>
            </View>
          ) : (
            /* 이메일 섹션 */
            <View>
              <Text className="text-[12px] font-semibold text-text2 mb-1.5" style={{ letterSpacing: -0.2 }}>
                이메일 주소
              </Text>

              {/* 이메일 + 인증 요청 */}
              <View className="flex-row gap-2">
                <View className="flex-1 h-[52px] bg-input rounded-xl px-4 flex-row items-center gap-2.5">
                  <Image
                    source={require('../../assets/icons/mail.png')}
                    style={{ width: 18, height: 18, tintColor: colors.text3 }}
                  />
                  <TextInput
                    className="flex-1 text-[15px] text-text1"
                    placeholder="example@recare.kr"
                    placeholderTextColor={colors.text3}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    style={{ letterSpacing: -0.3 }}
                  />
                </View>
                <TouchableOpacity
                  className="h-[52px] px-4 rounded-xl bg-white items-center justify-center"
                  activeOpacity={0.85}
                  onPress={() => { setEmailSeconds(180); setEmailTimerActive(true); }}
                  style={{ borderWidth: 1.5, borderColor: colors.primary }}
                >
                  <Text className="text-primary text-[14px] font-bold" style={{ letterSpacing: -0.3 }}>
                    인증 요청
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 인증번호 + 확인 */}
              <View className="flex-row gap-2 mt-2">
                <View className="flex-1">
                  <TextInput
                    className="h-[52px] bg-input rounded-xl px-4 text-[15px] text-text1"
                    placeholder="인증번호 입력"
                    placeholderTextColor={colors.text3}
                    keyboardType="number-pad"
                    style={{ letterSpacing: -0.3, paddingRight: emailTimerActive ? 64 : 16 }}
                  />
                  {emailTimerActive && (
                    <View className="absolute right-3.5 top-0 bottom-0 justify-center" pointerEvents="none">
                      <Text className="text-[13px] font-semibold text-primary" style={{ letterSpacing: -0.2 }}>
                        {formatTime(emailSeconds)}
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  className="h-[52px] px-4 rounded-xl bg-white items-center justify-center"
                  activeOpacity={0.85}
                  style={{ borderWidth: 1.5, borderColor: colors.primary }}
                >
                  <Text className="text-primary text-[14px] font-bold" style={{ letterSpacing: -0.3 }}>
                    확인
                  </Text>
                </TouchableOpacity>
              </View>

              <Text
                className="mt-2 text-[12px] text-text3 font-medium"
                style={{ letterSpacing: -0.2, lineHeight: 18 }}
              >
                인증번호가 오지 않는다면 스팸 메일함을 확인하거나, 입력하신 이메일이 가입 시 등록한 정보와 일치하는지 다시 확인해 주세요.
              </Text>
            </View>
          )}
        </View>

        {/* 다음 버튼 */}
        <View className="mt-6 mb-4">
          <TouchableOpacity
            className="h-[52px] w-full bg-primary rounded-xl items-center justify-center"
            activeOpacity={0.85}
          >
            <Text className="text-white text-base font-bold" style={{ letterSpacing: -0.3 }}>
              다음
            </Text>
          </TouchableOpacity>

          {/* 아이디 찾기 링크 */}
          <View className="mt-3.5 flex-row justify-center">
            <Text className="text-[13px] text-text2" style={{ letterSpacing: -0.3 }}>
              아이디가 기억되지 않으신가요?{' '}
            </Text>
            <TouchableOpacity activeOpacity={0.7} onPress={() => router.replace('/(auth)/find-id')}>
              <Text className="text-[13px] text-primary font-bold" style={{ letterSpacing: -0.3 }}>
                아이디 찾기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
