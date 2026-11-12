import BellBlueSvg from '@/shared/assets/icons-svg/bell-blue.svg';
import InfoCircleGraySvg from '@/shared/assets/icons-svg/info-circle-gray.svg';

export function BellIcon({ size = 20 }: { size?: number }) {
  return <BellBlueSvg width={size} height={size} />;
}

export function InfoIcon({ size = 14 }: { size?: number }) {
  return <InfoCircleGraySvg width={size} height={size} />;
}
