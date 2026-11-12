import { Image } from 'react-native';

import CheckBlueSvg from '@/shared/assets/icons-svg/check-blue.svg';
import DocBlueSvg from '@/shared/assets/icons-svg/doc-blue.svg';
import PulseBlueSvg from '@/shared/assets/icons-svg/pulse-blue.svg';

export function BackIcon() {
  return <Image source={require('@/shared/assets/icons/chevron-left.png')} style={{ width: 24, height: 24 }} />;
}

export function PulseIcon() {
  return <PulseBlueSvg width={20} height={20} />;
}

export function CheckIcon() {
  return <CheckBlueSvg width={20} height={20} />;
}

export function DocGlyph({ size = 12 }: { size?: number }) {
  return <DocBlueSvg width={size} height={size} />;
}
