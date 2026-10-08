import { useEffect, useRef } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import type { Hospital } from '../mocks';
import { HospitalCard } from './HospitalCard';

const CARD_WIDTH = 260;
const CARD_GAP = 10;

export function MapBottomSheet({
  hospitals,
  radius,
  total,
  selectedId,
  onSelectCard,
}: {
  hospitals: Hospital[];
  radius: string;
  total: number;
  selectedId: string;
  onSelectCard: (id: string) => void;
}) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const index = hospitals.findIndex((h) => h.id === selectedId);
    if (index >= 0) {
      scrollRef.current?.scrollTo({ x: index * (CARD_WIDTH + CARD_GAP), animated: true });
    }
  }, [selectedId, hospitals]);

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 12,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 24,
        shadowOffset: { width: 0, height: -4 },
        elevation: 8,
      }}
    >
      <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 14 }} />

      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text1, letterSpacing: -0.3 }}>
          인근 산재 지정 병원 목록이에요!
        </Text>
        <Text style={{ fontSize: 12, color: colors.text2, letterSpacing: -0.2, marginTop: 4 }}>
          현재 위치 기준 {radius} 이내 · {total}곳
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: CARD_GAP, paddingHorizontal: 20, paddingBottom: 18 }}
      >
        {hospitals.map((hospital) => (
          <HospitalCard
            key={hospital.id}
            hospital={hospital}
            active={hospital.id === selectedId}
            onPress={() => onSelectCard(hospital.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
