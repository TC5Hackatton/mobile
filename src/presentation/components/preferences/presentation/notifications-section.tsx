import { useState } from 'react';

import { ToggleOnlyCard } from './ToggleOnlyCard';

export function NotificationsSection() {
  const [sounds, setSounds] = useState(true);
  const [vibration, setVibration] = useState(false);

  return (
    <ToggleOnlyCard
      title="Notificações"
      icon="notifications"
      items={[
        {
          title: 'Sons',
          description: 'Alertas sonoros',
          value: sounds,
          onValueChange: setSounds,
        },
        {
          title: 'Vibração',
          description: 'Feedback tátil',
          value: vibration,
          onValueChange: setVibration,
        },
      ]}
    />
  );
}
