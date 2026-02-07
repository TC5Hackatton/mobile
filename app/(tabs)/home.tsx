import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/src/presentation/components/app-header';
import { ContentCard } from '@/src/presentation/components/content-card';
import { FloatingActionButton } from '@/src/presentation/components/floating-action-button';
import { customColors } from '@/src/presentation/constants/paper-theme';
import { useDependencies } from '@/src/presentation/contexts/DependenciesContext';

export default function HomeScreen() {
  const { logger } = useDependencies();

  const handleFABPress = () => {
    logger.log('FAB pressed');
    // TODO: Implementar ação do FAB
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <AppHeader />

        <View style={styles.content}>
          <ContentCard>
            <Text>Welcome, user!</Text>
          </ContentCard>
        </View>

        <FloatingActionButton
          onPress={handleFABPress}
          accessibilityLabel="Adicionar novo item"
          accessibilityHint="Abre a tela para adicionar um novo item"
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: customColors.darkNavy,
  },
  safeArea: {
    flex: 1,
    backgroundColor: customColors.lightGray,
  },
  content: {
    flex: 1,
  },
});
