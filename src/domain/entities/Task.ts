import { TaskStatus } from '../enums/TaskStatus';
import { TimeType } from '../enums/TimeType';

export class Task {
  private constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly time_type: TimeType,
    public readonly time_value: number,
    public readonly time_spend: number,
    public readonly status: TaskStatus,
    public readonly created_at: Date,
    public readonly id?: string,
    public readonly uid?: string,
  ) {}

  static create(
    title: string,
    description: string,
    time_type: TimeType,
    time_value: number,
    time_spend: number,
    status: TaskStatus,
    created_at: Date,
    id?: string,
    uid?: string,
  ) {
    return new Task(title, description, time_type, time_value, time_spend, status, created_at, id, uid);
  }
}
