import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

import { colors } from '@/shared/constants/colors';
import { CaseDetailHeader } from '@/features/case/components/CaseDetailHeader';
import { TERMS_ITEMS } from '@/features/auth/constants/terms';
import { getTermsBody } from '@/features/auth/constants/termsContent';

// 읽기 전용 약관 상세(가입 흐름 밖). 가입용 SignupTermsDetailPage와 같은 약관 상수·본문(getTermsBody)을 쓰고, 동의 버튼은 없다.
export default function TermsDetailScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { type, title } = useLocalSearchParams<{ type?: string; title?: string }>();
  const item = TERMS_ITEMS.find((i) => i.termsType === type);
  const body = getTermsBody(type ?? '');

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: top }}>
      <CaseDetailHeader title={title ?? item?.title ?? '약관'} />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: Math.max(bottom, 16) }}
      >
        <Text style={{ fontSize: 12, fontWeight: '400', color: colors.text3, letterSpacing: -0.2, marginBottom: 16 }}>
          버전 {(item ?? TERMS_ITEMS[0]).termsVersion}
        </Text>
        {body.map(([heading, text], i) => (
          <View key={heading} style={{ marginBottom: i === body.length - 1 ? 0 : 20 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text1, letterSpacing: -0.3, marginBottom: 6 }}>{heading}</Text>
            <Text style={{ fontSize: 13, fontWeight: '500', color: colors.text2, letterSpacing: -0.3, lineHeight: 13 * 1.65 }}>{text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
