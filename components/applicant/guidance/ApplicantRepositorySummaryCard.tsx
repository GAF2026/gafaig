import type {
  ApplicantWorkspaceGuidance,
} from "@/lib/guidance/useApplicantGuidance";

import ApplicantGuidanceStatusBadge from "./ApplicantGuidanceStatusBadge";

export default function ApplicantRepositorySummaryCard({
  workspace,
}: {
  workspace:
    ApplicantWorkspaceGuidance;
}) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
          Repository Context
        </h3>

        <ApplicantGuidanceStatusBadge
          status={
            workspace.repositoryContextStatus
          }
          label="Repository Context status"
        />
      </div>

      <dl className="mt-5 space-y-4">
        <div>
          <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/50">
            Workflow Status
          </dt>

          <dd className="mt-2 break-words text-[15px] font-semibold text-black">
            {workspace.workflowStatus ||
              "Unresolved"}
          </dd>
        </div>

        <div>
          <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/50">
            Workflow Stage
          </dt>

          <dd className="mt-2 break-words text-[15px] font-semibold text-black">
            {workspace.workflowStage ||
              "Unresolved"}
          </dd>
        </div>

        <div>
          <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/50">
            Observed At
          </dt>

          <dd className="mt-2 break-words text-[14px] leading-6 text-black/70">
            {workspace.observedAt ||
              "No observation timestamp"}
          </dd>
        </div>
      </dl>
    </article>
  );
}