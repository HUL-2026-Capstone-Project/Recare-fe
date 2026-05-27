import { useEffect, useState } from 'react';
import { Image, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/constants/colors';

const CARRIERS = ['SKT', 'KT', 'LG U+', '알뜰폰'] as const;
type Carrier = (typeof CARRIERS)[number];

const FIELD_LABELS: Record<string, string> = {
  name: '이름',
  userId: '아이디',
  password: '비밀번호',
  residentNumber: '주민등록번호 앞 6자리',
  phoneVerified: '휴대폰 인증',
};

export default function SignUpInfoScreen() {
  const { top } = useSafeAreaInsets();
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier>('SKT');
  const [timerActive, setTimerActive] = useState(false);
  const [seconds, setSeconds] = useState(180);

  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [residentNumber, setResidentNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [missingFields, setMissingFields] = useState<string[]>([]);

  useEffect(() => {
    if (!timerActive) return;
    const id = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(id); setTimerActive(false); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timerActive]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const handleRequestVerification = () => {
    setSeconds(180);
    setTimerActive(true);
    setPhoneVerified(false);
  };

  const handleNext = () => {
    const missing: string[] = [];
    if (!name.trim()) missing.push('이름');
    if (!userId.trim()) missing.push('아이디');
    if (!password.trim()) missing.push('비밀번호');
    if (residentNumber.length < 6) missing.push('주민등록번호 앞 6자리');
    if (!phoneVerified) missing.push('휴대폰 인증');

    if (missing.length > 0) {
      setMissingFields(missing);
      setShowAlert(true);
      return;
    }
    router.push('/(auth)/signup-address');
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
            source={require('../../assets/icons/chevron-left.png')}
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
          <View className="flex-1 bg-border rounded-full" />
        </View>

        {/* 타이틀 */}
        <View className="pt-7 pb-2">
          <Text
            className="text-[22px] font-extrabold text-text1"
            style={{ letterSpacing: -0.5, lineHeight: 30 }}
          >
            정보를 입력해주세요
          </Text>
          <Text
            className="mt-2 text-[14px] text-text2 font-medium"
            style={{ letterSpacing: -0.3, lineHeight: 21 }}
          >
            본인 확인을 위해 정확한 정보를 입력해 주세요.
          </Text>
        </View>

        {/* 폼 */}
        <ScrollView className="flex-1 pt-3" showsVerticalScrollIndicator={false}>
          <View className="gap-3">
            {/* 이름 */}
            <TextInput
              className="h-[52px] bg-input rounded-xl px-4 text-[15px] text-text1"
              placeholder="이름을 입력하세요"
              placeholderTextColor={colors.text3}
              value={name}
              onChangeText={setName}
              style={{ letterSpacing: -0.3 }}
            />

            {/* 아이디 */}
            <TextInput
              className="h-[52px] bg-input rounded-xl px-4 text-[15px] text-text1"
              placeholder="아이디를 입력해주세요"
              placeholderTextColor={colors.text3}
              value={userId}
              onChangeText={setUserId}
              autoCapitalize="none"
              autoCorrect={false}
              style={{ letterSpacing: -0.3 }}
            />

            {/* 비밀번호 */}
            <TextInput
              className="h-[52px] bg-input rounded-xl px-4 text-[15px] text-text1"
              placeholder="비밀번호를 입력해주세요"
              placeholderTextColor={colors.text3}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              style={{ letterSpacing: -0.3 }}
            />

            {/* 주민등록번호 */}
            <View className="flex-row gap-2">
              <View className="flex-1">
                <TextInput
                  className="h-[52px] bg-input rounded-xl px-4 text-[15px] text-text1"
                  placeholder="주민등록번호 앞 6자리"
                  placeholderTextColor={colors.text3}
                  value={residentNumber}
                  onChangeText={setResidentNumber}
                  keyboardType="number-pad"
                  maxLength={6}
                  style={{ letterSpacing: -0.3 }}
                />
              </View>
              <View
                className="bg-input rounded-xl items-center justify-center"
                style={{ width: 52, height: 52 }}
              >
                <Text
                  className="text-text1 font-bold text-[18px]"
                  style={{ letterSpacing: 2 }}
                >
                  •••
                </Text>
              </View>
            </View>

            {/* 휴대폰 번호 */}
            <View className="mt-1">
              <Text
                className="text-[12px] font-semibold text-text2 mb-1.5"
                style={{ letterSpacing: -0.2 }}
              >
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
                    style={{
                      backgroundColor:
                        carrier === selectedCarrier ? colors.primaryLight : colors.input,
                    }}
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
                  onPress={handleRequestVerification}
                  style={{ borderWidth: 1.5, borderColor: colors.primary }}
                >
                  <Text
                    className="text-primary text-[14px] font-bold"
                    style={{ letterSpacing: -0.3 }}
                  >
                    인증 요청
                  </Text>
                </TouchableOpacity>
              </View>

              {/* 인증번호 입력 + 확인 */}
              <View className="flex-row gap-2 mt-2">
                <View className="flex-1">
                  <TextInput
                    className="h-[52px] bg-input rounded-xl px-4 text-[15px] text-text1"
                    placeholder="인증번호 입력"
                    placeholderTextColor={colors.text3}
                    keyboardType="number-pad"
                    style={{ letterSpacing: -0.3, paddingRight: timerActive ? 64 : 16 }}
                  />
                  {timerActive && (
                    <View
                      className="absolute right-3.5 top-0 bottom-0 justify-center"
                      pointerEvents="none"
                    >
                      <Text
                        className="text-[13px] font-semibold text-primary"
                        style={{ letterSpacing: -0.2 }}
                      >
                        {formatTime(seconds)}
                      </Text>
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  className="h-[52px] px-4 rounded-xl bg-white items-center justify-center"
                  activeOpacity={0.85}
                  onPress={() => { setPhoneVerified(true); setTimerActive(false); }}
                  style={{ borderWidth: 1.5, borderColor: colors.primary }}
                >
                  <Text
                    className="text-primary text-[14px] font-bold"
                    style={{ letterSpacing: -0.3 }}
                  >
                    확인
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 안내 박스 */}
            <View
              className="rounded-[10px] p-3 flex-row gap-2 items-start mb-4"
              style={{ backgroundColor: colors.primaryLight, marginTop: 4 }}
            >
              <Image
                source={require('../../assets/icons/info-circle.png')}
                style={{ width: 14, height: 14, marginTop: 1, tintColor: colors.primary }}
              />
              <Text
                className="flex-1 text-[11px] font-medium"
                style={{ color: colors.primaryDark, letterSpacing: -0.2, lineHeight: 16 }}
              >
                입력하신 정보는 본인 확인 및 서비스 이용을 위해서만 사용됩니다.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* 다음 버튼 */}
        <View className="pb-4">
          <TouchableOpacity
            className="h-[52px] w-full bg-primary rounded-xl items-center justify-center"
            activeOpacity={0.85}
            onPress={handleNext}
          >
            <Text
              className="text-white text-base font-bold"
              style={{ letterSpacing: -0.3 }}
            >
              다음
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 유효성 검사 모달 */}
      <Modal visible={showAlert} transparent animationType="fade">
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: 'rgba(17,24,32,0.55)' }}
        >
          <View className="w-full bg-white rounded-[18px] px-5 pt-6 pb-4" style={{ shadowColor: '#000', shadowOpacity: 0.22, shadowRadius: 20, shadowOffset: { width: 0, height: 8 } }}>
            {/* 경고 아이콘 */}
            <View
              className="w-12 h-12 rounded-full items-center justify-center self-center mb-3.5"
              style={{ backgroundColor: '#FFF1E5' }}
            >
              <Image
                source={require('../../assets/icons/alert-warning.png')}
                style={{ width: 24, height: 24 }}
              />
            </View>

            {/* 제목 */}
            <Text
              className="text-center text-[17px] font-extrabold text-text1"
              style={{ letterSpacing: -0.4, lineHeight: 23 }}
            >
              입력 정보를 확인해주세요
            </Text>

            {/* 부제 */}
            <Text
              className="text-center text-[13px] text-text2 font-medium mt-2"
              style={{ letterSpacing: -0.3, lineHeight: 20 }}
            >
              모든 항목을 입력해야 다음 단계로 넘어갈 수 있어요.
            </Text>

            {/* 누락 항목 목록 */}
            <View className="mt-4 rounded-xl p-3" style={{ backgroundColor: colors.input }}>
              <Text
                className="text-[11px] font-bold text-text2 mb-1.5"
                style={{ letterSpacing: -0.2 }}
              >
                누락된 항목
              </Text>
              <View className="gap-1.5">
                {missingFields.map(field => (
                  <View key={field} className="flex-row items-center gap-1.5">
                    <Image
                      source={require('../../assets/icons/x-circle.png')}
                      style={{ width: 12, height: 12 }}
                    />
                    <Text
                      className="text-[13px] font-semibold text-text1"
                      style={{ letterSpacing: -0.2 }}
                    >
                      {field}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* 확인 버튼 */}
            <TouchableOpacity
              className="h-12 w-full bg-primary rounded-xl items-center justify-center mt-4"
              activeOpacity={0.85}
              onPress={() => setShowAlert(false)}
            >
              <Text
                className="text-white text-[15px] font-bold"
                style={{ letterSpacing: -0.3 }}
              >
                확인
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
