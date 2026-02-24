import { TaskStatus } from '@/src/domain';
import { useTask } from '@/src/presentation/contexts/TaskContext';
import { act, renderHook, waitFor } from '@testing-library/react-native'; // waitFor aqui
import { useFocusViewModel } from './useFocusViewModel';

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

describe('useFocusViewModel', () => {
  const mockCurrentTask = { id: '1', title: 'Task 1', timeValue: 25, status: TaskStatus.TODO };
  const mockNextTask = { id: '2', title: 'Task 2', timeValue: 30, status: TaskStatus.TODO };

  const mockGetFocusTasksUseCase = { execute: jest.fn() };
  const mockUpdateTaskStatusUseCase = { execute: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useTask as jest.Mock).mockReturnValue({
      getFocusTasksUseCase: mockGetFocusTasksUseCase,
      updateTaskStatusUseCase: mockUpdateTaskStatusUseCase,
    });

    mockGetFocusTasksUseCase.execute.mockResolvedValue({
      current: mockCurrentTask,
      next: mockNextTask,
    });
  });

  it('must load the initial tasks and change the loading setting to false.', async () => {
    const { result } = renderHook(() => useFocusViewModel());

    expect(result.current.loading).toBe(true);

    // Substituímos waitForNextUpdate por waitFor
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.currentTask).toEqual(mockCurrentTask);
    expect(result.current.nextTask).toEqual(mockNextTask);
  });

  it('must toggle the timer and update the status in the database when handleToggleTimer is called', async () => {
    const { result } = renderHook(() => useFocusViewModel());

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.handleToggleTimer();
    });

    expect(mockUpdateTaskStatusUseCase.execute).toHaveBeenCalledWith(mockCurrentTask, TaskStatus.DOING);
    expect(mockGetFocusTasksUseCase.execute).toHaveBeenCalledTimes(2);
  });

  it('must finish the task and load the next task when handleFinishTask is called', async () => {
    const { result } = renderHook(() => useFocusViewModel());

    await waitFor(() => expect(result.current.loading).toBe(false));

    mockGetFocusTasksUseCase.execute.mockResolvedValue({
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
    mockGetFocusTasksUseCase.execute.mockRejectedValue(new Error('Falha no banco'));

    const { result } = renderHook(() => useFocusViewModel());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.currentTask).toBeNull();
  });
});
