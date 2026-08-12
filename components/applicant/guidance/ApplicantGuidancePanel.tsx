"use client";

import {
  useApplicantGuidance,
} from "@/lib/guidance/useApplicantGuidance";

import ApplicantGuidanceStatusBadge from "./ApplicantGuidanceStatusBadge";
import ApplicantGuidanceLoading from "./ApplicantGuidanceLoading";
import ApplicantGuidanceError from "./ApplicantGuidanceError";
import ApplicantOperationalSummaryCard from "./ApplicantOperationalSummaryCard";
import ApplicantRepositorySummaryCard from "./ApplicantRepositorySummaryCard";
import ApplicantNextActionCard from "./ApplicantNextActionCard";
import ApplicantBlockingCard from "./ApplicantBlockingCard";
import ApplicantWaitingOnCard from "./ApplicantWaitingOnCard";
import ApplicantAuthorityBoundaryCard from "./ApplicantAuthorityBoundaryCard";
import ApplicantGuidanceRefreshStatus from "./ApplicantGuidanceRefreshStatus";
import ApplicantGuidanceDetails from "./ApplicantGuidanceDetails";
import ApplicantGuidanceLiveRegion from "./ApplicantGuidanceLiveRegion";

export default function ApplicantGuidancePanel({
  caseId,
}: {
  caseId: string;
}) {
  const {
    loading,
    refreshing,
    error,
    guidance,
    operationalSummary,
    components,
    workspace,
    status,
    lastUpdatedAt,
    refresh,
  } =
    useApplicantGuidance(
      caseId,
    );

  const hasRenderableWorkspace =
    Boolean(workspace);

  const liveMessage =
    loading
      ? "Loading operational guidance."
      : refreshing
        ? "Refreshing operational guidance."
        : error &&
            !hasRenderableWorkspace
          ? "Operational guidance is unavailable."
          : error &&
              hasRenderableWorkspace
            ? "The latest refresh failed. Previously loaded guidance remains visible."
            : operationalSummary
              ? `Operational summary loaded. Overall status is ${status ?? "unknown"}.`
              : workspace
                ? `Operational guidance loaded. Overall status is ${status ?? "unknown"}.`
                : "No operational guidance workspace is available.";

  return (
    <section
      className="min-w-0 rounded-3xl border border-black/10 bg-white p-4 sm:p-8"
      aria-labelledby="applicant-guidance-heading"
      aria-describedby="applicant-guidance-description"
      aria-busy={
        loading ||
        refreshing
      }
    >
      <ApplicantGuidanceLiveRegion
        message={liveMessage}
        assertive={Boolean(
          error &&
            !hasRenderableWorkspace,
        )}
      />

      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/60 sm:text-[13px] sm:tracking-[0.22em]">
            Applicant Guidance
          </div>

          <h2
            id="applicant-guidance-heading"
            className="mt-3 break-words text-[22px] font-semibold tracking-tight text-black sm:mt-4 sm:text-[26px]"
          >
            Current operational guidance
          </h2>

          <p
            id="applicant-guidance-description"
            className="mt-4 max-w-[920px] text-[14px] leading-7 text-black/75 sm:mt-5 sm:text-[15px] sm:leading-8"
          >
            Guidance is derived from authenticated, organization-scoped,
            read-only operational context. It does not create workflow,
            governance, certification, publication, registry, or verification
            authority.
          </p>
        </div>

        {status ? (
          <div className="shrink-0 self-start">
            <ApplicantGuidanceStatusBadge
              status={status}
              label="Overall Guidance status"
            />
          </div>
        ) : null}
      </div>

      <div className="mt-6 sm:mt-8">
        {loading ? (
          <ApplicantGuidanceLoading />
        ) : null}

        {!loading &&
        error &&
        !hasRenderableWorkspace ? (
          <ApplicantGuidanceError
            message={error}
            retrying={refreshing}
            onRetry={() => {
              void refresh();
            }}
          />
        ) : null}

        {!loading &&
        hasRenderableWorkspace &&
        workspace ? (
          <div className="min-w-0 space-y-4 sm:space-y-5">
            {error ? (
              <div
                className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-[13px] leading-6 text-amber-950 sm:px-5"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                The most recent refresh was unsuccessful. The last successfully
                loaded Guidance result remains visible.
              </div>
            ) : null}

            {operationalSummary ? (
              <ApplicantOperationalSummaryCard
                summary={
                  operationalSummary
                }
              />
            ) : (
              <div
                className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-[13px] leading-6 text-amber-950 sm:px-5"
                role="status"
                aria-live="polite"
                aria-atomic="true"
              >
                No participant-visible Operational Summary payload was
                returned. Detailed Guidance remains available below.
              </div>
            )}

            <div className="grid min-w-0 gap-4 sm:gap-5 lg:grid-cols-2">
              <ApplicantRepositorySummaryCard
                workspace={workspace}
              />

              <ApplicantNextActionCard
                workspace={workspace}
              />

              <ApplicantBlockingCard
                workspace={workspace}
              />

              <ApplicantWaitingOnCard
                workspace={workspace}
              />
            </div>

            <ApplicantGuidanceDetails
              operationalSummary={
                guidance?.guidance ??
                null
              }
              components={
                components
              }
            />

            <ApplicantAuthorityBoundaryCard
              boundary={
                guidance
                  ?.authorityBoundary
              }
            />

            <div className="flex min-w-0 flex-col gap-3 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <ApplicantGuidanceRefreshStatus
                refreshing={
                  refreshing
                }
                lastUpdatedAt={
                  lastUpdatedAt
                }
              />

              <button
                type="button"
                onClick={() => {
                  void refresh();
                }}
                disabled={refreshing}
                aria-disabled={
                  refreshing
                }
                aria-describedby="applicant-guidance-refresh-description"
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-black/20 bg-white px-4 py-2 text-[13px] font-semibold text-black transition hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-10 sm:w-auto"
              >
                {refreshing
                  ? "Refreshing guidance..."
                  : "Refresh guidance"}
              </button>

              <span
                id="applicant-guidance-refresh-description"
                className="sr-only"
              >
                Refreshing retrieves updated read-only Guidance. It does not
                change workflow or authority state.
              </span>
            </div>
          </div>
        ) : null}

        {!loading &&
        !error &&
        !workspace ? (
          <ApplicantGuidanceError
            message="The Guidance API returned no workspace projection."
            retrying={refreshing}
            onRetry={() => {
              void refresh();
            }}
          />
        ) : null}
      </div>
    </section>
  );
}