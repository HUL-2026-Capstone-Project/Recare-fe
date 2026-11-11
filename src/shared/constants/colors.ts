/**
 * Re:care 서비스 공통 색상 팔레트
 *
 * NativeWind className → tailwind.config.js 참고
 * prop 직접 전달 시 (placeholderTextColor, tintColor 등) → 이 파일 import
 */

export const colors = {
  // Brand
  primary: '#3182F6',
  primaryDark: '#1B64DA',
  primaryLight: '#EBF3FE',
  primaryDisabled: '#D6E6FE',

  // Surface
  bg: '#F8F9FA',
  surface: '#FFFFFF',

  // Text
  text1: '#191F28',
  text2: '#6B7684',
  text3: '#B0B8C1',
  textInverse: '#FFFFFF',

  // Status
  success: '#09BD6B',
  warning: '#FF8C00',
  danger: '#F04452',

  // Border / Input
  border: '#E5E8EB',
  input: '#F2F4F6',

  // Chips (status backgrounds)
  chip: {
    blueBg: '#EBF3FE',
    blueFg: '#3182F6',
    orangeBg: '#FFF4E5',
    orangeFg: '#FF8C00',
    greenBg: '#E5F8EF',
    greenFg: '#09BD6B',
    redBg: '#FDECEE',
    redFg: '#F04452',
    grayBg: '#F2F4F6',
    grayFg: '#6B7684',
    darkBg: '#191F28',
    darkFg: '#FFFFFF',
  },

  // Misc
  map: {
    bg: '#E8F0FA',
    park: '#D6E9D6',
    road: '#FFFFFF',
  },

  // Shadows (RGBA)
  shadow: {
    card: 'rgba(0,0,0,0.04)',
    primaryGlow: 'rgba(49,130,246,0.4)',
    phone: 'rgba(0,0,0,0.12)',
  },
} as const;

export type ColorKey = keyof typeof colors;
