import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Animated, Modal, Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { CloseIcon } from '@/features/map/components/icons';
import { Chip } from './CaseSectionParts';

type DocSheetProps = {
  title: string;
  chip?: { label: string; bg: string; fg: string };
  // true면 닫기(X)가 opacity 0.4로 눌리지 않고 뒤로가기도 막힌다(업로드 중).
  lock?: boolean;
  onClose: () => void;
  children: ReactNode;
};

// 시안의 DSheet: 오버레이 rgba(25,31,40,0.55), 위쪽 반지름 24, 손잡이 40×4, 헤더 52, 본문 좌우 20, 아래 여백 34(안전영역 포함).
// 서류 시트만의 모양(제목 옆 칩, X만 잠김, 하단 버튼 없음)이라 FormSheet와 별도로 만든다. 열림 애니메이션은 FormSheet와 같다.
export function DocSheet({ title, chip, lock, onClose, children }: DocSheetProps) {
  const { bottom } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const slide = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    slide.setValue(600);
    Animated.timing(slide, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  }, [slide]);

  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => !lock && onClose()}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25,31,40,0.55)' }}>
        <Animated.View
          style={{
            transform: [{ translateY: slide }],
            maxHeight: height * 0.8,
            backgroundColor: colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: Math.max(bottom, 34),
          }}
        >
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginTop: 12 }} />
          <View className="flex-row items-center justify-between" style={{ height: 52, paddingLeft: 20, paddingRight: 10 }}>
            <View className="flex-row items-center" style={{ gap: 8, flexShrink: 1 }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text1, letterSpacing: -0.3 }}>{title}</Text>
              {chip && <Chip label={chip.label} bg={chip.bg} fg={chip.fg} />}
            </View>
            <Pressable
              disabled={lock}
              onPress={onClose}
              accessibilityLabel="닫기"
              style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', opacity: lock ? 0.4 : 1 }}
            >
              <CloseIcon size={22} />
            </Pressable>
          </View>
          <View style={{ paddingHorizontal: 20, flexShrink: 1 }}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}
