import { useRepo } from "../context/RepoContext";
import { useApi } from "../hooks/useApi";
import { api } from "../api/github";
import { API_URL } from "../env";
import { Card } from "../components/ui/Card";
import { PageHeader } from "../components/ui/SectionTitle";
import { Button } from "../components/ui/Button";
import { StatusPill } from "../components/ui/Badge";
import { GithubIcon } from "../components/ui/icons";

/** Platform settings: backend connection, GitHub App status, current repo. */
export default function SettingsPage() {
  const { repo, setRepo } = useRepo();
  const health = useApi((signal) => api.health(signal));
  const github = useApi((signal) => api.githubTest(signal));

  const connected = github.data?.success === true;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Settings"
        subtitle="Platform connection and developer configuration. Secrets are never displayed in the UI."
      />

      {/* Backend connection */}
      <section aria-label="Backend connection">
        <Card variant="soft" className="p-6 sm:p-8">
          <div className="flex flex-col gap-5">
            <p className="clay-label">Backend Connection</p>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[20px] bg-white/70 p-4">
                <dt className="clay-label">API Base URL</dt>
                <dd className="mt-1 break-all font-mono text-sm font-bold text-[var(--clay-foreground)]">
                  {API_URL}
                </dd>
              </div>
              <div className="rounded-[20px] bg-white/70 p-4">
                <dt className="clay-label">Service</dt>
                <dd className="mt-1 flex flex-wrap items-center gap-2">
                  <StatusPill ok={health.data?.status === "healthy"} label="Backend" />
                  <span className="text-sm font-semibold text-clay-muted">
                    {health.data?.service ?? "—"} v{health.data?.version ?? "—"}
                  </span>
                </dd>
              </div>
            </dl>
            <p className="text-sm leading-relaxed text-clay-muted">
              The backend URL is read from the{" "}
              <code className="rounded-lg bg-[#efebf5] px-1.5 py-0.5 font-mono text-xs font-bold">
                VITE_API_URL
              </code>{" "}
              environment variable at build time. Change it in{" "}
              <code className="rounded-lg bg-[#efebf5] px-1.5 py-0.5 font-mono text-xs font-bold">
                frontend/.env
              </code>{" "}
              and restart the dev server.
            </p>
          </div>
        </Card>
      </section>

      {/* GitHub connection */}
      <section aria-label="GitHub connection">
        <Card variant="solid" className="p-6 sm:p-8">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="clay-orb clay-orb-gray flex h-11 w-11 items-center justify-center" aria-hidden="true">
                  <GithubIcon size={22} />
                </span>
                <div>
                  <p className="font-clay font-extrabold">GitHub App</p>
                  <p className="text-sm text-clay-muted">Authentication is handled server-side.</p>
                </div>
              </div>
              <StatusPill ok={connected} label={connected ? "Authenticated" : "Not connected"} />
            </div>
            {github.status === "error" ? (
              <p className="rounded-[20px] border border-[#ef4444]/25 bg-[#ef4444]/6 p-4 text-sm text-[#b91c1c]" role="alert">
                {github.error}
              </p>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" size="sm" onClick={github.reload}>
                Recheck connection
              </Button>
              <Button variant="secondary" size="sm" onClick={health.reload}>
                Recheck backend
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Current repository */}
      <section aria-label="Current repository">
        <Card variant="solid" className="p-6 sm:p-8">
          <div className="flex flex-col gap-4">
            <p className="clay-label">Current Repository</p>
            {repo ? (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-clay text-lg font-extrabold">{repo.fullName}</p>
                  <p className="text-sm text-clay-muted">Used by repo-scoped pages.</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setRepo(null)}>
                  Clear selection
                </Button>
              </div>
            ) : (
              <p className="text-sm text-clay-muted">
                No repository selected. Open one from the Repositories page to begin.
              </p>
            )}
          </div>
        </Card>
      </section>
    </div>
  );
}