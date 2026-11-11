import { Image, Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { CARD_SHADOW } from '@/features/case/constants';
import type { ChecklistItem } from '@/features/case/mocks';

export function ChecklistCard({ items }: { items: ChecklistItem[] }) {
  const doneCount = items.filter((item) => item.done).length;

  return (
    <View className="mt-2.5">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-[17px] font-bold text-text1" style={{ letterSpacing: -0.3 }}>
          접수 체크리스트
        </Text>
        <Text className="text-[12px]" style={{ color: colors.text2, letterSpacing: -0.2 }}>
          {doneCount} / {items.length}
        </Text>
      </View>

      <View className="bg-white" style={{ borderRadius: 20, ...CARD_SHADOW }}>
        {items.map((item, i) => (
          <View
            key={item.label}
            className="flex-row items-center px-4 py-3 gap-3"
            style={{
              borderBottomWidth: i < items.length - 1 ? 1 : 0,
              borderBottomColor: colors.border,
            }}
          >
            {item.done ? (
              <View
                className="items-center justify-center"
                style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: colors.success }}
              >
                <Image
                  source={require('@/shared/assets/icons/check-timeline.png')}
                  style={{ width: 12, height: 12, tintColor: '#fff' }}
                />
              </View>
            ) : (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: colors.border,
                  backgroundColor: '#fff',
                }}
              />
            )}
            <Text
              className="text-[13px]"
              style={{
                fontWeight: item.done ? '500' : '600',
                color: item.done ? colors.text3 : colors.text1,
                letterSpacing: -0.3,
                textDecorationLine: item.done ? 'line-through' : 'none',
              }}
            >
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
