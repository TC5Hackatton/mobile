import { Stack } from 'expo-router';

import FocusContent from '@/src/presentation/components/focus-mode/smart/FocusContent';
import { TaskProvider } from '@/src/presentation/contexts/TaskContext';

export default function FocusRoute() {
  return (
    <TaskProvider>
      <Stack.Screen options={{ headerShown: false }} />
      <FocusContent />
    </TaskProvider>
  );
}
