// Mock the entire infra dependency chain in one shot so Firebase ESM and
// AsyncStorage native modules are never resolved during tests.
jest.mock('@/src/presentation/contexts/DependenciesContext', () => ({
  useDependencies: jest.fn(),
}));

import { TaskStatus } from '@/src/domain';
import { useTask } from '@/src/presentation/contexts/TaskContext';
import { useFocusSession } from '@/src/presentation/hooks/use-focus-session';
import { act, renderHook, waitFor } from '@testing-library/react-native';

// Mock do Contexto de Tasks
jest.mock('@/src/presentation/contexts/TaskContext');

// Mock do hook de Timer
jest.mock('@/src/presentation/hooks/use-focus-timer', () => ({
  useFocusTimer: jest.fn(() => ({
    formatTime: () => '25:00',
    isActive: false,
    toggleTimer: jest.fn(),
    progress: 0,
  })),
}));

describe('useFocusSession', () => {
  const mockCurrentTask = { id: '1', title: 'Task 1', timeValue: 25, status: TaskStatus.TODO };
  const mockNextTask = { id: '2', title: 'Task 2', timeValue: 30, status: TaskStatus.TODO };

  const mockFetchFocusTasksUseCase = { execute: jest.fn() };
  const mockUpdateTaskStatusUseCase = { execute: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTask as jest.Mock).mockReturnValue({
      fetchFocusTasksUseCase: mockFetchFocusTasksUseCase,
      updateTaskStatusUseCase: mockUpdateTaskStatusUseCase,
    });

    mockFetchFocusTasksUseCase.execute.mockResolvedValue({
      current: mockCurrentTask,
      next: mockNextTask,
    });
  });

  it('must load the initial tasks and change the loading setting to false.', async () => {
    const { result } = renderHook(() => useFocusSession());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.currentTask).toEqual(mockCurrentTask);
    expect(result.current.nextTask).toEqual(mockNextTask);
  });

  it('must toggle the timer and update the status in the database when handleToggleTimer is called', async () => {
    const { result } = renderHook(() => useFocusSession());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleToggleTimer();
    });

    expect(mockUpdateTaskStatusUseCase.execute).toHaveBeenCalledWith(mockCurrentTask, TaskStatus.DOING);
    // No longer calls fetchFocusTasksUseCase on toggle — only 1 call (initial load)
    expect(mockFetchFocusTasksUseCase.execute).toHaveBeenCalledTimes(1);
  });

  it('must finish the task and load the next task when handleFinishTask is called', async () => {
    const { result } = renderHook(() => useFocusSession());

    await waitFor(() => expect(result.current.loading).toBe(false));

    mockFetchFocusTasksUseCase.execute.mockResolvedValue({
      current: mockNextTask,
      next: null,
    });

    await act(async () => {
      await result.current.handleFinishTask();
    });

    expect(mockUpdateTaskStatusUseCase.execute).toHaveBeenCalledWith(mockCurrentTask, TaskStatus.DONE);
    expect(result.current.currentTask).toEqual(mockNextTask);
    expect(result.current.showConfirm).toBe(false);
  });

  it('must handle errors during loading without freezing the loading state', async () => {
    console.error = jest.fn();
    mockFetchFocusTasksUseCase.execute.mockRejectedValue(new Error('Falha no banco'));

    const { result } = renderHook(() => useFocusSession());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.currentTask).toBeNull();
  });
});
