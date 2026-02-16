import firebaseConfig from '@/firebaseConfig';
import { CreateTaskDTO } from '@/src/data';
import { Task, TaskRepository } from '@/src/domain';
import { addDoc, collection, getDocs } from 'firebase/firestore';

export class FirebaseTaskRepository implements TaskRepository {
  async getAll(): Promise<Task[]> {
    const querySnapshot = await getDocs(collection(firebaseConfig.db, 'tasks'));

    const tasks: Task[] = [];
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data()}`);
      // TODO: call the mapper here
      tasks.push({ ...doc.data(), id: doc.id } as Task);
    });

    return tasks;
  }

  async createTask(dto: CreateTaskDTO, uid: string): Promise<Task> {
    if (!dto.title || !dto.description || !dto.timeType) {
      throw new Error('Por favor, preencha todos os campos!');
    }

    const response = await addDoc(collection(firebaseConfig.db, 'tasks'), { ...dto, uid });
    // TODO: clean and adapt the return
    console.log('## CL ## response', response);

    return null as unknown as Task;
  }
}
