import { useState } from 'react';

import { ToggleOnlyCard } from './ToggleOnlyCard';

export function FocusModeSection() {
  const [hideCompleted, setHideCompleted] = useState(false);
  const [currentTaskOnly, setCurrentTaskOnly] = useState(false);

  return (
    <ToggleOnlyCard
      title="Modo Foco"
      icon="psychology"
      items={[
        {
          title: 'Ocultar Concluídas',
          description: 'Menos distrações visuais',
          value: hideCompleted,
          onValueChange: setHideCompleted,
        },
        {
          title: 'Apenas Tarefa Atual',
          description: 'Foco total em uma coisa',
          value: currentTaskOnly,
          onValueChange: setCurrentTaskOnly,
        },
      ]}
    />
  );
}
