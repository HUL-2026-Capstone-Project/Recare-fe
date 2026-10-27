import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ActivityIndicator, Animated, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { CloseIcon } from '@/features/map/components/icons';

const SHEET_TOP_GAP = 52;
const KEYBOARD_MAX_HEIGHT = 540;

type FormSheetProps = {
  visible: boolean;
  title: string;
  submitLabel: string;
  canSubmit: boolean;
  saving: boolean;
  // 값이 있으면 버튼 바로 위에 보이는 저장 실패 안내
  failureMessage: string | null;
  onClose: () => void;
  onSubmit: () => void;
  children: ReactNode;
};

function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', () => setVisible(true));
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => setVisible(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return visible;
}

// 단계·할 일·상태 변경이 같이 쓰는 바텀시트. 바깥을 눌러도 닫히지 않고, X와 뒤로가기로만 닫히며 저장 중에는 둘 다 막는다.
// 안의 상태는 열릴 때마다 새로 마운트되도록 visible일 때만 children을 그린다.
export function FormSheet({ visible, title, submitLabel, canSubmit, saving, failureMessage, onClose, onSubmit, children }: FormSheetProps) {
  const { bottom } = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const keyboardVisible = useKeyboardVisible();
  const slide = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (!visible) return;
    slide.setValue(600);
    Animated.timing(slide, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  }, [visible, slide]);

  const close = () => {
    if (!saving) onClose();
  };
  const maxHeight = keyboardVisible ? Math.min(KEYBOARD_MAX_HEIGHT, height - SHEET_TOP_GAP) : height - SHEET_TOP_GAP;
  const disabled = !canSubmit || saving;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      {visible && (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25,31,40,0.55)' }}>
          <Animated.View
            style={{
              transform: [{ translateY: slide }],
              maxHeight,
              backgroundColor: colors.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              overflow: 'hidden',
            }}
          >
            <View pointerEvents={saving ? 'none' : 'auto'} style={{ opacity: saving ? 0.5 : 1 }}>
              <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginTop: 12 }} />
              <View className="flex-row items-center justify-between" style={{ height: 52, paddingLeft: 20, paddingRight: 10 }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text1, letterSpacing: -0.3 }}>{title}</Text>
                <Pressable onPress={close} accessibilityLabel="닫기" style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}>
                  <CloseIcon size={22} />
                </Pressable>
              </View>
            </View>

            <ScrollView
              style={{ flexShrink: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              pointerEvents={saving ? 'none' : 'auto'}
              contentContainerStyle={{ paddingTop: 4, paddingHorizontal: 20, paddingBottom: 8, opacity: saving ? 0.5 : 1 }}
            >
              {children}
            </ScrollView>

            <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: keyboardVisible ? 12 : Math.max(bottom, 34) }}>
              {failureMessage && (
                <Text style={{ fontSize: 13, lineHeight: 13 * 1.5, fontWeight: '600', color: colors.danger, letterSpacing: -0.3, marginBottom: 10 }}>{failureMessage}</Text>
              )}
              <Pressable
                disabled={disabled}
                onPress={onSubmit}
                className="flex-row items-center justify-center"
                style={{ height: 52, borderRadius: 12, backgroundColor: canSubmit ? colors.primary : colors.primaryDisabled, gap: 8, opacity: saving ? 0.6 : 1 }}
              >
                {saving && <ActivityIndicator size="small" color="#fff" style={{ transform: [{ scale: 0.8 }] }} />}
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.3 }}>{saving ? '저장 중...' : submitLabel}</Text>
              </Pressable>
            </View>
          </Animated.View>
        </KeyboardAvoidingView>
      )}
    </Modal>
  );
}
