import { fireEvent, render, screen } from '@testing-library/react-native';
import { router } from 'expo-router';
import { FocusEmptyState } from './FocusEmptyState';

jest.mock('expo-router', () => ({
  router: { back: jest.fn() },
}));

describe('FocusEmptyState', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders the empty state message', () => {
    render(<FocusEmptyState />);
    expect(screen.getByText('Nenhuma tarefa pendente encontrada.')).toBeTruthy();
  });

  it('renders the back button', () => {
    render(<FocusEmptyState />);
    expect(screen.getByText('Voltar')).toBeTruthy();
  });

  it('calls router.back() when the back button is pressed', () => {
    render(<FocusEmptyState />);
    fireEvent.press(screen.getByText('Voltar'));
    expect(router.back).toHaveBeenCalledTimes(1);
  });
});
