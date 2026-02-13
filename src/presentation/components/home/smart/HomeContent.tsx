import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TaskStatus } from '@/src/domain';
import { AppHeader } from '@/src/presentation/components/shared/app-header';
import { ContentCard } from '@/src/presentation/components/shared/content-card';
import { FloatingActionButton } from '@/src/presentation/components/shared/floating-action-button';
import { customColors } from '@/src/presentation/constants/paper-theme';
import { useDependencies } from '@/src/presentation/contexts/DependenciesContext';
import { useTask } from '@/src/presentation/contexts/TaskContext';

export default function HomeContent() {
  const { logger } = useDependencies();
  const { createTaskUseCase } = useTask();

  const handleFABPress = () => {
    // TODO: remover isso assim que a criação de tarefa for implementada
    createTaskUseCase.execute({
      title: 'Nova tarefa',
      description: 'Nova tarefa',
      status: TaskStatus.TODO,
      timeSpent: 0,
      timeType: 'minutes',
    });

    // TODO: Implementar ação do FAB
    logger.log('FAB pressed');
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
