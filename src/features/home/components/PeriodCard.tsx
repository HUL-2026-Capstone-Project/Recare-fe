import { ImageBackground, Text, View } from 'react-native';

type PeriodCardProps = {
  name: string;
  startDate: string;
  endDate: string;
  remainingDays: number;
  progress: number; // 0~1
};

export function PeriodCard({ name, startDate, endDate, remainingDays, progress }: PeriodCardProps) {
  return (
    <ImageBackground
      source={require('@/shared/assets/icons/recovery-box.png')}
      className="rounded-[20px] p-4 mb-3 overflow-hidden"
    >
      <Text className="text-white text-[14px] font-semibold" style={{ letterSpacing: -0.3 }}>
        {name}님의 산재 요양기간이에요!
      </Text>
      <Text className="text-white text-[12px] mt-1.5" style={{ opacity: 0.85, letterSpacing: -0.2 }}>
        {startDate} ~ {endDate}
      </Text>
      <View
        className="mt-2.5 h-1.5 rounded-full overflow-hidden"
        style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
      >
        <View className="h-full rounded-full bg-white" style={{ width: `${progress * 100}%` }} />
      </View>
      <View className="mt-2 flex-row justify-between items-baseline">
        <Text className="text-white text-[12px]" style={{ opacity: 0.85, letterSpacing: -0.2 }}>
          남은 기간
        </Text>
        <Text className="text-white text-[20px] font-extrabold" style={{ letterSpacing: -0.5 }}>
          {remainingDays}
          <Text className="text-[12px] font-semibold" style={{ opacity: 0.85 }}> 일</Text>
        </Text>
      </View>
    </ImageBackground>
  );
}
