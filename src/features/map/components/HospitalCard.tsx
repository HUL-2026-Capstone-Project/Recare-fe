import { Pressable, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import type { Hospital } from '../mocks';
import { PhoneIcon } from './icons';

export function HospitalCard({
  hospital,
  active,
  onPress,
}: {
  hospital: Hospital;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 260,
        borderRadius: 14,
        padding: 14,
        backgroundColor: active ? colors.primaryLight : colors.surface,
        borderWidth: active ? 1.5 : 1,
        borderColor: active ? colors.primary : colors.border,
      }}
    >
      <View className="flex-row justify-between items-start" style={{ marginBottom: 4 }}>
        <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 50, backgroundColor: colors.primaryLight }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: colors.primary }}>지정병원</Text>
        </View>
        <View
          style={{
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 50,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <Text style={{ fontSize: 11, fontWeight: '700', color: colors.primary, letterSpacing: -0.2 }}>
            {hospital.distance}
          </Text>
        </View>
      </View>

      <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text1, letterSpacing: -0.3, marginTop: 6 }}>
        {hospital.name}
      </Text>
      <Text style={{ fontSize: 11, color: colors.text2, letterSpacing: -0.2, lineHeight: 15.4, marginTop: 4 }}>
        {hospital.address}
      </Text>

      <View
        className="flex-row"
        style={{
          gap: 8,
          marginTop: 12,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: active ? 'rgba(49,130,246,0.15)' : colors.border,
        }}
      >
        <Pressable
          // 전화 연결이 시안에 없어 스텁 처리 (TODO)
          onPress={() => {}}
          className="flex-1 flex-row items-center justify-center"
          style={{ height: 32, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: 8, gap: 4 }}
        >
          <PhoneIcon size={12} />
          <Text style={{ fontSize: 12, fontWeight: '700', color: colors.text1, letterSpacing: -0.2 }}>전화</Text>
        </Pressable>
        <Pressable
          // 길찾기(지도 앱 연동)가 시안에 없어 스텁 처리 (TODO)
          onPress={() => {}}
          className="flex-1 items-center justify-center"
          style={{ height: 32, backgroundColor: colors.primary, borderRadius: 8 }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff', letterSpacing: -0.2 }}>길찾기</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}
