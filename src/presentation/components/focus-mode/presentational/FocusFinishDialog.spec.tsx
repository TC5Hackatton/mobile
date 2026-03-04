import { fireEvent, render, screen } from '@testing-library/react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { FocusFinishDialog } from './FocusFinishDialog';

const renderWithProvider = (ui: React.ReactElement) => render(<PaperProvider>{ui}</PaperProvider>);

describe('FocusFinishDialog', () => {
  const onDismiss = jest.fn();
  const onConfirm = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('renders the dialog title and task name when visible', () => {
    renderWithProvider(
      <FocusFinishDialog
        visible={true}
        taskTitle="Implementar tela de login"
        onDismiss={onDismiss}
        onConfirm={onConfirm}
      />,
    );

    expect(screen.getByText('Finalizar Tarefa?')).toBeTruthy();
    expect(screen.getByText(/Implementar tela de login/)).toBeTruthy();
  });

  it('calls onDismiss when the "Não" button is pressed', () => {
    renderWithProvider(
      <FocusFinishDialog visible={true} taskTitle="Qualquer tarefa" onDismiss={onDismiss} onConfirm={onConfirm} />,
    );

    fireEvent.press(screen.getByText('Não'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('calls onConfirm when the "Sim" button is pressed', () => {
    renderWithProvider(
      <FocusFinishDialog visible={true} taskTitle="Qualquer tarefa" onDismiss={onDismiss} onConfirm={onConfirm} />,
    );

    fireEvent.press(screen.getByText('Sim'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onDismiss).not.toHaveBeenCalled();
  });
});
