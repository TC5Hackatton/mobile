import firebaseConfig from '@/firebaseConfig';
import { CreateTaskDTO } from '@/src/data';
import { Task, TaskRepository } from '@/src/domain';
import { addDoc, collection } from 'firebase/firestore';

export class FirebaseTaskRepository implements TaskRepository {
  async createTask(dto: CreateTaskDTO, uid: string): Promise<Task> {
    const response = await addDoc(collection(firebaseConfig.db, 'tasks'), { ...dto, uid });
    // TODO: clean and adapt the return
    console.log('## CL ## response', response);

    return null as unknown as Task;
  }
}
