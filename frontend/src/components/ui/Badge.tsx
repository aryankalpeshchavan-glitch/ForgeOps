import type { ReactNode } from "react";

type Tone = "green" | "amber" | "red" | "violet" | "blue" | "gray";

interface PillProps {
  children: ReactNode;
  tone?: Tone;
  dot?: boolean;
  className?: string;
}

const toneClass: Record<Tone, string> = {
  green: "clay-pill-green",
  amber: "clay-pill-amber",
  red: "clay-pill-red",
  violet: "clay-pill-violet",
  blue: "clay-pill-blue",
  gray: "clay-pill-gray",
};

/** Small status pill / badge. */
export function Pill({ children, tone = "gray", dot = false, className = "" }: PillProps) {
  return (
    <span className={`clay-pill ${toneClass[tone]} ${className}`}>
      {dot ? <span aria-hidden="true">●</span> : null}
      {children}
    </span>
  );
}

interface StatusPillProps {
  ok: boolean;
  label?: string;
  children?: ReactNode;
}

/** Semantic connected/disconnected pill. */
export function StatusPill({ ok, label, children }: StatusPillProps) {
  return (
    <Pill tone={ok ? "green" : "red"} dot>
      {children ?? label ?? (ok ? "Connected" : "Disconnected")}
    </Pill>
  );
}