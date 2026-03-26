import { create } from 'zustand';

import type { LocalTodoItem } from '@/lib/todoDatabase';

type ToDoListUIState = {
  selectedTodoId: number | null;
  editTitle: string;
  editDetails: string;
  editCompleted: boolean;
  searchQuery: string;
  statusFilter: 'all' | 'todo' | 'complete';

  openEditor: (todo: LocalTodoItem) => void;
  closeEditor: () => void;
  setEditTitle: (value: string) => void;
  setEditDetails: (value: string) => void;
  setEditCompleted: (value: boolean) => void;
  setSearchQuery: (value: string) => void;
  setStatusFilter: (value: 'all' | 'todo' | 'complete') => void;
};

export const useToDoListUIState = create<ToDoListUIState>((set) => ({
  selectedTodoId: null,
  editTitle: '',
  editDetails: '',
  editCompleted: false,
  searchQuery: '',
  statusFilter: 'all',

  openEditor: (todo) =>
    set({
      selectedTodoId: todo.id,
      editTitle: todo.title,
      editDetails: todo.details,
      editCompleted: todo.completed,
    }),
  closeEditor: () =>
    set({
      selectedTodoId: null,
      editTitle: '',
      editDetails: '',
      editCompleted: false,
    }),
  setEditTitle: (editTitle) => set({ editTitle }),
  setEditDetails: (editDetails) => set({ editDetails }),
  setEditCompleted: (editCompleted) => set({ editCompleted }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
}));
