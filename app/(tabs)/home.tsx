import HomeContent from '@/src/presentation/components/home/smart/HomeContent';
import { TaskProvider } from '@/src/presentation/contexts/TaskContext';

export default function Home() {
  return (
    <TaskProvider>
      <HomeContent />
    </TaskProvider>
  );
}
