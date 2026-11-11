import { Image } from 'react-native';

export function svgAssetUri(mod: number) {
  return Image.resolveAssetSource(mod).uri;
}
