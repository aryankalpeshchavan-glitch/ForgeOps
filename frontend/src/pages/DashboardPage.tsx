import { useApi } from "../hooks/useApi";
import { api } from "../api/github";
import { Card } from "../components/ui/Card";
import { Button, LinkButton } from "../components/ui/Button";
import { Pill, StatusPill } from "../components/ui/Badge";
import { SectionTitle } from "../components/ui/SectionTitle";
import { Metric } from "../components/ui/Metric";
import { RepoCard } from "../components/repo/RepoCard";
import {
  GithubIcon,
  RepositoryIcon,
  StarIcon,
  IssueIcon,
  RocketIcon,
  SearchIcon,
} from "../components/ui/icons";
import { formatNumber } from "../utils/format";

/** Landing + platform dashboard for ForgeOps. */
export default function DashboardPage() {
  const health = useApi((signal) => api.health(signal));
  const github = useApi((signal) => api.githubTest(signal));
  const repos = useApi((signal) => api.repositories(signal));

  const repoList = repos.data?.repositories ?? [];
  const connected = github.data?.success === true;
  const totalStars = repoList.reduce((sum, r) => sum + (r.stars || 0), 0);
  const totalIssues = repoList.reduce((sum, r) => sum + (r.open_issues || 0), 0);

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="clay-card clay-card-soft p-8 sm:p-12">
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <Pill
              tone={health.status === "success" && health.data?.status === "healthy" ? "green" : "amber"}
              dot
            >
              Platform {health.data?.status ?? "…"}
            </Pill>
            <StatusPill ok={connected} label={connected ? "GitHub Connected" : "GitHub Disconnected"} />
          </div>
          <h1 className="font-clay max-w-3xl text-4xl font-black leading-[1.1] tracking-tight text-[var(--clay-foreground)] sm:text-5xl lg:text-6xl">
            Autonomous GitHub{" "}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#db2777] bg-clip-text text-transparent">
              Repository Engineering
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-clay-muted sm:text-lg">
            ForgeOps inspects, scores, analyzes and repairs your GitHub repositories —
            engineering health, CI/CD, testing, security and maturity in one place.
          </p>
          <div className="flex flex-wrap gap-3">
            <LinkButton to="/repositories" size="lg" icon={<RepositoryIcon size={20} />}>
              Connect / Select Repositories
            </LinkButton>
            {repoList.length > 0 ? (
              <LinkButton
                to={`/repos/${repoList[0].full_name}`}
                size="lg"
                variant="secondary"
                icon={<RocketIcon size={20} />}
              >
                Quick Inspect
              </LinkButton>
            ) : null}
          </div>
        </div>
      </section>

      {/* Platform stats */}
      <section aria-label="Platform statistics">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          <Card variant="solid" className="p-5">
            <Metric
              icon={<RepositoryIcon size={20} />}
              label="Repositories"
              value={repos.status === "loading" ? "…" : formatNumber(repos.data?.count ?? 0)}
              tone="violet"
            />
          </Card>
          <Card variant="solid" className="p-5">
            <Metric
              icon={<GithubIcon size={20} />}
              label="GitHub App"
              value={github.status === "loading" ? "…" : connected ? "Connected" : "Offline"}
              tone="blue"
            />
          </Card>
          <Card variant="solid" className="p-5">
            <Metric
              icon={<StarIcon size={20} />}
              label="Total Stars"
              value={formatNumber(totalStars)}
              tone="amber"
            />
          </Card>
          <Card variant="solid" className="p-5">
            <Metric
              icon={<IssueIcon size={20} />}
              label="Open Issues"
              value={formatNumber(totalIssues)}
              tone="pink"
            />
          </Card>
        </div>
      </section>

      {/* Recent repositories + quick actions */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionTitle
            eyebrow="Workspace"
            title="Recent Repositories"
            description="Repositories accessible through the ForgeOps GitHub App."
            action={
              <LinkButton
                to="/repositories"
                variant="secondary"
                size="sm"
                icon={<SearchIcon size={16} />}
              >
                Browse all
              </LinkButton>
            }
          />
          <div className="mt-5 flex flex-col gap-4">
            {repos.status === "loading" ? (
              <div
                className="clay-skeleton h-40 w-full"
                role="status"
                aria-label="Loading repositories"
              />
            ) : null}
            {repos.status === "error" ? (
              <div className="clay-card clay-card-solid p-6" role="alert">
                <p className="font-clay font-extrabold">Could not load repositories</p>
                <p className="mt-1 text-sm text-clay-muted">{repos.error}</p>
                <div className="mt-4">
                  <Button variant="secondary" size="sm" onClick={repos.reload}>
                    Try again
                  </Button>
                </div>
              </div>
            ) : null}
            {repos.status === "success" && repoList.length === 0 ? (
              <div className="clay-card clay-card-solid p-6">
                <p className="font-clay font-extrabold">No repositories installed yet</p>
                <p className="mt-1 text-sm text-clay-muted">
                  Install the ForgeOps GitHub App on a repository to get started.
                </p>
              </div>
            ) : null}
            {repoList.slice(0, 3).map((repo) => (
              <RepoCard key={repo.full_name} repo={repo} />
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div>
          <SectionTitle eyebrow="Quick Actions" title="Automation" />
          <div className="mt-5 flex flex-col gap-4">
            <Card variant="solid" className="p-5" interactive>
              <div className="flex flex-col gap-3">
                <span
                  className="clay-orb clay-orb-pink flex h-11 w-11 items-center justify-center text-xl"
                  aria-hidden="true"
                >
                  <RocketIcon size={20} />
                </span>
                <div>
                  <p className="font-clay font-extrabold">Fix CI/CD automatically</p>
                  <p className="mt-1 text-sm text-clay-muted">
                    ForgeOps can open a pull request that repairs your pipeline.
                  </p>
                </div>
                <LinkButton
                  to={
                    repoList.length > 0
                      ? `/repos/${repoList[0].full_name}/automation`
                      : "/repositories"
                  }
                  size="sm"
                  className="self-start"
                >
                  Open Automation
                </LinkButton>
              </div>
            </Card>
            <Card variant="solid" className="p-5">
              <div className="flex flex-col gap-3">
                <p className="clay-label">Platform Status</p>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill ok={health.data?.status === "healthy"} label="Backend" />
                  <StatusPill ok={connected} label="GitHub" />
                </div>
                <div className="mt-2 grid gap-2 text-sm font-semibold text-clay-muted">
                  <p>Service: {health.data?.service ?? "—"}</p>
                  <p>Version: {health.data?.version ?? "—"}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}