import { Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { Card } from '@/features/home/components/Card';
import type { ProfileGroup } from '../mocks';
import { NONE_LABEL } from '../mocks';

export function ProfileInfoGroup({ group }: { group: ProfileGroup }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text2, letterSpacing: -0.2, marginHorizontal: 4, marginBottom: 8 }}>
        {group.title}
      </Text>
      <Card style={{ padding: 0 }}>
        {group.rows.map((row, index) => (
          <View
            key={row.label}
            className="flex-row justify-between"
            style={{
              alignItems: row.wrap ? 'flex-start' : 'center',
              gap: 16,
              paddingVertical: 13,
              paddingHorizontal: 14,
              borderBottomWidth: index < group.rows.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
            }}
          >
            <Text style={{ fontSize: 13, color: colors.text2, letterSpacing: -0.3, flexShrink: 0 }}>{row.label}</Text>
            <Text
              style={{
                fontSize: 14,
                fontWeight: row.value ? '600' : '400',
                color: row.value ? colors.text1 : colors.text3,
                letterSpacing: -0.3,
                textAlign: 'right',
                lineHeight: 20,
              }}
            >
              {row.value || NONE_LABEL}
            </Text>
          </View>
        ))}
      </Card>
    </View>
  );
}
