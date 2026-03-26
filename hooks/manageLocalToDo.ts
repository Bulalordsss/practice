import { hideLocalTodo as hideLocalTodoInDb, updateLocalTodo as updateLocalTodoInDb } from '@/lib/todoDatabase';
import { useTodoListStoreData } from '@/stores/toDolistStoreData';

export function useManageLocalToDo() {
  const localTodoList = useTodoListStoreData((s) => s.localTodoList);
  const updateLocalTodo = useTodoListStoreData((s) => s.updateLocalTodo);
  const hideLocalTodo = useTodoListStoreData((s) => s.hideLocalTodo);

  const saveLocalTodo = async (payload: {
    id: number;
    title: string;
    details: string;
    completed: boolean;
  }) => {
    await updateLocalTodoInDb(payload.id, payload);

    const existingTodo = localTodoList.find((item) => item.id === payload.id);
    if (!existingTodo) {
      return null;
    }

    const nextTodo = {
      ...existingTodo,
      title: payload.title,
      details: payload.details,
      completed: payload.completed,
    };

    updateLocalTodo(nextTodo);
    return nextTodo;
  };

  const archiveLocalTodo = async (id: number) => {
    await hideLocalTodoInDb(id);
    hideLocalTodo(id);
  };

  return {
    saveLocalTodo,
    archiveLocalTodo,
  };
}
