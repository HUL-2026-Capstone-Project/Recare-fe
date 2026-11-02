import { View } from 'react-native';
import { SvgUri } from 'react-native-svg';

import { svgAssetUri } from '@/shared/lib/svgAsset';
import { DOC_TONE_COLORS } from '../documentFormat';
import type { DocTone } from '../documentFormat';

// 색이 파일에 고정된 SVG라 톤마다 파일이 따로 있다(doc-blue/green/red는 기존 에셋, doc-orange는 이번에 추가).
const DOC_GLYPHS: Record<DocTone, number> = {
  blue: require('@/shared/assets/icons-svg/doc-blue.svg'),
  orange: require('@/shared/assets/icons-svg/doc-orange.svg'),
  red: require('@/shared/assets/icons-svg/doc-red.svg'),
  green: require('@/shared/assets/icons-svg/doc-green.svg'),
};

export function DocumentIcon({ tone }: { tone: DocTone }) {
  return (
    <View style={{ width: 28, height: 32, borderRadius: 5, backgroundColor: DOC_TONE_COLORS[tone].bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <SvgUri uri={svgAssetUri(DOC_GLYPHS[tone])} width={14} height={14} />
    </View>
  );
}
