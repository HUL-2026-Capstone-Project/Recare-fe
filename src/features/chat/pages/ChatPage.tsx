import { useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { useChatStore } from '@/store/chatStore';
import { ChatHeader } from '../components/ChatHeader';
import { MessageBubble } from '../components/MessageList';
import { ChatInputBar } from '../components/ChatInputBar';
import { CHAT_STATUS } from '../mocks';

export default function ChatScreen() {
  const { top } = useSafeAreaInsets();
  const messages = useChatStore((state) => state.messages);
  const showQuickReplies = useChatStore((state) => state.showQuickReplies);
  const send = useChatStore((state) => state.send);
  const scrollRef = useRef<ScrollView>(null);

  const visibleMessages = showQuickReplies ? messages : messages.filter((m) => m.type !== 'quickReplies');

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <ChatHeader status={CHAT_STATUS} />

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 20, gap: 16 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {visibleMessages.map((message) => (
            <MessageBubble key={message.id} message={message} onQuickReply={send} />
          ))}
        </ScrollView>

        <ChatInputBar />
      </KeyboardAvoidingView>
    </View>
  );
}
