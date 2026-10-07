import { SvgUri } from 'react-native-svg';

import { svgAssetUri } from '@/shared/lib/svgAsset';
import type { NotificationIcon } from '../mocks';

const NOTIFICATION_ICON_FILES: Record<NotificationIcon, number> = {
  money: require('@/shared/assets/icons-svg/noti-money.svg'),
  doc: require('@/shared/assets/icons-svg/noti-doc.svg'),
  check: require('@/shared/assets/icons-svg/noti-check.svg'),
  case: require('@/shared/assets/icons-svg/noti-briefcase.svg'),
  info: require('@/shared/assets/icons-svg/noti-info.svg'),
};

export function NotificationTypeIcon({ icon, size = 18 }: { icon: NotificationIcon; size?: number }) {
  return <SvgUri uri={svgAssetUri(NOTIFICATION_ICON_FILES[icon])} width={size} height={size} />;
}
