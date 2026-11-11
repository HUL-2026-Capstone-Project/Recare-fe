import Svg, { Path, Rect } from 'react-native-svg';

import { colors } from '@/shared/constants/colors';

// icons-svg의 plus 파일은 색이 흰색/회색으로 고정돼 primary로 쓸 수 없고, chevron-down은 회색 고정이라 배지 글자색에 못 맞춘다.
// 달력 파일은 없다. 그래서 세 아이콘은 시안 path로 직접 그린다. 닫기 X는 icons-svg/close.svg(map/components/icons의 CloseIcon)를 쓴다.
export function PlusIcon({ size = 14, color = colors.primary }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round">
      <Path d="M7 2V12M2 7H12" />
    </Svg>
  );
}

export function ChevronDownSmallIcon({ color, size = 10 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 10 10" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M2 3.5L5 6.5 8 3.5" />
    </Svg>
  );
}

export function CalendarIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <Rect x={3} y={4.5} width={14} height={12.5} rx={2.5} stroke={colors.text3} strokeWidth={1.5} />
      <Path d="M3 8.5H17M7 3v3M13 3v3" stroke={colors.text3} strokeWidth={1.5} strokeLinecap="round" />
    </Svg>
  );
}
