import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { CloseIcon } from '@/features/map/components/icons';
import { BackIcon, CheckIcon } from './DiagnosisIcons';

// 시안의 DgHead: 높이 52, 좌우 12, 44 / 가운데 / 44 세 칸. 뒤로가기와 닫기는 필요한 화면에서만 그린다.
export function DgHead({ title, onBack, onClose }: { title: string; onBack?: () => void; onClose?: () => void }) {
  return (
    <View className="flex-row items-center" style={{ height: 52, paddingHorizontal: 12, backgroundColor: '#fff' }}>
      <View style={{ width: 44, height: 44 }}>
        {onBack && (
          <Pressable onPress={onBack} accessibilityLabel="뒤로가기" className="items-center justify-center" style={{ width: 44, height: 44 }}>
            <BackIcon />
          </Pressable>
        )}
      </View>
      <Text className="flex-1 text-center" style={{ fontSize: 17, fontWeight: '700', color: colors.text1, letterSpacing: -0.3 }}>
        {title}
      </Text>
      <View style={{ width: 44, height: 44 }}>
        {onClose && (
          <Pressable onPress={onClose} accessibilityLabel="닫기" className="items-center justify-center" style={{ width: 44, height: 44 }}>
            <CloseIcon size={22} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

// 시안의 DgFoot: 위아래 12, 좌우 20. 아래쪽은 기기 하단 안전영역을 더한다.
export function DgFoot({ children }: { children: ReactNode }) {
  const { bottom } = useSafeAreaInsets();
  return <View style={{ paddingTop: 12, paddingHorizontal: 20, paddingBottom: 12 + bottom, backgroundColor: '#fff' }}>{children}</View>;
}

// 비활성은 배경만 #D6E6FE로 바뀌고 눌려도 동작하지 않는다.
export function DgBtn({ children, off, onPress }: { children: string; off?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      onPress={off ? undefined : onPress}
      className="items-center justify-center"
      style={{ width: '100%', height: 52, borderRadius: 12, backgroundColor: off ? colors.primaryDisabled : colors.primary }}
    >
      <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.3 }}>{children}</Text>
    </Pressable>
  );
}

export function DgTextBtn({ children, onPress }: { children: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} className="items-center justify-center" style={{ height: 44, marginTop: 4 }}>
      <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text2, letterSpacing: -0.3 }}>{children}</Text>
    </Pressable>
  );
}

export function Progress({ n, total = 4 }: { n: number; total?: number }) {
  return (
    <View style={{ height: 4, backgroundColor: colors.input }}>
      <View style={{ height: '100%', width: `${(n / total) * 100}%`, backgroundColor: colors.primary }} />
    </View>
  );
}

export function Choice({ title, sub, on, onPress }: { title: string; sub?: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center"
      style={{
        minHeight: 64,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        gap: 12,
        backgroundColor: on ? colors.primaryLight : '#fff',
        borderWidth: 1.5,
        borderColor: on ? colors.primary : colors.border,
      }}
    >
      <View className="flex-1">
        <Text style={{ fontSize: 15, fontWeight: on ? '700' : '600', color: on ? colors.primary : colors.text1, letterSpacing: -0.3 }}>{title}</Text>
        {!!sub && <Text style={{ fontSize: 12, fontWeight: '500', color: colors.text2, marginTop: 2, letterSpacing: -0.2 }}>{sub}</Text>}
      </View>
      {on && <CheckIcon />}
    </Pressable>
  );
}
