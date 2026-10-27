import { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '@/shared/constants/colors';
import { digitsToDate } from '@/features/calculator/utils/date';

const ROW_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const EDGE_ROWS = 2;
// 월/일 휠은 같은 값을 여러 번 이어 붙여 순환처럼 보이게 하고, 스크롤이 끝나면 가운데 묶음으로 되돌린다.
const CIRCULAR_COPIES = 9;
const YEARS_BACK = 30;

const pad2 = (n: number) => String(n).padStart(2, '0');
const daysInMonth = (year: number, month: number) => new Date(year, month, 0).getDate();

type WheelProps = {
  values: number[];
  suffix: string;
  selectedIndex: number;
  circular: boolean;
  onChange: (index: number) => void;
};

function Wheel({ values, suffix, selectedIndex, circular, onChange }: WheelProps) {
  const ref = useRef<ScrollView>(null);
  const count = values.length;
  const copies = circular ? CIRCULAR_COPIES : 1;
  const centerCopy = Math.floor(copies / 2);
  const [liveIndex, setLiveIndex] = useState(centerCopy * count + selectedIndex);
  const liveRef = useRef(liveIndex);

  const indexFromOffset = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    Math.min(copies * count - 1, Math.max(0, Math.round(e.nativeEvent.contentOffset.y / ROW_HEIGHT)));

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = indexFromOffset(e);
    if (next === liveRef.current) return;
    liveRef.current = next;
    setLiveIndex(next);
  };

  const settle = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const absolute = indexFromOffset(e);
    const index = absolute % count;
    onChange(index);
    if (circular && (absolute < count * 2 || absolute >= count * (copies - 2))) {
      const recentered = centerCopy * count + index;
      liveRef.current = recentered;
      setLiveIndex(recentered);
      ref.current?.scrollTo({ y: recentered * ROW_HEIGHT, animated: false });
    }
  };

  const items = Array.from({ length: copies * count }, (_, i) => values[i % count]);

  return (
    <ScrollView
      ref={ref}
      style={{ flex: 1, height: ROW_HEIGHT * VISIBLE_ROWS }}
      showsVerticalScrollIndicator={false}
      snapToInterval={ROW_HEIGHT}
      decelerationRate="fast"
      scrollEventThrottle={16}
      onScroll={handleScroll}
      onScrollEndDrag={(e) => onChange(indexFromOffset(e) % count)}
      onMomentumScrollEnd={settle}
      onContentSizeChange={() => ref.current?.scrollTo({ y: (centerCopy * count + selectedIndex) * ROW_HEIGHT, animated: false })}
      contentContainerStyle={{ paddingVertical: ROW_HEIGHT * EDGE_ROWS }}
    >
      {items.map((value, i) => {
        const distance = Math.abs(i - liveIndex);
        return (
          <View key={i} style={{ height: ROW_HEIGHT, alignItems: 'center', justifyContent: 'center' }}>
            <Text
              style={{
                fontSize: distance === 0 ? 18 : 16,
                fontWeight: distance === 0 ? '800' : '500',
                color: distance === 0 ? colors.text1 : distance === 1 ? colors.text2 : colors.text3,
              }}
            >
              {value}
              {suffix}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

type DatePickerSheetProps = {
  visible: boolean;
  title: string;
  // 현재 폼 값(YYYY.MM.DD). 없으면 오늘 날짜에서 시작한다.
  value: string;
  onClose: () => void;
  onConfirm: (value: string) => void;
};

export function DatePickerSheet({ visible, title, value, onClose, onConfirm }: DatePickerSheetProps) {
  const { bottom } = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(320)).current;

  useEffect(() => {
    if (!visible) return;
    slide.setValue(320);
    Animated.timing(slide, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  }, [visible, slide]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      {visible && <SheetBody title={title} value={value} bottom={bottom} slide={slide} onClose={onClose} onConfirm={onConfirm} />}
    </Modal>
  );
}

// 열릴 때마다 새로 마운트돼 휠 위치가 그때의 값으로 시작한다.
function SheetBody({ title, value, bottom, slide, onClose, onConfirm }: Omit<DatePickerSheetProps, 'visible'> & { bottom: number; slide: Animated.Value }) {
  const today = new Date();
  const maxYear = today.getFullYear();
  const initial = digitsToDate(value.replace(/\D/g, '')) ?? today;
  // 연도 범위는 과거 30년 ~ 올해. 이미 저장된 값이 범위 밖이면 그 연도까지 넓힌다.
  const minYear = Math.min(maxYear - YEARS_BACK, initial.getFullYear());
  const maxSelectable = Math.max(maxYear, initial.getFullYear());

  const [year, setYear] = useState(initial.getFullYear());
  const [month, setMonth] = useState(initial.getMonth() + 1);
  const [day, setDay] = useState(initial.getDate());

  const years = Array.from({ length: maxSelectable - minYear + 1 }, (_, i) => minYear + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const dayCount = daysInMonth(year, month);
  const days = Array.from({ length: dayCount }, (_, i) => i + 1);
  // 월/연도를 바꿔 일수가 줄면 일을 그 달의 마지막 날로 맞춘다.
  const safeDay = Math.min(day, dayCount);

  return (
    <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(25,31,40,0.55)' }}>
      <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={onClose} />
      <Animated.View
        style={{
          transform: [{ translateY: slide }],
          backgroundColor: colors.surface,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: Math.max(bottom, 16),
        }}
      >
        <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 14 }} />
        <View className="flex-row items-center justify-between" style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text1, letterSpacing: -0.3 }}>{title}</Text>
          <Text style={{ fontSize: 13, color: colors.text2 }}>
            {year}.{pad2(month)}.{pad2(safeDay)}
          </Text>
        </View>

        <View style={{ height: ROW_HEIGHT * VISIBLE_ROWS, justifyContent: 'center' }}>
          <View
            pointerEvents="none"
            style={{ position: 'absolute', left: 0, right: 0, top: ROW_HEIGHT * EDGE_ROWS, height: ROW_HEIGHT, borderRadius: 12, backgroundColor: colors.input }}
          />
          <View className="flex-row">
            <Wheel values={years} suffix="년" circular={false} selectedIndex={years.indexOf(year)} onChange={(i) => setYear(years[i])} />
            <Wheel values={months} suffix="월" circular selectedIndex={month - 1} onChange={(i) => setMonth(months[i])} />
            <Wheel key={dayCount} values={days} suffix="일" circular selectedIndex={safeDay - 1} onChange={(i) => setDay(days[i])} />
          </View>
        </View>

        <Pressable
          onPress={() => onConfirm(`${year}.${pad2(month)}.${pad2(safeDay)}`)}
          style={{ height: 52, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginTop: 12 }}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.3 }}>확인</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
