import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { useChatStore } from '@/store/chatStore';
import { PlusIcon, SendButtonIcon } from './icons';

export function ChatInputBar() {
  const [value, setValue] = useState('');
  const send = useChatStore((state) => state.send);
  const isStreaming = useChatStore((state) => state.isStreaming);

  const handleSend = () => {
    if (isStreaming || !value.trim()) return;
    const question = value;
    setValue('');
    send(question);
  };

  return (
    <View
      className="flex-row items-center px-4"
      style={{ gap: 8, paddingTop: 10, paddingBottom: 14, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}
    >
      <Pressable
        // 첨부 동작이 시안에 없어 스텁 처리 (TODO)
        onPress={() => {}}
        style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: colors.input, alignItems: 'center', justifyContent: 'center' }}
      >
        <PlusIcon size={18} />
      </Pressable>

      <TextInput
        value={value}
        onChangeText={setValue}
        placeholder="메시지 입력..."
        placeholderTextColor={colors.text3}
        style={{
          flex: 1,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.input,
          paddingHorizontal: 16,
          fontSize: 14,
          color: colors.text1,
          letterSpacing: -0.3,
        }}
      />

      {/* 답변을 받는 동안에는 전송만 막는다(입력은 계속 가능). */}
      <Pressable
        onPress={handleSend}
        disabled={isStreaming}
        style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: isStreaming ? colors.primaryDisabled : colors.primary, alignItems: 'center', justifyContent: 'center' }}
      >
        <SendButtonIcon size={18} />
      </Pressable>
    </View>
  );
}
