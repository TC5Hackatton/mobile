import { TaskStatus } from '../enums/TaskStatus';
import { TimeType } from '../enums/TimeType';

export class Task {
  private constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly timeType: TimeType,
    public readonly timeValue: number,
    public readonly timeSpend: number,
    public readonly status: TaskStatus,
    public readonly createdAt: Date,
    public readonly id?: string,
    public readonly uid?: string,
  ) { }

  static create(
    title: string,
    description: string,
    timeType: TimeType,
    timeValue: number,
    timeSpend: number,
    status: TaskStatus,
    createdAt: Date,
    id?: string,
    uid?: string,
  ) {
    return new Task(title, description, timeType, timeValue, timeSpend, status, createdAt, id, uid);
  }
}
