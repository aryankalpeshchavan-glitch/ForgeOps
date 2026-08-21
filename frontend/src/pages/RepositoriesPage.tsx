import { useMemo, useState } from "react";
import { useApi } from "../hooks/useApi";
import { api } from "../api/github";
import { StateView } from "../components/ui/StateView";
import { PageHeader } from "../components/ui/SectionTitle";
import { Card } from "../components/ui/Card";
import { Pill } from "../components/ui/Badge";
import { Metric } from "../components/ui/Metric";
import { RepoCard } from "../components/repo/RepoCard";
import {
  RepositoryIcon,
  StarIcon,
  IssueIcon,
  SearchIcon,
} from "../components/ui/icons";
import { formatNumber } from "../utils/format";
import type { RepositoriesResponse } from "../api/types";

/** Full list of repositories accessible through the ForgeOps GitHub App. */
export default function RepositoriesPage() {
  const repos = useApi((signal) => api.repositories(signal));
  const [filter, setFilter] = useState("");

  const repoList = repos.data?.repositories ?? [];

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return repoList;
    return repoList.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.full_name.toLowerCase().includes(q) ||
        (r.language ?? "").toLowerCase().includes(q),
    );
  }, [filter, repoList]);

  const totalStars = repoList.reduce((sum, r) => sum + (r.stars || 0), 0);

  return (
    <div>
      <PageHeader
        title="Repositories"
        subtitle="All repositories the ForgeOps GitHub App can access. Select one to open its health dashboard."
        action={
          <div className="flex max-w-md items-center gap-2">
            <div className="relative w-full">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-clay-muted" aria-hidden="true">
                <SearchIcon size={18} />
              </span>
              <input
                type="search"
                className="clay-input pl-12"
                placeholder="Filter repositories…"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                aria-label="Filter repositories"
              />
            </div>
          </div>
        }
      />

      <div className="mb-8 grid grid-cols-3 gap-4 lg:gap-6">
        <Card variant="solid" className="p-4">
          <Metric
            icon={<RepositoryIcon size={18} />}
            label="Available"
            value={repos.status === "loading" ? "…" : formatNumber(repos.data?.count ?? 0)}
            tone="violet"
          />
        </Card>
        <Card variant="solid" className="p-4">
          <Metric
            icon={<StarIcon size={18} />}
            label="Stars"
            value={formatNumber(totalStars)}
            tone="amber"
          />
        </Card>
        <Card variant="solid" className="p-4">
          <Metric
            icon={<PillTone />}
            label="Languages"
            value={new Set(repoList.map((r) => r.language).filter(Boolean)).size}
            tone="blue"
          />
        </Card>
      </div>

      <div aria-live="polite">
        <StateView<RepositoriesResponse>
          status={repos.status}
          data={repos.data}
          error={repos.error}
          onRetry={repos.reload}
          loadingRows={4}
          emptyTitle="No repositories available"
          emptyBody="Install the ForgeOps GitHub App on a repository so it can be analyzed."
        >
          {(data) =>
            data.repositories && data.repositories.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((repo) => (
                  <RepoCard key={repo.full_name} repo={repo} />
                ))}
              </div>
            ) : (
              <Card variant="solid" className="p-8">
                <p className="font-clay font-extrabold text-lg">No repositories found</p>
                <p className="mt-1 text-sm text-clay-muted">
                  Adjust your filter, or install the ForgeOps GitHub App on a repository.
                </p>
              </Card>
            )
          }
        </StateView>
      </div>
    </div>
  );
}

function PillTone() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 2l7 4v6c0 5-3.5 7.5-7 8.5-3.5-1-7-3.5-7-8.5V6z" />
    </svg>
  );
}