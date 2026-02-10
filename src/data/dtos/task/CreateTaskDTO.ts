import { TaskStatus } from '@/src/domain';

export interface CreateTaskDTO {
  description: string;
  status: TaskStatus;
  timeSpent: number;
  timeType: string;
  title: string;
}
