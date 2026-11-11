import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';

type Props = {
  title: string;
  agreeing: boolean;
  failed: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

// 바깥을 눌러도 닫히지 않는다. 처리 중에는 뒤로가기도 막는다.
export function AgreeConfirmModal({ title, agreeing, failed, onCancel, onConfirm }: Props) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={() => !agreeing && onCancel()}>
      <View className="flex-1 items-center justify-center" style={{ paddingHorizontal: 24, backgroundColor: 'rgba(25,31,40,0.55)' }}>
        <View className="w-full" style={{ backgroundColor: colors.surface, borderRadius: 20, paddingTop: 28, paddingHorizontal: 20, paddingBottom: 20 }}>
          <Text className="text-center" style={{ fontSize: 18, fontWeight: '800', color: colors.text1, letterSpacing: -0.4 }}>
            {title}
          </Text>
          <Text className="text-center" style={{ fontSize: 13, fontWeight: '500', color: colors.text2, letterSpacing: -0.3, marginTop: 8 }}>
            동의한 뒤에는 앱에서 철회할 수 없어요.
          </Text>
          {failed && (
            <Text className="text-center" style={{ fontSize: 13, lineHeight: 13 * 1.5, fontWeight: '600', color: colors.danger, letterSpacing: -0.3, marginTop: 24 }}>
              동의하지 못했어요. 잠시 후 다시 시도해 주세요.
            </Text>
          )}
          <View className="flex-row" style={{ gap: 8, marginTop: failed ? 12 : 24 }}>
            <Pressable
              disabled={agreeing}
              onPress={onCancel}
              style={{ flex: 1, height: 52, borderRadius: 12, backgroundColor: colors.input, alignItems: 'center', justifyContent: 'center', opacity: agreeing ? 0.6 : 1 }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text1 }}>취소</Text>
            </Pressable>
            <Pressable
              disabled={agreeing}
              onPress={onConfirm}
              className="flex-row"
              style={{ flex: 1, height: 52, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', gap: 8, opacity: agreeing ? 0.6 : 1 }}
            >
              {agreeing && <ActivityIndicator size="small" color="#fff" style={{ transform: [{ scale: 0.8 }] }} />}
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>{agreeing ? '처리 중...' : '동의하기'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
