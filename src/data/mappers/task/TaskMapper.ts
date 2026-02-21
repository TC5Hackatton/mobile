import { Task, TaskStatus, TimeType } from '@/src/domain';
import { ResponseTaskDTO } from '../../dtos/task/ResponseTaskDTO';

export class TaskMapper {
  static fromDtoToDomain(task: ResponseTaskDTO): Task {
    return Task.create(
      task.title,
      task.description,
      task.timeType === 'cronometro' ? TimeType.CRONOMETRO : TimeType.TEMPO_FIXO,
      Number(task.timeValue || 0),
      Number(task.timeSpend || 0),
      task.status === 'todo' ? TaskStatus.TODO : task.status === 'doing' ? TaskStatus.DOING : TaskStatus.DONE,
      task.createdAt,
      task.id,
      task.uid,
      task.statusChangedAt,
    );
  }
}
