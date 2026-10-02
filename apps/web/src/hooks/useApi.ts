import { useCallback, useEffect, useState } from "react";

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Wraps a fetcher in consistent loading/error/retry state so every page
 * gets the same loading/error/empty handling (brief section 22) without
 * repeating boilerplate. `deps` re-runs the fetch when they change.
 */
export function useApi<T>(fetcher: () => Promise<T>, deps: React.DependencyList = []): State<T> & { reload: () => void } {
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);

  const load = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetcher()
      .then((data) => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch((err) => { if (!cancelled) setState({ data: null, loading: false, error: err?.message ?? "Request failed" }); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  useEffect(() => load(), [load]);

  return { ...state, reload: () => setTick((t) => t + 1) };
}
