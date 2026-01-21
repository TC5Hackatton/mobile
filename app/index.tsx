import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    // Redirecionar imediatamente para a splash screen
    router.replace('/splash');
  }, []);

  return null;
}
