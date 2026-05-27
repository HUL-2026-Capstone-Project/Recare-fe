/** @type {import('tailwindcss').Config} */

// constants/colors.ts와 동일한 값을 유지합니다.
// className 기반 스타일은 여기서, prop 직접 전달은 constants/colors.ts에서 import해서 사용하세요.

module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: '#3182F6',
        'primary-dark': '#1B64DA',
        'primary-light': '#EBF3FE',
        'primary-disabled': '#D6E6FE',

        // Surface
        bg: '#F8F9FA',
        surface: '#FFFFFF',

        // Text
        text1: '#191F28',
        text2: '#6B7684',
        text3: '#B0B8C1',

        // Status
        success: '#09BD6B',
        warning: '#FF8C00',
        danger: '#F04452',

        // Border / Input
        border: '#E5E8EB',
        input: '#F2F4F6',
      },
    },
  },
  plugins: [],
};
