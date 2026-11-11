import { Modal, Pressable, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';

export function TodoDeleteConfirm({ deleting, onCancel, onConfirm }: { deleting: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => !deleting && onCancel()}>
      <View className="flex-1 items-center justify-center" style={{ paddingHorizontal: 24, backgroundColor: 'rgba(25,31,40,0.55)' }}>
        <View className="w-full" style={{ backgroundColor: colors.surface, borderRadius: 20, paddingTop: 28, paddingHorizontal: 20, paddingBottom: 20 }}>
          <Text className="text-center" style={{ fontSize: 18, fontWeight: '800', color: colors.text1, letterSpacing: -0.4 }}>
            할 일을 삭제할까요?
          </Text>
          <Text className="text-center" style={{ fontSize: 13, fontWeight: '500', color: colors.text2, letterSpacing: -0.3, marginTop: 8 }}>
            삭제하면 되돌릴 수 없어요.
          </Text>
          <View className="flex-row" style={{ gap: 8, marginTop: 24 }}>
            <Pressable
              disabled={deleting}
              onPress={onCancel}
              style={{ flex: 1, height: 52, borderRadius: 12, backgroundColor: colors.input, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text1 }}>취소</Text>
            </Pressable>
            <Pressable
              disabled={deleting}
              onPress={onConfirm}
              style={{ flex: 1, height: 52, borderRadius: 12, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', opacity: deleting ? 0.6 : 1 }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>삭제하기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
