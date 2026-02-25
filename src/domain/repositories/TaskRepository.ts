import { CreateTaskDTO } from '@/src/data/dtos/task/CreateTaskDTO';
import { Task } from '../entities/Task';

export interface TaskRepository {
  fetchAll(uid: string): Promise<Task[]>;
  fetchOldestTodoStatus(): Promise<Task | null>;
  createTask(dto: CreateTaskDTO, uid: string): Promise<void>;
  updateTask(task: Task): Promise<void>;
}
