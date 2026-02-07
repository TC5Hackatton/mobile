import { router } from 'expo-router';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

export default function ForgotPasswordContent() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Tela precisa ser criada</Text>
      <Button onPress={() => router.back()}>Voltar</Button>
    </View>
  );
}
