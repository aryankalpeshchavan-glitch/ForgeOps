interface HealthScoreProps {
  score: number;
  status?: string;
  size?: number;
  showLabel?: boolean;
}

function scoreTone(score: number): string {
  if (score >= 80) return "#10b981"; // excellent
  if (score >= 60) return "#7c3aed"; // good
  if (score >= 40) return "#f59e0b"; // needs work
  return "#ef4444"; // critical
}

function displayLabel(status: string | undefined, score: number): string {
  const map: Record<string, string> = {
    excellent: "EXCELLENT",
    good: "GOOD",
    needs_improvement: "NEEDS WORK",
    critical: "CRITICAL",
  };
  if (status) return map[status] ?? status.toUpperCase();
  if (score >= 80) return "EXCELLENT";
  if (score >= 60) return "GOOD";
  if (score >= 40) return "NEEDS WORK";
  return "CRITICAL";
}

/**
 * Large visual health score — an animated SVG progress ring in the
 * clay material language. Never rendered as plain text.
 */
export function HealthScore({ score, status, size = 210, showLabel = true }: HealthScoreProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const tone = scoreTone(clamped);
  const label = displayLabel(status, clamped);
  const circumference = 2 * Math.PI * (size / 2 - 6);
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className="clay-card flex items-center justify-center"
      style={{ width: size + 24, height: size + 24, borderRadius: "50%", padding: 0 }}
      role="img"
      aria-label={`Repository health score ${clamped} out of 100, ${label}`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 6}
          fill="none"
          stroke="rgba(160,150,180,0.22)"
          strokeWidth={13}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 6}
          fill="none"
          stroke={tone}
          strokeWidth={13}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.22,1,0.36,1)" }}
        />
        <text
          x="50%"
          y="46%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size / 2}
          fontWeight={900}
          fontFamily="Nunito, sans-serif"
          fill="var(--clay-foreground)"
        >
          {clamped}
        </text>
        {showLabel ? (
          <text
            x="50%"
            y="63%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={size / 10}
            fontWeight={800}
            fontFamily="Nunito, sans-serif"
            fill={tone}
            letterSpacing={1.5}
          >
            {label}
          </text>
        ) : null}
      </svg>
    </div>
  );
}