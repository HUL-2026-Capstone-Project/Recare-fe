import { Pressable, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import type { Notification } from '../mocks';
import { NotificationTypeIcon } from './icons';

export function NotificationItem({ item }: { item: Notification }) {
  const { read } = item;

  return (
    <Pressable
      // 알림 항목 탭 동작이 시안에 없어 스텁 처리 (TODO)
      onPress={() => {}}
      className="flex-row"
      style={{
        gap: 12,
        paddingVertical: 14,
        paddingRight: 20,
        paddingLeft: read ? 20 : 17,
        backgroundColor: read ? colors.input : colors.surface,
        borderLeftWidth: read ? 0 : 3,
        borderLeftColor: colors.primary,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: read ? colors.border : colors.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <NotificationTypeIcon icon={item.icon} size={18} />
      </View>

      <View className="flex-1 min-w-0">
        <View className="flex-row items-center" style={{ gap: 6, marginBottom: 3 }}>
          <View
            style={{
              borderRadius: 50,
              paddingHorizontal: 8,
              paddingVertical: 3,
              backgroundColor: read ? colors.input : colors.primaryLight,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '600', letterSpacing: -0.2, color: read ? colors.text2 : colors.primary }}>
              {item.type}
            </Text>
          </View>
          {!read && (
            <View style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: colors.danger }} />
          )}
        </View>

        <Text
          style={{
            fontSize: 14,
            fontWeight: read ? '500' : '700',
            color: read ? colors.text2 : colors.text1,
            letterSpacing: -0.3,
            marginBottom: 2,
          }}
        >
          {item.title}
        </Text>

        <Text
          numberOfLines={2}
          style={{
            fontSize: 12,
            color: read ? colors.text3 : colors.text2,
            letterSpacing: -0.2,
            lineHeight: 17.4,
            marginBottom: 4,
          }}
        >
          {item.message}
        </Text>

        <Text style={{ fontSize: 11, color: colors.text3, letterSpacing: -0.2 }}>{item.time}</Text>
      </View>
    </Pressable>
  );
}
