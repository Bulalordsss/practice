import { insertLocalTodo } from '@/lib/todoDatabase';
import { useTodoListStoreData } from '@/stores/toDolistStoreData';

export function useCreateToDo() {
  const addLocalTodo = useTodoListStoreData((s) => s.addLocalTodo);

  const createToDo = async (title: string, details: string) => {
    const trimmedTitle = title.trim();
    const trimmedDetails = details.trim();

    if (!trimmedTitle) {
      return null;
    }

    const newTodo = await insertLocalTodo(trimmedTitle, trimmedDetails);
    addLocalTodo(newTodo);
    return newTodo;
  };

  return { createToDo };
}
