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
  const mockCurrentTask = { id: '1', title: 'Task 1', timeValue: 25, timeSpend: 0, status: TaskStatus.DOING, statusChangedAt: new Date() };
  const mockNextTask = { id: '2', title: 'Task 2', timeValue: 30, timeSpend: 0, status: TaskStatus.TODO };

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

  it('must pause current task and start next task when handleNextTask is called', async () => {
    const { result } = renderHook(() => useFocusSession());

    await waitFor(() => expect(result.current.loading).toBe(false));

    mockFetchFocusTasksUseCase.execute.mockResolvedValue({
      current: mockNextTask,
      next: null,
    });

    await act(async () => {
      await result.current.handleNextTask();
    });

    // Current task (DOING) is paused → TODO
    expect(mockUpdateTaskStatusUseCase.execute).toHaveBeenCalledWith(mockCurrentTask, TaskStatus.TODO);
    // Next task is started → DOING
    expect(mockUpdateTaskStatusUseCase.execute).toHaveBeenCalledWith(mockNextTask, TaskStatus.DOING);
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

  it('passes total elapsed seconds and autoStart=true to useFocusTimer when the loaded task is DOING', async () => {
    const { useFocusTimer } = require('@/src/presentation/hooks/use-focus-timer');

    const statusChangedAt = new Date(Date.now() - 60_000); // 1 minute into current session
    const doingTask = {
      id: '1',
      title: 'Task DOING',
      timeValue: 25,
      timeSpend: 5,          // 5 minutes spent in previous sessions
      status: TaskStatus.DOING,
      statusChangedAt,
    };

    mockFetchFocusTasksUseCase.execute.mockResolvedValue({ current: doingTask, next: null });

    const { result } = renderHook(() => useFocusSession());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const lastCall = useFocusTimer.mock.calls.at(-1);
    const elapsedArg = lastCall?.[2] ?? 0;   // 3rd param: elapsedSeconds
    const autoStartArg = lastCall?.[3];       // 4th param: autoStart

    // 5 min previous (300s) + ~60s current session = ~360s total
    expect(elapsedArg).toBeGreaterThanOrEqual(358);
    expect(elapsedArg).toBeLessThanOrEqual(362);
    expect(autoStartArg).toBe(true);
  });

  it('passes elapsed seconds and autoStart=false when the loaded task is paused (TODO)', async () => {
    const { useFocusTimer } = require('@/src/presentation/hooks/use-focus-timer');

    const pausedTask = {
      id: '2',
      title: 'Task TODO',
      timeValue: 25,
      timeSpend: 3,   // 3 minutes spent before being paused
      status: TaskStatus.TODO,
      statusChangedAt: undefined,
    };

    mockFetchFocusTasksUseCase.execute.mockResolvedValue({ current: pausedTask, next: null });

    const { result } = renderHook(() => useFocusSession());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const lastCall = useFocusTimer.mock.calls.at(-1);
    expect(lastCall?.[2]).toBe(180); // 3 min * 60 = 180s
    expect(lastCall?.[3]).toBe(false);
  });
});
