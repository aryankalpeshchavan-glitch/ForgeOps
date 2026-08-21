import { useParams } from "react-router-dom";
import { AutomatedFix } from "../components/repo/AutomatedFix";
import { PageHeader } from "../components/ui/SectionTitle";
import { useApi } from "../hooks/useApi";
import { api } from "../api/github";
import { StateView } from "../components/ui/StateView";
import { Card } from "../components/ui/Card";
import type { ReportResponse } from "../api/types";

/** Automated engineering fixes — the ForgeOps "Fix with ForgeOps" flow. */
export default function AutomationPage() {
  const { owner = "", repo = "" } = useParams();
  const report = useApi((signal) => api.report(owner, repo));

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Automation"
        subtitle="Let ForgeOps repair and improve your repository automatically through pull requests."
      />

      {/* Context note */}
      <StateView<ReportResponse>
        status={report.status}
        data={report.data}
        error={report.error}
        onRetry={report.reload}
        loadingRows={1}
      >
        {(data) => {
          const hasCi = data.report?.engineering?.ci_cd === "configured";
          return (
            <Card variant="solid" className="p-5">
              <p className="text-sm leading-relaxed text-clay-muted">
                {hasCi ? (
                  <>
                    <span className="font-clay font-extrabold text-[#047857]">CI/CD configured.</span>{" "}
                    ForgeOps found a GitHub Actions workflow in place. The fix flow is still
                    available to repair or extend it.
                  </>
                ) : (
                  <>
                    <span className="font-clay font-extrabold text-[#b45309]">
                      CI/CD recommended.
                    </span>{" "}
                    The engineering report identified a missing or incomplete pipeline. Run the
                    automated fix below to generate a pull request.
                  </>
                )}
              </p>
            </Card>
          );
        }}
      </StateView>

      <AutomatedFix owner={owner} repo={repo} />

      {/* Recap of what happens */}
      <section aria-label="How automation works">
        <PageHeader title="What happens next" subtitle="A safe, reviewable automation flow." />
        <div className="grid gap-4 sm:grid-cols-3">
          <StepCard n={1} title="Create branch" body="forgeops/fix-ci is branched from your default branch." />
          <StepCard n={2} title="Write the workflow" body="A GitHub Actions CI config is committed to the branch." />
          <StepCard n={3} title="Open a Pull Request" body="You review and merge the PR — your default branch is never pushed to." />
        </div>
      </section>
    </div>
  );
}

function StepCard({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <Card variant="solid" className="p-5" interactive>
      <span className="clay-orb clay-orb-violet flex h-10 w-10 items-center justify-center font-clay text-lg font-black" aria-hidden="true">
        {n}
      </span>
      <p className="mt-3 font-clay font-extrabold">{title}</p>
      <p className="mt-1 text-sm text-clay-muted">{body}</p>
    </Card>
  );
}