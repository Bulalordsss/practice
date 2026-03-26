import { useCallback } from 'react';
import axios from 'axios';

import { useHomeUIState } from '@/stores/homeUIState';
import { useTodoListStoreData, type TodoItem } from '@/stores/toDolistStoreData';

const TODO_LIST_URL = 'https://jsonplaceholder.typicode.com/todos';
const PAGE_SIZE = 100;
const CONCURRENT_REQUESTS = 5;

export function useGetTodoList() {
  const recentActivities = useTodoListStoreData((s) => s.recentActivities);
  const totalCount = useTodoListStoreData((s) => s.recentActivitiesTotalCount);
  const setRecentActivities = useTodoListStoreData((s) => s.setRecentActivities);
  const appendRecentActivities = useTodoListStoreData((s) => s.appendRecentActivities);
  const setRecentActivitiesTotalCount = useTodoListStoreData((s) => s.setRecentActivitiesTotalCount);

  const isLoading = useHomeUIState((s) => s.isLoading);
  const isRefreshing = useHomeUIState((s) => s.isRefreshing);
  const error = useHomeUIState((s) => s.error);
  const hasLoaded = useHomeUIState((s) => s.hasLoaded);
  const currentPage = useHomeUIState((s) => s.currentPage);
  const pageSize = useHomeUIState((s) => s.pageSize);
  const hasNextPage = useHomeUIState((s) => s.hasNextPage);
  const setLoading = useHomeUIState((s) => s.setLoading);
  const setRefreshing = useHomeUIState((s) => s.setRefreshing);
  const setError = useHomeUIState((s) => s.setError);
  const setHasLoaded = useHomeUIState((s) => s.setHasLoaded);
  const setCurrentPage = useHomeUIState((s) => s.setCurrentPage);
  const setHasNextPage = useHomeUIState((s) => s.setHasNextPage);

  const getTodoList = useCallback(
    async (page = 1, options?: { refresh?: boolean }) => {
      const isRefresh = Boolean(options?.refresh);

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        const pageNumbers = Array.from({ length: CONCURRENT_REQUESTS }, (_, index) => page + index);
        const responses = await Promise.all(
          pageNumbers.map((pageNumber) =>
            axios.get<TodoItem[]>(TODO_LIST_URL, {
              params: {
                _page: pageNumber,
                _limit: PAGE_SIZE,
              },
            })
          )
        );

        const combinedItems = responses.flatMap((response) => response.data);
        const uniqueItems = combinedItems.filter(
          (item, index, array) => index === array.findIndex((candidate) => candidate.id === item.id)
        );
        const resolvedTotalCount = Number(
          responses[0]?.headers['x-total-count'] ?? uniqueItems.length
        );
        const lastFetchedPage = pageNumbers[pageNumbers.length - 1];
        const resolvedHasNextPage = lastFetchedPage * PAGE_SIZE < resolvedTotalCount;

        if (page === 1 || isRefresh) {
          setRecentActivities(uniqueItems);
        } else {
          appendRecentActivities(uniqueItems);
        }

        setRecentActivitiesTotalCount(resolvedTotalCount);
        setCurrentPage(lastFetchedPage);
        setHasNextPage(resolvedHasNextPage);
        setHasLoaded(true);

        return uniqueItems;
      } catch (e: any) {
        setError(e?.message ?? 'Unable to load activities');
        throw e;
      } finally {
        if (isRefresh) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    },
    [
      appendRecentActivities,
      setCurrentPage,
      setError,
      setHasLoaded,
      setHasNextPage,
      setLoading,
      setRecentActivities,
      setRecentActivitiesTotalCount,
      setRefreshing,
    ]
  );

  const refreshTodoList = useCallback(async () => {
    return getTodoList(1, { refresh: true });
  }, [getTodoList]);

  const loadNextPage = useCallback(async () => {
    if (isLoading || isRefreshing || !hasNextPage) {
      return [];
    }

    return getTodoList(currentPage + 1);
  }, [currentPage, getTodoList, hasNextPage, isLoading, isRefreshing]);

  const reloadTodoList = useCallback(async () => {
    return getTodoList(1);
  }, [getTodoList]);

  return {
    todoList: recentActivities,
    totalCount,
    isLoading,
    isRefreshing,
    error,
    hasLoaded,
    currentPage,
    pageSize,
    hasNextPage,
    getTodoList: reloadTodoList,
    refreshTodoList,
    loadNextPage,
  };
}
