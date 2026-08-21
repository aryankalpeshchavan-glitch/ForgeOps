import { useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { api } from "../api/github";
import { Card } from "../components/ui/Card";
import { HealthScore } from "../components/ui/HealthScore";
import { EngineeringTile } from "../components/repo/EngineeringTile";
import { RecommendationCard } from "../components/repo/RecommendationCard";
import { StateView } from "../components/ui/StateView";
import { PageHeader } from "../components/ui/SectionTitle";
import { Button, LinkButton } from "../components/ui/Button";
import {
  DocsIcon,
  FlaskIcon,
  WorkflowIcon,
  ShipIcon,
  DatabaseIcon,
  RocketIcon,
  ShieldIcon,
} from "../components/ui/icons";
import { formatNumber } from "../utils/format";
import type { ReportResponse } from "../api/types";

/** Polished ForgeOps engineering report from GET /report. */
export default function ReportPage() {
  const { owner = "", repo = "" } = useParams();
  const report = useApi((signal) => api.report(owner, repo));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Engineering Report"
        subtitle={`ForgeOps engineering assessment of ${owner}/${repo}.`}
        action={
          <LinkButton
            to={`/repos/${owner}/${repo}/automation`}
            size="sm"
            icon={<RocketIcon size={16} />}
          >
            Fix with ForgeOps
          </LinkButton>
        }
      />

      <StateView<ReportResponse>
        status={report.status}
        data={report.data}
        error={report.error}
        onRetry={report.reload}
        loadingRows={4}
        emptyTitle="No report available"
        emptyBody="ForgeOps could not generate a report for this repository."
      >
        {(data) => {
          const r = data.report;
          if (!r) return null;
          const eng = r.engineering;
          const deps = eng?.dependencies ?? { python: false, node: false };
          return (
            <>
              {/* Summary + health */}
              <section className="grid gap-6 lg:grid-cols-3" aria-label="Report summary">
                <Card variant="soft" className="flex flex-col items-center gap-4 p-6">
                  <p className="clay-label">Overall Health</p>
                  <HealthScore score={r.health?.score ?? 0} status={r.health?.status} size={170} />
                </Card>

                <Card variant="solid" className="p-6 lg:row-span-2">
                  <p className="clay-label mb-4">Executive Summary</p>
                  <p className="text-sm leading-relaxed text-[var(--clay-foreground)]">
                    {r.repository} reports a{" "}
                    <strong className="font-clay text-[#047857]">
                      {r.health?.score ?? 0}/100
                    </strong>{" "}
                    engineering health score ({r.health?.status}). Identified primary
                    technologies include{" "}
                    {r.technology?.languages?.length ? r.technology.languages.join(", ") : "none"}.
                  </p>
                  {r.security?.suspicious_files > 0 ? (
                    <div className="mt-4 rounded-[20px] border border-[#ef4444]/25 bg-[#ef4444]/6 p-4" role="alert">
                      <p className="text-sm font-bold text-[#b91c1c]">
                        ⚠ Potential secret files: {r.security.suspicious_files}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-4 rounded-[20px] border border-[#10b981]/25 bg-[#10b981]/6 p-4">
                      <p className="text-sm font-bold text-[#047857]">
                        ✓ No suspicious secret files detected.
                      </p>
                    </div>
                  )}
                </Card>

                <div className="lg:col-span-2">
                  <p className="clay-label mb-3">Scorecard</p>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-5 sm:gap-3">
                    {Object.entries(r.health?.category_scores ?? {}).map(([key, value]) => (
                      <MiniScore key={key} label={key.replace(/_/g, " ")} value={value} />
                    ))}
                  </div>
                </div>
              </section>
{/* Engineering capabilities */}
              <section aria-label="Engineering capabilities">
                <PageHeader title="Engineering Capabilities" subtitle="Detected from the repository tree." />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <EngineeringTile label="Documentation" ok={eng?.documentation === "good"} detail="README" icon={<DocsIcon size={22} />} tone="blue" />
                  <EngineeringTile label="Testing" ok={eng?.testing === "detected"} detail="Automated tests" icon={<FlaskIcon size={22} />} tone="green" />
                  <EngineeringTile label="CI/CD" ok={eng?.ci_cd === "configured"} detail="GitHub Actions" icon={<WorkflowIcon size={22} />} tone="violet" />
                  <EngineeringTile label="Docker" ok={eng?.docker === "configured"} detail="Containerization" icon={<ShipIcon size={22} />} tone="pink" />
                  <EngineeringTile label="Python Deps" ok={deps.python} detail="requirements/pyproject" icon={<DatabaseIcon size={22} />} tone="amber" />
                  <EngineeringTile label="Node Deps" ok={deps.node} detail="package.json" icon={<DatabaseIcon size={22} />} tone="gray" />
                </div>
              </section>

              {/* Recommendations */}
              <section aria-label="Recommendations">
                <PageHeader
                  title="Recommendations"
                  subtitle={`${r.recommendations?.length ?? 0} actionable improvements.`}
                />
                <div className="flex flex-col gap-4">
                  {(r.recommendations ?? []).length === 0 ? (
                    <Card variant="solid" className="p-6">
                      <p className="flex items-center gap-2 font-clay font-extrabold text-[#047857]">
                        ✓ No open recommendations — this repository is in great shape.
                      </p>
                    </Card>
                  ) : (
                    r.recommendations.map((rec, i) => (
                      <RecommendationCard key={`${rec.priority}-${i}`} recommendation={rec} />
                    ))
                  )}
                </div>
              </section>

              {/* Quick action */}
              <section className="clay-card clay-card-soft flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
                <div>
                  <p className="font-clay text-lg font-extrabold sm:text-xl">Ready to act?</p>
                  <p className="mt-1 text-sm text-clay-muted">
                    ForgeOps can implement the top recommendation as a pull request.
                  </p>
                </div>
                <LinkButton
                  to={`/repos/${owner}/${repo}/automation`}
                  icon={<RocketIcon size={18} />}
                >
                  Fix with ForgeOps
                </LinkButton>
              </section>
            </>
          );
        }}
      </StateView>
    </div>
  );
}

function scoreTone(value: number): string {
  if (value >= 17) return "#10b981";
  if (value >= 12) return "#7c3aed";
  if (value >= 8) return "#f59e0b";
  return "#ef4444";
}

function MiniScore({ label, value }: { label: string; value: number }) {
  return (
    <Card variant="solid" className="p-3 text-center">
      <p className="font-clay text-xl font-black" style={{ color: scoreTone(value) }}>
        {value}
      </p>
      <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-clay-muted">{label}</p>
    </Card>
  );
}