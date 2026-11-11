const apiUrl = process.env.EXPO_PUBLIC_API_URL;
const aiApiUrl = process.env.EXPO_PUBLIC_AI_API_URL;

if (!apiUrl) {
  throw new Error('EXPO_PUBLIC_API_URL is not set. Check your .env file.');
}

if (!aiApiUrl) {
  throw new Error('EXPO_PUBLIC_AI_API_URL is not set. Check your .env file.');
}

export const env = {
  apiUrl,
  apiTimeoutMs: Number(process.env.EXPO_PUBLIC_API_TIMEOUT_MS) || 10000,
  aiApiUrl,
  aiApiTimeoutMs: Number(process.env.EXPO_PUBLIC_AI_API_TIMEOUT_MS) || 60000,
  // 지도 화면은 Client ID가 없어도 앱 전체가 죽으면 안 되므로 여기서는 throw하지 않는다.
  // 비어 있을 때의 경고는 지도를 실제로 사용하는 컴포넌트에서 한 번만 남긴다.
  naverMapClientId: process.env.EXPO_PUBLIC_NAVER_MAP_CLIENT_ID ?? '',
};
