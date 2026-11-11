import { Text, View } from 'react-native';

import { colors } from '@/shared/constants/colors';
import { CARD_SHADOW } from '@/features/case/constants';
import { TimelineDot } from '@/features/case/components/TimelineDot';
import type { TimelineStep } from '@/features/case/mocks';

type ProgressTimelineProps = {
  steps: TimelineStep[];
  title?: string;
  caption?: string;
  captionRight?: string;
};

export function ProgressTimeline({
  steps,
  title = '진행 상황',
  caption,
  captionRight,
}: ProgressTimelineProps) {
  return (
    <View className="mt-2.5">
      <Text className="text-[17px] font-bold text-text1 mb-3" style={{ letterSpacing: -0.3 }}>
        {title}
      </Text>
      <View className="bg-white p-4" style={{ borderRadius: 20, ...CARD_SHADOW }}>
        {(caption || captionRight) && (
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[12px]" style={{ color: colors.text2, letterSpacing: -0.2 }}>
              {caption}
            </Text>
            {captionRight && (
              <Text
                className="text-[11px] font-bold"
                style={{ color: colors.primary, letterSpacing: -0.2 }}
              >
                {captionRight}
              </Text>
            )}
          </View>
        )}

        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <View key={step.label} style={{ flexDirection: 'row', gap: 14 }}>
              <View style={{ width: 16, alignItems: 'center' }}>
                <TimelineDot state={step.state} />
                {!isLast && (
                  <View
                    style={{
                      flex: 1,
                      width: 2,
                      marginTop: 2,
                      backgroundColor: step.state === 'done' ? colors.success : colors.border,
                    }}
                  />
                )}
              </View>
              <View style={{ flex: 1, paddingBottom: isLast ? 0 : 16 }}>
                <View className="flex-row justify-between items-baseline">
                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: step.state === 'pending' ? '500' : '700',
                      color: step.state === 'pending' ? colors.text3 : colors.text1,
                      letterSpacing: -0.3,
                    }}
                  >
                    {step.label}
                  </Text>
                  <Text style={{ fontSize: 11, color: colors.text3, letterSpacing: -0.2 }}>
                    {step.date}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 11,
                    marginTop: 2,
                    color: step.state === 'pending' ? colors.text3 : colors.text2,
                    letterSpacing: -0.2,
                  }}
                >
                  {step.desc}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
