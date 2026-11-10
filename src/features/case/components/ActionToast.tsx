import { Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';

// bottom을 주면 화면 아래에서 그 값만큼 띄우고(안전영역 별도 가산 없음), 없으면 기존처럼 안전영역 + 24다.
// sideMargin을 주면 토스트 최대 너비가 화면 너비에서 좌우 그 값씩 뺀 값이 되어 긴 문구는 줄바꿈된다(기본 0은 기존과 같다).
export function ActionToast({ message, bottom: fixedBottom, sideMargin = 0 }: { message: string | null; bottom?: number; sideMargin?: number }) {
  const { bottom } = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  if (!message) return null;

  return (
    <View pointerEvents="none" className="absolute left-0 right-0 items-center" style={{ bottom: fixedBottom ?? bottom + 24 }}>
      <View
        className="justify-center"
        style={{
          minHeight: 44,
          maxWidth: sideMargin > 0 ? width - sideMargin * 2 : '100%',
          paddingHorizontal: 20,
          borderRadius: 22,
          backgroundColor: colors.text1,
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 24,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8,
        }}
      >
        <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff', letterSpacing: -0.3 }}>{message}</Text>
      </View>
    </View>
  );
}
