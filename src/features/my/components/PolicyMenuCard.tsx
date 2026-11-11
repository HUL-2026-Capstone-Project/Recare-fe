import { Pressable, Text } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { Card } from '@/features/home/components/Card';
import { ChevronRightGray } from './icons';

export function PolicyMenuCard({ items, onPressItem }: { items: string[]; onPressItem: (index: number) => void }) {
  return (
    <Card style={{ padding: 4, marginBottom: 12 }}>
      {items.map((label, index) => (
        <Pressable
          key={label}
          onPress={() => onPressItem(index)}
          className="flex-row items-center justify-between"
          style={{
            paddingVertical: 11,
            paddingHorizontal: 12,
            borderBottomWidth: index < items.length - 1 ? 1 : 0,
            borderBottomColor: colors.border,
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: '500', color: colors.text1, letterSpacing: -0.3 }}>
            {label}
          </Text>
          <ChevronRightGray size={16} />
        </Pressable>
      ))}
    </Card>
  );
}
