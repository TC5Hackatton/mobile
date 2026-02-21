import { TaskStatus, TimeType } from '@/src/domain';
import { ResponseTaskDTO } from '../../dtos/task/ResponseTaskDTO';
import { TaskMapper } from './TaskMapper';

describe('TaskMapper', () => {
  const mockDate = new Date();
  const baseDto: ResponseTaskDTO = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    timeType: 'cronometro',
    timeSpend: 3600,
    status: 'todo',
    uid: 'user-123',
    createdAt: mockDate,
  };

  describe('fromDtoToDomain', () => {
    it('should map ResponseTaskDTO to Task domain entity with CRONOMETRO time type', () => {
      const task = TaskMapper.fromDtoToDomain(baseDto);

      expect(task.id).toBe(baseDto.id);
      expect(task.title).toBe(baseDto.title);
      expect(task.description).toBe(baseDto.description);
      expect(task.timeType).toBe(TimeType.CRONOMETRO);
      expect(task.timeSpend).toBe(baseDto.timeSpend);
      expect(task.status).toBe(TaskStatus.TODO);
      expect(task.uid).toBe(baseDto.uid);
      expect(task.createdAt).toEqual(mockDate);
    });

    it('should map ResponseTaskDTO to Task domain entity with TEMPO_FIXO time type', () => {
      const dto: ResponseTaskDTO = {
        ...baseDto,
        id: '2',
        title: 'Fixed Time Task',
        description: 'Task with fixed time',
        timeType: 'tempo_fixo',
        timeSpend: 1800,
        status: 'doing',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.timeType).toBe(TimeType.TEMPO_FIXO);
      expect(task.status).toBe(TaskStatus.DOING);
      expect(task.id).toBe('2');
    });

    it('should map status "todo" to TaskStatus.TODO', () => {
      const dto: ResponseTaskDTO = {
        ...baseDto,
        status: 'todo',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.status).toBe(TaskStatus.TODO);
    });

    it('should map status "doing" to TaskStatus.DOING', () => {
      const dto: ResponseTaskDTO = {
        ...baseDto,
        status: 'doing',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.status).toBe(TaskStatus.DOING);
    });

    it('should map status "done" to TaskStatus.DONE', () => {
      const dto: ResponseTaskDTO = {
        ...baseDto,
        status: 'done',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.status).toBe(TaskStatus.DONE);
    });

    it('should preserve id as string', () => {
      const dto: ResponseTaskDTO = {
        ...baseDto,
        id: '999',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.id).toBe('999');
      expect(typeof task.id).toBe('string');
    });

    it('should map timeSpend correctly', () => {
      const dto: ResponseTaskDTO = {
        ...baseDto,
        timeSpend: 7200,
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.timeSpend).toBe(7200);
      expect(typeof task.timeSpend).toBe('number');
    });

    it('should handle empty description', () => {
      const dto: ResponseTaskDTO = {
        ...baseDto,
        description: '',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.description).toBe('');
    });

    it('should preserve uid from DTO', () => {
      const dto: ResponseTaskDTO = {
        ...baseDto,
        uid: 'specific-user-uid-123',
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.uid).toBe('specific-user-uid-123');
    });

    it('should set timeValue to 0 (default if not provided)', () => {
      const dto: ResponseTaskDTO = {
        ...baseDto,
        timeValue: undefined,
      };

      const task = TaskMapper.fromDtoToDomain(dto);

      expect(task.timeValue).toBe(0);
    });
  });
});
