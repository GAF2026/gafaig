"use client";

import {
  useId,
  useState,
} from "react";

import type {
  ApplicantGuidanceComponents,
  ApplicantGuidanceResult,
} from "@/lib/guidance/useApplicantGuidance";

import ApplicantGuidanceStatusBadge from "./ApplicantGuidanceStatusBadge";
import ApplicantGuidanceLiveRegion from "./ApplicantGuidanceLiveRegion";

type GuidanceDetailEntry = {
  readonly key:
    string;

  readonly label:
    string;

  readonly result:
    ApplicantGuidanceResult | undefined;
};

function DetailList({
  title,
  values,
}: {
  title:
    string;

  values:
    readonly string[];
}) {
  if (
    values.length === 0
  ) {
    return null;
  }

  return (
    <div>
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.13em] text-black/50">
        {title}
      </h4>

      <ul className="mt-3 list-disc space-y-2 pl-5">
        {values.map(
          (
            value,
            index,
          ) => (
            <li
              key={`${title}-${index}-${value}`}
              className="text-[13px] leading-6 text-black/70"
            >
              {value}
            </li>
          ),
        )}
      </ul>
    </div>
  );
}

function ComponentDetail({
  label,
  result,
}: {
  label:
    string;

  result:
    ApplicantGuidanceResult | undefined;
}) {
  if (!result) {
    return null;
  }

  const summary =
    result.explanation
      ?.summary ??
    "No participant-visible explanation was returned.";

  const facts =
    result.explanation
      ?.facts ??
    [];

  const unresolvedConditions =
    result.explanation
      ?.unresolvedConditions ??
    [];

  const ruleIds =
    result.explanation
      ?.ruleIds ??
    [];

  const sourceCount =
    result.sourceReferences
      ?.length ??
    0;

  return (
    <article className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-[14px] font-semibold tracking-tight text-black">
          {label}
        </h3>

        <ApplicantGuidanceStatusBadge
          status={
            result.status ??
            "UNRESOLVED"
          }
          label={`${label} status`}
        />
      </div>

      <p className="mt-4 text-[14px] leading-7 text-black/70">
        {summary}
      </p>

      <div className="mt-5 space-y-5">
        <DetailList
          title="Authoritative facts"
          values={facts}
        />

        <DetailList
          title="Unresolved conditions"
          values={
            unresolvedConditions
          }
        />

        <DetailList
          title="Applied rules"
          values={ruleIds}
        />

        <div>
          <h4 className="text-[11px] font-semibold uppercase tracking-[0.13em] text-black/50">
            Source references
          </h4>

          <p className="mt-2 text-[14px] font-semibold text-black">
            {sourceCount}
          </p>
        </div>
      </div>
    </article>
  );
}

export default function ApplicantGuidanceDetails({
  operationalSummary,
  components,
}: {
  operationalSummary:
    ApplicantGuidanceResult | null;

  components:
    ApplicantGuidanceComponents | null;
}) {
  const [
    expanded,
    setExpanded,
  ] =
    useState(false);

  const detailsId =
    useId();

  const entries:
    readonly GuidanceDetailEntry[] = [
      {
        key:
          "operational-summary",

        label:
          "Operational Summary",

        result:
          operationalSummary ??
          undefined,
      },

      {
        key:
          "repository-context",

        label:
          "Repository Context",

        result:
          components
            ?.repositoryContext,
      },

      {
        key:
          "next-action",

        label:
          "Next Required Action",

        result:
          components
            ?.nextAction,
      },

      {
        key:
          "blocking",

        label:
          "Blocking",

        result:
          components
            ?.blocking,
      },

      {
        key:
          "waiting-on",

        label:
          "Waiting On",

        result:
          components
            ?.waitingOn,
      },
    ];

  const visibleEntries =
    entries.filter(
      (
        entry,
      ) =>
        Boolean(
          entry.result,
        ),
    );

  if (
    visibleEntries.length ===
    0
  ) {
    return null;
  }

  const liveMessage =
    expanded
      ? "Guidance explainability details expanded."
      : "Guidance explainability details collapsed.";

  return (
    <section
      className="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"
      aria-labelledby={`${detailsId}-heading`}
    >
      <ApplicantGuidanceLiveRegion
        message={
          liveMessage
        }
      />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
            Guidance Explainability
          </div>

          <h3
            id={`${detailsId}-heading`}
            className="mt-3 text-[18px] font-semibold tracking-tight text-black"
          >
            How this guidance was resolved
          </h3>

          <p className="mt-3 max-w-[760px] text-[13px] leading-6 text-black/65">
            Review participant-visible facts, unresolved conditions, applied
            deterministic rules, and authoritative source-reference counts.
          </p>
        </div>

        <button
          type="button"
          aria-expanded={
            expanded
          }
          aria-controls={
            detailsId
          }
          onClick={() => {
            setExpanded(
              (
                current,
              ) =>
                !current,
            );
          }}
          className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-full border border-black/20 bg-white px-4 py-2 text-[13px] font-semibold text-black transition hover:bg-black/[0.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
        >
          {expanded
            ? "Hide details"
            : "Show details"}
        </button>
      </div>

      <div
        id={detailsId}
        hidden={
          !expanded
        }
        className="mt-6"
      >
        <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
          {visibleEntries.map(
            (
              entry,
            ) => (
              <ComponentDetail
                key={
                  entry.key
                }
                label={
                  entry.label
                }
                result={
                  entry.result
                }
              />
            ),
          )}
        </div>
      </div>
    </section>
  );
}