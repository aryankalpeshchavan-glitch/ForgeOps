import type { ReactNode } from "react";

type Tone = "violet" | "pink" | "blue" | "green" | "amber" | "red" | "gray";

interface MetricProps {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
  hint?: string;
  tone?: Tone;
}

const orbTone: Record<Tone, string> = {
  violet: "clay-orb-violet",
  pink: "clay-orb-pink",
  blue: "clay-orb-blue",
  green: "clay-orb-green",
  amber: "clay-orb-amber",
  red: "clay-orb-red",
  gray: "clay-orb-gray",
};

/** Compact stat metric used across dashboard cards. */
export function Metric({ icon, label, value, hint, tone = "violet" }: MetricProps) {
  return (
    <div className="flex items-start gap-4">
      {icon ? (
        <span
          className={`clay-orb flex h-11 w-11 items-center justify-center text-lg ${orbTone[tone]}`}
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      <div>
        <p className="clay-label mb-0.5">{label}</p>
        <p className="font-clay text-2xl font-black leading-none text-[var(--clay-foreground)]">
          {value}
        </p>
        {hint ? <p className="mt-1 text-xs font-medium text-clay-muted">{hint}</p> : null}
      </div>
    </div>
  );
}