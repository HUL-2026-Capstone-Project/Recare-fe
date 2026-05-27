import { Image, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/constants/colors';

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      {/* 헤더 */}
      <View className="h-14 px-5 flex-row items-center justify-between">
        <View className="flex-row items-baseline">
          <Text
            className="text-[22px] text-primary font-normal"
            style={{ letterSpacing: -0.6, lineHeight: 28, opacity: 0.85 }}
          >
            Re:
          </Text>
          <Text
            className="text-[22px] text-primary font-extrabold"
            style={{ letterSpacing: -0.6, lineHeight: 28 }}
          >
            care
          </Text>
        </View>
        <TouchableOpacity activeOpacity={0.7}>
          <Image
            source={require('../../assets/icons/bell-badge.png')}
            style={{ width: 28, height: 28 }}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 2, paddingBottom: 24 }}
      >
        {/* 산재 인정 기간 카드 */}
        <ImageBackground
          source={require('../../assets/icons/recovery-box.png')}
          className="rounded-[18px] p-4 mb-3 overflow-hidden"
        >
          <Text
            className="text-white text-[14px] font-semibold"
            style={{ opacity: 0.92, letterSpacing: -0.3 }}
          >
            홍길동님의 산재 인정 기간이에요!
          </Text>
          <Text
            className="text-white text-[12px] font-medium mt-1.5"
            style={{ opacity: 0.85, letterSpacing: -0.2 }}
          >
            2024.01.15 ~ 2024.07.15
          </Text>
          <View
            className="mt-2.5 h-1.5 rounded-full overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
          >
            <View className="h-full rounded-full bg-white" style={{ width: '70%' }} />
          </View>
          <View className="mt-2 flex-row justify-between items-baseline">
            <Text className="text-white text-[12px]" style={{ opacity: 0.85, letterSpacing: -0.2 }}>
              남은 기간
            </Text>
            <Text
              className="text-white text-[20px] font-extrabold"
              style={{ letterSpacing: -0.5 }}
            >
              42
              <Text className="text-[12px] font-semibold" style={{ opacity: 0.85 }}> 일</Text>
            </Text>
          </View>
        </ImageBackground>

        {/* 내 사건 대시보드 */}
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
            내 사건 대시보드
          </Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/(tabs)/cases')}>
            <Text className="text-[13px] text-text2 font-medium" style={{ letterSpacing: -0.2 }}>
              전체보기 ›
            </Text>
          </TouchableOpacity>
        </View>

        {/* 사건 카드 */}
        <View
          className="bg-white rounded-2xl p-3.5 mb-3.5"
          style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 16, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
        >
          <View className="flex-row justify-between items-start mb-1.5">
            <Text
              className="text-[11px] font-semibold"
              style={{ color: colors.text3, letterSpacing: 0.3 }}
            >
              CASE · 2024-0312
            </Text>
            <View
              className="flex-row items-center px-3 py-1.5 rounded-full"
              style={{ backgroundColor: colors.chip.orangeBg }}
            >
              <Text
                className="text-[12px] font-semibold"
                style={{ color: colors.chip.orangeFg, letterSpacing: -0.2, lineHeight: 14 }}
              >
                심사 중
              </Text>
            </View>
          </View>
          <Text
            className="text-[15px] font-bold text-text1 mb-1"
            style={{ letterSpacing: -0.3 }}
          >
            산재 추가상병 요추 염좌 산재 신청
          </Text>
          <Text
            className="text-[12px] text-text2 mb-2.5"
            style={{ letterSpacing: -0.2 }}
          >
            재해일 2024.01.15 · 심사 단계 진행 중
          </Text>
          <View
            className="flex-row justify-between items-center pt-2.5"
            style={{ borderTopWidth: 1, borderTopColor: colors.border }}
          >
            <Text className="text-[12px]" style={{ letterSpacing: -0.2 }}>
              <Text className="text-primary font-bold">3</Text>
              <Text style={{ color: colors.text3 }}> / 5 단계</Text>
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text className="text-[13px] text-primary font-bold" style={{ letterSpacing: -0.3 }}>
                자세히보기 ›
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 다음 신청서 */}
        <Text className="text-[17px] font-bold text-text1 mb-3" style={{ letterSpacing: -0.3 }}>
          다음 신청서를 제출할 수 있어요
        </Text>
        <View className="gap-2 mb-2">
          <TouchableOpacity
            className="bg-white rounded-2xl p-3"
            activeOpacity={0.85}
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 16, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
          >
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-[10px] items-center justify-center"
                style={{ backgroundColor: colors.chip.blueBg }}
              >
                <Image
                  source={require('../../assets/icons/document.png')}
                  style={{ width: 20, height: 20, tintColor: colors.primary }}
                />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-[14px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
                    휴업급여 청구서
                  </Text>
                  <View
                    className="px-2 py-1 rounded-full"
                    style={{ backgroundColor: colors.chip.blueBg }}
                  >
                    <Text
                      className="text-[11px] font-semibold"
                      style={{ color: colors.chip.blueFg, letterSpacing: -0.2 }}
                    >
                      추천
                    </Text>
                  </View>
                </View>
                <Text
                  className="text-[12px] text-text2 mt-0.5"
                  style={{ letterSpacing: -0.2 }}
                >
                  근로 유지 기간 보상
                </Text>
              </View>
              <Image
                source={require('../../assets/icons/chevron-right.png')}
                style={{ width: 16, height: 16, tintColor: colors.text3 }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white rounded-2xl p-3"
            activeOpacity={0.85}
            style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 16, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
          >
            <View className="flex-row items-center gap-3">
              <View
                className="w-10 h-10 rounded-[10px] items-center justify-center"
                style={{ backgroundColor: colors.input }}
              >
                <Image
                  source={require('../../assets/icons/document.png')}
                  style={{ width: 20, height: 20, tintColor: colors.text2 }}
                />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-[14px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
                    요양비 청구서
                  </Text>
                  <View
                    className="px-2 py-1 rounded-full"
                    style={{ backgroundColor: colors.input }}
                  >
                    <Text
                      className="text-[11px] font-semibold"
                      style={{ color: colors.text2, letterSpacing: -0.2 }}
                    >
                      제출 가능
                    </Text>
                  </View>
                </View>
                <Text
                  className="text-[12px] text-text2 mt-0.5"
                  style={{ letterSpacing: -0.2 }}
                >
                  치료비 직접 신청
                </Text>
              </View>
              <Image
                source={require('../../assets/icons/chevron-right.png')}
                style={{ width: 16, height: 16, tintColor: colors.text3 }}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View className="h-2" />

        {/* 자주 묻는 질문 */}
        <Text className="text-[17px] font-bold text-text1 mb-3" style={{ letterSpacing: -0.3 }}>
          자주 묻는 질문들이에요
        </Text>
        <View
          className="bg-white rounded-2xl p-1"
          style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 16, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
        >
          <TouchableOpacity
            className="flex-row items-center justify-between px-3 py-2.5"
            activeOpacity={0.7}
            style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
          >
            <View className="flex-row items-center gap-2.5 flex-1 min-w-0">
              <View
                className="w-[22px] h-[22px] rounded-full items-center justify-center flex-shrink-0"
                style={{ backgroundColor: colors.chip.blueBg }}
              >
                <Text
                  className="text-[11px] font-extrabold"
                  style={{ color: colors.primary }}
                >
                  Q
                </Text>
              </View>
              <Text
                className="text-[14px] text-text1 font-medium flex-1"
                style={{ letterSpacing: -0.3 }}
              >
                산재 승인까지 얼마나 걸리나요?
              </Text>
            </View>
            <Image
              source={require('../../assets/icons/chevron-right.png')}
              style={{ width: 16, height: 16, tintColor: colors.text3 }}
            />
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-between px-3 py-2.5"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-2.5 flex-1 min-w-0">
              <View
                className="w-[22px] h-[22px] rounded-full items-center justify-center flex-shrink-0"
                style={{ backgroundColor: colors.chip.blueBg }}
              >
                <Text
                  className="text-[11px] font-extrabold"
                  style={{ color: colors.primary }}
                >
                  Q
                </Text>
              </View>
              <Text
                className="text-[14px] text-text1 font-medium flex-1"
                style={{ letterSpacing: -0.3 }}
              >
                휴업급여는 어떻게 계산되나요?
              </Text>
            </View>
            <Image
              source={require('../../assets/icons/chevron-right.png')}
              style={{ width: 16, height: 16, tintColor: colors.text3 }}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
