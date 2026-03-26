import { create } from 'zustand';

type LoginUIState = {
  username: string;
  password: string;
  isSubmitting: boolean;
  error: string | null;

  setUsername: (v: string) => void;
  setPassword: (v: string) => void;
  setSubmitting: (v: boolean) => void;
  setError: (v: string | null) => void;
  reset: () => void;
};

export const useLoginUIState = create<LoginUIState>((set) => ({
  username: '',
  password: '',
  isSubmitting: false,
  error: null,

  setUsername: (username) => set({ username }),
  setPassword: (password) => set({ password }),
  setSubmitting: (isSubmitting) => set({ isSubmitting }),
  setError: (error) => set({ error }),

  reset: () =>
    set({
      username: '',
      password: '',
      isSubmitting: false,
      error: null,
    }),
}));
