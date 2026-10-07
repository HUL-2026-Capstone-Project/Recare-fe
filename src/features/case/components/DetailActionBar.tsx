import { Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import type { BottomAction } from '@/features/case/mocks';

export function DetailActionBar({ actions }: { actions: BottomAction[] }) {
  const [primaryAction, secondaryAction] = actions;

  return (
    // 시안 간격 그대로 재현 (좌 버튼 97px 고정 + 간격 42px, 의도된 정렬이 아니면 추후 수정)
    <View className="flex-row mt-3" style={{ gap: 42 }}>
      {primaryAction && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {}}
          className="items-center justify-center"
          style={{
            width: 97,
            height: 48,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: colors.primary,
          }}
        >
          <Text className="text-[14px] font-bold" style={{ color: colors.primary, letterSpacing: -0.3 }}>
            {primaryAction.label}
          </Text>
        </TouchableOpacity>
      )}
      {secondaryAction && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {}}
          className="flex-1 items-center justify-center"
          style={{ height: 48, borderRadius: 14, backgroundColor: colors.primary }}
        >
          <Text className="text-white text-[14px] font-bold" style={{ letterSpacing: -0.3 }}>
            {secondaryAction.label}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
