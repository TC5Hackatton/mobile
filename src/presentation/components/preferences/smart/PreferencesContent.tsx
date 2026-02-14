import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/src/presentation/components/shared/app-header';
import { customColors } from '@/src/presentation/constants/paper-theme';
import {
  AccessibilitySection,
  AppearanceSection,
  FocusModeSection,
  InfoCard,
  NotificationsSection,
  ProductivitySection,
} from '../presentation';

// NOTE: maybe here we can render the some sections directly, and use a reducer to control the state
export default function PreferencesContent() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <AppHeader title="Preferências" showBackButton />
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <InfoCard />
          <AppearanceSection />
          <ProductivitySection />
          <NotificationsSection />
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
    backgroundColor: customColors.lightGray,
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
