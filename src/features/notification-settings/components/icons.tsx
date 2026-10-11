import { SvgUri } from 'react-native-svg';

import { svgAssetUri } from '@/shared/lib/svgAsset';

export function BellIcon({ size = 20 }: { size?: number }) {
  return (
    <SvgUri
      uri={svgAssetUri(require('@/shared/assets/icons-svg/my-bell.svg'))}
      width={size}
      height={size}
    />
  );
}

export function InfoIcon({ size = 14 }: { size?: number }) {
  return (
    <SvgUri
      uri={svgAssetUri(require('@/shared/assets/icons-svg/noti-info.svg'))}
      width={size}
      height={size}
    />
  );
}
