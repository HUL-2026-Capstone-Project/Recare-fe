import { SvgUri } from 'react-native-svg';

import { svgAssetUri } from '@/shared/lib/svgAsset';

export function CalculatorIcon({ size = 20 }: { size?: number }) {
  return <SvgUri uri={svgAssetUri(require('@/shared/assets/icons-svg/calculator-blue.svg'))} width={size} height={size} />;
}
