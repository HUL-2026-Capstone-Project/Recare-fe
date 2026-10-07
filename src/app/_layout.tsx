import '../../global.css';

import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { useAuthStore } from '@/store/authStore';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(auth)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const status = useAuthStore((state) => state.status);
  const hydrate = useAuthStore((state) => state.hydrate);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (status === 'loading') return;
    SplashScreen.hideAsync();

    const inAuthGroup = segments[0] === '(auth)';
    if (status === 'authenticated' && inAuthGroup) {
      router.replace('/(tabs)');
    } else if (status === 'unauthenticated' && !inAuthGroup) {
      router.replace('/(auth)');
    }
  }, [status, segments, router]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="case-detail/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="calculator" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
