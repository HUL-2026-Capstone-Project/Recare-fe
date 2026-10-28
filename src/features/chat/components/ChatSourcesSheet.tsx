import { useEffect, useRef } from 'react';
import { Animated, Modal, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import type { SourceRef } from '../sourceFormat';
import { CloseIcon } from './icons';

// 칩을 누르면 열리는 "참고 자료 N건" 시트. Modal이라 헤더와 하단 탭까지 화면 전체를 어둡게 덮는다.
// X와 뒤로가기로만 닫힌다(바깥 터치로는 닫지 않는다).
export function ChatSourcesSheet({ refs, onClose }: { refs: SourceRef[]; onClose: () => void }) {
  const { bottom } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const slide = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    Animated.timing(slide, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  }, [slide]);

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25,31,40,0.55)' }}>
        <Animated.View
          style={{
            transform: [{ translateY: slide }],
            maxHeight: height - 52,
            backgroundColor: colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: Math.max(bottom, 34),
          }}
        >
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginTop: 12 }} />
          <View className="flex-row items-center justify-between" style={{ height: 52, paddingLeft: 20, paddingRight: 10 }}>
            <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text1, letterSpacing: -0.3 }}>참고 자료 {refs.length}건</Text>
            <Pressable onPress={onClose} accessibilityLabel="닫기" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
              <CloseIcon size={22} />
            </Pressable>
          </View>
          <ScrollView style={{ flexShrink: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {refs.map((ref, index) => (
              <View key={ref.key} style={{ paddingVertical: 14, borderBottomWidth: index < refs.length - 1 ? 1 : 0, borderBottomColor: colors.input }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text1, letterSpacing: -0.3 }}>{ref.label}</Text>
                {!!ref.title && (
                  <Text style={{ fontSize: 13, fontWeight: '500', color: colors.text2, letterSpacing: -0.3, marginTop: 2 }}>{ref.title}</Text>
                )}
              </View>
            ))}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}
