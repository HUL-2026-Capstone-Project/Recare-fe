import { useEffect } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { CaseDetailHeader } from '@/features/case/components/CaseDetailHeader';
import { useProfileStore } from '@/store/profileStore';
import { ProfileHero } from '../components/ProfileHero';
import { ProfileInfoGroup } from '../components/ProfileInfoGroup';
import { buildProfileGroups } from '../mocks';

export default function ProfilePage() {
  const { top, bottom } = useSafeAreaInsets();
  const profile = useProfileStore((state) => state.profile);
  const status = useProfileStore((state) => state.status);
  const errorMessage = useProfileStore((state) => state.errorMessage);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const groups = profile ? buildProfileGroups(profile) : [];

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <CaseDetailHeader title="내 프로필" transparent />

      {!profile && status === 'loading' ? (
        // 임시 UI, 디자인 필요: 시안에 로딩 화면이 없어 기존 토큰만으로 최소 구성
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : !profile && status === 'error' ? (
        // 임시 UI, 디자인 필요: 시안에 에러 화면이 없어 기존 토큰만으로 최소 구성
        <View className="flex-1 items-center justify-center" style={{ gap: 8, paddingHorizontal: 20 }}>
          <Text style={{ fontSize: 13, color: colors.text2, letterSpacing: -0.2, textAlign: 'center' }}>
            {errorMessage}
          </Text>
          <Pressable onPress={fetchProfile}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary, letterSpacing: -0.2 }}>
              다시 시도
            </Text>
          </Pressable>
        </View>
      ) : profile ? (
        <>
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 20 }}
          >
            <ProfileHero name={profile.name} loginId={profile.loginId} isVerified={profile.isVerified} />
            {groups.map((group) => (
              <ProfileInfoGroup key={group.title} group={group} />
            ))}
          </ScrollView>

          <View style={{ paddingTop: 8, paddingHorizontal: 20, paddingBottom: Math.max(bottom, 12), backgroundColor: colors.bg }}>
            <TouchableOpacity
              activeOpacity={0.8}
              // 프로필 수정 화면이 시안에 없어 스텁 처리 (TODO). 수정 API(profileStore.updateProfile)는 구현돼 있으나 호출하는 UI는 없음
              onPress={() => {}}
              className="items-center justify-center"
              style={{ height: 52, borderRadius: 14, borderWidth: 1.5, borderColor: colors.primary }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.primary, letterSpacing: -0.3 }}>
                프로필 정보 수정
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </View>
  );
}
