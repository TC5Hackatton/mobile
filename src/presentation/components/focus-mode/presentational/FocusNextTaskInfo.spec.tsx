import { Task } from '@/src/domain';
import { TaskStatus } from '@/src/domain/enums/TaskStatus';
import { TimeType } from '@/src/domain/enums/TimeType';
import { render, screen } from '@testing-library/react-native';
import { FocusNextTaskInfo } from './FocusNextTaskInfo';

const makeTask = (title: string, timeValue: number): Task =>
  Task.create(title, 'Description', TimeType.TEMPO_FIXO, timeValue, 0, TaskStatus.TODO, new Date(), 'id-1', 'uid-1');

describe('FocusNextTaskInfo', () => {
  it('always renders the section label', () => {
    render(<FocusNextTaskInfo nextTask={null} />);
    expect(screen.getByText('Próxima tarefa:')).toBeTruthy();
  });

  it('renders the next task title and duration when a task is provided', () => {
    const task = makeTask('Revisar documentação', 30);
    render(<FocusNextTaskInfo nextTask={task} />);

    expect(screen.getByText('Revisar documentação')).toBeTruthy();
    expect(screen.getByText('30 min')).toBeTruthy();
  });

  it('shows the empty queue message when nextTask is null', () => {
    render(<FocusNextTaskInfo nextTask={null} />);
    expect(screen.getByText('Não existem mais tarefas.')).toBeTruthy();
  });

  it('does not show the empty queue message when a task is provided', () => {
    const task = makeTask('Outra tarefa', 25);
    render(<FocusNextTaskInfo nextTask={task} />);

    expect(screen.queryByText('Não existem mais tarefas.')).toBeNull();
  });
});
