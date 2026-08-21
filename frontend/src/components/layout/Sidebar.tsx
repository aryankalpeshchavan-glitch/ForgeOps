import { NavLink } from "react-router-dom";
import { useRepo } from "../../context/RepoContext";
import type { ReactNode } from "react";
import {
  HomeIcon,
  RepositoryIcon,
  ChartIcon,
  LayersIcon,
  WorkflowIcon,
  RocketIcon,
  GearIcon,
} from "../ui/icons";

interface NavItem {
  label: string;
  icon: ReactNode;
  to: string;
  end?: boolean;
  repoScoped?: boolean;
}

/** Sidebar navigation. Repo-scoped items fall back to the Repositories page when no repo is selected. */
export function Sidebar() {
  const { repo } = useRepo();

  const items: NavItem[] = [
    { label: "Dashboard", icon: <HomeIcon />, to: "/", end: true, repoScoped: false },
    { label: "Repositories", icon: <RepositoryIcon />, to: "/repositories", repoScoped: false },
    {
      label: "Repository Health",
      icon: <ChartIcon />,
      to: repo ? `/repos/${repo.owner}/${repo.name}` : "/repositories",
      repoScoped: true,
    },
    {
      label: "Analysis",
      icon: <LayersIcon />,
      to: repo ? `/repos/${repo.owner}/${repo.name}/analysis` : "/repositories",
      repoScoped: true,
    },
    {
      label: "Engineering Report",
      icon: <WorkflowIcon />,
      to: repo ? `/repos/${repo.owner}/${repo.name}/report` : "/repositories",
      repoScoped: true,
    },
    {
      label: "Automation",
      icon: <RocketIcon />,
      to: repo ? `/repos/${repo.owner}/${repo.name}/automation` : "/repositories",
      repoScoped: true,
    },
    { label: "Settings", icon: <GearIcon />, to: "/settings", repoScoped: false },
  ];

  return (
    <nav aria-label="Primary">
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.label}>
            <NavLink
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-[20px] px-4 py-3 font-clay text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#7c3aed]/10 text-[#6d28d9]"
                    : "text-[var(--clay-foreground)] hover:-translate-y-0.5 hover:bg-[#7c3aed]/6 hover:text-[#6d28d9]"
                }`
              }
            >
              <span className="text-lg" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
              {item.repoScoped && !repo ? (
                <span className="ml-auto text-xs text-clay-muted">pick a repo</span>
              ) : null}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}