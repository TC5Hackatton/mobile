import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { type FontSizeScale } from '@/src/domain';
import { AppHeader } from '@/src/presentation/components/shared/app-header';
import { useSettings } from '@/src/presentation/contexts/SettingsContext';
import { useTheme } from '@/src/presentation/contexts/ThemeContext';
import { useTimerSettings } from '@/src/presentation/contexts/TimerSettingsContext';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { AppearanceSection, FocusModeSection, InfoCard, ProductivitySection } from '../presentation';

export default function PreferencesContent() {
  const colors = useThemeColors();
  const { isDark, fontSizeScale, setTheme, setFontSizeScale } = useTheme();
  const { updateSettingsUseCase } = useSettings();
  const { amountDefault, setAmountDefault } = useTimerSettings();

  const handleThemeToggle = () => {
    const newDark = !isDark;
    setTheme(newDark ? 'dark' : 'light');
    updateSettingsUseCase.execute({ darkMode: newDark }).catch((err) =>
      Toast.show({
        type: 'error',
        text1: 'Falha ao salvar tema no Firebase',
        text2: String(err),
      }),
    );
  };

  const handleFontSizeChange = (size: FontSizeScale) => {
    setFontSizeScale(size);
    updateSettingsUseCase.execute({ fontSize: size }).catch((err) =>
      Toast.show({
        type: 'error',
        text1: 'Falha ao salvar tamanho da fonte no Firebase',
        text2: String(err),
      }),
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <AppHeader title="Preferências" />
        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <InfoCard />
          <AppearanceSection
            isDark={isDark}
            fontSizeScale={fontSizeScale}
            onThemeToggle={handleThemeToggle}
            onFontSizeChange={handleFontSizeChange}
          />
          <ProductivitySection amountDefault={amountDefault} onAmountDefaultChange={setAmountDefault} />
          <FocusModeSection />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
});
