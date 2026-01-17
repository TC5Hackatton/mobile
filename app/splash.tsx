import { useEffect } from 'react';
import { router } from 'expo-router';
import { AppSplashScreen } from '@/src/presentation/components/splash-screen';

export default function Splash() {
  useEffect(() => {
    // Navegar para a tela de login após um tempo mínimo de exibição
    const timer = setTimeout(() => {
      router.replace('/sign-in');
    }, 2000); // 2 segundos

    return () => clearTimeout(timer);
  }, []);

  return <AppSplashScreen />;
}
