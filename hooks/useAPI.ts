import { useState, useCallback } from 'react';

interface UseAPIReturn<T> {
  execute: (apiCall: () => Promise<T>) => Promise<T | null>;
  data: T | null;
  loading: boolean;
  error: Error | null;
  reset: () => void;
}

export function useAPI<T = unknown>(): UseAPIReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<T>): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      console.error('API call failed:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { execute, data, loading, error, reset };
}
