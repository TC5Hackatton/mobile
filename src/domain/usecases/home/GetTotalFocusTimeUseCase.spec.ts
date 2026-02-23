import { TaskRepository } from '@/src/domain/repositories/TaskRepository';
import { GetStoredSessionUseCase } from '@/src/domain/usecases/user/GetStoredSessionUseCase';
import { GetTotalFocusTimeUseCase } from './GetTotalFocusTimeUseCase';

describe('GetTotalFocusTimeUseCase', () => {
  let useCase: GetTotalFocusTimeUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepository>;
  let mockGetStoredSessionUseCase: jest.Mocked<GetStoredSessionUseCase>;

  beforeEach(() => {
    mockTaskRepository = { fetchAll: jest.fn() } as any;
    mockGetStoredSessionUseCase = { execute: jest.fn() } as any;
    useCase = new GetTotalFocusTimeUseCase(mockTaskRepository, mockGetStoredSessionUseCase);
  });

  describe('execute', () => {
    it('should round up 0.73 to 1 min (Math.round rule)', async () => {
      mockGetStoredSessionUseCase.execute.mockResolvedValue({ uid: 'user_1' } as any);
      mockTaskRepository.fetchAll.mockResolvedValue([{ uid: 'user_1', timeSpend: 0.73 }] as any);

      const result = await useCase.execute();

      expect(result).toBe('1 min');
    });

    it('should round down 0.49 to 0 min', async () => {
      mockGetStoredSessionUseCase.execute.mockResolvedValue({ uid: 'user_1' } as any);
      mockTaskRepository.fetchAll.mockResolvedValue([{ uid: 'user_1', timeSpend: 0.49 }] as any);

      const result = await useCase.execute();

      expect(result).toBe('0 min');
    });

    it('should format hours and minutes correctly (e.g., 65.7 min -> 66 min -> 1h 6min)', async () => {
      mockGetStoredSessionUseCase.execute.mockResolvedValue({ uid: 'user_1' } as any);
      mockTaskRepository.fetchAll.mockResolvedValue([{ uid: 'user_1', timeSpend: 65.7 }] as any);

      const result = await useCase.execute();

      expect(result).toBe('1h 6min');
    });

    it('should handle multiple tasks for the same user', async () => {
      mockGetStoredSessionUseCase.execute.mockResolvedValue({ uid: 'user_1' } as any);
      mockTaskRepository.fetchAll.mockResolvedValue([
        { uid: 'user_1', timeSpend: 10.5 },
        { uid: 'user_1', timeSpend: 5.2 },
      ] as any);

      const result = await useCase.execute();

      // 10.5 + 5.2 = 15.7 -> round -> 16
      expect(result).toBe('16 min');
    });
  });
});
