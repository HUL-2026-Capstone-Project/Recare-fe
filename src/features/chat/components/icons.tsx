import LogoRecareMascotSvg from '@/shared/assets/icons-svg/logo-recare-mascot.svg';
import CloseSvg from '@/shared/assets/icons-svg/close.svg';
import PlusGraySvg from '@/shared/assets/icons-svg/plus-gray.svg';
import SendWhiteSvg from '@/shared/assets/icons-svg/send-white.svg';

export function ChatbotAvatar({ size }: { size: number }) {
  return <LogoRecareMascotSvg width={size} height={size} />;
}

export function CloseIcon({ size = 22 }: { size?: number }) {
  return <CloseSvg width={size} height={size} />;
}

export function PlusIcon({ size = 18 }: { size?: number }) {
  return <PlusGraySvg width={size} height={size} />;
}

export function SendButtonIcon({ size = 18 }: { size?: number }) {
  return <SendWhiteSvg width={size} height={size} />;
}
