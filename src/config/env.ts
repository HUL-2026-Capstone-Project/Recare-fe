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
};
