import { TaskStatus } from '../enums/TaskStatus';
import { TimeType } from '../enums/TimeType';

const SHORT_DESCRIPTION_DISPLAY_LENGTH = 20;

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

  get statusLabel() {
    switch (this.status) {
      case TaskStatus.DOING:
        return 'Em Andamento';
      case TaskStatus.DONE:
        return 'Concluído';
      default:
        return 'A Fazer';
    }
  }

  get createdAtLabel() {
    return this.createdAt.toLocaleDateString();
  }

  get shortDescription() {
    return this.description.length > SHORT_DESCRIPTION_DISPLAY_LENGTH ? this.description.substring(0, SHORT_DESCRIPTION_DISPLAY_LENGTH) + '...' : this.description;
  }
}
