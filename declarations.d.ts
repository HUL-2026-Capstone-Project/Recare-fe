// react-native-svg-transformer가 .svg를 react-native-svg 컴포넌트로 변환한다.
declare module '*.svg' {
  import type { FC } from 'react';
  import type { SvgProps } from 'react-native-svg';

  const content: FC<SvgProps>;
  export default content;
}
