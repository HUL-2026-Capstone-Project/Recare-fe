import { Pressable, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { Card } from '@/features/home/components/Card';

type Stat = { value: string; label: string; onPress?: () => void };

export function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <View className="flex-row gap-2" style={{ marginBottom: 14 }}>
      {stats.map((stat) => {
        const card = (
          <Card className="items-center" style={{ padding: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: colors.primary, letterSpacing: -0.4 }}>
              {stat.value}
            </Text>
            <Text style={{ fontSize: 11, color: colors.text2, letterSpacing: -0.2, marginTop: 2 }}>
              {stat.label}
            </Text>
          </Card>
        );
        return stat.onPress ? (
          <Pressable key={stat.label} className="flex-1" onPress={stat.onPress}>
            {card}
          </Pressable>
        ) : (
          <View key={stat.label} className="flex-1">
            {card}
          </View>
        );
      })}
    </View>
  );
}
