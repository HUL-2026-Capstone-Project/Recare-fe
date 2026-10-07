import { Image } from 'react-native';
import { SvgUri } from 'react-native-svg';

function assetUri(mod: number) {
  return Image.resolveAssetSource(mod).uri;
}

export function ChatbotAvatar({ size }: { size: number }) {
  return (
    <SvgUri
      uri={assetUri(require('@/shared/assets/icons-svg/logo-recare-mascot.svg'))}
      width={size}
      height={size}
    />
  );
}

export function CloseIcon({ size = 22 }: { size?: number }) {
  return (
    <SvgUri
      uri={assetUri(require('@/shared/assets/icons-svg/close.svg'))}
      width={size}
      height={size}
    />
  );
}

export function PlusIcon({ size = 18 }: { size?: number }) {
  return (
    <SvgUri
      uri={assetUri(require('@/shared/assets/icons-svg/plus-gray.svg'))}
      width={size}
      height={size}
    />
  );
}

export function SendButtonIcon({ size = 18 }: { size?: number }) {
  return (
    <SvgUri
      uri={assetUri(require('@/shared/assets/icons-svg/send-white.svg'))}
      width={size}
      height={size}
    />
  );
}
