import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChatScreen() {
  const { top } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white items-center justify-center" style={{ paddingTop: top }}>
      <Text className="text-base font-bold text-text1">채팅</Text>
    </View>
  );
}
