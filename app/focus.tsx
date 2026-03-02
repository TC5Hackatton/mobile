import { TaskProvider } from '@/src/presentation/contexts/TaskContext';
import FocusScreen from '@/src/presentation/features/focus-mode/focus-screen';

export default function FocusRoute() {
  return (
    <TaskProvider>
      <FocusScreen />
    </TaskProvider>
  );
}
