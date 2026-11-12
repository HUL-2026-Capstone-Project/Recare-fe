import type { FC } from 'react';
import type { SvgProps } from 'react-native-svg';

import NotiBriefcaseSvg from '@/shared/assets/icons-svg/noti-briefcase.svg';
import NotiCheckSvg from '@/shared/assets/icons-svg/noti-check.svg';
import NotiDocSvg from '@/shared/assets/icons-svg/noti-doc.svg';
import NotiInfoSvg from '@/shared/assets/icons-svg/noti-info.svg';
import NotiMoneySvg from '@/shared/assets/icons-svg/noti-money.svg';
import type { NotificationIcon } from '../types';

const NOTIFICATION_ICONS: Record<NotificationIcon, FC<SvgProps>> = {
  money: NotiMoneySvg,
  doc: NotiDocSvg,
  check: NotiCheckSvg,
  case: NotiBriefcaseSvg,
  info: NotiInfoSvg,
};

export function NotificationTypeIcon({ icon, size = 18 }: { icon: NotificationIcon; size?: number }) {
  const Icon = NOTIFICATION_ICONS[icon];
  return <Icon width={size} height={size} />;
}
