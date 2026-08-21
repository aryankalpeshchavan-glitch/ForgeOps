import type { ReactNode } from "react";
import { Card } from "../ui/Card";

interface EngineeringTileProps {
  label: string;
  ok: boolean;
  detail?: string;
  icon: ReactNode;
  tone?: "violet" | "pink" | "blue" | "green" | "amber" | "red" | "gray";
}

const orbTone: Record<string, string> = {
  violet: "clay-orb-violet",
  pink: "clay-orb-pink",
  blue: "clay-orb-blue",
  green: "clay-orb-green",
  amber: "clay-orb-amber",
  red: "clay-orb-red",
  gray: "clay-orb-gray",
};

/** Engineering insight tile: capability present/absent with status color. */
export function EngineeringTile({ label, ok, detail, icon, tone = "violet" }: EngineeringTileProps) {
  return (
    <Card variant="solid" className="p-5">
      <div className="flex items-start gap-4">
        <span className={`clay-orb flex h-11 w-11 shrink-0 items-center justify-center text-xl ${orbTone[tone]}`} aria-hidden="true">
          {icon}
        </span>
        <div className="min-w-0">
          <p className="font-clay text-sm font-extrabold">{label}</p>
          <p className={`font-clay text-sm font-black ${ok ? "text-[#047857]" : "text-[#b91c1c]"}`}>
            {ok ? "✓ Detected" : "✕ Missing"}
          </p>
          {detail ? <p className="mt-1 text-xs font-medium text-clay-muted">{detail}</p> : null}
        </div>
      </div>
    </Card>
  );
}