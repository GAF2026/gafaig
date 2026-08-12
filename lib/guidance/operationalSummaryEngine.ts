import type {
  GuidanceEngine,
} from "./engine";

import {
  buildGuidanceResult,
  createGuidanceMetadata,
} from "./resultBuilders";

import type {
  CompositeGuidanceComponents,
} from "./compositeGuidanceTypes";

import type {
  OperationalSummaryEngineInput,
  OperationalSummaryPayload,
} from "./operationalSummaryTypes";

import type {
  GuidanceParticipant,
  GuidanceResult,
  GuidanceRuleId,
  GuidanceSourceReference,
} from "./types";

const ENGINE_NAME =
  "operational-summary";

const ENGINE_VERSION =
  "1.0.0";

const OPERATIONAL_SUMMARY_RULES = {
  CASE_SCOPE_REQUIRED:
    "OG-OPERATIONAL-SUMMARY-CASE-SCOPE-REQUIRED",

  ORGANIZATION_SCOPE_PRESERVED:
    "OG-OPERATIONAL-SUMMARY-ORGANIZATION-SCOPE-PRESERVED",

  COMPOSITE_INPUT_REQUIRED:
    "OG-OPERATIONAL-SUMMARY-COMPOSITE-INPUT-REQUIRED",

  COMPONENT_RESULTS_PRESERVED:
    "OG-OPERATIONAL-SUMMARY-COMPONENT-RESULTS-PRESERVED",

  UNRESOLVED_STATE_PRESERVED:
    "OG-OPERATIONAL-SUMMARY-UNRESOLVED-STATE-PRESERVED",

  PARTICIPANT_VISIBILITY_PRESERVED:
    "OG-OPERATIONAL-SUMMARY-PARTICIPANT-VISIBILITY-PRESERVED",

  PROTECTED_DETAILS_SUPPRESSED:
    "OG-OPERATIONAL-SUMMARY-PROTECTED-DETAILS-SUPPRESSED",

  NO_INDEPENDENT_SOURCE_QUERY:
    "OG-OPERATIONAL-SUMMARY-NO-INDEPENDENT-SOURCE-QUERY",

  NO_RESULT_RECOMPUTATION:
    "OG-OPERATIONAL-SUMMARY-NO-RESULT-RECOMPUTATION",

  NO_NEW_CONCLUSION:
    "OG-OPERATIONAL-SUMMARY-NO-NEW-CONCLUSION",

  NO_WORKFLOW_MUTATION:
    "OG-OPERATIONAL-SUMMARY-NO-WORKFLOW-MUTATION",

  NO_AUTHORITY_CREATION:
    "OG-OPERATIONAL-SUMMARY-NO-AUTHORITY-CREATION",

  FAIL_CLOSED:
    "OG-OPERATIONAL-SUMMARY-FAIL-CLOSED",
} as const;

function uniqueStrings(
  values:
    readonly string[],
): readonly string[] {
  return [
    ...new Set(
      values
        .map(
          (value) =>
            value.trim(),
        )
        .filter(Boolean),
    ),
  ];
}

function uniqueRuleIds(
  components:
    CompositeGuidanceComponents,
  composite:
    OperationalSummaryEngineInput[
      "composite"
    ],
): readonly GuidanceRuleId[] {
  return uniqueStrings([
    ...components.repositoryContext
      .explanation.ruleIds,

    ...components.nextAction
      .explanation.ruleIds,

    ...components.blocking
      .explanation.ruleIds,

    ...components.waitingOn
      .explanation.ruleIds,

    ...composite.explanation.ruleIds,
  ]);
}

function combinedSourceReferences(
  input:
    OperationalSummaryEngineInput,
): readonly GuidanceSourceReference[] {
  return [
    ...(input.sourceReferences ?? []),

    ...input.components
      .repositoryContext
      .sourceReferences,

    ...input.components
      .nextAction
      .sourceReferences,

    ...input.components
      .blocking
      .sourceReferences,

    ...input.components
      .waitingOn
      .sourceReferences,

    ...input.composite
      .sourceReferences,
  ];
}

function unresolvedConditions(
  input:
    OperationalSummaryEngineInput,
): readonly string[] {
  return uniqueStrings([
    ...input.components
      .repositoryContext
      .explanation
      .unresolvedConditions,

    ...input.components
      .nextAction
      .explanation
      .unresolvedConditions,

    ...input.components
      .blocking
      .explanation
      .unresolvedConditions,

    ...input.components
      .waitingOn
      .explanation
      .unresolvedConditions,

    ...input.composite
      .explanation
      .unresolvedConditions,
  ]);
}

function resolvedCurrentOwner(
  input:
    OperationalSummaryEngineInput,
): GuidanceParticipant | null {
  const waitingPayload =
    input.components.waitingOn
      .payload;

  if (
    waitingPayload?.currentOwner
  ) {
    return waitingPayload.currentOwner;
  }

  const nextActionPayload =
    input.components.nextAction
      .payload;

  return (
    nextActionPayload?.action
      ?.owner ??
    null
  );
}

function participantSummary(
  input:
    OperationalSummaryEngineInput,
): string {
  const repositoryPayload =
    input.components
      .repositoryContext
      .payload;

  const nextActionPayload =
    input.components
      .nextAction
      .payload;

  const blockingPayload =
    input.components
      .blocking
      .payload;

  const waitingPayload =
    input.components
      .waitingOn
      .payload;

  const statements:
    string[] = [];

  if (
    repositoryPayload
      ?.workflowStage
  ) {
    statements.push(
      `Current workflow stage: ${repositoryPayload.workflowStage}.`,
    );
  }

  const owner =
    resolvedCurrentOwner(input);

  if (owner) {
    statements.push(
      `Current operational owner: ${owner}.`,
    );
  }

  if (
    nextActionPayload?.action
  ) {
    statements.push(
      `Next required action: ${nextActionPayload.action.title}.`,
    );
  } else {
    statements.push(
      "No deterministic participant-visible next action is currently resolved.",
    );
  }

  if (
    blockingPayload?.blocked ===
    true
  ) {
    statements.push(
      `${blockingPayload.blockingConditions.length} participant-visible blocking condition${
        blockingPayload.blockingConditions.length ===
        1
          ? ""
          : "s"
      } remain active.`,
    );
  } else if (
    blockingPayload?.blocked ===
    false
  ) {
    statements.push(
      "No deterministic participant-visible blocking condition is currently active.",
    );
  } else {
    statements.push(
      "Blocking status remains unresolved.",
    );
  }

  if (
    waitingPayload?.waiting ===
    true &&
    waitingPayload.waitingOn
  ) {
    statements.push(
      `The case is waiting on ${waitingPayload.waitingOn}.`,
    );
  } else if (
    waitingPayload?.waiting ===
    false
  ) {
    statements.push(
      "The case is not currently waiting on a participant-visible dependency.",
    );
  } else {
    statements.push(
      "Waiting status remains unresolved.",
    );
  }

  return statements.join(" ");
}

function failureResult(input: {
  readonly contextCorrelationId:
    string;

  readonly status:
    GuidanceResult["status"];

  readonly summary:
    string;

  readonly unresolvedConditions:
    readonly string[];

  readonly sourceReferences:
    readonly GuidanceSourceReference[];

  readonly failureCode:
    "VALIDATION_FAILURE"
    | "DEPENDENCY_FAILURE"
    | "SOURCE_INCONSISTENT";

  readonly generatedAt?:
    string;
}): GuidanceResult<
  OperationalSummaryPayload
> {
  return buildGuidanceResult({
    status:
      input.status,

    summary:
      input.summary,

    ruleIds: [
      OPERATIONAL_SUMMARY_RULES
        .CASE_SCOPE_REQUIRED,

      OPERATIONAL_SUMMARY_RULES
        .ORGANIZATION_SCOPE_PRESERVED,

      OPERATIONAL_SUMMARY_RULES
        .COMPOSITE_INPUT_REQUIRED,

      OPERATIONAL_SUMMARY_RULES
        .FAIL_CLOSED,
    ],

    facts:
      [],

    unresolvedConditions:
      input.unresolvedConditions,

    sourceReferences:
      input.sourceReferences,

    failure: {
      code:
        input.failureCode,

      message:
        input.summary,

      retryable:
        false,
    },

    metadata:
      createGuidanceMetadata({
        correlationId:
          input.contextCorrelationId,

        engineName:
          ENGINE_NAME,

        engineVersion:
          ENGINE_VERSION,

        generatedAt:
          input.generatedAt,
      }),
  });
}

/**
 * Produces a concise summary from already-resolved Guidance results.
 *
 * This engine does not execute dependency engines, query Snowflake,
 * infer workflow state, create completion or transition conclusions,
 * expose protected details, or mutate operational state.
 */
export const operationalSummaryEngine:
  GuidanceEngine<
    OperationalSummaryEngineInput,
    OperationalSummaryPayload
  > = {
    name:
      ENGINE_NAME,

    version:
      ENGINE_VERSION,

    async execute({
      context,
      input,
    }): Promise<
      GuidanceResult<
        OperationalSummaryPayload
      >
    > {
      const sourceReferences =
        combinedSourceReferences(
          input,
        );

      if (!context.caseId) {
        return failureResult({
          contextCorrelationId:
            context.correlationId,

          status:
            "UNRESOLVED",

          summary:
            "Operational Summary requires explicit case scope.",

          unresolvedConditions: [
            "A case identifier is required.",
          ],

          sourceReferences,

          failureCode:
            "VALIDATION_FAILURE",
        });
      }

      const compositePayload =
        input.composite.payload;

      if (!compositePayload) {
        return failureResult({
          contextCorrelationId:
            context.correlationId,

          status:
            "UNRESOLVED",

          summary:
            "Operational Summary requires an authoritative Composite Guidance payload.",

          unresolvedConditions:
            uniqueStrings([
              "No authoritative Composite Guidance payload is available.",

              ...unresolvedConditions(
                input,
              ),
            ]),

          sourceReferences,

          failureCode:
            "DEPENDENCY_FAILURE",
        });
      }

      if (
        compositePayload.caseId !==
        context.caseId
      ) {
        return failureResult({
          contextCorrelationId:
            context.correlationId,

          status:
            "INCONSISTENT",

          summary:
            "Operational Summary case scope is inconsistent.",

          unresolvedConditions: [
            "The Guidance context case and Composite Guidance case do not match.",
          ],

          sourceReferences,

          failureCode:
            "SOURCE_INCONSISTENT",

          generatedAt:
            compositePayload
              .observedAt,
        });
      }

      if (
        compositePayload
          .organizationId !==
        context.organizationId
      ) {
        return failureResult({
          contextCorrelationId:
            context.correlationId,

          status:
            "INCONSISTENT",

          summary:
            "Operational Summary organization scope is inconsistent.",

          unresolvedConditions: [
            "The Guidance context organization and Composite Guidance organization do not match.",
          ],

          sourceReferences,

          failureCode:
            "SOURCE_INCONSISTENT",

          generatedAt:
            compositePayload
              .observedAt,
        });
      }

      const repositoryPayload =
        input.components
          .repositoryContext
          .payload;

      if (!repositoryPayload) {
        return failureResult({
          contextCorrelationId:
            context.correlationId,

          status:
            "UNRESOLVED",

          summary:
            "Operational Summary requires an authoritative Repository Context payload.",

          unresolvedConditions:
            uniqueStrings([
              "No authoritative Repository Context payload is available.",

              ...unresolvedConditions(
                input,
              ),
            ]),

          sourceReferences,

          failureCode:
            "DEPENDENCY_FAILURE",

          generatedAt:
            compositePayload
              .observedAt,
        });
      }

      const nextActionPayload =
        input.components
          .nextAction
          .payload;

      const blockingPayload =
        input.components
          .blocking
          .payload;

      const waitingPayload =
        input.components
          .waitingOn
          .payload;

      const preservedUnresolved =
        unresolvedConditions(input);

      const appliedRuleIds =
        uniqueRuleIds(
          input.components,
          input.composite,
        );

      const payload:
        OperationalSummaryPayload = {
        organizationId:
          compositePayload
            .organizationId,

        caseId:
          compositePayload.caseId,

        aggregatedStatus:
          input.composite.status,

        currentStage:
          repositoryPayload
            .workflowStage,

        currentOwner:
          resolvedCurrentOwner(
            input,
          ),

        nextRequiredAction:
          nextActionPayload
            ?.action ??
          null,

        repositorySummary: {
          repositoryCount:
            repositoryPayload
              .repositoryCount,

          repositoriesWithRecords:
            repositoryPayload
              .repositoriesWithRecords,

          emptyRepositories:
            repositoryPayload
              .emptyRepositories,

          relationshipAvailability:
            repositoryPayload
              .relationshipAvailability,
        },

        blockingSummary: {
          status:
            input.components
              .blocking.status,

          blocked:
            blockingPayload
              ?.blocked ??
            null,

          conditionCount:
            blockingPayload
              ?.blockingConditions
              .length ??
            0,

          participantVisibleConditions:
            blockingPayload
              ?.blockingConditions
              .map(
                (condition) =>
                  condition
                    .participantExplanation,
              ) ??
            [],
        },

        waitingSummary: {
          status:
            input.components
              .waitingOn.status,

          waiting:
            waitingPayload
              ?.waiting ??
            null,

          waitingOn:
            waitingPayload
              ?.waitingOn ??
            null,

          currentOwner:
            waitingPayload
              ?.currentOwner ??
            null,

          conditionCount:
            waitingPayload
              ?.conditions.length ??
            0,

          participantVisibleConditions:
            waitingPayload
              ?.conditions.map(
                (condition) =>
                  condition
                    .participantExplanation,
              ) ??
            [],
        },

        completionSummary:
          null,

        transitionSummary:
          null,

        unresolvedConditions:
          preservedUnresolved,

        participantSummary:
          participantSummary(input),

        explainabilityBasis: {
          componentStatuses: {
            repositoryContext:
              input.components
                .repositoryContext
                .status,

            nextAction:
              input.components
                .nextAction.status,

            blocking:
              input.components
                .blocking.status,

            waitingOn:
              input.components
                .waitingOn.status,

            composite:
              input.composite.status,
          },

          appliedRuleIds,

          sourceReferenceCount:
            sourceReferences.length,
        },

        observedAt:
          compositePayload
            .observedAt,
      };

      return buildGuidanceResult({
        status:
          input.composite.status,

        summary:
          payload.participantSummary,

        ruleIds: [
          OPERATIONAL_SUMMARY_RULES
            .ORGANIZATION_SCOPE_PRESERVED,

          OPERATIONAL_SUMMARY_RULES
            .COMPONENT_RESULTS_PRESERVED,

          OPERATIONAL_SUMMARY_RULES
            .UNRESOLVED_STATE_PRESERVED,

          OPERATIONAL_SUMMARY_RULES
            .PARTICIPANT_VISIBILITY_PRESERVED,

          OPERATIONAL_SUMMARY_RULES
            .PROTECTED_DETAILS_SUPPRESSED,

          OPERATIONAL_SUMMARY_RULES
            .NO_INDEPENDENT_SOURCE_QUERY,

          OPERATIONAL_SUMMARY_RULES
            .NO_RESULT_RECOMPUTATION,

          OPERATIONAL_SUMMARY_RULES
            .NO_NEW_CONCLUSION,

          OPERATIONAL_SUMMARY_RULES
            .NO_WORKFLOW_MUTATION,

          OPERATIONAL_SUMMARY_RULES
            .NO_AUTHORITY_CREATION,
        ],

        facts: [
          `Composite Guidance status is ${input.composite.status}.`,

          `Repository Context status is ${input.components.repositoryContext.status}.`,

          `Next Action status is ${input.components.nextAction.status}.`,

          `Blocking status is ${input.components.blocking.status}.`,

          `Waiting-On status is ${input.components.waitingOn.status}.`,

          `${repositoryPayload.repositoryCount} repository categories contain participant-visible records.`,
        ],

        unresolvedConditions:
          preservedUnresolved,

        sourceReferences,

        payload,

        metadata:
          createGuidanceMetadata({
            correlationId:
              context.correlationId,

            engineName:
              ENGINE_NAME,

            engineVersion:
              ENGINE_VERSION,

            generatedAt:
              compositePayload
                .observedAt,
          }),
      });
    },
  };