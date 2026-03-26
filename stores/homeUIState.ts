import { create } from 'zustand';

type HomeUIState = {
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  hasLoaded: boolean;
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;

  setLoading: (value: boolean) => void;
  setRefreshing: (value: boolean) => void;
  setError: (value: string | null) => void;
  setHasLoaded: (value: boolean) => void;
  setCurrentPage: (value: number) => void;
  setHasNextPage: (value: boolean) => void;
  reset: () => void;
};

export const useHomeUIState = create<HomeUIState>((set) => ({
  isLoading: false,
  isRefreshing: false,
  error: null,
  hasLoaded: false,
  currentPage: 1,
  pageSize: 100,
  hasNextPage: true,

  setLoading: (isLoading) => set({ isLoading }),
  setRefreshing: (isRefreshing) => set({ isRefreshing }),
  setError: (error) => set({ error }),
  setHasLoaded: (hasLoaded) => set({ hasLoaded }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setHasNextPage: (hasNextPage) => set({ hasNextPage }),

  reset: () =>
    set({
      isLoading: false,
      isRefreshing: false,
      error: null,
      hasLoaded: false,
      currentPage: 1,
      pageSize: 100,
      hasNextPage: true,
    }),
}));
