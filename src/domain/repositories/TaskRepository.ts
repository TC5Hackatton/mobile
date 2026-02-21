import { CreateTaskDTO } from '@/src/data/dtos/task/CreateTaskDTO';
import { Task } from '../entities/Task';

export interface TaskRepository {
  fetchAll(): Promise<Task[]>;
  createTask(dto: CreateTaskDTO, uid: string): Promise<Task>;
}
