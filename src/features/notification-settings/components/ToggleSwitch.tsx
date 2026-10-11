import { Pressable, View } from 'react-native';

import { colors } from '@/shared/constants/colors';

export function ToggleSwitch({
  on,
  disabled = false,
  onToggle,
}: {
  on: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  return (
    <Pressable
      onPress={disabled ? undefined : onToggle}
      accessibilityRole="switch"
      accessibilityState={{ checked: on, disabled }}
      style={{
        width: 48,
        height: 28,
        borderRadius: 14,
        backgroundColor: on ? colors.primary : '#D1D6DB',
        opacity: disabled ? 0.4 : 1,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: 2,
          left: on ? 22 : 2,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 3,
          shadowOffset: { width: 0, height: 1 },
          elevation: 2,
        }}
      />
    </Pressable>
  );
}
