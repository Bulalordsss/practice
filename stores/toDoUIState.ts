import { create } from 'zustand';

type ToDoUIState = {
  title: string;
  details: string;
  error: string | null;
  successMessage: string | null;

  setTitle: (value: string) => void;
  setDetails: (value: string) => void;
  setError: (value: string | null) => void;
  setSuccessMessage: (value: string | null) => void;
  reset: () => void;
};

export const useToDoUIState = create<ToDoUIState>((set) => ({
  title: '',
  details: '',
  error: null,
  successMessage: null,

  setTitle: (title) => set({ title }),
  setDetails: (details) => set({ details }),
  setError: (error) => set({ error }),
  setSuccessMessage: (successMessage) => set({ successMessage }),
  reset: () =>
    set({
      title: '',
      details: '',
      error: null,
      successMessage: null,
    }),
}));
