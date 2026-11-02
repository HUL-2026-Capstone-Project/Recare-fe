import type { ReactNode } from 'react';
import { Pressable, Text } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { DocSpinner } from './DocSpinner';

type ButtonProps = { children: ReactNode; busy?: boolean; off?: boolean; onPress?: () => void };

export function BtnOutline({ children, busy, off, onPress }: ButtonProps) {
  return (
    <Pressable
      disabled={off || busy}
      onPress={onPress}
      className="flex-row items-center justify-center"
      style={{ flex: 1, height: 52, borderRadius: 12, backgroundColor: '#fff', borderWidth: 1.5, borderColor: colors.border, gap: 8, opacity: off ? 0.4 : 1 }}
    >
      {busy ? (
        <DocSpinner color={colors.primary} size={16} />
      ) : (
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text1, letterSpacing: -0.3 }}>{children}</Text>
      )}
    </Pressable>
  );
}

export function BtnPrimary({ children, busy, off, onPress }: ButtonProps) {
  return (
    <Pressable
      disabled={off || busy}
      onPress={onPress}
      className="flex-row items-center justify-center"
      style={{ flex: 1, height: 52, borderRadius: 12, backgroundColor: colors.primary, gap: 8, opacity: off ? 0.4 : 1 }}
    >
      {busy ? <DocSpinner size={16} /> : <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.3 }}>{children}</Text>}
    </Pressable>
  );
}

export function BtnDel({ off, onPress }: { off?: boolean; onPress?: () => void }) {
  return (
    <Pressable disabled={off} onPress={onPress} className="items-center justify-center" style={{ height: 44, opacity: off ? 0.4 : 1 }}>
      <Text style={{ fontSize: 14, fontWeight: '700', color: colors.danger, letterSpacing: -0.3 }}>삭제</Text>
    </Pressable>
  );
}
