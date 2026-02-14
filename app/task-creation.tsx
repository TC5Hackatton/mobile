import { Stack } from 'expo-router';

import TaskCreationContent from '@/src/presentation/components/register-task/TaskCreationContent';

export default function TaskCreation() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <TaskCreationContent />
    </>
  );
}
