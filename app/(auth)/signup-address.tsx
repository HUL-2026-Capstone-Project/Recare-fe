import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/constants/colors';

const RECENT_SEARCHES = [
  '서울특별시 강남구 테헤란로 123',
  '서울시 송파구 올림픽로 300',
];

export default function SignUpAddressScreen() {
  const { top } = useSafeAreaInsets();

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

        {/* 콘텐츠 */}
        <View className="flex-1 pt-3 gap-4">
          {/* 주소 검색 */}
          <TouchableOpacity
            className="h-[52px] bg-input rounded-xl px-4 flex-row items-center gap-2.5"
            activeOpacity={0.7}
          >
            <Image
              source={require('../../assets/icons/search.png')}
              style={{ width: 20, height: 20, tintColor: colors.text3 }}
            />
            <Text
              className="flex-1 text-[15px]"
              style={{ color: colors.text3, letterSpacing: -0.3 }}
            >
              도로명, 지번, 건물명으로 검색
            </Text>
          </TouchableOpacity>

          {/* 최근 검색어 */}
          <View>
            <Text
              className="text-[12px] font-semibold text-text2 mb-1.5"
              style={{ letterSpacing: -0.2 }}
            >
              최근 검색어
            </Text>
            <View className="flex-row flex-wrap gap-1.5">
              {RECENT_SEARCHES.map(addr => (
                <TouchableOpacity
                  key={addr}
                  activeOpacity={0.7}
                  className="px-3 py-1.5 rounded-full bg-input"
                >
                  <Text
                    className="text-[12px] font-semibold text-text2"
                    style={{ letterSpacing: -0.2 }}
                  >
                    {addr}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 현재 위치로 찾기 */}
          <TouchableOpacity
            className="h-12 rounded-xl flex-row items-center justify-center gap-1.5"
            activeOpacity={0.85}
            style={{ backgroundColor: colors.primaryLight }}
          >
            <Image
              source={require('../../assets/icons/pin-filled.png')}
              style={{ width: 16, height: 16, tintColor: colors.primary }}
            />
            <Text
              className="text-primary text-[14px] font-bold"
              style={{ letterSpacing: -0.3 }}
            >
              현재 위치로 찾기
            </Text>
          </TouchableOpacity>
        </View>

        {/* 다음 버튼 */}
        <View className="pb-4">
          <TouchableOpacity
            className="h-[52px] w-full bg-primary rounded-xl items-center justify-center"
            activeOpacity={0.85}
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
    </View>
  );
}
