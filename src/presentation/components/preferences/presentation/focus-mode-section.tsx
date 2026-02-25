import { useState } from 'react';

import { ToggleOnlyCard } from './ToggleOnlyCard';

export function FocusModeSection() {
  const [currentTaskOnly, setCurrentTaskOnly] = useState(false);

  return (
    <ToggleOnlyCard
      title="Modo Foco"
      icon="psychology"
      items={[
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
