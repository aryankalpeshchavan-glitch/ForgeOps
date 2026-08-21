import { useState } from "react";
import { api } from "../../api/github";
import type { CiFixResponse } from "../../api/types";
import { Card, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Pill } from "../ui/Badge";
import {
  RocketIcon,
  ExternalLinkIcon,
  CheckIcon,
  GitBranchIcon,
} from "../ui/icons";

type Stage = "idle" | "confirm" | "working" | "success" | "error";

interface AutomatedFixProps {
  owner: string;
  repo: string;
}

/**
 * ForgeOps automation flow for a repository:
 * confirm → call POST /fix/ci → show branch + Pull Request → open on GitHub.
 */
export function AutomatedFix({ owner, repo }: AutomatedFixProps) {
  const [stage, setStage] = useState<Stage>("idle");
  const [result, setResult] = useState<CiFixResponse["result"] | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runFix() {
    setStage("working");
    setError(null);
    try {
      const response = await api.fixCi(owner, repo);
      if (response.success && response.result) {
        setResult(response.result);
        setStage("success");
      } else {
        setError(response.error ?? "ForgeOps could not complete the fix. No changes were made.");
        setStage("error");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      setStage("error");
    }
  }

  return (
    <Card variant="soft" className="p-6 sm:p-8">
      <CardBody className="gap-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="clay-orb clay-orb-violet flex h-14 w-14 items-center justify-center text-2xl" aria-hidden="true">
              <RocketIcon size={28} />
            </span>
            <div>
              <h3 className="font-clay text-xl font-black sm:text-2xl">ForgeOps Automation</h3>
              <p className="text-sm font-medium text-clay-muted">
                Autonomous engineering fixes, delivered as pull requests.
              </p>
            </div>
          </div>
          <Pill tone="violet">CI/CD</Pill>
        </div>

        {stage === "idle" ? <StageIdle onContinue={() => setStage("confirm")} /> : null}

        {stage === "confirm" ? (
          <ConfirmPanel
            onRun={() => void runFix()}
            onCancel={() => setStage("idle")}
          />
        ) : null}

        {stage === "working" ? (
          <div
            className="flex flex-col items-center gap-4 rounded-[24px] bg-white/50 p-8 text-center"
            role="status"
            aria-live="polite"
          >
            <span className="clay-spinner" aria-hidden="true" />
            <div>
              <p className="font-clay text-lg font-extrabold">ForgeOps is engineering…</p>
              <p className="mt-1 text-sm text-clay-muted">
                Creating a branch, writing a CI workflow, and opening a pull request on GitHub.
              </p>
            </div>
          </div>
        ) : null}

        {stage === "success" && result ? (
          <SuccessPanel
            branch={result.branch}
            prNumber={result.pull_request.number}
            prUrl={result.pull_request.url}
            onDone={() => {
              setStage("idle");
              setResult(null);
            }}
          />
        ) : null}

        {stage === "error" ? (
          <div
            className="flex flex-col items-start gap-4 rounded-[24px] border border-[#ef4444]/25 bg-[#ef4444]/5 p-6"
            role="alert"
          >
            <div className="flex items-center gap-3">
              <span className="clay-orb clay-orb-red flex h-10 w-10 items-center justify-center text-lg" aria-hidden="true">
                !
              </span>
              <p className="font-clay text-base font-extrabold">ForgeOps could not complete the fix</p>
            </div>
            <p className="text-sm leading-relaxed text-[var(--clay-foreground)]">{error}</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" onClick={() => void runFix()}>
                Try again
              </Button>
              <Button variant="secondary" onClick={() => setStage("idle")}>
                Back
              </Button>
            </div>
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}

function StageIdle({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex flex-col gap-5 rounded-[20px] border border-[#7c3aed]/15 bg-[#7c3aed]/5 p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-3 w-3 rounded-full bg-[#f59e0b]" aria-hidden="true" />
        <p className="font-clay text-base font-extrabold">Your repository can be improved.</p>
      </div>
      <p className="text-sm leading-relaxed text-clay-muted">
        ForgeOps can add or repair the CI/CD pipeline. It will create a branch, commit a
        GitHub Actions workflow, and open a Pull Request for your review — no direct push
        to your default branch.
      </p>
      <ul className="grid gap-2 text-sm font-medium text-[var(--clay-foreground)] sm:grid-cols-3">
        <li className="flex items-center gap-2"><span className="font-clay font-black text-[#7c3aed]" aria-hidden="true">1.</span>Create branch</li>
        <li className="flex items-center gap-2"><span className="font-clay font-black text-[#7c3aed]" aria-hidden="true">2.</span>Write CI workflow</li>
        <li className="flex items-center gap-2"><span className="font-clay font-black text-[#7c3aed]" aria-hidden="true">3.</span>Open Pull Request</li>
      </ul>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={onContinue} icon={<RocketIcon size={18} />}>
          Fix with ForgeOps
        </Button>
      </div>
    </div>
  );
}

function ConfirmPanel({ onRun, onCancel }: { onRun: () => void; onCancel: () => void }) {
  return (
    <div className="flex flex-col gap-4 rounded-[20px] border border-[#7c3aed]/25 bg-white/60 p-6">
      <p className="font-clay text-base font-extrabold">Confirm automated fix</p>
      <p className="text-sm leading-relaxed text-clay-muted">
        ForgeOps will use its GitHub App access to create a branch named{" "}
        <code className="rounded-lg bg-[#efebf5] px-1.5 py-0.5 font-sans text-xs font-bold">
          forgeops/fix-ci
        </code>
        , add a CI/CD workflow, and open a Pull Request in this repository. You can review
        and merge the PR yourself.
      </p>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" onClick={onRun} autoFocus>
          Yes, run the fix
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

function SuccessPanel({
  branch,
  prNumber,
  prUrl,
  onDone,
}: {
  branch: string;
  prNumber: number;
  prUrl: string;
  onDone: () => void;
}) {
  return (
    <div
      className="flex flex-col gap-5 rounded-[20px] border border-[#10b981]/25 bg-[#10b981]/5 p-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-3">
        <span className="clay-orb clay-orb-green flex h-11 w-11 items-center justify-center" aria-hidden="true">
          <CheckIcon size={22} />
        </span>
        <div>
          <p className="font-clay text-lg font-extrabold">Pull Request created successfully</p>
          <p className="text-sm text-clay-muted">ForgeOps opened a pull request on GitHub.</p>
        </div>
      </div>

      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-[20px] bg-white/80 p-4">
          <dt className="clay-label">Branch</dt>
          <dd className="mt-1 flex items-center gap-2 font-mono text-sm font-bold text-[var(--clay-foreground)]">
            <GitBranchIcon size={15} />
            {branch}
          </dd>
        </div>
        <div className="rounded-[20px] bg-white/80 p-4">
          <dt className="clay-label">Pull Request</dt>
          <dd className="mt-1 font-clay text-sm font-extrabold text-[var(--clay-foreground)]">
            #{prNumber}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-3">
        <a href={prUrl} target="_blank" rel="noreferrer" className="clay-btn clay-btn-primary">
          <ExternalLinkIcon size={18} />
          Open Pull Request
        </a>
        <Button variant="secondary" onClick={onDone}>
          Done
        </Button>
      </div>
    </div>
  );
}