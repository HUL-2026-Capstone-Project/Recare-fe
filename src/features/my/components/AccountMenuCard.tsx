import { Pressable, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { Card } from '@/features/home/components/Card';
import { AccountMenuIcon, ChevronRightGray } from './icons';
import type { myMock } from '../mocks';

export function AccountMenuCard({ items }: { items: (typeof myMock)['accountMenu'] }) {
  return (
    <Card style={{ padding: 4, marginBottom: 12 }}>
      {items.map((item, index) => (
        <Pressable
          // 메뉴 이동 화면이 시안에 없어 스텁 처리 (TODO)
          key={item.label}
          onPress={() => {}}
          className="flex-row items-center"
          style={{
            gap: 10,
            paddingVertical: 11,
            paddingHorizontal: 12,
            borderBottomWidth: index < items.length - 1 ? 1 : 0,
            borderBottomColor: colors.border,
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: colors.primaryLight,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AccountMenuIcon icon={item.icon} size={16} />
          </View>
          <Text className="flex-1" style={{ fontSize: 14, fontWeight: '500', color: colors.text1, letterSpacing: -0.3 }}>
            {item.label}
          </Text>
          <ChevronRightGray size={16} />
        </Pressable>
      ))}
    </Card>
  );
}
