import { Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { EmptyStateIcon } from '@/features/case/components/EmptyStateIcon';
import { RegisterCaseButton } from '@/features/case/components/RegisterCaseButton';
import { Card } from './Card';

export function CaseEmptyCard({ title, description }: { title: string; description: string }) {
  return (
    <Card className="p-5 items-center" style={{ marginBottom: 14 }}>
      <EmptyStateIcon size={52} />
      <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text1, letterSpacing: -0.3, marginTop: 14 }}>{title}</Text>
      <Text
        className="text-center"
        style={{ fontSize: 13, fontWeight: '500', color: colors.text2, letterSpacing: -0.3, lineHeight: 13 * 1.5, maxWidth: 260, marginTop: 6 }}
      >
        {description}
      </Text>
      <View style={{ marginTop: 16 }}>
        <RegisterCaseButton />
      </View>
    </Card>
  );
}
