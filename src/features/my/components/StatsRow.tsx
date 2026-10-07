import { Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { Card } from '@/features/home/components/Card';

export function StatsRow({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <View className="flex-row gap-2" style={{ marginBottom: 14 }}>
      {stats.map((stat) => (
        <Card key={stat.label} className="flex-1 items-center" style={{ padding: 10 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: colors.primary, letterSpacing: -0.4 }}>
            {stat.value}
          </Text>
          <Text style={{ fontSize: 11, color: colors.text2, letterSpacing: -0.2, marginTop: 2 }}>
            {stat.label}
          </Text>
        </Card>
      ))}
    </View>
  );
}
