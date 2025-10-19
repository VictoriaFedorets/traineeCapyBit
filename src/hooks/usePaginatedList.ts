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
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    setVisibleItems(items.slice(0, perPage));
    setShowMore(items.length > perPage);
  }, [items, perPage]);

  const fetchMoreItems = () => {
    if (loading) return;

    setLoading(true);
    setTimeout(() => {
      const nextItems = items.slice(
        visibleItems.length,
        visibleItems.length + perPage
      );
      setVisibleItems((prev) => [...prev, ...nextItems]);
      setShowMore(visibleItems.length + nextItems.length < items.length);
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
