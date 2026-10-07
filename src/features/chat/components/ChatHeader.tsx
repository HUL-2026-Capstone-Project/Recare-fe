import { Text, TouchableOpacity, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { ChatbotAvatar, CloseIcon } from './icons';

export function ChatHeader({ status }: { status: string }) {
  return (
    <View
      className="flex-row items-center justify-between px-4"
      style={{ height: 56, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border }}
    >
      <View className="flex-row items-center" style={{ gap: 10 }}>
        <ChatbotAvatar size={36} />
        <View>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text1, letterSpacing: -0.3 }}>
            무엇을 도와드릴까요?
          </Text>
          <View className="flex-row items-center" style={{ gap: 4, marginTop: 2 }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.success }} />
            <Text style={{ fontSize: 11, fontWeight: '600', color: colors.success }}>Re:care AI · {status}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity activeOpacity={0.7} hitSlop={8} onPress={() => {}}>
        {/* 닫기 동작이 시안에 없어 스텁 처리 (TODO) */}
        <CloseIcon size={22} />
      </TouchableOpacity>
    </View>
  );
}
