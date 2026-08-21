import type { ReactNode } from "react";
import { Card } from "../ui/Card";

interface CategoryScoreCardProps {
  label: string;
  score: number;
  icon: ReactNode;
  tone?: "violet" | "pink" | "blue" | "green" | "amber";
}

const orbTone: Record<string, string> = {
  violet: "clay-orb-violet",
  pink: "clay-orb-pink",
  blue: "clay-orb-blue",
  green: "clay-orb-green",
  amber: "clay-orb-amber",
};

function scoreColor(score: number): string {
  if (score >= 17) return "#10b981";
  if (score >= 12) return "#7c3aed";
  if (score >= 8) return "#f59e0b";
  return "#ef4444";
}

/** Individual health category card with a progress bar (out of 20). */
export function CategoryScoreCard({ label, score, icon, tone = "violet" }: CategoryScoreCardProps) {
  const pct = Math.max(0, Math.min(100, (score / 20) * 100));
  const color = scoreColor(score);
  return (
    <Card variant="solid" className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`clay-orb flex h-10 w-10 items-center justify-center text-lg ${orbTone[tone]}`} aria-hidden="true">
            {icon}
          </span>
          <div>
            <p className="font-clay text-sm font-extrabold">{label}</p>
            <p className="text-xs font-semibold text-clay-muted">out of 20</p>
          </div>
        </div>
        <p className="font-clay text-2xl font-black" style={{ color }}>
          {score}
        </p>
      </div>
      <div
        className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#ece7f4] shadow-[inset_2px_2px_5px_rgba(160,150,180,0.35)]"
        role="progressbar"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={20}
        aria-label={`${label} score`}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}cc, ${color})`,
            transition: "width 0.7s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </div>
    </Card>
  );
}