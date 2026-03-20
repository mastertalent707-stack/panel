import debounce from 'debounce';
import { useCallback, useEffect, useState } from 'react';
import { httpErrorToHuman } from '@/api/axios.ts';
import { useToast } from '@/providers/ToastProvider.tsx';

interface UseSearchableResourceOptions<T> {
  fetcher: (search: string) => Promise<Pagination<T>>;
  defaultSearchValue?: string;
  deps?: unknown[];
  debounceMs?: number;
  canRequest?: boolean;
}

export function useSearchableResource<T>({
  fetcher,
  defaultSearchValue = '',
  deps = [],
  debounceMs = 150,
  canRequest = true,
}: UseSearchableResourceOptions<T>) {
  const { addToast } = useToast();

  const [items, setItems] = useState<T[]>([]);
  const [search, setSearch] = useState(defaultSearchValue);
  const [loading, setLoading] = useState(false);

  const fetchData = (searchValue: string) => {
    if (!canRequest) return;

    setLoading(true);

    fetcher(searchValue)
      .then((response) => {
        setItems(response.data);
      })
      .catch((err) => {
        addToast(httpErrorToHuman(err), 'error');
      })
      .finally(() => setLoading(false));
  };

  const setDebouncedSearch = useCallback(
    debounce((s: string) => fetchData(s), debounceMs),
    deps,
  );

  useEffect(() => {
    setDebouncedSearch(search);
  }, [search]);

  useEffect(() => {
    if (!deps?.length || deps.filter((d) => !!d).length !== deps.length) {
      return;
    }

    fetchData(defaultSearchValue);
  }, deps);

  return { items, loading, search, setSearch, refetch: () => fetchData(search) };
}
