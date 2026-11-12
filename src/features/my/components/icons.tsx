import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

import ChevronRightGraySvg from '@/shared/assets/icons-svg/chevron-right-gray.svg';
import ChevronRightLgWhiteSvg from '@/shared/assets/icons-svg/chevron-right-lg-white.svg';
import MyBellSvg from '@/shared/assets/icons-svg/my-bell.svg';
import MyLockSvg from '@/shared/assets/icons-svg/my-lock.svg';
import MyProfileSvg from '@/shared/assets/icons-svg/my-profile.svg';

const ACCOUNT_MENU_ICONS = {
  user: MyProfileSvg,
  lock: MyLockSvg,
  bell: MyBellSvg,
} as const satisfies Record<string, FC<SvgProps>>;

export function AccountMenuIcon({
  icon,
  size = 16,
}: {
  icon: keyof typeof ACCOUNT_MENU_ICONS;
  size?: number;
}) {
  const Icon = ACCOUNT_MENU_ICONS[icon];
  return <Icon width={size} height={size} />;
}

export function ChevronRightWhite({ size = 20 }: { size?: number }) {
  return <ChevronRightLgWhiteSvg width={size} height={size} />;
}

export function ChevronRightGray({ size = 16 }: { size?: number }) {
  return <ChevronRightGraySvg width={size} height={size} />;
}
