import { useState, useCallback, useRef } from 'react';

const useCursorPagination = (fetchFn) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasNext, setHasNext] = useState(false);

  const loadingRef = useRef(false);
  const hasNextRef = useRef(false);
  const nextCursorCreatedAtRef = useRef(null);
  const nextCursorIdRef = useRef(null);
  const nextCursorStarRef = useRef(null);

  const fetchData = useCallback(
    async (isLoadMore = false) => {
      if (loadingRef.current) return;
      if (isLoadMore && !hasNextRef.current) return;

      try {
        loadingRef.current = true;
        setLoading(true);

        const response = await fetchFn(
          isLoadMore ? nextCursorCreatedAtRef.current : null,
          isLoadMore ? nextCursorIdRef.current : null,
          isLoadMore ? nextCursorStarRef.current : null
        );

        if (response?.code === 200 || response?.code === 0 || response?.data) {
          const data = response.data;
          const newItems = data.items || [];

          setItems((prev) => (isLoadMore ? [...prev, ...newItems] : newItems));

          const nextHasNext = data.hasNext || false;
          setHasNext(nextHasNext);
          hasNextRef.current = nextHasNext;

          nextCursorCreatedAtRef.current =
            data.nextCursorCreatedAt || data.nextCursor?.createdAt || null;
          nextCursorIdRef.current =
            data.nextCursorId || data.nextCursor?.id || null;
          nextCursorStarRef.current = data.nextCursorStar ?? null;
        }
      } catch (error) {
        console.error('데이터 조회 실패:', error);
      } finally {
        loadingRef.current = false;
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fetchFn]
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    nextCursorCreatedAtRef.current = null;
    nextCursorIdRef.current = null;
    nextCursorStarRef.current = null;
    fetchData(false);
  }, [fetchData]);

  const handleLoadMore = useCallback(() => {
    if (hasNextRef.current && !loadingRef.current) {
      fetchData(true);
    }
  }, [fetchData]);

  return {
    items,
    setItems,
    loading,
    refreshing,
    hasNext,
    fetchData,
    handleRefresh,
    handleLoadMore,
  };
};

export default useCursorPagination;
