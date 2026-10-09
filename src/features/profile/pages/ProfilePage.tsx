import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { CaseDetailHeader } from '@/features/case/components/CaseDetailHeader';
import { ProfileHero } from '../components/ProfileHero';
import { ProfileInfoGroup } from '../components/ProfileInfoGroup';
import { buildProfileGroups, profile } from '../mocks';

export default function ProfilePage() {
  const { top, bottom } = useSafeAreaInsets();
  const groups = buildProfileGroups(profile);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <CaseDetailHeader title="내 프로필" transparent />

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
          // 프로필 수정 화면이 시안에 없어 스텁 처리 (TODO)
          onPress={() => {}}
          className="items-center justify-center"
          style={{ height: 52, borderRadius: 14, borderWidth: 1.5, borderColor: colors.primary }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.primary, letterSpacing: -0.3 }}>
            프로필 정보 수정
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
