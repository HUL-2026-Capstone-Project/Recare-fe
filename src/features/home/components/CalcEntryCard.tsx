import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { ChevronRightGray } from '@/features/my/components/icons';
import { CALC_ENTRY_DESC, CALC_ENTRY_TITLE } from '../constants';
import { cardShadow } from './Card';
import { CalculatorIcon } from './icons';

// 시안 A. NativeWind는 className이 있는 요소의 style 함수를 버리므로(react-native-css-interop의 interop가 inline style을 객체로만 합침),
// 바깥 Pressable에는 시각 스타일을 주지 않고 눌림 상태(useState)와 안쪽 View 하나가 카드 면 전부를 가진다.
// 테두리 없이 홈 카드와 같은 그림자(Card의 cardShadow)를 쓴다(시안 A와 의도적으로 다름). 눌려도 그림자는 유지한다. ripple, 투명도 변경은 쓰지 않는다. 높이는 고정하지 않고 minHeight 60만 둔다.
const card = {
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: 60,
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderRadius: 16,
  backgroundColor: colors.surface,
  ...cardShadow,
} as const;

const styles = StyleSheet.create({
  card,
  cardPressed: { ...card, backgroundColor: colors.input },
  iconBox: {
    width: 36,
    height: 36,
    flexShrink: 0,
    marginRight: 12,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textArea: { flex: 1, minWidth: 0 },
  title: { fontSize: 14, fontWeight: '700', lineHeight: 20, color: colors.text1, letterSpacing: -0.3 },
  desc: { fontSize: 12, fontWeight: '500', lineHeight: 16, color: colors.text2, marginTop: 2, letterSpacing: -0.2 },
  arrow: { flexShrink: 0, marginLeft: 12 },
});

export function CalcEntryCard() {
  const [pressed, setPressed] = useState(false);

  return (
    <Pressable
      onPress={() => router.push('/calculator')}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      accessibilityRole="button"
      accessibilityLabel={`${CALC_ENTRY_TITLE}, ${CALC_ENTRY_DESC}`}
    >
      <View style={pressed ? styles.cardPressed : styles.card}>
        <View style={styles.iconBox}>
          <CalculatorIcon size={20} />
        </View>
        <View style={styles.textArea}>
          <Text style={styles.title}>{CALC_ENTRY_TITLE}</Text>
          <Text style={styles.desc}>{CALC_ENTRY_DESC}</Text>
        </View>
        <View style={styles.arrow}>
          <ChevronRightGray size={16} />
        </View>
      </View>
    </Pressable>
  );
}
