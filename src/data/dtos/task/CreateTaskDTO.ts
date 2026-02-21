import { TaskStatus } from '@/src/domain';

export interface CreateTaskDTO {
  description: string;
  status: TaskStatus;
  timeValue?: number;
  timeSpend: number;
  timeType: string;
  title: string;
}
