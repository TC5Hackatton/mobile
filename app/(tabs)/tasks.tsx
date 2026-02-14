import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppHeader } from '@/src/presentation/components/shared/app-header';
import { customColors } from '@/src/presentation/constants/paper-theme';

export default function TasksScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={[]}>
        <AppHeader title="Tarefas" />
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
});
