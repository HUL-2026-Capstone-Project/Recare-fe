import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { ChatHeader } from '../components/ChatHeader';
import { MessageBubble } from '../components/MessageList';
import { ChatInputBar } from '../components/ChatInputBar';
import { chatMock } from '../mocks';

export default function ChatScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1" style={{ backgroundColor: colors.bg, paddingTop: top }}>
      <ChatHeader status={chatMock.status} />

      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 20, gap: 16 }}
        >
          {chatMock.messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </ScrollView>

        <ChatInputBar />
      </KeyboardAvoidingView>
    </View>
  );
}
