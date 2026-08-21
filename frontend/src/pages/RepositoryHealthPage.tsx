import { useEffect, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useApi } from "../hooks/useApi";
import { api } from "../api/github";
import { useRepo } from "../context/RepoContext";
import { Card } from "../components/ui/Card";
import { Pill } from "../components/ui/Badge";
import { HealthScore } from "../components/ui/HealthScore";
import { StateView } from "../components/ui/StateView";
import { SectionTitle } from "../components/ui/SectionTitle";
import { CategoryScoreCard } from "../components/repo/CategoryScoreCard";
import {
  ExternalLinkIcon,
  WorkflowIcon,
  RepositoryIcon,
  ShieldIcon,
  RocketIcon,
  PullRequestIcon,
  IssueIcon,
  GitBranchIcon,
  CommitIcon,
} from "../components/ui/icons";
import type { HealthResponse, OverviewResponse } from "../api/types";

const categoryMeta: Record<
  string,
  { label: string; tone: "violet" | "pink" | "blue" | "green" | "amber"; icon: ReactNode }
> = {
  repository: { label: "Repository", tone: "blue", icon: <RepositoryIcon size={20} /> },
  ci_cd: { label: "CI/CD", tone: "violet", icon: <RocketIcon size={20} /> },
  development: { label: "Development", tone: "green", icon: <PullRequestIcon size={20} /> },
  issues: { label: "Issues", tone: "amber", icon: <IssueIcon size={20} /> },
  maturity: { label: "Maturity", tone: "pink", icon: <ShieldIcon size={20} /> },
};

/** Repository dashboard: header, big health score, category scores, activity. */
export default function RepositoryHealthPage() {
  const { owner = "", repo = "" } = useParams();
  const { setRepo } = useRepo();

  const overview = useApi((signal) => api.overview(owner, repo));
  const health = useApi((signal) => api.healthScore(owner, repo));

  useEffect(() => {
    if (owner && repo) setRepo({ owner, name: repo, fullName: `${owner}/${repo}` });
  }, [owner, repo, setRepo]);

  const repoInfo = overview.data?.repository;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <Card variant="soft" className="p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="clay-label">Repository</span>
              <Pill tone={overview.data?.repository?.private ? "amber" : "green"}>
                {overview.data?.repository?.private ? "Private" : "Public"}
              </Pill>
              {overview.data?.repository?.fork ? <Pill tone="gray">Fork</Pill> : null}
            </div>
            <h1 className="font-clay mt-2 break-all text-3xl font-black tracking-tight text-[var(--clay-foreground)] sm:text-4xl">
              {repoInfo?.name ?? `${owner}/${repo}`}
            </h1>
            <p className="mt-1 break-all font-medium text-clay-muted">{repoInfo?.full_name}</p>
            {repoInfo?.description ? (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-clay-muted">
                {repoInfo.description}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-2">
              <Pill tone="blue">
                <span className="flex items-center gap-1.5">
                  <WorkflowIcon size={13} /> {repoInfo?.default_branch ?? "…"}
                </span>
              </Pill>
              {repoInfo?.language ? <Pill tone="violet">{repoInfo.language}</Pill> : null}
              <a
                href={`https://github.com/${owner}/${repo}`}
                target="_blank"
                rel="noreferrer"
                className="clay-pill clay-pill-gray transition-transform hover:-translate-y-0.5"
              >
                Open on GitHub <ExternalLinkIcon size={13} />
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={`/repos/${owner}/${repo}/analysis`} className="clay-btn clay-btn-secondary clay-btn-sm">
              Analysis
            </Link>
            <Link to={`/repos/${owner}/${repo}/automation`} className="clay-btn clay-btn-primary clay-btn-sm">
              Fix CI/CD
            </Link>
          </div>
        </div>
      </Card>

      {/* Score + categories */}
      <section className="grid gap-6 lg:grid-cols-3" aria-label="Health score">
        <div className="flex flex-col items-center justify-center gap-5 rounded-[40px] bg-white/40 p-8">
          <p className="clay-label text-center">ForgeOps Health Score</p>
          <StateView<HealthResponse>
            status={health.status}
            data={health.data}
            error={health.error}
            onRetry={health.reload}
            loadingRows={1}
          >
            {(data) => (
              <div className="flex flex-col items-center gap-4">
                <HealthScore score={data.health?.score ?? 0} status={data.health?.status} />
                {data.health && data.health.signals.length > 0 ? (
                  <ul className="flex max-w-xs flex-col gap-1.5 text-sm font-medium text-clay-muted">
                    {data.health.signals.slice(0, 4).map((signal) => (
                      <li key={signal} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#10b981]" aria-hidden="true" />
                        {signal}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )}
          </StateView>
        </div>

        <div className="lg:col-span-2">
          <SectionTitle eyebrow="Scorecard" title="Category Breakdown" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <StateView<HealthResponse>
              status={health.status}
              data={health.data}
              error={health.error}
              onRetry={health.reload}
              loadingRows={3}
            >
              {(data) => (
                <>
                  {Object.entries(data.health?.category_scores ?? {}).map(([key, value]) => {
                    const meta = categoryMeta[key] ?? {
                      label: key,
                      tone: "violet" as const,
                      icon: <RepositoryIcon size={20} />,
                    };
                    return (
                      <CategoryScoreCard
                        key={key}
                        label={meta.label}
                        score={value}
                        icon={meta.icon}
                        tone={meta.tone}
                      />
                    );
                  })}
                </>
              )}
            </StateView>
          </div>
        </div>
      </section>
{/* Activity metrics */}
      <section aria-label="Repository activity">
        <SectionTitle eyebrow="Live Data" title="Repository Activity" />
        <StateView<OverviewResponse>
          status={overview.status}
          data={overview.data}
          error={overview.error}
          onRetry={overview.reload}
          loadingRows={2}
        >
          {(data) => {
            if (!data.repository) return null;
            const branches = data.branches ?? { count: 0, names: [] };
            const commits = data.commits ?? { count: 0, recent: [] };
            const prs = data.pull_requests ?? { open: 0 };
            const issues = data.issues ?? { open: 0 };
            const actions = data.github_actions ?? { workflow_count: 0, workflows: [] };
            return (
              <div className="mt-5 flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-6">
                  <StatCard label="Branches" value={branches.count} icon={<GitBranchIcon size={18} />} tone="blue" />
                  <StatCard label="Commits" value={commits.count} icon={<CommitIcon size={18} />} tone="violet" />
                  <StatCard label="Open PRs" value={prs.open} icon={<PullRequestIcon size={18} />} tone="green" />
                  <StatCard label="Open Issues" value={issues.open} icon={<IssueIcon size={18} />} tone="amber" />
                  <StatCard label="Workflows" value={actions.workflow_count} icon={<WorkflowIcon size={18} />} tone="pink" />
                </div>

                {commits.recent.length > 0 ? (
                  <div className="grid gap-5 lg:grid-cols-2">
                    <Card variant="solid" className="p-5">
                      <p className="clay-label mb-3">Recent Commits</p>
                      <ul className="flex flex-col gap-3">
                        {commits.recent.slice(0, 6).map((commit) => (
                          <li key={commit.sha} className="flex items-start gap-3">
                            <span className="clay-orb clay-orb-gray mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl" aria-hidden="true">
                              <CommitIcon size={14} />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold text-[var(--clay-foreground)]">{commit.message}</p>
                              <p className="text-xs font-semibold text-clay-muted">
                                {commit.author} · <code className="font-mono">{commit.sha.slice(0, 7)}</code>
                              </p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </Card>

                    <Card variant="solid" className="p-5">
                      <p className="clay-label mb-3">Workflows</p>
                      {actions.workflows.length === 0 ? (
                        <p className="text-sm text-clay-muted">No GitHub Actions workflows.</p>
                      ) : (
                        <ul className="flex flex-col gap-3">
                          {actions.workflows.map((wf) => (
                            <li key={wf.name} className="flex items-center justify-between gap-3">
                              <span className="text-sm font-bold text-[var(--clay-foreground)]">{wf.name}</span>
                              <Pill tone={wf.state === "active" ? "green" : "amber"} dot>{wf.state}</Pill>
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-5 flex flex-wrap gap-2">
                        {branches.names.map((branch) => (
                          <Pill key={branch} tone="gray">
                            <span className="flex items-center gap-1.5">
                              <GitBranchIcon size={12} /> {branch}
                            </span>
                          </Pill>
                        ))}
                      </div>
                    </Card>
                  </div>
                ) : null}
              </div>
            );
          }}
        </StateView>
      </section>

    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  icon: ReactNode;
  tone: "violet" | "pink" | "blue" | "green" | "amber";
}

const statTone: Record<string, string> = {
  violet: "clay-orb-violet",
  pink: "clay-orb-pink",
  blue: "clay-orb-blue",
  green: "clay-orb-green",
  amber: "clay-orb-amber",
};

function StatCard({ label, value, icon, tone }: StatCardProps) {
  return (
    <Card variant="solid" className="p-5" interactive>
      <div className="flex items-center gap-3">
        <span className={`clay-orb flex h-10 w-10 items-center justify-center text-lg ${statTone[tone]}`} aria-hidden="true">
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