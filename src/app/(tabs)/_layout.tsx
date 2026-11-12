import { Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Tabs, usePathname } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { extraBottomInset } from '@/shared/lib/bottomInset';

type TabKey = 'care' | 'map' | 'chat' | 'my';

// 기본 탭 버튼은 아이콘 칸(28)을 위쪽에 붙이고(padding 5), 아이콘+라벨 묶음(보이는 높이 약 39)은 위 여백 2.5로 시작한다.
// 높이 60에서 묶음을 세로 중앙에 두려면 (60 - 39) / 2 - 2.5 = 8만큼 내린다. 3버튼(높이 108)에서는 콘텐츠 영역 60의 중앙이 된다.
const TAB_ICON_CENTER_SHIFT = 8;

// cases(내 케이스)는 탭 버튼이 없는 케어 탭의 하위 화면이라 경로 기준으로 그룹을 판단한다.
function getActiveTab(pathname: string): TabKey | null {
  if (pathname === '/' || pathname.startsWith('/cases')) return 'care';
  if (pathname.startsWith('/map')) return 'map';
  if (pathname.startsWith('/chat')) return 'chat';
  if (pathname.startsWith('/my')) return 'my';
  return null;
}

function TabIcon({
  active,
  label,
  activeIcon,
  inactiveIcon,
}: {
  active: boolean;
  label: string;
  activeIcon: number;
  inactiveIcon: number;
}) {
  return (
    <View className="items-center" style={{ paddingTop: 4, gap: 2 }}>
      <Image source={active ? activeIcon : inactiveIcon} style={{ width: 24, height: 24 }} />
      <Text
        style={{
          fontSize: 11,
          letterSpacing: -0.2,
          fontWeight: active ? '700' : '500',
          color: active ? colors.primary : colors.text3,
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabLayout() {
  const activeTab = getActiveTab(usePathname());
  const { bottom } = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          // 탭바는 하단 inset을 padding으로 이미 반영하므로, inset이 큰 3버튼 내비게이션에서는 높이도 그만큼 늘려 아이콘 영역(60)을 유지한다.
          height: 60 + extraBottomInset(bottom),
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        // 아이콘 칸 위치만 내린다(탭 버튼의 눌리는 영역은 그대로).
        tabBarIconStyle: { marginTop: TAB_ICON_CENTER_SHIFT },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '케어',
          tabBarIcon: () => (
            <TabIcon
              active={activeTab === 'care'}
              label="케어"
              activeIcon={require('@/shared/assets/icons/tab-care-active.png')}
              inactiveIcon={require('@/shared/assets/icons/tab-care-inactive.png')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: '지도',
          tabBarIcon: () => (
            <TabIcon
              active={activeTab === 'map'}
              label="지도"
              activeIcon={require('@/shared/assets/icons/tab-map-active.png')}
              inactiveIcon={require('@/shared/assets/icons/tab-map-inactive.png')}
            />
          ),
        }}
      />
      <Tabs.Screen name="cases" options={{ href: null }} />
      <Tabs.Screen
        name="chat"
        options={{
          title: '채팅',
          tabBarIcon: () => (
            <TabIcon
              active={activeTab === 'chat'}
              label="채팅"
              activeIcon={require('@/shared/assets/icons/tab-chat-active.png')}
              inactiveIcon={require('@/shared/assets/icons/tab-chat-inactive.png')}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my"
        options={{
          title: '마이',
          tabBarIcon: () => (
            <TabIcon
              active={activeTab === 'my'}
              label="마이"
              activeIcon={require('@/shared/assets/icons/tab-my-active.png')}
              inactiveIcon={require('@/shared/assets/icons/tab-my-inactive.png')}
            />
          ),
        }}
      />
    </Tabs>
  );
}
