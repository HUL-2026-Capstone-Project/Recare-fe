import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';

// bottom을 주면 화면 아래에서 그 값만큼 띄우고(안전영역 별도 가산 없음), 없으면 기존처럼 안전영역 + 24다.
export function ActionToast({ message, bottom: fixedBottom }: { message: string | null; bottom?: number }) {
  const { bottom } = useSafeAreaInsets();
  if (!message) return null;

  return (
    <View pointerEvents="none" className="absolute left-0 right-0 items-center" style={{ bottom: fixedBottom ?? bottom + 24 }}>
      <View
        className="justify-center"
        style={{
          minHeight: 44,
          maxWidth: '100%',
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
