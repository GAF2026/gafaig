import type {
  ApplicantWorkspaceGuidance,
} from "@/lib/guidance/useApplicantGuidance";

import ApplicantGuidanceStatusBadge from "./ApplicantGuidanceStatusBadge";

function displayParticipant(
  value: string | null,
): string {
  if (!value) {
    return "Unresolved";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

export default function ApplicantWaitingOnCard({
  workspace,
}: {
  workspace: ApplicantWorkspaceGuidance;
}) {
  return (
    <article className="min-w-0 rounded-2xl border border-black/10 bg-black/[0.02] p-4 sm:p-6">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
          Waiting On
        </div>

        <ApplicantGuidanceStatusBadge
          status={
            workspace.waitingOnStatus
          }
          label="Waiting On status"
        />
      </div>

      <dl className="mt-4 space-y-4 sm:mt-5">
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 sm:text-[12px]">
            Waiting
          </dt>

          <dd className="mt-2 text-[14px] font-semibold text-black sm:text-[15px]">
            {workspace.waiting === true
              ? "Yes"
              : workspace.waiting === false
                ? "No"
                : "Unresolved"}
          </dd>
        </div>

        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 sm:text-[12px]">
            Waiting On
          </dt>

          <dd className="mt-2 break-words text-[14px] font-semibold leading-6 text-black sm:text-[15px]">
            {displayParticipant(
              workspace.waitingOn,
            )}
          </dd>
        </div>

        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50 sm:text-[12px]">
            Current Owner
          </dt>

          <dd className="mt-2 break-words text-[14px] font-semibold leading-6 text-black sm:text-[15px]">
            {displayParticipant(
              workspace.currentOwner,
            )}
          </dd>
        </div>
      </dl>
    </article>
  );
}