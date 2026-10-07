import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import type { SettlementData } from '@/features/case/mocks';

export function SettlementCard({ label, description, amount, stats }: SettlementData) {
  return (
    <LinearGradient
      colors={['#04A859', '#09BD6B']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 20, padding: 18, marginTop: 10, overflow: 'hidden' }}
    >
      <View
        style={{
          position: 'absolute',
          top: -70,
          right: -60,
          width: 180,
          height: 180,
          borderRadius: 90,
          backgroundColor: 'rgba(255,255,255,0.12)',
        }}
      />

      <Text
        className="text-white"
        style={{ fontSize: 11, fontWeight: '700', letterSpacing: 1.2, opacity: 0.85 }}
      >
        {label}
      </Text>
      <Text
        className="text-white mt-1"
        style={{ fontSize: 14, fontWeight: '600', letterSpacing: -0.3 }}
      >
        {description}
      </Text>

      <View className="flex-row items-baseline mt-2.5">
        <Text className="text-white" style={{ fontSize: 17, fontWeight: '700' }}>
          ₩
        </Text>
        <Text
          className="text-white"
          style={{ fontSize: 30, fontWeight: '800', letterSpacing: -1.2 }}
        >
          {amount}
        </Text>
      </View>

      <View
        style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.25)', marginTop: 10 }}
      />

      <View className="flex-row justify-between mt-2.5">
        {stats.map((stat) => (
          <View key={stat.label}>
            <Text
              className="text-white"
              style={{ fontSize: 10, letterSpacing: 0.4, opacity: 0.8 }}
            >
              {stat.label}
            </Text>
            <Text
              className="text-white mt-0.5"
              style={{ fontSize: 15, fontWeight: '800', letterSpacing: -0.3 }}
            >
              {stat.value}
            </Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}
