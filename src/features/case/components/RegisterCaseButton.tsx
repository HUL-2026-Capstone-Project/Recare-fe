import { Image, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export const openCaseRegister = () => router.push({ pathname: '/case-form', params: { mode: 'create' } });

export function RegisterCaseButton({ onPress = openCaseRegister }: { onPress?: () => void }) {
  return (
    <TouchableOpacity
      className="h-9 px-3.5 rounded-full bg-primary flex-row items-center gap-1"
      activeOpacity={0.85}
      onPress={onPress}
    >
      <Image source={require('@/shared/assets/icons/plus-white.png')} style={{ width: 14, height: 14, tintColor: '#fff' }} />
      <Text className="text-white text-[13px] font-bold" style={{ letterSpacing: -0.3 }}>
        케이스 등록
      </Text>
    </TouchableOpacity>
  );
}
