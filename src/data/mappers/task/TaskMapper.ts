import { Task, TaskStatus, TimeType } from '@/src/domain';
import { ResponseTaskDTO } from '../../dtos/task/ResponseTaskDTO';

export class TaskMapper {
  static fromDtoToDomain(task: ResponseTaskDTO): Task {
    return Task.create(
      task.title,
      task.description,
      task.timeType === 'cronometro' ? TimeType.CRONOMETRO : TimeType.TEMPO_FIXO,
      0, // TODO: vou ter que implementar o time_value
      Number(task.timeSpent),
      task.status === 'todo' ? TaskStatus.TODO : task.status === 'doing' ? TaskStatus.DOING : TaskStatus.DONE,
      String(task.id),
      task.uid,
    );
  }

  // static fromDomainToDto(entity: User): Partial<UserDTO> {
  //   return {
  //     id: Number(entity.id),
  //     name: entity.name,
  //     email: entity.email,
  //     password: entity.password,
  //     createdAt: entity.createdAt.toISOString(),
  //     updatedAt: entity.updatedAt.toISOString(),
  //   };
  // }
}
