// app.json은 정적 설정을 담고, 이 파일은 빌드 시점에 process.env 값을
// 읽어야 하는 설정(네이버 지도 Client ID)만 동적으로 덧붙인다.
// Client ID는 커밋 대상 파일(app.json 등)에 직접 쓰지 않고 .env에서만 주입한다.
module.exports = ({ config }) => {
  if (!process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_ID) {
    // eslint-disable-next-line no-console
    console.warn('[app.config.js] EXPO_PUBLIC_NAVER_MAP_CLIENT_ID is not set. Naver Map will not initialize.');
  }

  return {
    ...config,
    plugins: [
      ...(config.plugins ?? []),
      [
        '@mj-studio/react-native-naver-map',
        { client_id: process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_ID ?? '' },
      ],
      [
        'expo-build-properties',
        { android: { extraMavenRepos: ['https://repository.map.naver.com/archive/maven'] } },
      ],
    ],
  };
};
