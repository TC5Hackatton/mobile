import { useState } from 'react';

import { spacing } from '@/src/presentation/constants/spacing';
import { ToggleOnlyCard } from './ToggleOnlyCard';

export function AccessibilitySection() {
  const [reducedAnimations, setReducedAnimations] = useState(false);
  const [simplifiedMode, setSimplifiedMode] = useState(false);

  return (
    <ToggleOnlyCard
      title="Acessibilidade"
      icon="accessibility-new"
      items={[
        {
          title: 'Animações Reduzidas',
          description: 'Menos movimento na tela',
          value: reducedAnimations,
          onValueChange: setReducedAnimations,
        },
        {
          title: 'Modo Simplificado',
          description: 'Interface mais básica',
          value: simplifiedMode,
          onValueChange: setSimplifiedMode,
        },
      ]}
      cardStyle={{
        marginBottom: spacing.xxl,
      }}
    />
  );
}
