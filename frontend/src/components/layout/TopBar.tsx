import { Link, useNavigate } from "react-router-dom";
import { useRepo } from "../../context/RepoContext";
import { useApi } from "../../hooks/useApi";
import { api } from "../../api/github";
import { StatusPill } from "../ui/Badge";

interface TopBarProps {
  onMenuToggle: () => void;
}

/** Global top bar: brand, GitHub connection status, current repository. */
export function TopBar({ onMenuToggle }: TopBarProps) {
  const { repo } = useRepo();
  const navigate = useNavigate();

  const test = useApi((signal) => api.githubTest(signal));

  const connected = test.status === "success" && test.data?.success === true;

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          className="clay-btn clay-btn-secondary clay-btn-sm lg:hidden"
          aria-label="Toggle navigation"
        >
          <span aria-hidden="true">☰</span>
        </button>

        <Link
          to="/"
          className="flex items-center gap-2.5 rounded-[24px] px-2 py-1 transition-transform hover:-translate-y-0.5"
          aria-label="ForgeOps home"
        >
          <span
            className="clay-orb clay-orb-violet flex h-10 w-10 items-center justify-center rounded-2xl"
            aria-hidden="true"
          >
            <svg width="22" height="22" viewBox="0 0 64 64" fill="none">
              <path d="M16 40 L48 40 M32 34 L32 44" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
              <circle cx="20" cy="32" r="4" fill="#fff" />
              <path d="M48 30 Q30 26 18 32 Q38 28 48 32" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-clay text-xl font-black tracking-tight text-[var(--clay-foreground)]">
            Forge<span className="text-[#7c3aed]">Ops</span>
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {repo ? (
          <button
            type="button"
            onClick={() => navigate(`/repos/${repo.owner}/${repo.name}`)}
            className="hidden max-w-56 items-center gap-2 rounded-[20px] bg-white/70 px-3 py-2 font-clay text-sm font-bold shadow-[var(--shadow-clay-white)] transition-all hover:-translate-y-0.5 sm:flex"
            title={repo.fullName}
          >
            <span className="text-[#7c3aed]" aria-hidden="true">◈</span>
            <span className="truncate">{repo.name}</span>
          </button>
        ) : null}

        {connected ? (
          <StatusPill ok label="GitHub Connected" />
        ) : (
          <StatusPill ok={false} label={test.status === "error" ? "Backend offline" : "Checking…"} />
        )}
      </div>
    </header>
  );
}