import { Task, TaskStatus, TimeType } from '@/src/domain';
import { FirebaseTaskRepository } from './FirebaseTaskRepository';

jest.mock('firebase/firestore', () => ({
  addDoc: jest.fn(),
  collection: jest.fn(() => ({ id: 'mock-collection' })),
  doc: jest.fn(() => ({ id: 'mock-doc' })),
  getDocs: jest.fn(),
  query: jest.fn(),
  updateDoc: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
}));

jest.mock('@/firebaseConfig', () => ({
  __esModule: true,
  default: {
    db: {},
  },
}));

const { addDoc, collection, doc, getDocs, query, updateDoc, where } = require('firebase/firestore');
const firebaseConfig = require('@/firebaseConfig').default;

describe('FirebaseTaskRepository', () => {
  let repository: FirebaseTaskRepository;

  beforeEach(() => {
    repository = new FirebaseTaskRepository();
    jest.clearAllMocks();
  });

  describe('fetchAll', () => {
    it('should fetch and map all tasks', async () => {
      const mockDocs = [
        {
          id: '1',
          data: () => ({
            title: 'Task 1',
            status: TaskStatus.TODO,
            createdAt: { toDate: () => new Date() },
          }),
        },
      ];
      const mockSnapshot = {
        forEach: (callback: Function) => mockDocs.forEach((doc) => callback(doc)),
      };
      getDocs.mockResolvedValue(mockSnapshot);

      const result = await repository.fetchAll();

      expect(query).toHaveBeenCalled();
      expect(collection).toHaveBeenCalledWith(firebaseConfig.db, 'tasks');
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Task);
    });
  });

  describe('fetchOldestTodoStatus', () => {
    it('should return the oldest TODO task', async () => {
      const mockDoc = {
        id: 'oldest',
        data: () => ({
          title: 'Oldest Task',
          status: TaskStatus.TODO,
          createdAt: { toDate: () => new Date() },
        }),
      };
      const mockSnapshot = {
        empty: false,
        docs: [mockDoc],
      };
      getDocs.mockResolvedValue(mockSnapshot);

      const result = await repository.fetchOldestTodoStatus();

      expect(where).toHaveBeenCalledWith('status', '==', TaskStatus.TODO);
      expect(result?.id).toBe('oldest');
    });

    it('should return null if no TODO tasks found', async () => {
      getDocs.mockResolvedValue({ empty: true });

      const result = await repository.fetchOldestTodoStatus();

      expect(result).toBeNull();
    });
  });

  describe('createTask', () => {
    it('should call addDoc with task data', async () => {
      const dto = { title: 'New', description: 'Desc', timeType: TimeType.CRONOMETRO };
      addDoc.mockResolvedValue({ id: 'new-id' });

      await repository.createTask(dto as any, 'uid');

      expect(addDoc).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ ...dto, uid: 'uid' }));
    });

    it('should throw error if required fields are missing', async () => {
      await expect(repository.createTask({} as any, 'uid')).rejects.toThrow('Por favor, preencha todos os campos!');
    });
  });

  describe('updateTask', () => {
    it('should call updateDoc with partial data', async () => {
      const task = Task.create('Title', 'Desc', TimeType.CRONOMETRO, 0, 10, TaskStatus.DONE, new Date(), 'id', 'uid');

      await repository.updateTask(task);

      expect(doc).toHaveBeenCalledWith(firebaseConfig.db, 'tasks', 'id');
      expect(updateDoc).toHaveBeenCalledWith(expect.anything(), {
        status: TaskStatus.DONE,
        timeSpend: 10,
        statusChangedAt: null,
      });
    });
  });
});
