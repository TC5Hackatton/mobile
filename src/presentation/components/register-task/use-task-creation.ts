import { useRouter } from 'expo-router';
import { useState } from 'react';

export function useTaskCreation() {
  const router = useRouter();
  const [mode, setMode] = useState<'timer' | 'fixed'>('timer');
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const handleCancel = () => router.back();

  const handleSave = () => {
    // Aqui viria a chamada para o UseCase do Domain
    console.log('Salvando tarefa...');
    router.back();
  };

  return {
    mode,
    setMode,
    selectedDuration,
    setSelectedDuration,
    handleCancel,
    handleSave,
  };
}
