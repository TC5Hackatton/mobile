import { Task, TaskStatus, TimeType } from '@/src/domain';
import { useThemeColors } from '@/src/presentation/hooks/use-theme-colors';
import { act, render, screen } from '@testing-library/react-native';
import { RunningTimer } from './RunningTimer';

jest.mock('@/src/presentation/hooks/use-theme-colors');

const mockColors = {
  textSecondary: '#666',
};

describe('RunningTimer', () => {
  beforeEach(() => {
    (useThemeColors as jest.Mock).mockReturnValue(mockColors);
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render the initial state as 0m 00s regardless of task.timeSpend', () => {
    const task = Task.create(
      'Title',
      'Desc',
      TimeType.CRONOMETRO,
      0,
      10.5, // 10m 30s
      TaskStatus.DOING,
      new Date(),
      'id',
      'uid',
      new Date(),
    );

    render(<RunningTimer task={task} />);

    // Should be 0m 00s even if timeSpend is 10.5
    expect(screen.getByTestId('timer-text')).toHaveTextContent('0m 00s');
  });

  it('should update the timer every second', () => {
    const startTime = new Date(2024, 0, 1, 12, 0, 0);
    const task = Task.create(
      'Title',
      'Desc',
      TimeType.CRONOMETRO,
      0,
      10,
      TaskStatus.DOING,
      new Date(),
      'id',
      'uid',
      startTime,
    );

    jest.setSystemTime(startTime);
    render(<RunningTimer task={task} />);

    expect(screen.getByTestId('timer-text')).toHaveTextContent('0m 00s');

    // Advance 30 seconds
    act(() => {
      jest.advanceTimersByTime(30000);
    });

    expect(screen.getByTestId('timer-text')).toHaveTextContent('0m 30s');

    // Advance 1 minute more
    act(() => {
      jest.advanceTimersByTime(60000);
    });

    expect(screen.getByTestId('timer-text')).toHaveTextContent('1m 30s');
  });

  it('should not start the interval if task status is not DOING', () => {
    const task = Task.create('Title', 'Desc', TimeType.CRONOMETRO, 0, 10, TaskStatus.TODO, new Date());

    render(<RunningTimer task={task} />);

    expect(screen.getByTestId('timer-text')).toHaveTextContent('0m 00s');

    // Advance time
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    // Should still be 0m 00s
    expect(screen.getByTestId('timer-text')).toHaveTextContent('0m 00s');
  });
});
