import { TaskStatus } from '../enums/TaskStatus';
import { TimeType } from '../enums/TimeType';
import { Task } from './Task';

describe('Task Entity', () => {
  const date = new Date();

  it('should create a task with all required properties', () => {
    const task = Task.create(
      'Test Task',
      'Test Description',
      TimeType.CRONOMETRO,
      60,
      30,
      TaskStatus.TODO,
      date
    );

    expect(task.title).toBe('Test Task');
    expect(task.description).toBe('Test Description');
    expect(task.timeType).toBe(TimeType.CRONOMETRO);
    expect(task.timeValue).toBe(60);
    expect(task.timeSpend).toBe(30);
    expect(task.status).toBe(TaskStatus.TODO);
    expect(task.createdAt).toEqual(date);
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
      date,
      'task-123'
    );

    expect(task.createdAt).toEqual(date);
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
      date,
      undefined,
      'user-456'
    );

    expect(task.createdAt).toEqual(date);
    expect(task.id).toBeUndefined();
    expect(task.uid).toBe('user-456');
  });

  it('should create a task with all optional parameters', () => {
    const task = Task.create(
      'Complete Task',
      'Detailed Description',
      TimeType.TEMPO_FIXO,
      180,
      180,
      TaskStatus.DONE,
      date,
      'task-789',
      'user-101'
    );

    expect(task.title).toBe('Complete Task');
    expect(task.description).toBe('Detailed Description');
    expect(task.timeType).toBe(TimeType.TEMPO_FIXO);
    expect(task.timeValue).toBe(180);
    expect(task.timeSpend).toBe(180);
    expect(task.status).toBe(TaskStatus.DONE);
    expect(task.createdAt).toEqual(date);
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
      TaskStatus.TODO,
      date
    );

    const tempoFixoTask = Task.create(
      'Tempo Fixo Task',
      'Description',
      TimeType.TEMPO_FIXO,
      120,
      0,
      TaskStatus.TODO,
      date
    );

    expect(cronometroTask.timeType).toBe(TimeType.CRONOMETRO);
    expect(tempoFixoTask.timeType).toBe(TimeType.TEMPO_FIXO);
  });

  it('should create tasks with different statuses', () => {
    const todoTask = Task.create('Task 1', 'Desc', TimeType.CRONOMETRO, 60, 0, TaskStatus.TODO, date);
    const doingTask = Task.create('Task 2', 'Desc', TimeType.CRONOMETRO, 60, 30, TaskStatus.DOING, date);
    const doneTask = Task.create('Task 3', 'Desc', TimeType.CRONOMETRO, 60, 60, TaskStatus.DONE, date);

    expect(todoTask.status).toBe(TaskStatus.TODO);
    expect(doingTask.status).toBe(TaskStatus.DOING);
    expect(doneTask.status).toBe(TaskStatus.DONE);
  });

  describe('getters', () => {
    it('should return correct statusLabel', () => {
      const todoTask = Task.create('Task 1', 'Desc', TimeType.CRONOMETRO, 60, 0, TaskStatus.TODO, date);
      const doingTask = Task.create('Task 2', 'Desc', TimeType.CRONOMETRO, 60, 30, TaskStatus.DOING, date);
      const doneTask = Task.create('Task 3', 'Desc', TimeType.CRONOMETRO, 60, 60, TaskStatus.DONE, date);

      expect(todoTask.statusLabel).toBe('A Fazer');
      expect(doingTask.statusLabel).toBe('Em Andamento');
      expect(doneTask.statusLabel).toBe('Concluído');
    });

    it('should return correct createdAtLabel', () => {
      const fixedDate = new Date(2024, 0, 1);
      const task = Task.create('Task 1', 'Desc', TimeType.CRONOMETRO, 60, 0, TaskStatus.TODO, fixedDate);

      expect(task.createdAtLabel).toBe(fixedDate.toLocaleDateString());
    });

    describe('shortDescription', () => {
      it('should return full description if length is within limit (30 chars)', () => {
        const description = 'Short description';
        const task = Task.create('Task 1', description, TimeType.CRONOMETRO, 60, 0, TaskStatus.TODO, date);

        expect(task.shortDescription).toBe(description);
      });

      it('should return truncated description if length exceeds limit (30 chars)', () => {
        const description = 'This is a very long description that exceeds thirty characters';
        const task = Task.create('Task 1', description, TimeType.CRONOMETRO, 60, 0, TaskStatus.TODO, date);

        const expected = description.substring(0, 30) + '...';
        expect(task.shortDescription).toBe(expected);
      });

      it('should return full description if length is exactly 30 characters', () => {
        const description = '123456789012345678901234567890'; // 30 chars
        const task = Task.create('Task 1', description, TimeType.CRONOMETRO, 60, 0, TaskStatus.TODO, date);

        expect(task.shortDescription).toBe(description);
      });
    });
  });
});
