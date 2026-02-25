import firebaseConfig from '@/firebaseConfig';
import { CreateTaskDTO } from '@/src/data';
import { ResponseTaskDTO } from '@/src/data/dtos/task/ResponseTaskDTO';
import { TaskMapper } from '@/src/data/mappers/task/TaskMapper';
import { Task, TaskRepository } from '@/src/domain';
import { addDoc, collection, doc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';

export class FirebaseTaskRepository implements TaskRepository {
  async fetchAll(uid: string): Promise<Task[]> {
    const builtQuery = query(collection(firebaseConfig.db, 'tasks'), where('uid', '==', uid), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(builtQuery);

    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      tasks.push(TaskMapper.fromDtoToDomain({
        ...doc.data(),
        id: doc.id,
        createdAt: doc.data()?.createdAt?.toDate(),
        statusChangedAt: doc.data()?.statusChangedAt?.toDate(),
      } as ResponseTaskDTO));
    });

    return tasks;
  }

  async createTask(dto: CreateTaskDTO, uid: string): Promise<void> {
    if (!dto.title || !dto.description || !dto.timeType) {
      throw new Error('Por favor, preencha todos os campos!');
    }

    await addDoc(collection(firebaseConfig.db, 'tasks'), { ...dto, uid });
  }

  async updateTask(task: Task): Promise<void> {
    if (!task.id) throw new Error('Task ID is required for update');

    const taskRef = doc(firebaseConfig.db, 'tasks', task.id);
    await updateDoc(taskRef, {
      status: task.status,
      timeSpend: task.timeSpend,
      statusChangedAt: task.statusChangedAt || null,
    });
  }
}
