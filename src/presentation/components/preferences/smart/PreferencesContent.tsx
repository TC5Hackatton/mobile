import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/src/presentation/components/shared/app-header';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import {
  AccessibilitySection,
  AppearanceSection,
  FocusModeSection,
  InfoCard,
  ProductivitySection,
} from '../presentation';

// NOTE: maybe here we can render the some sections directly, and use a reducer to control the state
export default function PreferencesContent() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <AppHeader title="Preferências" />
        <ScrollView
          style={[styles.scrollView, { backgroundColor: colors.background }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <InfoCard />
          <AppearanceSection />
          <ProductivitySection />
          <FocusModeSection />
          <AccessibilitySection />
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
