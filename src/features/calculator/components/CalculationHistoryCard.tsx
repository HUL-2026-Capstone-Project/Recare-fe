import { Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { Card } from '@/features/home/components/Card';

export type CalculationHistoryItem = {
  id: string;
  title: string;
  date: string;
  amount: string;
};

export function CalculationHistoryCard({ items }: { items: CalculationHistoryItem[] }) {
  return (
    <Card className="p-1">
      {items.map((item) => (
        <View key={item.id} className="flex-row justify-between items-center px-3.5 py-3">
          <View>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text1, letterSpacing: -0.3 }}>
              {item.title}
            </Text>
            <Text className="mt-0.5" style={{ fontSize: 11, fontWeight: '400', color: colors.text3 }}>
              {item.date}
            </Text>
          </View>
          <Text style={{ fontSize: 14, fontWeight: '800', color: colors.text1, letterSpacing: -0.3 }}>
            {item.amount}
          </Text>
        </View>
      ))}
    </Card>
  );
}
