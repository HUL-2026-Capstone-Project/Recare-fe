import { Image } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { svgAssetUri } from '@/shared/lib/svgAsset';

export function BackIcon() {
  return <Image source={require('@/shared/assets/icons/chevron-left.png')} style={{ width: 24, height: 24 }} />;
}

export function PulseIcon() {
  return <SvgUri uri={svgAssetUri(require('@/shared/assets/icons-svg/pulse-blue.svg'))} width={20} height={20} />;
}

export function CheckIcon() {
  return <SvgUri uri={svgAssetUri(require('@/shared/assets/icons-svg/check-blue.svg'))} width={20} height={20} />;
}

export function DocGlyph({ size = 12 }: { size?: number }) {
  return <SvgUri uri={svgAssetUri(require('@/shared/assets/icons-svg/doc-blue.svg'))} width={size} height={size} />;
}
