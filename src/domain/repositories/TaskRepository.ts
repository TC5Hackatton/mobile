import { CreateTaskDTO } from '@/src/data/dtos/task/CreateTaskDTO';
import { Task } from '../entities/Task';

export interface TaskRepository {
  createTask(dto: CreateTaskDTO, uid: string): Promise<Task>;
}
