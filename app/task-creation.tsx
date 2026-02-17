import { Stack } from 'expo-router';

import TaskCreationContent from '@/src/presentation/components/register-task/TaskCreationContent';
import { TaskProvider } from '@/src/presentation/contexts/TaskContext';

export default function TaskCreation() {
  return (
    <TaskProvider>
      <Stack.Screen options={{ headerShown: false }} />
      <TaskCreationContent />
    </TaskProvider>
  );
}
