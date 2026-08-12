import type {
  ApplicantWorkspaceGuidance,
} from "@/lib/guidance/useApplicantGuidance";

import ApplicantGuidanceStatusBadge from "./ApplicantGuidanceStatusBadge";
import ApplicantGuidanceActionLink from "./ApplicantGuidanceActionLink";

export default function ApplicantNextActionCard({
  workspace,
}: {
  workspace:
    ApplicantWorkspaceGuidance;
}) {
  const action =
    workspace.nextAction;

  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
          Next Required Action
        </h3>

        <ApplicantGuidanceStatusBadge
          status={
            workspace.nextActionStatus
          }
          label="Next Required Action status"
        />
      </div>

      <h4 className="mt-5 break-words text-[19px] font-semibold tracking-tight text-black">
        {action?.title ||
          "No deterministic next action available"}
      </h4>

      <p className="mt-3 text-[14px] leading-7 text-black/70">
        {action?.participantExplanation ||
          action?.description ||
          "The Guidance Engine has not identified a participant-visible next action."}
      </p>

      <dl className="mt-5 space-y-3">
        <div>
          <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/50">
            Owner
          </dt>

          <dd className="mt-1 break-words text-[14px] font-semibold text-black">
            {action?.owner ||
              workspace.currentOwner ||
              "Unresolved"}
          </dd>
        </div>

        <div>
          <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/50">
            Related Stage
          </dt>

          <dd className="mt-1 break-words text-[14px] text-black/70">
            {action?.relatedStage ||
              workspace.workflowStage ||
              "None identified"}
          </dd>
        </div>

        <div>
          <dt className="text-[12px] font-semibold uppercase tracking-[0.12em] text-black/50">
            Related Repository
          </dt>

          <dd className="mt-1 break-words text-[14px] text-black/70">
            {action?.relatedRepository ||
              "None identified"}
          </dd>
        </div>
      </dl>

      <div className="mt-auto pt-5">
        <ApplicantGuidanceActionLink
          relatedRepository={
            action?.relatedRepository
          }
        />
      </div>
    </article>
  );
}