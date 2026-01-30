import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import firebaseConfig from '@/firebaseConfig';
import { logger } from '@/src/infrastructure/logger';
import { AppHeader } from '@/src/presentation/components/app-header';
import { ContentCard } from '@/src/presentation/components/content-card';
import { FloatingActionButton } from '@/src/presentation/components/floating-action-button';
import { customColors } from '@/src/presentation/constants/paper-theme';
import { useAppHeader } from '@/src/presentation/hooks/use-app-header';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Text } from 'react-native-paper';

export default function HomeScreen() {
  const { handleExpandPress, handleThemeTogglePress } = useAppHeader();
  const [testUser, setTestUser] = useState<string>('');

  const handleFABPress = () => {
    logger.log('FAB pressed');
    // TODO: Implementar ação do FAB

    // TODO: Remover, só estamos provando que o Firebase funciona
    signInWithEmailAndPassword(firebaseConfig.auth, 'teste@teste.com', 'senha123').then((value) => {
      console.log(value.user);
      setTestUser(`Email: ${value.user.email} \n\n\n UID: ${value.user.uid}`);
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <AppHeader onExpandPress={handleExpandPress} onThemeTogglePress={handleThemeTogglePress} />

        <View style={styles.content}>
          <ContentCard>{testUser && <Text>{testUser}</Text>}</ContentCard>
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
