import { useNavigate } from "react-router-dom";
import { useRepo } from "../../context/RepoContext";
import type { Repository } from "../../api/types";
import { Card, CardBody } from "../ui/Card";
import { Pill } from "../ui/Badge";
import { StarIcon, GitBranchIcon, IssueIcon, ExternalLinkIcon } from "../ui/icons";
import { formatNumber, truncate } from "../../utils/format";

interface RepoCardProps {
  repo: Repository;
  onOpen?: (repo: Repository) => void;
}

/** Tactile repository card used in dashboard and repositories lists. */
export function RepoCard({ repo, onOpen }: RepoCardProps) {
  const navigate = useNavigate();
  const { setRepo } = useRepo();
  const [owner, name] = repo.full_name.split("/");

  function open() {
    if (onOpen) {
      onOpen(repo);
      return;
    }
    if (owner && name) {
      setRepo({ owner, name, fullName: repo.full_name });
      navigate(`/repos/${owner}/${name}`);
    }
  }

  return (
    <Card
      interactive
      className="cursor-pointer"
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`Open repository ${repo.full_name}`}
    >
      <CardBody className="gap-4 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-clay truncate text-lg font-extrabold text-[var(--clay-foreground)]">
              {repo.name}
            </h3>
            <p className="text-xs font-semibold text-clay-muted">{repo.full_name}</p>
          </div>
          <Pill tone={repo.private ? "amber" : "green"}>{repo.private ? "Private" : "Public"}</Pill>
        </div>

        {repo.description ? (
          <p className="min-h-10 text-sm leading-relaxed text-clay-muted">
            {truncate(repo.description, 110)}
          </p>
        ) : (
          <p className="min-h-10 text-sm italic text-clay-muted">No description provided.</p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          {repo.language ? (
            <Pill tone={repo.language ? (repo.language.toLowerCase() === "python" ? "blue" : "violet") : "gray"}>
              {repo.language}
            </Pill>
          ) : null}
          <Pill tone="gray">
            <span className="flex items-center gap-1.5">
              <StarIcon size={14} /> {formatNumber(repo.stars)}
            </span>
          </Pill>
          <Pill tone="gray">
            <span className="flex items-center gap-1.5">
              <GitBranchIcon size={14} /> {repo.default_branch}
            </span>
          </Pill>
          <Pill tone="gray">
            <span className="flex items-center gap-1.5">
              <IssueIcon size={14} /> {formatNumber(repo.open_issues)}
            </span>
          </Pill>
        </div>

        <div className="flex items-center justify-between pt-1">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm font-bold text-[#6d28d9] underline-offset-4 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <span>GitHub</span>
            <ExternalLinkIcon size={14} />
          </a>
          <span className="font-clay text-sm font-extrabold text-[#7c3aed]">
            Open →
          </span>
        </div>
      </CardBody>
    </Card>
  );
}