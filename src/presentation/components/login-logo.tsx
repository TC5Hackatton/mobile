import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

export function LoginLogo() {
  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/logo_v.svg')}
        style={styles.logo}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 240,
  },
});
