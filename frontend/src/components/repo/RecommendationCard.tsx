import type { ReportRecommendation } from "../../api/types";
import { Card } from "../ui/Card";

interface RecommendationCardProps {
  recommendation: ReportRecommendation;
}

function priorityMeta(
  priority: string,
): { tone: "red" | "amber" | "green" | "gray"; label: string; bar: string } {
  switch (priority) {
    case "CRITICAL":
      return { tone: "red", label: "CRITICAL", bar: "#ef4444" };
    case "HIGH":
      return { tone: "amber", label: "HIGH", bar: "#f59e0b" };
    case "MEDIUM":
      return { tone: "green", label: "MEDIUM", bar: "#10b981" };
    default:
      return { tone: "gray", label: "LOW", bar: "#635f69" };
  }
}

function categoryAction(category: string): string {
  const map: Record<string, string> = {
    "CI/CD": "CI/CD",
    Testing: "TESTING",
    Documentation: "DOCUMENTATION",
    DevOps: "DEVOPS",
    Security: "SECURITY",
  };
  return map[category] ?? "ENGINEERING";
}

/** One actionable recommendation with a clear priority band. */
export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const { label, bar } = priorityMeta(recommendation.priority);

  return (
    <Card variant="solid" className="overflow-hidden p-0">
      <div className="flex items-stretch">
        <div className="w-1.5 shrink-0" style={{ background: bar }} aria-hidden="true" />
        <div className="p-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="clay-pill" style={{ background: `${bar}1f`, color: bar }}>
              {label}
            </span>
            <span className="clay-label">{categoryAction(recommendation.category)}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-[var(--clay-foreground)]">
            {recommendation.message}
          </p>
        </div>
      </div>
    </Card>
  );
}