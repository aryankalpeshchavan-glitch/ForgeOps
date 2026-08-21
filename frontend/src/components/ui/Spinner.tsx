export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <span className="clay-spinner" aria-hidden="true" />
      <span className="text-sm font-medium text-clay-muted">{label}</span>
    </div>
  );
}

export function SkeletonCard({ width = "100%", height = 180 }: { width?: string | number; height?: number }) {
  return <div className="clay-skeleton" style={{ width, height }} aria-hidden="true" />;
}