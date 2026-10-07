import { SvgUri } from 'react-native-svg';

import { svgAssetUri } from '@/shared/lib/svgAsset';

export function SearchIcon({ size = 20 }: { size?: number }) {
  return (
    <SvgUri
      uri={svgAssetUri(require('@/shared/assets/icons-svg/search-dark.svg'))}
      width={size}
      height={size}
    />
  );
}

export function FilterIcon({ size = 14 }: { size?: number }) {
  return (
    <SvgUri
      uri={svgAssetUri(require('@/shared/assets/icons-svg/filter.svg'))}
      width={size}
      height={size}
    />
  );
}

export function PhoneIcon({ size = 12 }: { size?: number }) {
  return (
    <SvgUri
      uri={svgAssetUri(require('@/shared/assets/icons-svg/phone.svg'))}
      width={size}
      height={size}
    />
  );
}

export function MapMarkerIcon({ active, size = 10 }: { active?: boolean; size?: number }) {
  return (
    <SvgUri
      uri={svgAssetUri(
        active
          ? require('@/shared/assets/icons-svg/map-marker-active.svg')
          : require('@/shared/assets/icons-svg/map-marker-primary.svg')
      )}
      width={size}
      height={size}
    />
  );
}
