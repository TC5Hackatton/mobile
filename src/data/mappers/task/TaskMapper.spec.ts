import { TaskStatus, TimeType } from '@/src/domain';
import { ResponseTaskDTO } from '../../dtos/task/ResponseTaskDTO';
import { TaskMapper } from './TaskMapper';

describe('TaskMapper', () => {
  describe('fromDtoToDomain', () => {
    it('should map ResponseTaskDTO to Task domain entity with CRONOMETRO time type', () => {
      const dto: ResponseTaskDTO = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        timeType: 'cronometro',
        timeSpend: 3600,
        status: 'todo',
        uid: 'user-123',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.id).toBe('1');
      expect(task.title).toBe('Test Task');
      expect(task.description).toBe('Test Description');
      expect(task.time_type).toBe(TimeType.CRONOMETRO);
      expect(task.time_spend).toBe(3600);
      expect(task.status).toBe(TaskStatus.TODO);
      expect(task.uid).toBe('user-123');
    });

    it('should map ResponseTaskDTO to Task domain entity with TEMPO_FIXO time type', () => {
      const dto: ResponseTaskDTO = {
        id: '2',
        title: 'Fixed Time Task',
        description: 'Task with fixed time',
        timeType: 'tempo_fixo',
        timeSpend: 1800,
        status: 'doing',
        uid: 'user-456',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.time_type).toBe(TimeType.TEMPO_FIXO);
      expect(task.status).toBe(TaskStatus.DOING);
    });

    it('should map status "todo" to TaskStatus.TODO', () => {
      const dto: ResponseTaskDTO = {
        id: '3',
        title: 'Todo Task',
        description: 'Description',
        timeType: 'cronometro',
        timeSpend: 0,
        status: 'todo',
        uid: 'user-789',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.status).toBe(TaskStatus.TODO);
    });

    it('should map status "doing" to TaskStatus.DOING', () => {
      const dto: ResponseTaskDTO = {
        id: '4',
        title: 'Doing Task',
        description: 'Description',
        timeType: 'cronometro',
        timeSpend: 0,
        status: 'doing',
        uid: 'user-789',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.status).toBe(TaskStatus.DOING);
    });

    it('should map status "done" to TaskStatus.DONE', () => {
      const dto: ResponseTaskDTO = {
        id: '5',
        title: 'Done Task',
        description: 'Description',
        timeType: 'cronometro',
        timeSpend: 0,
        status: 'done',
        uid: 'user-789',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.status).toBe(TaskStatus.DONE);
    });

    it('should preserve id as string', () => {
      const dto: ResponseTaskDTO = {
        id: '999',
        title: 'Task',
        description: 'Description',
        timeType: 'cronometro',
        timeSpend: 0,
        status: 'todo',
        uid: 'user-123',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.id).toBe('999');
      expect(typeof task.id).toBe('string');
    });

    it('should map timeSpend correctly', () => {
      const dto: ResponseTaskDTO = {
        id: '6',
        title: 'Task',
        description: 'Description',
        timeType: 'cronometro',
        timeSpend: 7200,
        status: 'todo',
        uid: 'user-123',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.time_spend).toBe(7200);
      expect(typeof task.time_spend).toBe('number');
    });

    it('should handle empty description', () => {
      const dto: ResponseTaskDTO = {
        id: '7',
        title: 'Task with no description',
        description: '',
        timeType: 'cronometro',
        timeSpend: 0,
        status: 'todo',
        uid: 'user-123',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.description).toBe('');
    });

    it('should preserve uid from DTO', () => {
      const dto: ResponseTaskDTO = {
        id: '8',
        title: 'Task',
        description: 'Description',
        timeType: 'cronometro',
        timeSpend: 0,
        status: 'todo',
        uid: 'specific-user-uid-123',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.uid).toBe('specific-user-uid-123');
    });

    it('should set time_value to 0 (TODO implementation)', () => {
      const dto: ResponseTaskDTO = {
        id: '9',
        title: 'Task',
        description: 'Description',
        timeType: 'cronometro',
        timeSpend: 0,
        status: 'todo',
        uid: 'user-123',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      // Currently hardcoded to 0 in mapper
      expect(task.time_value).toBe(0);
    });
  });
});
