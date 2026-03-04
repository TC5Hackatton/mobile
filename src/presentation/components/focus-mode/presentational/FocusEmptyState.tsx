import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export function FocusEmptyState() {
  return (
    <View style={styles.container}>
      <Text>Nenhuma tarefa pendente encontrada.</Text>
      <Button onPress={() => router.back()}>Voltar</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
