import { useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { colors } from '@/shared/constants/colors';

type WithdrawModalProps = {
  visible: boolean;
  onClose: () => void;
  // 실패하면 reject한다. 성공하면 호출한 쪽이 세션을 정리하고 화면을 벗어난다.
  onConfirm: () => Promise<void>;
};

function WarningIcon() {
  return (
    <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
      <Path d="M13 3.8 L23.2 21.2 H2.8 Z" stroke={colors.danger} strokeWidth={1.6} strokeLinejoin="round" />
      <Path d="M13 10 V15" stroke={colors.danger} strokeWidth={1.6} strokeLinecap="round" />
      <Circle cx={13} cy={18.1} r={1} fill={colors.danger} />
    </Svg>
  );
}

function CheckBox({ checked }: { checked: boolean }) {
  return (
    <View
      style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: checked ? colors.primary : colors.surface,
        borderWidth: checked ? 0 : 1.5,
        borderColor: colors.text3,
      }}
    >
      <Svg width={14} height={14} viewBox="0 0 14 14" fill="none">
        <Path d="M3 7.3 L5.9 10.2 L11 4.4" stroke={checked ? '#fff' : colors.text3} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    </View>
  );
}

export function WithdrawModal({ visible, onClose, onConfirm }: WithdrawModalProps) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const cancel = () => {
    if (loading) return;
    setChecked(false);
    setFailed(false);
    onClose();
  };

  const confirm = async () => {
    if (!checked || loading) return;
    setFailed(false);
    setLoading(true);
    try {
      await onConfirm();
    } catch {
      setLoading(false);
      setFailed(true);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={cancel}>
      <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: 'rgba(25,31,40,0.55)' }}>
        <View className="w-full" style={{ backgroundColor: colors.surface, borderRadius: 20, paddingTop: 28, paddingHorizontal: 20, paddingBottom: 20 }}>
          <View className="items-center">
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: colors.chip.redBg, alignItems: 'center', justifyContent: 'center' }}>
              <WarningIcon />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text1, letterSpacing: -0.4, marginTop: 16 }}>정말 탈퇴하시겠어요?</Text>
            <Text className="text-center" style={{ fontSize: 13, fontWeight: '500', color: colors.text2, lineHeight: 13 * 1.5, marginTop: 8 }}>
              {'탈퇴하면 케이스와 휴업급여 계산 기록이 모두 삭제돼요.\n삭제된 정보는 복구할 수 없어요.'}
            </Text>
          </View>

          <Pressable
            accessibilityRole="checkbox"
            accessibilityState={{ checked, disabled: loading }}
            disabled={loading}
            onPress={() => setChecked((prev) => !prev)}
            className="flex-row items-center"
            style={{ minHeight: 44, gap: 10, marginTop: 16, opacity: loading ? 0.45 : 1 }}
          >
            <CheckBox checked={checked || loading} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text1 }}>위 내용을 확인했어요</Text>
          </Pressable>

          {failed && (
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.danger, marginTop: 8 }}>
              탈퇴하지 못했어요. 잠시 후 다시 시도해 주세요.
            </Text>
          )}

          <View className="flex-row" style={{ gap: 8, marginTop: failed ? 12 : 8 }}>
            <Pressable
              disabled={loading}
              onPress={cancel}
              style={{ flex: 1, height: 52, borderRadius: 12, backgroundColor: colors.input, alignItems: 'center', justifyContent: 'center', opacity: loading ? 0.5 : 1 }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text2 }}>취소</Text>
            </Pressable>
            <Pressable
              disabled={!checked || loading}
              onPress={confirm}
              className="flex-row"
              style={{ flex: 1, height: 52, borderRadius: 12, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', gap: 8, opacity: loading ? 0.6 : checked ? 1 : 0.35 }}
            >
              {loading && (
                <View style={{ width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
                  <ActivityIndicator size="small" color="#fff" style={{ transform: [{ scale: 0.8 }] }} />
                </View>
              )}
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>{loading ? '탈퇴 중...' : '탈퇴하기'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
