import { create } from 'zustand';
import type { LocalTodoItem } from '@/lib/todoDatabase';

export type TodoItem = {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
};

type TodoListStoreData = {
  recentActivities: TodoItem[];
  recentActivitiesTotalCount: number;
  localTodoList: LocalTodoItem[];

  setRecentActivities: (value: TodoItem[]) => void;
  appendRecentActivities: (value: TodoItem[]) => void;
  setRecentActivitiesTotalCount: (value: number) => void;
  setLocalTodoList: (value: LocalTodoItem[]) => void;
  addLocalTodo: (value: LocalTodoItem) => void;
  updateLocalTodo: (value: LocalTodoItem) => void;
  hideLocalTodo: (id: number) => void;
  clearRecentActivities: () => void;
};

export const useTodoListStoreData = create<TodoListStoreData>((set) => ({
  recentActivities: [],
  recentActivitiesTotalCount: 0,
  localTodoList: [],

  setRecentActivities: (recentActivities) => set({ recentActivities }),
  appendRecentActivities: (value) =>
    set((state) => {
      const existingIds = new Set(state.recentActivities.map((item) => item.id));
      const nextItems = value.filter((item) => !existingIds.has(item.id));

      return {
        recentActivities: [...state.recentActivities, ...nextItems],
      };
    }),
  setRecentActivitiesTotalCount: (recentActivitiesTotalCount) => set({ recentActivitiesTotalCount }),
  setLocalTodoList: (localTodoList) => set({ localTodoList }),
  addLocalTodo: (value) =>
    set((state) => ({
      localTodoList: [value, ...state.localTodoList],
    })),
  updateLocalTodo: (value) =>
    set((state) => ({
      localTodoList: state.localTodoList.map((item) => (item.id === value.id ? value : item)),
    })),
  hideLocalTodo: (id) =>
    set((state) => ({
      localTodoList: state.localTodoList.filter((item) => item.id !== id),
    })),
  clearRecentActivities: () => set({ recentActivities: [], recentActivitiesTotalCount: 0 }),
}));
