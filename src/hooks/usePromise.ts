import { DependencyList, useCallback, useEffect, useState } from "react";

export type UsePromise<T> = [
  data: T | undefined,
  error: unknown,
  loading: boolean,
];

/**
 * Convenience hook for making promises react-friendly.
 * @param promiseGetter A synchronous function that returns a promise.
 * @param deps Optional react dependency list.
 * @param refreshIntervalMs Refresh interval for re-fetching data.
 */
const usePromise = <T>(
  promiseGetter: () => Promise<T>,
  deps: DependencyList = [],
  refreshIntervalMs?: number,
): UsePromise<T> => {
  const [data, setData] = useState<T>();
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState(true);
  const loadData = useCallback(() => {
    setError(undefined);
    setLoading(true);
    promiseGetter()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, deps);
  useEffect(() => {
    loadData();
    if (refreshIntervalMs) {
      const intervalId = setInterval(loadData, refreshIntervalMs);
      return () => clearInterval(intervalId);
    }
  }, [loadData]);
  return [data, error, loading];
};

export default usePromise;
