import { CreateTaskDTO } from '@/src/data/dtos/task/CreateTaskDTO';
import { Task } from '../entities/Task';

export interface TaskRepository {
  createTask(dto: CreateTaskDTO, uid: string): Promise<void>;
  fetchAll(uid: string): Promise<Task[]>;
  fetchOldestTodoStatus(uid: string): Promise<Task | null>;
  updateTask(task: Task): Promise<void>;
}
