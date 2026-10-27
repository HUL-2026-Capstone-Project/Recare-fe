import Svg, { Circle, Path, Rect, SvgUri } from 'react-native-svg';

import { svgAssetUri } from '@/shared/lib/svgAsset';

export function SearchIcon({ size = 20 }: { size?: number }) {
  return (
    <SvgUri
      uri={svgAssetUri(require('@/shared/assets/icons-svg/search-dark.svg'))}
      width={size}
      height={size}
    />
  );
}

export function FilterIcon({ size = 14 }: { size?: number }) {
  return (
    <SvgUri
      uri={svgAssetUri(require('@/shared/assets/icons-svg/filter.svg'))}
      width={size}
      height={size}
    />
  );
}

export function PhoneIcon({ size = 12 }: { size?: number }) {
  return (
    <SvgUri
      uri={svgAssetUri(require('@/shared/assets/icons-svg/phone.svg'))}
      width={size}
      height={size}
    />
  );
}

export function MapMarkerIcon({ active, size = 10 }: { active?: boolean; size?: number }) {
  return (
    <SvgUri
      uri={svgAssetUri(
        active
          ? require('@/shared/assets/icons-svg/map-marker-active.svg')
          : require('@/shared/assets/icons-svg/map-marker-primary.svg')
      )}
      width={size}
      height={size}
    />
  );
}

// 아래 아이콘은 icons-svg에 맞는 파일이 없거나(위치 핀·진료과목·거리·새로고침), 색을 바꿔 써야 해서(전화기: 정보 행 #6B7684,
// 비활성 #B0B8C1) 파일 대신 직접 그린다. SvgUri는 파일에 박힌 색을 바꿀 수 없다.
type StrokeIconProps = { size?: number; color?: string; strokeWidth?: number };

export function LocationPinIcon({ size = 18, color = '#6B7684', strokeWidth = 1.5 }: StrokeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round">
      <Path d="M10 18c-3.2-3.6-6-6.4-6-9.6a6 6 0 0112 0c0 3.2-2.8 6-6 9.6z" />
      <Circle cx={10} cy={8.4} r={2.1} />
    </Svg>
  );
}

export function PhoneOutlineIcon({ size = 18, color = '#6B7684', strokeWidth = 1.5 }: StrokeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round">
      <Path d="M4.5 3.5c0-.6.4-1 1-1h2l1.2 3.2-1.5 1c.8 1.8 2.2 3.2 4 4l1-1.5 3.3 1.2v2c0 .6-.4 1-1 1C8.7 13.4 4.5 9.2 4.5 3.5z" />
    </Svg>
  );
}

export function DepartmentIcon({ size = 18, color = '#6B7684', strokeWidth = 1.5 }: StrokeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round">
      <Rect x={3} y={3} width={14} height={14} rx={3.5} />
      <Path d="M10 6.8V13.2M6.8 10H13.2" strokeLinecap="round" />
    </Svg>
  );
}

export function DirectionIcon({ size = 18, color = '#6B7684', strokeWidth = 1.5 }: StrokeIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round">
      <Path d="M16.5 3.5L3.5 8.7l5 2 2 5z" />
    </Svg>
  );
}

export function RefreshIcon({ size = 14, color = '#6B7684' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M11.5 7a4.5 4.5 0 11-1.4-3.25M11.5 2v2.5H9" />
    </Svg>
  );
}

// icons-svg/close.svg (22px, #191F28, 선 1.8)와 check-green-xs.svg(10px 도면을 12px로 확대, #09BD6B)를 그대로 쓴다.
export function CloseIcon({ size = 22 }: { size?: number }) {
  return <SvgUri uri={svgAssetUri(require('@/shared/assets/icons-svg/close.svg'))} width={size} height={size} />;
}

export function CheckGreenIcon({ size = 12 }: { size?: number }) {
  return <SvgUri uri={svgAssetUri(require('@/shared/assets/icons-svg/check-green-xs.svg'))} width={size} height={size} />;
}
