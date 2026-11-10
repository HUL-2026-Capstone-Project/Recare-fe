import { Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { PulseIcon } from '@/features/diagnosis/components/DiagnosisIcons';
import { ChevronRightGray } from '@/features/my/components/icons';
import { Card } from './Card';

// 홈 Card는 radius 20이라 radius 16만 style로 덮어쓴다(그림자는 같다). 크기는 계산기 카드(CalcEntryCard)와 같게 맞췄다.
export function DiagEntryCard() {
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/diagnosis')}>
      <Card style={{ borderRadius: 16, minHeight: 60, paddingVertical: 10, paddingHorizontal: 12 }}>
        <View className="flex-row items-center" style={{ minHeight: 40, gap: 12 }}>
          <View className="items-center justify-center" style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.primaryLight }}>
            <PulseIcon />
          </View>
          <View className="flex-1">
            <Text style={{ fontSize: 14, fontWeight: '700', lineHeight: 20, color: colors.text1, letterSpacing: -0.3 }}>산재 자가진단</Text>
            <Text style={{ fontSize: 12, lineHeight: 16, color: colors.text2, marginTop: 2, letterSpacing: -0.2 }}>질문 4개로 내 상황을 확인해요</Text>
          </View>
          <ChevronRightGray size={16} />
        </View>
      </Card>
    </TouchableOpacity>
  );
}
