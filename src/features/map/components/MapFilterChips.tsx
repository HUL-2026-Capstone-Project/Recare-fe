import { ScrollView, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';

export function MapFilterChips({ chips }: { chips: string[] }) {
  return (
    <View style={{ position: 'absolute', top: 72, left: 20, right: 20 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {chips.map((chip, index) => {
            const isFirst = index === 0;
            return (
              <View
                key={chip}
                style={{
                  paddingVertical: 6,
                  paddingHorizontal: 12,
                  borderRadius: 50,
                  backgroundColor: isFirst ? colors.text1 : colors.surface,
                  shadowColor: '#000',
                  shadowOpacity: isFirst ? 0 : 0.06,
                  shadowRadius: 8,
                  shadowOffset: { width: 0, height: 2 },
                  elevation: isFirst ? 0 : 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    letterSpacing: -0.2,
                    color: isFirst ? '#fff' : colors.text1,
                  }}
                >
                  {chip}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
