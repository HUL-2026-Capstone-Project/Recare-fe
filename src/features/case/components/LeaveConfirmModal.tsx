import { Modal, Pressable, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';

type LeaveConfirmModalProps = {
  visible: boolean;
  onCancel: () => void;
  onLeave: () => void;
};

export function LeaveConfirmModal({ visible, onCancel, onLeave }: LeaveConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: 'rgba(25,31,40,0.55)' }}>
        <View className="w-full" style={{ backgroundColor: colors.surface, borderRadius: 20, padding: 20 }}>
          <Text className="text-center" style={{ fontSize: 18, fontWeight: '800', color: colors.text1, letterSpacing: -0.4 }}>
            작성 중인 내용이 사라져요
          </Text>
          <Text className="text-center" style={{ fontSize: 13, color: colors.text2, letterSpacing: -0.3, marginTop: 8, lineHeight: 20 }}>
            지금 나가면 입력한 내용이 저장되지 않아요
          </Text>
          <View className="flex-row" style={{ gap: 8, marginTop: 20 }}>
            <Pressable
              onPress={onCancel}
              style={{ flex: 1, height: 52, borderRadius: 12, borderWidth: 1.5, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.primary, letterSpacing: -0.3 }}>취소</Text>
            </Pressable>
            <Pressable
              onPress={onLeave}
              style={{ flex: 1, height: 52, borderRadius: 12, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.3 }}>나가기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
