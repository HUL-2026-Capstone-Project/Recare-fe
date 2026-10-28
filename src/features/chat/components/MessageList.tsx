import { useEffect, useRef } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import type { ChatMessage, ChatQuickReply } from '../mocks';
import { toSourceRefs } from '../sourceFormat';
import type { SourceRef } from '../sourceFormat';
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

function PendingDot({ delay, color }: { delay: number; color: string }) {
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

  return <Animated.View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: color, opacity }} />;
}

// 질문 직후: 말풍선 없이 서버 상태 문구와 점 3개
function StatusRow({ text }: { text: string }) {
  return (
    <View className="flex-row items-start" style={{ gap: 8 }}>
      <ChatbotAvatar size={32} />
      <View className="flex-row items-center" style={{ minHeight: 32, gap: 8, flexShrink: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '500', color: colors.text2, letterSpacing: -0.3, flexShrink: 1 }}>{text}</Text>
        <View className="flex-row" style={{ gap: 4 }}>
          <PendingDot delay={0} color={colors.text3} />
          <PendingDot delay={150} color={colors.text3} />
          <PendingDot delay={300} color={colors.text3} />
        </View>
      </View>
    </View>
  );
}

// AI 답변은 줄마다 별도 블록으로 그린다(줄 사이 간격 6).
function AnswerBubble({ lines }: { lines: string[] }) {
  return (
    <View
      style={{
        maxWidth: '78%',
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 16,
        borderBottomLeftRadius: 4,
        gap: 6,
      }}
    >
      {lines.map((line, index) => (
        <Text key={index} style={{ fontSize: 14, lineHeight: 21, letterSpacing: -0.3, fontWeight: '500', color: '#fff' }}>
          {line}
        </Text>
      ))}
    </View>
  );
}

function ErrorBox({ onRetry }: { onRetry: () => void }) {
  return (
    <View>
      <View style={{ maxWidth: '82%', alignSelf: 'flex-start', backgroundColor: colors.chip.redBg, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 14 }}>
        <Text style={{ fontSize: 13, lineHeight: 13 * 1.5, fontWeight: '600', color: colors.danger, letterSpacing: -0.3 }}>
          답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.
        </Text>
      </View>
      <Pressable onPress={onRetry} className="justify-center" style={{ height: 44, paddingHorizontal: 8, alignSelf: 'flex-start' }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.primary }}>다시 시도</Text>
      </Pressable>
    </View>
  );
}

function SourceChips({ refs, onOpen }: { refs: SourceRef[]; onOpen: () => void }) {
  return (
    <View className="flex-row" style={{ paddingLeft: 40, gap: 8 }}>
      <View className="justify-center" style={{ height: 32 }}>
        <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text2, letterSpacing: -0.2 }}>참고</Text>
      </View>
      <View className="flex-row flex-wrap" style={{ flex: 1, gap: 6 }}>
        {refs.map((ref) => (
          <Pressable
            key={ref.key}
            onPress={onOpen}
            hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            className="justify-center"
            style={{ height: 32, maxWidth: '100%', paddingHorizontal: 12, borderRadius: 16, backgroundColor: colors.primaryLight }}
          >
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 12, fontWeight: '600', color: colors.primary, letterSpacing: -0.2 }}>
              {ref.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

type AnswerMessageData = Extract<ChatMessage, { type: 'answer' }>;

function AnswerMessage({ message, onOpenSources, onRetry }: { message: AnswerMessageData; onOpenSources: (refs: SourceRef[]) => void; onRetry: () => void }) {
  if (message.phase === 'waiting') return <StatusRow text={message.statusText ?? ''} />;

  if (message.phase === 'error') {
    // 받은 조각이 있으면 말풍선 바로 아래에, 없으면 오류 박스만. 둘 다 아바타는 위쪽 정렬이다.
    return (
      <View className="flex-row items-start" style={{ gap: 8 }}>
        <ChatbotAvatar size={32} />
        <View style={{ flexShrink: 1 }}>
          {message.lines.length > 0 && <AnswerBubble lines={message.lines} />}
          <ErrorBox onRetry={onRetry} />
        </View>
      </View>
    );
  }

  const refs = message.phase === 'done' ? toSourceRefs(message.sources) : [];
  return (
    <View style={{ gap: 16 }}>
      <View className="flex-row items-end" style={{ gap: 8 }}>
        <ChatbotAvatar size={32} />
        <AnswerBubble lines={message.lines} />
      </View>
      {refs.length > 0 && <SourceChips refs={refs} onOpen={() => onOpenSources(refs)} />}
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
  onOpenSources,
  onRetry,
}: {
  message: ChatMessage;
  onQuickReply: (label: string) => void;
  onOpenSources: (refs: SourceRef[]) => void;
  onRetry: (answerId: string) => void;
}) {
  switch (message.type) {
    case 'date':
      return <DateDivider text={message.text} />;
    case 'bot':
      return <BotMessage text={message.text} />;
    case 'answer':
      return <AnswerMessage message={message} onOpenSources={onOpenSources} onRetry={() => onRetry(message.id)} />;
    case 'quickReplies':
      return <QuickReplies items={message.items} onSelect={onQuickReply} />;
    case 'user':
      return <UserMessage text={message.text} />;
  }
}
