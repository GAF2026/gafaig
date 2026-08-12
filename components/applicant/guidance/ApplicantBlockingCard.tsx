import type {
  ApplicantWorkspaceGuidance,
} from "@/lib/guidance/useApplicantGuidance";

import ApplicantGuidanceStatusBadge from "./ApplicantGuidanceStatusBadge";

export default function ApplicantBlockingCard({
  workspace,
}: {
  workspace:
    ApplicantWorkspaceGuidance;
}) {
  const blockingMessage =
    workspace.blocked === true
      ? "The case currently has a participant-visible blocking condition."
      : workspace.blocked === false
        ? "No deterministic blocking condition is currently present."
        : "Blocking status remains unresolved from the available authoritative context.";

  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
          Blocking
        </h3>

        <ApplicantGuidanceStatusBadge
          status={
            workspace.blockingStatus
          }
          label="Blocking status"
        />
      </div>

      <p className="mt-5 text-[14px] leading-7 text-black/70">
        {blockingMessage}
      </p>

      <div className="mt-auto pt-5">
        <div className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/50">
          Visible Blocking Conditions
        </div>

        <div className="mt-2 text-[28px] font-semibold tracking-tight text-black">
          {workspace.blockingConditionCount}
        </div>
      </div>
    </article>
  );
}