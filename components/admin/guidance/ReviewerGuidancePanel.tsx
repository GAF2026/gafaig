"use client";

import {
  useReviewerGuidance,
} from "@/lib/guidance/useReviewerGuidance";

import ReviewerGuidanceStatusBadge from "./ReviewerGuidanceStatusBadge";
import ReviewerOperationalSummaryCard from "./ReviewerOperationalSummaryCard";

function displayValue(
  value:
    string | null | undefined,
): string {
  const normalized =
    value?.trim();

  return normalized ||
    "Not resolved";
}

function formatUpdatedAt(
  value:
    string | null,
): string {
  if (!value) {
    return "Not yet refreshed";
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleString();
}

function ConditionList({
  values,
  emptyMessage,
}: {
  values:
    readonly string[];

  emptyMessage:
    string;
}) {
  if (
    values.length === 0
  ) {
    return (
      <p className="mt-3 text-[13px] leading-6 text-black/60">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="mt-3 space-y-2">
      {values.map(
        (
          value,
          index,
        ) => (
          <li
            key={`${value}-${index}`}
            className="rounded-xl border border-black/10 bg-white px-3 py-3 text-[13px] leading-6 text-black/75"
          >
            {value}
          </li>
        ),
      )}
    </ul>
  );
}

function RepositoryList({
  title,
  values,
  emptyMessage,
}: {
  title:
    string;

  values:
    readonly string[];

  emptyMessage:
    string;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.13em] text-black/50">
        {title}
      </div>

      {values.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {values.map(
            (
              value,
              index,
            ) => (
              <li
                key={`${value}-${index}`}
                className="break-words [overflow-wrap:anywhere] text-[13px] leading-6 text-black/75"
              >
                {value}
              </li>
            ),
          )}
        </ul>
      ) : (
        <p className="mt-3 text-[13px] leading-6 text-black/60">
          {emptyMessage}
        </p>
      )}
    </div>
  );
}

export default function ReviewerGuidancePanel({
  caseId,
}: {
  caseId:
    string;
}) {
  const {
    loading,
    refreshing,
    error,
    guidance,
    operationalSummary,
    status,
    scope,
    authorityBoundary,
    lastUpdatedAt,
    refresh,
  } =
    useReviewerGuidance(
      caseId,
    );

  if (
    loading &&
    !guidance
  ) {
    return (
      <section
        className="min-w-0 rounded-3xl border border-black/10 bg-white p-5 sm:p-8"
        aria-labelledby="reviewer-guidance-heading"
        aria-busy="true"
      >
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
          Reviewer Operational Guidance
        </div>

        <h2
          id="reviewer-guidance-heading"
          className="mt-2 text-[24px] font-semibold tracking-tight text-black"
        >
          Loading reviewer guidance
        </h2>

        <p className="mt-3 text-[14px] leading-7 text-black/65">
          Resolving the current stage, owner, next required action,
          blocking conditions, waiting state, and repository context
          from the existing read-only Operational Guidance engines.
        </p>
      </section>
    );
  }

  if (
    error &&
    !operationalSummary
  ) {
    return (
      <section
        className="min-w-0 rounded-3xl border border-red-200 bg-white p-5 sm:p-8"
        aria-labelledby="reviewer-guidance-heading"
      >
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-red-700">
          Reviewer Operational Guidance
        </div>

        <h2
          id="reviewer-guidance-heading"
          className="mt-2 text-[24px] font-semibold tracking-tight text-black"
        >
          Reviewer guidance unavailable
        </h2>

        <p
          className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-[14px] leading-7 text-red-900"
          role="alert"
        >
          {error}
        </p>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => {
              void refresh();
            }}
            disabled={
              refreshing
            }
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-black bg-black px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {refreshing
              ? "Refreshing…"
              : "Retry guidance"}
          </button>
        </div>
      </section>
    );
  }

  if (
    !operationalSummary
  ) {
    return (
      <section
        className="min-w-0 rounded-3xl border border-amber-200 bg-white p-5 sm:p-8"
        aria-labelledby="reviewer-guidance-heading"
      >
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-800">
          Reviewer Operational Guidance
        </div>

        <h2
          id="reviewer-guidance-heading"
          className="mt-2 text-[24px] font-semibold tracking-tight text-black"
        >
          Guidance remains unresolved
        </h2>

        <p className="mt-3 text-[14px] leading-7 text-black/65">
          The current authoritative context did not produce a
          renderable Operational Summary for this reviewer case.
        </p>

        <div className="mt-5">
          <button
            type="button"
            onClick={() => {
              void refresh();
            }}
            disabled={
              refreshing
            }
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-black/20 bg-white px-4 py-2 text-[13px] font-semibold text-black transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {refreshing
              ? "Refreshing…"
              : "Refresh guidance"}
          </button>
        </div>
      </section>
    );
  }

  const nextAction =
    operationalSummary
      .nextRequiredAction;

  const repositories =
    operationalSummary
      .repositorySummary;

  const blocking =
    operationalSummary
      .blockingSummary;

  const waiting =
    operationalSummary
      .waitingSummary;

  const unresolved =
    operationalSummary
      .unresolvedConditions;

  return (
    <section
      className="min-w-0 rounded-3xl border border-black/10 bg-white p-4 sm:p-8"
      aria-labelledby="reviewer-guidance-heading"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
            Reviewer Operational Guidance
          </div>

          <h2
            id="reviewer-guidance-heading"
            className="mt-2 text-[24px] font-semibold tracking-tight text-black sm:text-[28px]"
          >
            What the reviewer should do next
          </h2>

          <p className="mt-3 max-w-4xl text-[14px] leading-7 text-black/65">
            This guidance is derived from existing authoritative
            operational context. It provides reviewer visibility only
            and does not execute actions, resolve blockers, reassign
            ownership, or mutate workflow, repository, governance,
            certification, publication, registry, verification, or
            scoring state.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ReviewerGuidanceStatusBadge
            status={
              status
            }
            label="Reviewer Operational Guidance status"
          />

          <button
            type="button"
            onClick={() => {
              void refresh();
            }}
            disabled={
              refreshing
            }
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-black/20 bg-white px-4 py-2 text-[13px] font-semibold text-black transition hover:bg-black/[0.03] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {refreshing
              ? "Refreshing…"
              : "Refresh guidance"}
          </button>
        </div>
      </div>

      {error ? (
        <div
          className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4 text-[13px] leading-6 text-amber-950"
          role="status"
        >
          The latest refresh did not complete successfully. Previously
          loaded guidance remains visible. {error}
        </div>
      ) : null}

      <div className="mt-6">
        <ReviewerOperationalSummaryCard
          summary={
            operationalSummary
          }
        />
      </div>

      <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-2">
        <article className="min-w-0 rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
              Next Required Action
            </h3>

            <ReviewerGuidanceStatusBadge
              status={
                guidance
                  ?.components
                  ?.nextAction
                  ?.status
              }
              label="Next Required Action status"
            />
          </div>

          <h4 className="mt-5 break-words text-[19px] font-semibold tracking-tight text-black">
            {displayValue(
              nextAction?.title,
            )}
          </h4>

          <p className="mt-3 text-[14px] leading-7 text-black/70">
            {displayValue(
              nextAction
                ?.description,
            )}
          </p>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
                Action Owner
              </dt>

              <dd className="mt-1 break-words text-[14px] font-semibold text-black">
                {displayValue(
                  nextAction?.owner ??
                    operationalSummary.currentOwner,
                )}
              </dd>
            </div>

            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
                Related Stage
              </dt>

              <dd className="mt-1 break-words text-[14px] font-semibold text-black">
                {displayValue(
                  nextAction
                    ?.relatedStage,
                )}
              </dd>
            </div>

            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
                Related Repository
              </dt>

              <dd className="mt-1 break-words text-[14px] font-semibold text-black">
                {displayValue(
                  nextAction
                    ?.relatedRepository,
                )}
              </dd>
            </div>

            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
                Current Case Stage
              </dt>

              <dd className="mt-1 break-words text-[14px] font-semibold text-black">
                {displayValue(
                  operationalSummary
                    .currentStage,
                )}
              </dd>
            </div>
          </dl>

          {nextAction
            ?.participantExplanation ? (
            <div className="mt-5 rounded-2xl border border-black/10 bg-white p-4">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
                Why this action
              </div>

              <p className="mt-2 text-[13px] leading-6 text-black/70">
                {
                  nextAction
                    .participantExplanation
                }
              </p>
            </div>
          ) : null}
        </article>

        <article className="min-w-0 rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
              Repository Context
            </h3>

            <ReviewerGuidanceStatusBadge
              status={
                guidance
                  ?.components
                  ?.repositoryContext
                  ?.status
              }
              label="Repository Context status"
            />
          </div>

          <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
            <RepositoryList
              title="Repositories With Records"
              values={
                repositories
                  .repositoriesWithRecords
              }
              emptyMessage="No repository category with records was identified."
            />

            <RepositoryList
              title="Empty Repositories"
              values={
                repositories
                  .emptyRepositories
              }
              emptyMessage="No empty repository category was identified."
            />
          </div>

          <div className="mt-4 rounded-2xl border border-black/10 bg-white p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
              Relationship Availability
            </div>

            <div className="mt-2 break-words [overflow-wrap:anywhere] text-[14px] font-semibold text-black">
              {displayValue(
                repositories
                  .relationshipAvailability,
              )}
            </div>
          </div>
        </article>

        <article className="min-w-0 rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
              Blocking
            </h3>

            <ReviewerGuidanceStatusBadge
              status={
                blocking.status
              }
              label="Blocking status"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
                Visible Conditions
              </div>

              <div className="mt-1 text-[28px] font-semibold tracking-tight text-black">
                {
                  blocking
                    .conditionCount
                }
              </div>
            </div>

            <div className="text-[13px] font-semibold text-black/65">
              {blocking.blocked ===
              true
                ? "Case is blocked"
                : blocking.blocked ===
                    false
                  ? "No deterministic blocker"
                  : "Blocking state unresolved"}
            </div>
          </div>

          <ConditionList
            values={
              blocking
                .participantVisibleConditions
            }
            emptyMessage="No participant-visible blocking condition is currently present."
          />
        </article>

        <article className="min-w-0 rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
              Waiting On
            </h3>

            <ReviewerGuidanceStatusBadge
              status={
                waiting.status
              }
              label="Waiting On status"
            />
          </div>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
                Waiting On
              </dt>

              <dd className="mt-1 break-words text-[14px] font-semibold text-black">
                {displayValue(
                  waiting.waitingOn,
                )}
              </dd>
            </div>

            <div>
              <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
                Current Owner
              </dt>

              <dd className="mt-1 break-words text-[14px] font-semibold text-black">
                {displayValue(
                  waiting.currentOwner ??
                    operationalSummary.currentOwner,
                )}
              </dd>
            </div>
          </dl>

          <ConditionList
            values={
              waiting
                .participantVisibleConditions
            }
            emptyMessage="No participant-visible waiting condition is currently present."
          />
        </article>
      </div>

      {unresolved.length >
      0 ? (
        <article className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6">
          <h3 className="text-[12px] font-semibold uppercase tracking-[0.16em] text-amber-900">
            Unresolved Guidance Conditions
          </h3>

          <ConditionList
            values={
              unresolved
            }
            emptyMessage="No unresolved guidance conditions are present."
          />
        </article>
      ) : null}

      <article className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
        <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
          Authority Boundary
        </div>

        <p className="mt-3 text-[13px] leading-6 text-black/65">
          Reviewer Operational Guidance is advisory and read-only.
          Human authority remains responsible for operational,
          governance, verification, certification, publication, and
          registry decisions.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {authorityBoundary
            ?.readOnly !==
          false ? (
            <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-black/65">
              Read Only
            </span>
          ) : null}

          {authorityBoundary
            ?.automaticActionExecution !==
          true ? (
            <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-black/65">
              No Automatic Action
            </span>
          ) : null}

          {authorityBoundary
            ?.automaticReassignment !==
          true ? (
            <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-black/65">
              No Automatic Reassignment
            </span>
          ) : null}

          {authorityBoundary
            ?.workflowMutation !==
          true ? (
            <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-black/65">
              No Workflow Mutation
            </span>
          ) : null}

          {authorityBoundary
            ?.repositoryMutation !==
          true ? (
            <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-black/65">
              No Repository Mutation
            </span>
          ) : null}

          {authorityBoundary
            ?.governanceAuthority !==
          true ? (
            <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-black/65">
              No Governance Authority
            </span>
          ) : null}

          {authorityBoundary
            ?.certificationAuthority !==
          true ? (
            <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-black/65">
              No Certification Authority
            </span>
          ) : null}

          {authorityBoundary
            ?.publicationAuthority !==
          true ? (
            <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-black/65">
              No Publication Authority
            </span>
          ) : null}

          {authorityBoundary
            ?.registryAuthority !==
          true ? (
            <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-black/65">
              No Registry Authority
            </span>
          ) : null}

          {authorityBoundary
            ?.verificationAuthority !==
          true ? (
            <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-black/65">
              No Verification Authority
            </span>
          ) : null}

          {authorityBoundary
            ?.scoringAuthority !==
          true ? (
            <span className="rounded-full border border-black/15 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-black/65">
              No Scoring Authority
            </span>
          ) : null}
        </div>
      </article>

      <div className="mt-5 flex flex-col gap-2 border-t border-black/10 pt-4 text-[11px] leading-5 text-black/45 sm:flex-row sm:flex-wrap sm:justify-between">
        <span>
          Case:{" "}
          {displayValue(
            scope?.caseId ??
              operationalSummary.caseId,
          )}
        </span>

        <span>
          Participant:{" "}
          {displayValue(
            scope?.participant,
          )}
        </span>

        <span>
          Last refreshed:{" "}
          {formatUpdatedAt(
            lastUpdatedAt,
          )}
        </span>
      </div>
    </section>
  );
}