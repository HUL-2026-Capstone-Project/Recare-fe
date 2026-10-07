import { Pressable, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import type { ChatMessage, ChatQuickReply } from '../mocks';
import { ChatbotAvatar } from './icons';

function DateDivider({ text }: { text: string }) {
  return (
    <View className="items-center">
      <Text
        style={{
          fontSize: 11,
          fontWeight: '500',
          color: colors.text3,
          backgroundColor: colors.surface,
          paddingHorizontal: 10,
          paddingVertical: 4,
          borderRadius: 50,
          letterSpacing: -0.2,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

function BotMessage({ text }: { text: string }) {
  return (
    <View className="flex-row items-end" style={{ gap: 8 }}>
      <ChatbotAvatar size={32} />
      <View
        style={{
          maxWidth: '78%',
          backgroundColor: colors.primary,
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 16,
          borderBottomLeftRadius: 4,
        }}
      >
        <Text style={{ fontSize: 14, lineHeight: 21, letterSpacing: -0.3, fontWeight: '500', color: '#fff' }}>
          {text}
        </Text>
      </View>
    </View>
  );
}

function QuickReplies({ items }: { items: ChatQuickReply[] }) {
  return (
    <View style={{ gap: 8, alignItems: 'flex-start', paddingLeft: 40 }}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          // 빠른 답변 전송 동작이 시안에 없어 스텁 처리 (TODO)
          onPress={() => {}}
          style={{
            height: 40,
            paddingHorizontal: 16,
            borderRadius: 50,
            justifyContent: 'center',
            backgroundColor: item.primary ? colors.primary : colors.surface,
            borderWidth: item.primary ? 0 : 1.5,
            borderColor: colors.primary,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              letterSpacing: -0.3,
              color: item.primary ? '#fff' : colors.primary,
            }}
          >
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function UserMessage({ text }: { text: string }) {
  return (
    <View className="flex-row justify-end">
      <View
        style={{
          maxWidth: '70%',
          backgroundColor: colors.surface,
          paddingVertical: 12,
          paddingHorizontal: 14,
          borderRadius: 16,
          borderBottomRightRadius: 4,
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text style={{ fontSize: 14, lineHeight: 21, letterSpacing: -0.3, fontWeight: '500', color: colors.text1 }}>
          {text}
        </Text>
      </View>
    </View>
  );
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  switch (message.type) {
    case 'date':
      return <DateDivider text={message.text} />;
    case 'bot':
      return <BotMessage text={message.text} />;
    case 'quickReplies':
      return <QuickReplies items={message.items} />;
    case 'user':
      return <UserMessage text={message.text} />;
  }
}
