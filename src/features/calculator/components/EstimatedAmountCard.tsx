import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors } from '@/shared/constants/colors';

type EstimatedAmountCardProps = {
  name: string;
  amount: string;
  ratioLabel: string;
};

export function EstimatedAmountCard({ name, amount, ratioLabel }: EstimatedAmountCardProps) {
  return (
    <LinearGradient
      colors={[colors.primaryDark, colors.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        borderRadius: 18,
        paddingVertical: 16,
        paddingHorizontal: 18,
        overflow: 'hidden',
        marginBottom: 12,
      }}
    >
      <View
        style={{ position: 'absolute', right: -60, top: -60, width: 200, height: 200, opacity: 0.1 }}
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: '#fff',
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 40,
            left: 40,
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 2,
            borderColor: '#fff',
          }}
        />
      </View>

      <Text className="text-white" style={{ fontSize: 11, fontWeight: '700', letterSpacing: 1.2, opacity: 0.8 }}>
        ESTIMATED AMOUNT
      </Text>
      <Text
        className="text-white mt-1.5"
        style={{ fontSize: 14, fontWeight: '600', letterSpacing: -0.3, opacity: 0.95 }}
      >
        {name}님의 예상 휴업급여 보상금액이에요!
      </Text>
      <View className="flex-row items-baseline mt-3">
        <Text className="text-white" style={{ fontSize: 18, fontWeight: '700', marginRight: 4, opacity: 0.9 }}>
          ₩
        </Text>
        <Text className="text-white" style={{ fontSize: 32, fontWeight: '800', letterSpacing: -1.2, lineHeight: 32 }}>
          {amount}
        </Text>
      </View>
      <Text
        className="text-white mt-1.5"
        style={{ fontSize: 12, fontWeight: '400', letterSpacing: -0.2, opacity: 0.85 }}
      >
        {ratioLabel}
      </Text>
    </LinearGradient>
  );
}
