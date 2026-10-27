import { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { useCaseStore } from '@/store/caseStore';
import { useProfileStore } from '@/store/profileStore';
import { useToastStore } from '@/store/toastStore';
import { ProfileCard } from '../components/ProfileCard';
import { StatsRow } from '../components/StatsRow';
import { AccountMenuCard } from '../components/AccountMenuCard';
import { PolicyMenuCard } from '../components/PolicyMenuCard';
import { APP_VERSION, myMock } from '../mocks';

export default function MyPage() {
  const { top, bottom } = useSafeAreaInsets();
  const logout = useAuthStore((state) => state.logout);
  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);
  const toastMessage = useToastStore((state) => state.message);

  useEffect(() => {
    if (!profile) fetchProfile();
  }, [profile, fetchProfile]);

  // 진행 케이스 수는 케이스 목록(progress.group이 ACTIVE)에서 센다. 아직 한 번도 불러오지 않았을 때만 불러온다.
  // 제출 서류·받은 알림 수는 서버에서 채울 수 없어 통계에서 그리지 않는다.
  const cases = useCaseStore((state) => state.cases);
  const listStatus = useCaseStore((state) => state.listStatus);
  const fetchCases = useCaseStore((state) => state.fetchCases);
  const hasCaseList = listStatus === 'success' || cases.length > 0;
  const activeCaseCount = cases.filter((c) => c.progress.group === 'ACTIVE').length;

  useEffect(() => {
    if (listStatus === 'idle') fetchCases();
  }, [listStatus, fetchCases]);

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
        <ProfileCard
          name={profile?.name ?? ''}
          phone={profile?.phone ?? ''}
          email={profile?.email ?? ''}
          onPress={() => router.push('/profile')}
        />
        {hasCaseList && <StatsRow stats={[{ value: String(activeCaseCount), label: '진행 케이스' }]} />}
        <AccountMenuCard items={myMock.accountMenu} />
        <PolicyMenuCard items={myMock.policyMenu} />

        <View className="flex-row items-center justify-center" style={{ paddingTop: 8, paddingBottom: 4 }}>
          <Pressable
            // 로그아웃 확인 모달이 시안에 없어 스텁 처리 (TODO)
            onPress={() => logout()}
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

      {toastMessage && (
        // 임시 UI, 보고: 기존 토스트 컴포넌트가 없어 최소 구현. 위치는 탭바(60px) 위로 임시 결정.
        <View
          pointerEvents="none"
          className="absolute left-5 right-5 rounded-xl items-center"
          style={{ bottom: Math.max(bottom, 8) + 60 + 12, backgroundColor: colors.text1, paddingVertical: 12 }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff', letterSpacing: -0.3 }}>{toastMessage}</Text>
        </View>
      )}
    </View>
  );
}
