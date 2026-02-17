import { Task } from './Task';
import { TaskStatus } from '../enums/TaskStatus';
import { TimeType } from '../enums/TimeType';

describe('Task Entity', () => {
  describe('create', () => {
    it('should create a task with all required properties', () => {
      const task = Task.create(
        'Test Task',
        'Test Description',
        TimeType.CRONOMETRO,
        60,
        30,
        TaskStatus.TODO
      );

      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
      expect(task.time_type).toBe(TimeType.CRONOMETRO);
      expect(task.time_value).toBe(60);
      expect(task.time_spent).toBe(30);
      expect(task.status).toBe(TaskStatus.TODO);
      expect(task.id).toBeUndefined();
      expect(task.uid).toBeUndefined();
    });

    it('should create a task with optional id parameter', () => {
      const task = Task.create(
        'Test Task',
        'Test Description',
        TimeType.TEMPO_FIXO,
        120,
        0,
        TaskStatus.DOING,
        'task-123'
      );

      expect(task.id).toBe('task-123');
      expect(task.uid).toBeUndefined();
    });

    it('should create a task with optional uid parameter', () => {
      const task = Task.create(
        'Test Task',
        'Test Description',
        TimeType.CRONOMETRO,
        90,
        45,
        TaskStatus.DONE,
        undefined,
        'user-456'
      );

      expect(task.id).toBeUndefined();
      expect(task.uid).toBe('user-456');
    });

    it('should create a task with both optional parameters', () => {
      const task = Task.create(
        'Complete Task',
        'Detailed Description',
        TimeType.TEMPO_FIXO,
        180,
        180,
        TaskStatus.DONE,
        'task-789',
        'user-101'
      );

      expect(task.title).toBe('Complete Task');
      expect(task.description).toBe('Detailed Description');
      expect(task.time_type).toBe(TimeType.TEMPO_FIXO);
      expect(task.time_value).toBe(180);
      expect(task.time_spent).toBe(180);
      expect(task.status).toBe(TaskStatus.DONE);
      expect(task.id).toBe('task-789');
      expect(task.uid).toBe('user-101');
    });

    it('should create tasks with different time types', () => {
      const cronometroTask = Task.create(
        'Cronometro Task',
        'Description',
        TimeType.CRONOMETRO,
        60,
        0,
        TaskStatus.TODO
      );

      const tempoFixoTask = Task.create(
        'Tempo Fixo Task',
        'Description',
        TimeType.TEMPO_FIXO,
        120,
        0,
        TaskStatus.TODO
      );

      expect(cronometroTask.time_type).toBe(TimeType.CRONOMETRO);
      expect(tempoFixoTask.time_type).toBe(TimeType.TEMPO_FIXO);
    });

    it('should create tasks with different statuses', () => {
      const todoTask = Task.create('Task 1', 'Desc', TimeType.CRONOMETRO, 60, 0, TaskStatus.TODO);
      const doingTask = Task.create('Task 2', 'Desc', TimeType.CRONOMETRO, 60, 30, TaskStatus.DOING);
      const doneTask = Task.create('Task 3', 'Desc', TimeType.CRONOMETRO, 60, 60, TaskStatus.DONE);

      expect(todoTask.status).toBe(TaskStatus.TODO);
      expect(doingTask.status).toBe(TaskStatus.DOING);
      expect(doneTask.status).toBe(TaskStatus.DONE);
    });
  });
});
