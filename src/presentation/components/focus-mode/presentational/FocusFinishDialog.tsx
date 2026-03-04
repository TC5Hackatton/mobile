import { Button, Dialog, Portal, Text } from 'react-native-paper';

interface Props {
  visible: boolean;
  taskTitle: string;
  onDismiss: () => void;
  onConfirm: () => void;
}

export function FocusFinishDialog({ visible, taskTitle, onDismiss, onConfirm }: Props) {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Finalizar Tarefa?</Dialog.Title>
        <Dialog.Content>
          <Text>Deseja marcar "{taskTitle}" como concluída e ir para a próxima?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Não</Button>
          <Button onPress={onConfirm}>Sim</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
