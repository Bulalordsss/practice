import { useCallback } from 'react';

import { getLocalTodos, initializeTodoDatabase } from '@/lib/todoDatabase';
import { useTodoListStoreData } from '@/stores/toDolistStoreData';

export function useGetLocalToDoList() {
  const localTodoList = useTodoListStoreData((s) => s.localTodoList);
  const setLocalTodoList = useTodoListStoreData((s) => s.setLocalTodoList);

  const getToDoList = useCallback(async () => {
    await initializeTodoDatabase();
    const todos = await getLocalTodos();
    setLocalTodoList(todos);
    return todos;
  }, [setLocalTodoList]);

  return {
    localTodoList,
    getToDoList,
  };
}
