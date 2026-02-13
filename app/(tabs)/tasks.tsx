import TasksContent from '@/src/presentation/components/tasks/smart/TasksContent';
import { TaskProvider } from '@/src/presentation/contexts/TaskContext';

export default function Home() {
  return (
    <TaskProvider>
      <TasksContent />
    </TaskProvider>
  );
}
