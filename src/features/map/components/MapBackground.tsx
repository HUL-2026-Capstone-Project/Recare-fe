import { View } from 'react-native';
import Svg, { Defs, Path, Pattern, Polygon, Rect } from 'react-native-svg';

import { colors } from '@/shared/constants/colors';

export function MapBackground() {
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#E8F0FA' }}>
      <Svg width="100%" height="100%" viewBox="0 0 375 600" preserveAspectRatio="none">
        <Defs>
          <Pattern id="diamondTile" patternUnits="userSpaceOnUse" width={40} height={40}>
            <Polygon points="0,0 20,0 0,20" fill={colors.primary} fillOpacity={0.06} />
            <Polygon points="40,0 20,0 40,20" fill={colors.primary} fillOpacity={0.06} />
            <Polygon points="0,40 0,20 20,40" fill={colors.primary} fillOpacity={0.06} />
            <Polygon points="40,40 40,20 20,40" fill={colors.primary} fillOpacity={0.06} />
          </Pattern>
        </Defs>
        <Rect x={0} y={0} width={375} height={600} fill="url(#diamondTile)" />

        <Rect x={20} y={220} width={60} height={60} rx={6} fill="#D6E9D6" fillOpacity={0.8} />
        <Rect x={290} y={40} width={70} height={80} rx={6} fill="#D6E9D6" fillOpacity={0.8} />
        <Rect x={140} y={380} width={80} height={50} rx={6} fill="#D6E9D6" fillOpacity={0.8} />

        <Path d="M-20 180 Q 100 200 200 160 T 400 140" stroke="#fff" strokeWidth={14} fill="none" />
        <Path d="M-20 320 Q 120 300 240 340 T 400 320" stroke="#fff" strokeWidth={10} fill="none" />
        <Path d="M-20 460 L 400 480" stroke="#fff" strokeWidth={8} fill="none" />
        <Path d="M80 -20 L 110 600" stroke="#fff" strokeWidth={10} fill="none" />
        <Path d="M260 -20 Q 250 200 280 400 T 290 620" stroke="#fff" strokeWidth={12} fill="none" />
      </Svg>
    </View>
  );
}
