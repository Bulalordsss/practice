import { create } from 'zustand';

export type AuthUser = {
  username: string;
};

type AuthDataState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;

  setAuth: (payload: { user: AuthUser; token: string }) => void;
  clearAuth: () => void;
};

export const useLoginStoreData = create<AuthDataState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: ({ user, token }) =>
    set({
      user,
      token,
      isAuthenticated: true,
    }),

  clearAuth: () =>
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    }),
}));