import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { render, screen } from '@testing-library/react-native';
import StatCard from './StatCard';

jest.mock('@/src/presentation/hooks/use-theme-colors');
jest.mock('@expo/vector-icons/MaterialIcons', () => 'MaterialIcons');

const mockColors = {
  surfaceVariant: '#F0F0F0',
  text: '#000000',
  textSecondary: '#666666',
};

describe('StatCard', () => {
  beforeEach(() => {
    (useThemeColors as jest.Mock).mockReturnValue(mockColors);
  });

  it('should render the value correctly', () => {
    render(<StatCard icon="pending" iconColor="#666" value={7} label="A Fazer" />);

    expect(screen.getByTestId('stat-card-value')).toHaveTextContent('7');
  });

  it('should render the label correctly', () => {
    render(<StatCard icon="timelapse" iconColor="#888" value={3} label="Em Andamento" />);

    expect(screen.getByTestId('stat-card-label')).toHaveTextContent('Em Andamento');
  });

  it('should render the card container', () => {
    render(<StatCard icon="check-circle-outline" iconColor="#00f" value={5} label="Concluídas" />);

    expect(screen.getByTestId('stat-card')).toBeTruthy();
  });

  it('should render a zero value without errors', () => {
    render(<StatCard icon="group-work" iconColor="#f00" value={0} label="Tarefas Totais" />);

    expect(screen.getByTestId('stat-card-value')).toHaveTextContent('0');
  });
});
