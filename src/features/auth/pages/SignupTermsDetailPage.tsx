import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { TERMS_ITEMS } from '@/features/auth/constants/terms';
import { getTermsBody } from '@/features/auth/constants/termsContent';
import { useSignupStore } from '@/store/signupStore';

export default function SignupTermsDetailScreen() {
  const { top } = useSafeAreaInsets();
  const { index } = useLocalSearchParams<{ index: string }>();
  const itemIndex = Number(index);
  const item = TERMS_ITEMS[itemIndex];
  const body = item ? getTermsBody(item.termsType) : [];

  const handleAgree = () => {
    if (!item) {
      router.back();
      return;
    }
    const next = [...useSignupStore.getState().termsAgree];
    next[itemIndex] = true;
    useSignupStore.getState().setTermsAgree(next);
    router.back();
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: top }}>
      {/* NavBar */}
      <View className="h-[52px] px-3 flex-row items-center justify-between">
        <TouchableOpacity
          className="w-10 items-center justify-center"
          activeOpacity={0.7}
          onPress={() => router.back()}
        >
          <Image
            source={require('@/shared/assets/icons/chevron-left.png')}
            style={{ width: 24, height: 24 }}
          />
        </TouchableOpacity>
        <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
          {item?.title ?? '약관'}
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12 }}>
        <Text className="text-[12px] mb-4" style={{ color: colors.text3, letterSpacing: -0.2 }}>
          시행일 2026.01.01 · 버전 {item?.termsVersion ?? '1.0'}
        </Text>
        {body.map(([heading, text], i) => (
          <View key={heading} style={{ marginBottom: i === body.length - 1 ? 0 : 20 }}>
            <Text
              className="text-[14px] font-bold text-text1 mb-1.5"
              style={{ letterSpacing: -0.3 }}
            >
              {heading}
            </Text>
            <Text
              className="text-[13px] font-medium"
              style={{ color: colors.text2, letterSpacing: -0.3, lineHeight: 13 * 1.65 }}
            >
              {text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View
        className="bg-white"
        style={{ paddingTop: 12, paddingHorizontal: 20, paddingBottom: 16, borderTopWidth: 1, borderTopColor: colors.border }}
      >
        <TouchableOpacity
          className="h-[52px] w-full bg-primary rounded-xl items-center justify-center"
          activeOpacity={0.85}
          onPress={handleAgree}
        >
          <Text className="text-white text-base font-bold" style={{ letterSpacing: -0.3 }}>
            동의하고 돌아가기
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
