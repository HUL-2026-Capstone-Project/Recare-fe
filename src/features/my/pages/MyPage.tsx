import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { ProfileCard } from '../components/ProfileCard';
import { StatsRow } from '../components/StatsRow';
import { AccountMenuCard } from '../components/AccountMenuCard';
import { PolicyMenuCard } from '../components/PolicyMenuCard';
import { APP_VERSION, myMock } from '../mocks';

export default function MyPage() {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <View className="h-14 px-5 justify-center">
        <Text className="text-[22px] font-extrabold text-text1" style={{ letterSpacing: -0.5 }}>
          마이페이지
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingTop: 4, paddingHorizontal: 20, paddingBottom: 24 }}
      >
        <ProfileCard name={myMock.user.name} phone={myMock.user.phone} email={myMock.user.email} />
        <StatsRow
          stats={myMock.stats.map((stat) => ({
            ...stat,
            onPress: stat.id === 'notifications' ? () => router.push('/notifications') : undefined,
          }))}
        />
        <AccountMenuCard items={myMock.accountMenu} />
        <PolicyMenuCard items={myMock.policyMenu} />

        <View className="flex-row items-center justify-center" style={{ paddingTop: 8, paddingBottom: 4 }}>
          <Pressable
            // 로그아웃 확인 모달이 시안에 없어 스텁 처리 (TODO), 기존 인증 로직 연결하지 않음
            onPress={() => {}}
            style={{ paddingHorizontal: 14 }}
          >
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.text2, letterSpacing: -0.3 }}>
              로그아웃
            </Text>
          </Pressable>
          <View style={{ width: 1, height: 11, backgroundColor: colors.border }} />
          <Pressable
            // 회원탈퇴 확인 모달이 시안에 없어 스텁 처리 (TODO)
            onPress={() => {}}
            style={{ paddingHorizontal: 14 }}
          >
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.danger, letterSpacing: -0.3 }}>
              회원탈퇴
            </Text>
          </Pressable>
        </View>

        <Text
          className="text-center"
          style={{ fontSize: 11, color: colors.text3, marginTop: 4 }}
        >
          Re:care {APP_VERSION}
        </Text>
      </ScrollView>
    </View>
  );
}
