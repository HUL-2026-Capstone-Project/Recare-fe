import * as SecureStore from 'expo-secure-store';

const KEYS = {
  accessToken: 'recare_access_token',
  refreshToken: 'recare_refresh_token',
  tokenType: 'recare_token_type',
} as const;

export const tokenStorage = {
  async getAccessToken() {
    return SecureStore.getItemAsync(KEYS.accessToken);
  },

  async getRefreshToken() {
    return SecureStore.getItemAsync(KEYS.refreshToken);
  },

  async getTokenType() {
    return (await SecureStore.getItemAsync(KEYS.tokenType)) ?? 'Bearer';
  },

  async setTokens(accessToken: string, refreshToken: string, tokenType: string) {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.accessToken, accessToken),
      SecureStore.setItemAsync(KEYS.refreshToken, refreshToken),
      SecureStore.setItemAsync(KEYS.tokenType, tokenType || 'Bearer'),
    ]);
  },

  async setAccessToken(accessToken: string, tokenType: string) {
    await Promise.all([
      SecureStore.setItemAsync(KEYS.accessToken, accessToken),
      SecureStore.setItemAsync(KEYS.tokenType, tokenType || 'Bearer'),
    ]);
  },

  async clear() {
    await Promise.all([
      SecureStore.deleteItemAsync(KEYS.accessToken),
      SecureStore.deleteItemAsync(KEYS.refreshToken),
      SecureStore.deleteItemAsync(KEYS.tokenType),
    ]);
  },
};
