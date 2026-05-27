import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/constants/colors';

const FOUND_ACCOUNTS = [
  { id: 'hyung****jin', joinedAt: '2023.08.14 가입' },
  { id: 'recare***24', joinedAt: '2024.01.02 가입' },
];

export default function FindIdResultScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      {/* NavBar */}
      <View className="h-[52px] px-3 flex-row items-center justify-between bg-white">
        <TouchableOpacity
          className="w-10 items-center justify-center"
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Image source={require('../../assets/icons/chevron-left.png')} style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
        <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
          아이디 찾기
        </Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-5">
        {/* 상단 안내 */}
        <View className="pt-6 pb-5">
          <View
            className="w-14 h-14 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: colors.primaryLight }}
          >
            <Image
              source={require('../../assets/icons/check-circle.png')}
              style={{ width: 28, height: 28, tintColor: colors.primary }}
            />
          </View>
          <Text
            className="text-[22px] font-extrabold text-text1"
            style={{ letterSpacing: -0.5, lineHeight: 30 }}
          >
            아이디를 확인해 주세요
          </Text>
          <Text
            className="mt-2 text-[13px] text-text2 font-medium"
            style={{ letterSpacing: -0.3, lineHeight: 20 }}
          >
            {'본인 인증된 정보로 가입된 아이디예요.\n보안을 위해 일부는 가려져 있어요.'}
          </Text>
        </View>

        {/* 아이디 카드 목록 */}
        <View className="gap-2 flex-1">
          {FOUND_ACCOUNTS.map(account => (
            <View
              key={account.id}
              className="bg-white rounded-2xl p-3.5 flex-row items-center gap-3"
              style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}
            >
              <View
                className="w-9 h-9 rounded-[10px] items-center justify-center"
                style={{ backgroundColor: colors.primaryLight }}
              >
                <Image
                  source={require('../../assets/icons/user.png')}
                  style={{ width: 18, height: 18, tintColor: colors.primary }}
                />
              </View>
              <View className="flex-1">
                <Text
                  className="text-[15px] font-bold text-text1"
                  style={{ letterSpacing: -0.3 }}
                >
                  {account.id}
                </Text>
                <Text
                  className="text-[11px] text-text3 mt-0.5"
                  style={{ letterSpacing: -0.2 }}
                >
                  {account.joinedAt}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* 하단 버튼 */}
        <View className="pb-4 flex-row gap-2">
          <TouchableOpacity
            className="flex-1 h-[52px] rounded-xl bg-white items-center justify-center"
            activeOpacity={0.85}
            style={{ borderWidth: 1.5, borderColor: colors.border }}
            onPress={() => router.push('/(auth)/find-pw')}
          >
            <Text
              className="text-[15px] font-bold text-text1"
              style={{ letterSpacing: -0.3 }}
            >
              비밀번호 찾기
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="h-[52px] bg-primary rounded-xl items-center justify-center"
            activeOpacity={0.85}
            style={{ flex: 1.2 }}
            onPress={() => router.replace('/(auth)/login')}
          >
            <Text
              className="text-white text-[15px] font-bold"
              style={{ letterSpacing: -0.3 }}
            >
              로그인하기
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
