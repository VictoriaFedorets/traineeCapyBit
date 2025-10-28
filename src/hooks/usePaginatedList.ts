import { useState, useEffect } from "react";

interface UsePaginatedListOptions<T> {
  items: T[];
  perPage?: number;
  delay?: number;
}

export function usePaginatedList<T>({
  items,
  perPage = 10,
  delay = 1000,
}: UsePaginatedListOptions<T>) {
  const [visibleItems, setVisibleItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // Сбрасываем список только при смене items (например, новый videoId)
  useEffect(() => {
    setVisibleItems(items.slice(0, perPage));
    setPage(1);
  }, [items, perPage]);

  const showMore = visibleItems.length < items.length;

  const fetchMoreItems = () => {
    if (loading || !showMore) return;

    setLoading(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const nextItems = items.slice(0, nextPage * perPage);
      setVisibleItems(nextItems);
      setPage(nextPage);
      setLoading(false);
    }, delay);
  };

  return {
    visibleItems,
    showMore,
    fetchMoreItems,
    loading,
    dataLength: visibleItems.length,
  };
}
