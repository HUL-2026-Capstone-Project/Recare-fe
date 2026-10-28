import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { useChatStore } from '@/store/chatStore';
import { ChatHeader } from '../components/ChatHeader';
import { MessageBubble } from '../components/MessageList';
import { ChatInputBar } from '../components/ChatInputBar';
import { ChatSourcesSheet } from '../components/ChatSourcesSheet';
import type { SourceRef } from '../sourceFormat';
import { CHAT_STATUS } from '../mocks';

export default function ChatScreen() {
  const { top } = useSafeAreaInsets();
  const messages = useChatStore((state) => state.messages);
  const showQuickReplies = useChatStore((state) => state.showQuickReplies);
  const send = useChatStore((state) => state.send);
  const retry = useChatStore((state) => state.retry);
  const [sourceRefs, setSourceRefs] = useState<SourceRef[] | null>(null);
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
            <MessageBubble key={message.id} message={message} onQuickReply={send} onOpenSources={setSourceRefs} onRetry={retry} />
          ))}
        </ScrollView>

        <ChatInputBar />
      </KeyboardAvoidingView>

      {sourceRefs && <ChatSourcesSheet refs={sourceRefs} onClose={() => setSourceRefs(null)} />}
    </View>
  );
}
