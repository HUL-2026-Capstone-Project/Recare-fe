import { useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { CaseDetailHeader } from '@/features/case/components/CaseDetailHeader';
import { NotificationItem } from '../components/NotificationItem';
import { notifications as initialNotifications } from '../mocks';

export default function NotificationsPage() {
  const { top, bottom } = useSafeAreaInsets();
  const [items, setItems] = useState(initialNotifications);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: top, paddingBottom: bottom }}>
      <CaseDetailHeader
        title="알림"
        right={
          <Pressable onPress={() => setItems((prev) => prev.map((item) => ({ ...item, read: true })))}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.primary, letterSpacing: -0.2 }}>
              전체 읽음
            </Text>
          </Pressable>
        }
      />
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationItem item={item} />}
      />
    </View>
  );
}
