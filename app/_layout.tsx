import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, StatusBar as RNStatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { CustomToast } from '@/src/presentation/components/shared/custom-toast';
import { ErrorBoundary } from '@/src/presentation/components/shared/error-boundary';
import { customColors, darkTheme, lightTheme } from '@/src/presentation/constants/paper-theme';
import { DependenciesProvider } from '@/src/presentation/contexts/DependenciesContext';
import { FontSizeProvider } from '@/src/presentation/contexts/FontSizeContext';
import { SessionProvider } from '@/src/presentation/contexts/SessionContext';
import { ThemeProvider as AppThemeProvider, useTheme } from '@/src/presentation/contexts/ThemeContext';
import {
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
} from '@expo-google-fonts/raleway';

// Manter a splash screen visível enquanto carregamos as fontes
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { isDark } = useTheme();
  const paperTheme = isDark ? darkTheme : lightTheme;

  const [fontsLoaded, fontError] = useFonts({
    Raleway_400Regular,
    Raleway_500Medium,
    Raleway_600SemiBold,
    Raleway_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const statusBarColor = isDark ? customColors.darkNavy : customColors.white;
      const statusBarStyle = isDark ? 'light-content' : 'dark-content';
      const navBarStyle = isDark ? 'light' : 'dark';

      RNStatusBar.setBackgroundColor(statusBarColor);
      RNStatusBar.setBarStyle(statusBarStyle);
      NavigationBar.setBackgroundColorAsync(statusBarColor);
      NavigationBar.setButtonStyleAsync(navBarStyle);
    }
  }, [isDark]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        <PaperProvider key={isDark ? 'dark' : 'light'} theme={paperTheme}>
          <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="sign-in" options={{ headerShown: false }} />
              <Stack.Screen name="sign-up" options={{ headerShown: false }} />
              <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            <CustomToast />
          </ThemeProvider>
        </PaperProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <DependenciesProvider>
        <SessionProvider>
          <AppThemeProvider>
            <FontSizeProvider>
              <RootLayoutContent />
            </FontSizeProvider>
          </AppThemeProvider>
        </SessionProvider>
      </DependenciesProvider>
    </ErrorBoundary>
  );
}
