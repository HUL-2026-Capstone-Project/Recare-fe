const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// SVG는 런타임에 파일을 불러오지 않고(SvgUri의 fetch는 Android release에서 리소스 이름만 받아 실패한다)
// 빌드 시점에 react-native-svg 컴포넌트로 변환해 번들에 넣는다.
// withNativeWind는 transformerPath만 바꾸고 transformer.babelTransformerPath는 그대로 두므로(react-native-css-interop/dist/metro/index.js:44-50),
// svg 설정은 withNativeWind 앞에서 적용해도 서로 덮어쓰지 않는다.
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer/expo'),
};
config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
};

module.exports = withNativeWind(config, { input: './global.css' });
