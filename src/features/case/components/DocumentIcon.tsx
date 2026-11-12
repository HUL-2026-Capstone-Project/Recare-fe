import type { FC } from 'react';
import { View } from 'react-native';
import type { SvgProps } from 'react-native-svg';

import DocBlueSvg from '@/shared/assets/icons-svg/doc-blue.svg';
import DocGreenSvg from '@/shared/assets/icons-svg/doc-green.svg';
import DocOrangeSvg from '@/shared/assets/icons-svg/doc-orange.svg';
import DocRedSvg from '@/shared/assets/icons-svg/doc-red.svg';
import { DOC_TONE_COLORS } from '../documentFormat';
import type { DocTone } from '../documentFormat';

// 색이 파일에 고정된 SVG라 톤마다 파일이 따로 있다(doc-blue/green/red는 기존 에셋, doc-orange는 이번에 추가).
const DOC_GLYPHS: Record<DocTone, FC<SvgProps>> = {
  blue: DocBlueSvg,
  orange: DocOrangeSvg,
  red: DocRedSvg,
  green: DocGreenSvg,
};

export function DocumentIcon({ tone }: { tone: DocTone }) {
  const Glyph = DOC_GLYPHS[tone];
  return (
    <View style={{ width: 28, height: 32, borderRadius: 5, backgroundColor: DOC_TONE_COLORS[tone].bg, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Glyph width={14} height={14} />
    </View>
  );
}
