import { Image, Text, View } from 'react-native';
import { Tabs, usePathname } from 'expo-router';

import { colors } from '@/shared/constants/colors';

type TabKey = 'care' | 'map' | 'chat' | 'my';

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

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 60,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
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
