import { Task, TaskStatus, TimeType } from "@/src/domain";
import { useThemeColors } from "@/src/presentation/hooks/use-theme-colors";
import { renderHook } from '@testing-library/react-native';
import useTaskLabels from './useTaskLabels';

jest.mock("@/src/presentation/hooks/use-theme-colors");

const mockColors = {
  mediumGray: '#888',
  secondary: '#0f0',
  primary: '#00f',
};

describe('useTaskLabels', () => {
  beforeEach(() => {
    (useThemeColors as jest.Mock).mockReturnValue(mockColors);
  });

  it('should generate correct labels for a task with timeValue and timeSpend', () => {
    const task = Task.create(
      'Title',
      'Desc',
      TimeType.CRONOMETRO,
      60,
      12.3456,
      TaskStatus.DOING,
      new Date()
    );

    const { result } = renderHook(() => useTaskLabels());
    const labels = result.current.calculateLabels(task);

    expect(labels).toHaveLength(2);

    // timeValue label
    expect(labels[0]).toEqual({
      icon: 'clock-outline',
      text: '60 min',
      color: mockColors.mediumGray,
    });

    // timeSpend label - should be rounded to 2 decimals
    expect(labels[1]).toEqual({
      icon: 'timer-sand',
      text: '12.35 min',
      color: mockColors.primary,
    });
  });

  it('should use correct icon and color when task is paused (TODO status)', () => {
    const task = Task.create(
      'Title',
      'Desc',
      TimeType.CRONOMETRO,
      0,
      5,
      TaskStatus.TODO,
      new Date()
    );

    const { result } = renderHook(() => useTaskLabels());
    const labels = result.current.calculateLabels(task);

    expect(labels).toHaveLength(1);
    expect(labels[0]).toEqual(expect.objectContaining({
      icon: 'timer-sand-paused',
      color: mockColors.primary,
    }));
  });

  it('should use secondary color when task is done', () => {
    const task = Task.create(
      'Title',
      'Desc',
      TimeType.CRONOMETRO,
      0,
      5,
      TaskStatus.DONE,
      new Date()
    );

    const { result } = renderHook(() => useTaskLabels());
    const labels = result.current.calculateLabels(task);

    expect(labels[0].color).toBe(mockColors.secondary);
  });

  it('should return empty array if no time info is available', () => {
    const task = Task.create(
      'Title',
      'Desc',
      TimeType.CRONOMETRO,
      0,
      0,
      TaskStatus.TODO,
      new Date()
    );

    const { result } = renderHook(() => useTaskLabels());
    const labels = result.current.calculateLabels(task);

    expect(labels).toHaveLength(0);
  });
});
