import { SvgUri } from 'react-native-svg';

import { svgAssetUri } from '@/shared/lib/svgAsset';

export function VerifiedCheckIcon({ size = 11 }: { size?: number }) {
  return (
    <SvgUri
      uri={svgAssetUri(require('@/shared/assets/icons-svg/check-green-xs.svg'))}
      width={size}
      height={size}
    />
  );
}
