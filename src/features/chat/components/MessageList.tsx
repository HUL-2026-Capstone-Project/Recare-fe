import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

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

function PendingDot({ delay }: { delay: number }) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(opacity, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 300, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [delay, opacity]);

  return <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#fff', opacity }} />;
}

function PendingMessage() {
  return (
    <View className="flex-row items-end" style={{ gap: 8 }}>
      <ChatbotAvatar size={32} />
      <View
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 14,
          paddingHorizontal: 16,
          borderRadius: 16,
          borderBottomLeftRadius: 4,
          flexDirection: 'row',
          gap: 4,
        }}
      >
        <PendingDot delay={0} />
        <PendingDot delay={150} />
        <PendingDot delay={300} />
      </View>
    </View>
  );
}

function QuickReplies({ items, onSelect }: { items: ChatQuickReply[]; onSelect: (label: string) => void }) {
  return (
    <View style={{ gap: 8, alignItems: 'flex-start', paddingLeft: 40 }}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={() => onSelect(item.label)}
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

export function MessageBubble({
  message,
  onQuickReply,
}: {
  message: ChatMessage;
  onQuickReply: (label: string) => void;
}) {
  switch (message.type) {
    case 'date':
      return <DateDivider text={message.text} />;
    case 'bot':
      return <BotMessage text={message.text} />;
    case 'pending':
      return <PendingMessage />;
    case 'quickReplies':
      return <QuickReplies items={message.items} onSelect={onQuickReply} />;
    case 'user':
      return <UserMessage text={message.text} />;
  }
}
