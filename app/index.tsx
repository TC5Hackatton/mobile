import { customColors } from '@/src/presentation/constants/paper-theme';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Index() {
  useEffect(() => {
    // Navegar para a tela de login após um tempo mínimo de exibição
    const timer = setTimeout(() => {
      console.log('Navegando para a tela de login...');
      router.replace('/sign-in');
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require('@/assets/images/logo_v.svg')} style={styles.logo} contentFit="contain" />

        <Text style={styles.tagline}>Organize com calma,{'\n'}produza com foco</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: customColors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    width: 250,
    height: 300,
    marginBottom: 24,
  },
  tagline: {
    fontSize: 24,
    color: '#707070',
    textAlign: 'center',
    fontFamily: 'Raleway_400Regular',
    marginTop: 16,
  },
});
