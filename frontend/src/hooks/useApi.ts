import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "../api/client";

export type ApiStatus = "idle" | "loading" | "success" | "error";

interface ApiState<T> {
  status: ApiStatus;
  data: T | null;
  error: string | null;
}

const initialState = {
  status: "idle" as const,
  data: null,
  error: null,
};

/**
 * Generic data-fetching hook with loading / success / error / empty states.
 * Every page-level fetch uses this so no screen is ever blank or silent.
 */
export function useApi<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
) {
  const [state, setState] = useState<ApiState<T>>(initialState);
  const [reloadKey, setReloadKey] = useState(0);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    setState((prev) =>
      prev.status === "success" || prev.status === "error"
        ? { ...prev, status: "loading" }
        : { ...prev, status: "loading" },
    );
    fetcher(controller.signal)
      .then((data) => setState({ status: "success", data, error: null }))
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        const message =
          err instanceof ApiError ? err.message : "An unexpected error occurred.";
        setState({ status: "error", data: null, error: message });
      });
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return { ...state, reload };
}

/** Reduce typing noise for the ubiquitous loading branch. */
export function isLoaded<T>(
  state: ApiState<T>,
): state is { status: "success"; data: T; error: null } {
  return state.status === "success" && state.data !== null;
}