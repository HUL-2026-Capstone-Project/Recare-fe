import { useState } from 'react';
import { Pressable, TextInput, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { PlusIcon, SendButtonIcon } from './icons';

export function ChatInputBar() {
  const [value, setValue] = useState('');

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

      <Pressable
        // 전송 동작(AI/API 연동)이 범위 밖이라 스텁 처리 (TODO)
        onPress={() => {}}
        style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}
      >
        <SendButtonIcon size={18} />
      </Pressable>
    </View>
  );
}
