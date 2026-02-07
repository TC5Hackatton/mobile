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

import { CustomToast } from '@/src/presentation/components/custom-toast';
import { ErrorBoundary } from '@/src/presentation/components/error-boundary';
import { customColors, darkTheme, lightTheme } from '@/src/presentation/constants/paper-theme';
import { DependenciesProvider } from '@/src/presentation/contexts/DependenciesContext';
import { useColorScheme } from '@/src/presentation/hooks/use-color-scheme';
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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const paperTheme = colorScheme === 'dark' ? darkTheme : lightTheme;

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
      RNStatusBar.setBackgroundColor(customColors.darkNavy);
      RNStatusBar.setBarStyle('light-content');
      NavigationBar.setBackgroundColorAsync(customColors.darkNavy);
      NavigationBar.setButtonStyleAsync('light');
    }
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ErrorBoundary>
      <DependenciesProvider>
        <SafeAreaProvider>
          <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
            <PaperProvider theme={paperTheme}>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="sign-in" options={{ headerShown: false }} />
                  <Stack.Screen name="sign-up" options={{ headerShown: false }} />
                  <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="dark" />
                <CustomToast />
              </ThemeProvider>
            </PaperProvider>
          </SafeAreaView>
        </SafeAreaProvider>
      </DependenciesProvider>
    </ErrorBoundary>
  );
}
