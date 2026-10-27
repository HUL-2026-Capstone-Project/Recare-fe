import { View } from 'react-native';
import Svg, { Line, Rect } from 'react-native-svg';

import { colors } from '@/shared/constants/colors';

export function EmptyStateIcon({ size }: { size: number }) {
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={26} height={26} viewBox="0 0 26 26" fill="none">
        <Rect x={5} y={3} width={16} height={20} rx={3} stroke={colors.primary} strokeWidth={1.8} />
        <Line x1={9} y1={9} x2={17} y2={9} stroke={colors.primary} strokeWidth={1.8} strokeLinecap="round" />
        <Line x1={9} y1={13} x2={17} y2={13} stroke={colors.primary} strokeWidth={1.8} strokeLinecap="round" />
        <Line x1={9} y1={17} x2={14} y2={17} stroke={colors.primary} strokeWidth={1.8} strokeLinecap="round" />
      </Svg>
    </View>
  );
}
