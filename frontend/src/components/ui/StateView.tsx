import type { ReactNode } from "react";
import type { ApiStatus } from "../../hooks/useApi";
import { Button } from "./Button";
import { SkeletonCard } from "./Spinner";

interface StateViewProps<T> {
  status: ApiStatus;
  data: T | null;
  error: string | null;
  onRetry?: () => void;
  loadingRows?: number;
  emptyTitle?: string;
  emptyBody?: string;
  emptyAction?: ReactNode;
  children: (data: T) => ReactNode;
}

/**
 * Rendering wrapper that guarantees a loading / error / empty / success state
 * is always shown. No page ever renders a blank screen.
 */
export function StateView<T>({
  status,
  data,
  error,
  onRetry,
  loadingRows = 3,
  emptyTitle = "Nothing here yet",
  emptyBody = "There is no data to display.",
  emptyAction,
  children,
}: StateViewProps<T>) {
  if (status === "loading" || (status === "idle" && !data)) {
    return (
      <div className="flex flex-col gap-5" role="status" aria-live="polite">
        {Array.from({ length: loadingRows }).map((_, i) => (
          <SkeletonCard key={i} height={92 + (i % 2) * 60} />
        ))}
        <p className="text-sm text-clay-muted">Loading…</p>
      </div>
    );
  }

  if (status === "error") {
    const isApiError = error ? isKnownApiError(error) : false;
    return (
      <div
        className="clay-card clay-card-solid flex flex-col items-center gap-4 p-8"
        role="alert"
      >
        <span
          className="clay-orb clay-orb-red flex h-14 w-14 items-center justify-center text-2xl"
          aria-hidden="true"
        >
          !
        </span>
        <h3 className="font-clay text-lg font-extrabold">Something went wrong</h3>
        <p className="text-center text-sm text-clay-muted">
          {error || "An unexpected error occurred."}
        </p>
        {isApiError && onRetry ? (
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : (
          <p className="text-xs text-clay-muted">
            {isApiError
              ? "If this persists, check the backend configuration."
              : "Please try again shortly."}
          </p>
        )}
      </div>
    );
  }

  if (status === "success" && data) {
    return <>{children(data)}</>;
  }

  // Empty / idle state
  return (
    <div className="clay-card clay-card-solid flex flex-col items-center gap-4 p-8">
      <span
        className="clay-orb clay-orb-blue flex h-14 w-14 items-center justify-center text-2xl"
        aria-hidden="true"
      >
        Ø
      </span>
      <h3 className="font-clay text-lg font-extrabold">{emptyTitle}</h3>
      <p className="text-center text-sm text-clay-muted">{emptyBody}</p>
      {emptyAction}
    </div>
  );
}

function isKnownApiError(message: string): boolean {
  return /backend|timed out|Cannot reach|status \d/.test(message);
}