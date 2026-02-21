import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { Task, TaskStatus, TimeType } from '@/src/domain';

jest.mock('@/src/presentation/hooks/use-theme-colors', () => ({
  useThemeColors: jest.fn(),
}));

jest.mock('../../shared/content-card', () => ({
  ContentCard: ({ children, style }: any) => {
    const { View } = require('react-native');
    return (
      <View testID="content-card" style={style}>
        {children}
      </View>
    );
  },
}));

jest.mock('react-native-paper', () => ({
  Badge: ({ children, style, size }: any) => {
    const { Text } = require('react-native');
    return (
      <Text testID="badge" style={style}>
        {children}
      </Text>
    );
  },
  Card: ({ children, style, theme }: any) => {
    const { View } = require('react-native');
    return (
      <View testID="task-card" style={style}>
        {children}
      </View>
    );
  },
  Text: ({ children, theme, variant }: any) => {
    const { Text: RNText } = require('react-native');
    return <RNText>{children}</RNText>;
  },
}));

const { Card } = require('react-native-paper');
Card.Content = ({ children }: any) => {
  const { View } = require('react-native');
  return <View>{children}</View>;
};

import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import TasksListCard from './TasksListCard';

const mockUseThemeColors = useThemeColors as jest.MockedFunction<typeof useThemeColors>;

const mockColors = {
  tertiary: '#6B9BD0',
  yellow: '#F5D06C',
  secondary: '#9ACA69',
  text: '#1A1F2E',
  surfaceVariant: '#FAFBFC',
} as any;

const createTask = (id: string, status: TaskStatus): Task =>
  Task.create('Task ' + id, 'Description ' + id, TimeType.TEMPO_FIXO, 60, 0, status, new Date(), id, 'user-1');

describe('TasksListCard', () => {
  beforeEach(() => {
    mockUseThemeColors.mockReturnValue(mockColors);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return null when tasks list is empty', () => {
    const { toJSON } = render(<TasksListCard tasks={[]} status={TaskStatus.TODO} />);
    expect(toJSON()).toBeNull();
  });

  it('should render a card per task with title and description', () => {
    const tasks = [createTask('1', TaskStatus.TODO), createTask('2', TaskStatus.TODO)];
    render(<TasksListCard tasks={tasks} status={TaskStatus.TODO} />);

    expect(screen.getAllByTestId('task-card')).toHaveLength(2);
    expect(screen.getByText(/Task 1/)).toBeTruthy();
    expect(screen.getByText(/Description 1/)).toBeTruthy();
  });

  it('should display the correct task count in the badge', () => {
    const tasks = [createTask('1', TaskStatus.TODO), createTask('2', TaskStatus.TODO)];
    render(<TasksListCard tasks={tasks} status={TaskStatus.TODO} />);

    expect(screen.getByTestId('badge').props.children).toBe(2);
  });

  it('should render multiple tasks', () => {
    const tasks = [
      createTask('1', TaskStatus.TODO),
      createTask('2', TaskStatus.TODO),
      createTask('3', TaskStatus.TODO),
    ];
    render(<TasksListCard tasks={tasks} status={TaskStatus.TODO} />);

    expect(screen.getAllByTestId('task-card')).toHaveLength(3);
    expect(screen.getByText(/Task 1/)).toBeTruthy();
    expect(screen.getByText(/Task 2/)).toBeTruthy();
    expect(screen.getByText(/Task 3/)).toBeTruthy();
  });

  describe('status label and badge color', () => {
    it('should display "A Fazer" label with tertiary color for TODO status', () => {
      render(<TasksListCard tasks={[createTask('1', TaskStatus.TODO)]} status={TaskStatus.TODO} />);

      expect(screen.getByText('A Fazer')).toBeTruthy();
      expect(screen.getByTestId('badge').props.style).toEqual(
        expect.objectContaining({ backgroundColor: mockColors.tertiary }),
      );
    });

    it('should display "Em Andamento" label with yellow color for DOING status', () => {
      render(<TasksListCard tasks={[createTask('1', TaskStatus.DOING)]} status={TaskStatus.DOING} />);

      expect(screen.getByText('Em Andamento')).toBeTruthy();
      expect(screen.getByTestId('badge').props.style).toEqual(
        expect.objectContaining({ backgroundColor: mockColors.yellow }),
      );
    });

    it('should display "Concluído" label with secondary color for DONE status', () => {
      render(<TasksListCard tasks={[createTask('1', TaskStatus.DONE)]} status={TaskStatus.DONE} />);

      expect(screen.getByText('Concluído')).toBeTruthy();
      expect(screen.getByTestId('badge').props.style).toEqual(
        expect.objectContaining({ backgroundColor: mockColors.secondary }),
      );
    });
  });
});
