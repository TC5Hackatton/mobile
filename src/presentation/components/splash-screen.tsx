import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { customColors } from '@/src/presentation/constants/paper-theme';

interface AppSplashScreenProps {
  onFinish?: () => void;
}

export function AppSplashScreen({ onFinish }: AppSplashScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo SVG */}
        <Image
          source={require('@/assets/images/logo_v.svg')}
          style={styles.logo}
          contentFit="contain"
        />

        {/* Tagline */}
        <Text style={styles.tagline}>Organize com calma,{"\n"}produza com foco</Text>
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
