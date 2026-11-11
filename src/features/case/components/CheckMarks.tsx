import Svg, { Path } from 'react-native-svg';

// 시안 SVG 그대로. icons-svg의 check-white*.svg는 체크 모양(크기·위치)이 시안과 달라 직접 그린다.
export function TimelineCheck() {
  return (
    <Svg width={10} height={10} viewBox="0 0 10 10" fill="none" stroke="#FFFFFF" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M2 5.2L4.2 7.3 8 3.2" />
    </Svg>
  );
}

export function TodoCheck() {
  return (
    <Svg width={14} height={14} viewBox="0 0 14 14" fill="none" stroke="#FFFFFF" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M3 7.2L5.8 10 11 4.4" />
    </Svg>
  );
}
