import { SvgUri } from 'react-native-svg';

import { svgAssetUri } from '@/shared/lib/svgAsset';

const ACCOUNT_MENU_ICON_FILES = {
  user: require('@/shared/assets/icons-svg/my-profile.svg'),
  lock: require('@/shared/assets/icons-svg/my-lock.svg'),
  bell: require('@/shared/assets/icons-svg/my-bell.svg'),
} as const;

export function AccountMenuIcon({
  icon,
  size = 16,
}: {
  icon: keyof typeof ACCOUNT_MENU_ICON_FILES;
  size?: number;
}) {
  return <SvgUri uri={svgAssetUri(ACCOUNT_MENU_ICON_FILES[icon])} width={size} height={size} />;
}

export function ChevronRightWhite({ size = 20 }: { size?: number }) {
  return (
    <SvgUri
      uri={svgAssetUri(require('@/shared/assets/icons-svg/chevron-right-lg-white.svg'))}
      width={size}
      height={size}
    />
  );
}

export function ChevronRightGray({ size = 16 }: { size?: number }) {
  return (
    <SvgUri
      uri={svgAssetUri(require('@/shared/assets/icons-svg/chevron-right-gray.svg'))}
      width={size}
      height={size}
    />
  );
}
