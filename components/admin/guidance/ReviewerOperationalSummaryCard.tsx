import type {
  ReviewerOperationalSummary,
} from "@/lib/guidance/useReviewerGuidance";

import ReviewerGuidanceStatusBadge from "./ReviewerGuidanceStatusBadge";

function displayValue(
  value:
    string | null | undefined,
): string {
  const normalized =
    value?.trim();

  return normalized ||
    "Not resolved";
}

export default function ReviewerOperationalSummaryCard({
  summary,
}: {
  summary:
    ReviewerOperationalSummary;
}) {
  return (
    <article
      className="rounded-2xl border border-black/10 bg-black/[0.02] p-4 sm:p-6"
      aria-labelledby="reviewer-operational-summary-heading"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/50">
            Operational Summary
          </div>

          <h3
            id="reviewer-operational-summary-heading"
            className="mt-2 text-[20px] font-semibold tracking-tight text-black"
          >
            Current reviewer guidance
          </h3>
        </div>

        <ReviewerGuidanceStatusBadge
          status={
            summary.aggregatedStatus
          }
          label="Operational Summary status"
        />
      </div>

      <p className="mt-4 text-[15px] leading-7 text-black/75 sm:mt-5 sm:leading-8">
        {summary.participantSummary}
      </p>

      <dl className="mt-5 grid gap-4 sm:mt-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.13em] text-black/50">
            Current Stage
          </dt>

          <dd className="mt-2 break-words [overflow-wrap:anywhere] text-[14px] font-semibold text-black">
            {displayValue(
              summary.currentStage,
            )}
          </dd>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.13em] text-black/50">
            Current Owner
          </dt>

          <dd className="mt-2 break-words [overflow-wrap:anywhere] text-[14px] font-semibold text-black">
            {displayValue(
              summary.currentOwner,
            )}
          </dd>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.13em] text-black/50">
            Next Required Action
          </dt>

          <dd className="mt-2 break-words [overflow-wrap:anywhere] text-[14px] font-semibold text-black">
            {displayValue(
              summary.nextRequiredAction
                ?.title,
            )}
          </dd>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.13em] text-black/50">
            Unresolved Conditions
          </dt>

          <dd className="mt-2 text-[24px] font-semibold tracking-tight text-black">
            {
              summary
                .unresolvedConditions
                .length
            }
          </dd>
        </div>
      </dl>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-black/50">
            Repository Categories
          </div>

          <div className="mt-2 text-[24px] font-semibold tracking-tight text-black">
            {
              summary
                .repositorySummary
                .repositoryCount
            }
          </div>

          <div className="mt-1 text-[12px] leading-5 text-black/60">
            operational repository categories
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-black/50">
              Blocking
            </div>

            <ReviewerGuidanceStatusBadge
              status={
                summary
                  .blockingSummary
                  .status
              }
              label="Operational Summary blocking status"
            />
          </div>

          <div className="mt-3 text-[24px] font-semibold tracking-tight text-black">
            {
              summary
                .blockingSummary
                .conditionCount
            }
          </div>

          <div className="mt-1 text-[12px] leading-5 text-black/60">
            participant-visible conditions
          </div>
        </div>

        <div className="rounded-2xl border border-black/10 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-black/50">
              Waiting On
            </div>

            <ReviewerGuidanceStatusBadge
              status={
                summary
                  .waitingSummary
                  .status
              }
              label="Operational Summary waiting status"
            />
          </div>

          <div className="mt-3 break-words [overflow-wrap:anywhere] text-[16px] font-semibold tracking-tight text-black">
            {displayValue(
              summary
                .waitingSummary
                .waitingOn,
            )}
          </div>

          <div className="mt-1 text-[12px] leading-5 text-black/60">
            {
              summary
                .waitingSummary
                .conditionCount
            }{" "}
            participant-visible conditions
          </div>
        </div>
      </div>

      {summary.nextRequiredAction
        ?.description ? (
        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-black/50">
            Reviewer Instruction
          </div>

          <p className="mt-2 text-[14px] leading-7 text-black/75">
            {
              summary
                .nextRequiredAction
                .description
            }
          </p>
        </div>
      ) : null}
    </article>
  );
}