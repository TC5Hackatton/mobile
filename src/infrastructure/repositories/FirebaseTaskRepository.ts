import firebaseConfig from '@/firebaseConfig';
import { CreateTaskDTO } from '@/src/data';
import { ResponseTaskDTO } from '@/src/data/dtos/task/ResponseTaskDTO';
import { TaskMapper } from '@/src/data/mappers/task/TaskMapper';
import { Task, TaskRepository, TaskStatus } from '@/src/domain';
import { addDoc, collection, doc, getDocs, limit, orderBy, query, updateDoc, where } from 'firebase/firestore';

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

  async fetchOldestTodoStatus(uid: string): Promise<Task | null> {
    // Note: interesting enough, to be able to perform this query, we need to create an index in Firebase
    const builtQuery = query(collection(firebaseConfig.db, 'tasks'), where('status', '==', TaskStatus.TODO), where('uid', '==', uid), orderBy("createdAt", "asc"), limit(1));
    const querySnapshot = await getDocs(builtQuery);

    if (!querySnapshot.empty) {
      const oldestDoc = querySnapshot.docs[0];
      return TaskMapper.fromDtoToDomain({
        ...oldestDoc.data(),
        id: oldestDoc.id,
        createdAt: oldestDoc.data()?.createdAt?.toDate(),
        statusChangedAt: oldestDoc.data()?.statusChangedAt?.toDate(),
      } as ResponseTaskDTO);
    } else {
      return null;
    }
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
