import { useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { api } from "../api/github";
import { Card } from "../components/ui/Card";
import { Pill } from "../components/ui/Badge";
import { EngineeringTile } from "../components/repo/EngineeringTile";
import { StateView } from "../components/ui/StateView";
import { PageHeader } from "../components/ui/SectionTitle";
import {
  DocsIcon,
  FlaskIcon,
  WorkflowIcon,
  ShipIcon,
  DatabaseIcon,
  BoxIcon,
  FileIcon,
  LayersIcon,
  ShieldIcon,
} from "../components/ui/icons";
import { formatNumber } from "../utils/format";
import type { AnalysisResponse } from "../api/types";
import type { ReactNode } from "react";

/** Engineering analysis view — turns /analyze into readable insights. */
export default function AnalysisPage() {
  const { owner = "", repo = "" } = useParams();
  const analysis = useApi((signal) => api.analysis(owner, repo));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Engineering Insights"
        subtitle={`Structural and engineering analysis of ${owner}/${repo}.`}
      />

      <StateView<AnalysisResponse>
        status={analysis.status}
        data={analysis.data}
        error={analysis.error}
        onRetry={analysis.reload}
        loadingRows={4}
        emptyTitle="No analysis available"
        emptyBody="This repository could not be analyzed right now."
      >
        {(data) => {
          const a = data.analysis;
          if (!a) return null;
          const deps = a.dependencies ?? { python: false, node: false };
          return (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <MetricCard label="Files" value={formatNumber(a.file_count)} icon={<FileIcon size={18} />} tone="blue" />
                <MetricCard label="Directories" value={formatNumber(a.directory_count)} icon={<LayersIcon size={18} />} tone="violet" />
                <MetricCard label="Technologies" value={formatNumber(a.technologies.length)} icon={<BoxIcon size={18} />} tone="amber" />
                <MetricCard label="Tech Detected" value={a.technologies.length ? "Yes" : "No"} icon={<DatabaseIcon size={18} />} tone="green" />
              </div>

              <section aria-label="Engineering capabilities">
                <PageHeader title="Capabilities" subtitle="Automated detection from the repository tree." />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <EngineeringTile label="Documentation" ok={a.documentation.readme} detail="README.md" icon={<DocsIcon size={22} />} tone="blue" />
                  <EngineeringTile label="Testing" ok={a.testing.detected} detail="Tests directory or config" icon={<FlaskIcon size={22} />} tone="green" />
                  <EngineeringTile label="CI/CD" ok={a.ci_cd.github_actions} detail=".github/workflows" icon={<WorkflowIcon size={22} />} tone="violet" />
                  <EngineeringTile label="Docker" ok={a.devops.docker} detail="Dockerfile" icon={<ShipIcon size={22} />} tone="pink" />
                  <EngineeringTile label="Docker Compose" ok={a.devops.docker_compose} detail="compose.yml" icon={<BoxIcon size={22} />} tone="amber" />
                  <EngineeringTile
                    label="Dependency Mgmt"
                    ok={deps.python || deps.node}
                    detail={deps.python && deps.node ? "Python + Node" : deps.python ? "Python" : deps.node ? "Node" : "None detected"}
                    icon={<DatabaseIcon size={22} />}
                    tone="gray"
                  />
                </div>
              </section>

              <section aria-label="Security signals">
                <PageHeader title="Security" subtitle="Signals ForgeOps detects from the repository contents." />
                <Card variant="soft" className="p-6">
                  <div className="flex items-start gap-4">
                    <span className="clay-orb clay-orb-violet flex h-12 w-12 shrink-0 items-center justify-center" aria-hidden="true">
                      <ShieldIcon size={24} />
                    </span>
                    <div className="min-w-0">
                      <p className="font-clay text-lg font-extrabold">Security Overview</p>
                      <p className="mt-1 text-sm text-clay-muted">
                        {a.security.potential_secret_files === 0
                          ? "No potential secret files detected in the tracked tree."
                          : `${a.security.potential_secret_files} potential secret file(s) detected.`}
                      </p>
                      {a.security.suspicious_files.length > 0 ? (
                        <ul className="mt-3 flex flex-col gap-1.5">
                          {a.security.suspicious_files.map((f) => (
                            <li key={f}>
                              <Pill tone="red" dot>{f}</Pill>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <p className="mt-4 text-xs text-clay-muted">
                        Note: deep secret scanning is a future ForgeOps capability.
                      </p>
                    </div>
                  </div>
                </Card>
              </section>

              <section aria-label="Repository structure">
                <PageHeader
                  title="Repository Structure"
                  subtitle={`${formatNumber(a.files.length)} tracked files.`}
                />
                <Card variant="solid" className="p-5">
                  {a.files.length === 0 ? (
                    <p className="text-sm text-clay-muted">No files returned.</p>
                  ) : (
                    <ul className="flex max-h-96 flex-col gap-0.5 overflow-y-auto">
                      {a.files.map((file) => (
                        <li key={file} className="flex items-center gap-2 rounded-lg px-2 py-1 text-sm hover:bg-[#7c3aed]/5">
                          <FileIcon size={14} className="shrink-0 text-clay-muted" />
                          <code className="break-all font-mono text-[13px] text-[var(--clay-foreground)]">{file}</code>
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </section>
            </>
          );
        }}
      </StateView>
    </div>
  );
}
interface MetricCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  tone: "violet" | "pink" | "blue" | "green" | "amber";
}

const metricTone: Record<string, string> = {
  violet: "clay-orb-violet",
  pink: "clay-orb-pink",
  blue: "clay-orb-blue",
  green: "clay-orb-green",
  amber: "clay-orb-amber",
};

function MetricCard({ label, value, icon, tone }: MetricCardProps) {
  return (
    <Card variant="solid" className="p-5" interactive>
      <div className="flex items-center gap-3">
        <span className={`clay-orb flex h-10 w-10 items-center justify-center text-lg ${metricTone[tone]}`} aria-hidden="true">
          {icon}
        </span>
        <div>
          <p className="font-clay text-2xl font-black leading-none text-[var(--clay-foreground)]">{value}</p>
          <p className="text-xs font-bold text-clay-muted">{label}</p>
        </div>
      </div>
    </Card>
  );
}