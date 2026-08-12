import type {
  GuidanceEngine,
} from "./engine";

import {
  buildGuidanceResult,
  createGuidanceMetadata,
} from "./resultBuilders";

import type {
  CompositeGuidanceEngineInput,
  CompositeGuidancePayload,
} from "./compositeGuidanceTypes";

import type {
  GuidanceContext,
  GuidanceResult,
} from "./types";

const ENGINE_NAME =
  "composite-guidance";

const ENGINE_VERSION =
  "1.0.0";

function aggregateStatus(
  input: CompositeGuidanceEngineInput,
): GuidanceResult<CompositeGuidancePayload>["status"] {
  const statuses = [
    input.repositoryContext.status,
    input.nextAction.status,
    input.blocking.status,
    input.waitingOn.status,
  ];

  if (
    statuses.includes("ERROR")
  ) {
    return "ERROR";
  }

  if (
    statuses.includes("UNAUTHORIZED")
  ) {
    return "UNAUTHORIZED";
  }

  if (
    statuses.includes("NOT_VISIBLE")
  ) {
    return "NOT_VISIBLE";
  }

  if (
    statuses.includes("INCONSISTENT")
  ) {
    return "INCONSISTENT";
  }

  if (
    statuses.includes("STALE")
  ) {
    return "STALE";
  }

  if (
    statuses.includes("UNAVAILABLE")
  ) {
    return "UNAVAILABLE";
  }

  if (
    statuses.includes("UNRESOLVED")
  ) {
    return "INCOMPLETE";
  }

  if (
    statuses.includes("BLOCKED")
  ) {
    return "BLOCKED";
  }

  if (
    statuses.includes("WAITING")
  ) {
    return "WAITING";
  }

  if (
    statuses.includes("INCOMPLETE")
  ) {
    return "INCOMPLETE";
  }

  return "AVAILABLE";
}

/**
 * Aggregates already-executed Guidance results.
 *
 * This engine does not execute dependency engines, query Snowflake,
 * reinterpret results, infer relationships, or mutate operational state.
 */
export const compositeGuidanceEngine:
  GuidanceEngine<
    CompositeGuidanceEngineInput,
    CompositeGuidancePayload
  > = {
    name:
      ENGINE_NAME,

    version:
      ENGINE_VERSION,

    async execute({
      context,
      input,
    }): Promise<
      GuidanceResult<CompositeGuidancePayload>
    > {
      const repositoryPayload =
        input.repositoryContext.payload;

      if (!context.caseId) {
        return buildGuidanceResult({
          status:
            "UNRESOLVED",

          summary:
            "Composite Guidance requires explicit case scope.",

          ruleIds: [
            "OG-COMPOSITE-CASE-SCOPE-REQUIRED",
            "OG-COMPOSITE-FAIL-CLOSED",
          ],

          facts:
            [],

          unresolvedConditions: [
            "A case identifier is required.",
          ],

          sourceReferences:
            input.sourceReferences ?? [],

          failure: {
            code:
              "VALIDATION_FAILURE",

            message:
              "Composite Guidance requires explicit case scope.",

            retryable:
              false,
          },

          metadata:
            createGuidanceMetadata({
              correlationId:
                context.correlationId,

              engineName:
                ENGINE_NAME,

              engineVersion:
                ENGINE_VERSION,
            }),
        });
      }

      if (!repositoryPayload) {
        return buildGuidanceResult({
          status:
            "UNRESOLVED",

          summary:
            "Composite Guidance requires an authoritative Repository Context payload.",

          ruleIds: [
            "OG-COMPOSITE-REPOSITORY-CONTEXT-REQUIRED",
            "OG-COMPOSITE-FAIL-CLOSED",
          ],

          facts: [
            `Repository Context status is ${input.repositoryContext.status}.`,
          ],

          unresolvedConditions: [
            "No authoritative Repository Context payload is available.",
          ],

          sourceReferences:
            input.sourceReferences ?? [],

          failure: {
            code:
              "DEPENDENCY_FAILURE",

            message:
              "Composite Guidance requires an authoritative Repository Context payload.",

            retryable:
              false,
          },

          metadata:
            createGuidanceMetadata({
              correlationId:
                context.correlationId,

              engineName:
                ENGINE_NAME,

              engineVersion:
                ENGINE_VERSION,
            }),
        });
      }

      if (
        repositoryPayload.caseId !==
        context.caseId
      ) {
        return buildGuidanceResult({
          status:
            "INCONSISTENT",

          summary:
            "Composite Guidance case scope is inconsistent.",

          ruleIds: [
            "OG-COMPOSITE-CASE-SCOPE-REQUIRED",
            "OG-COMPOSITE-SOURCE-CONSISTENCY-REQUIRED",
          ],

          facts: [
            `Guidance context case is ${context.caseId}.`,
            `Repository Context case is ${repositoryPayload.caseId}.`,
          ],

          unresolvedConditions: [
            "The Guidance case and Repository Context case do not match.",
          ],

          sourceReferences:
            input.sourceReferences ?? [],

          failure: {
            code:
              "SOURCE_INCONSISTENT",

            message:
              "The Guidance case and Repository Context case do not match.",

            retryable:
              false,
          },

          metadata:
            createGuidanceMetadata({
              correlationId:
                context.correlationId,

              engineName:
                ENGINE_NAME,

              engineVersion:
                ENGINE_VERSION,

              generatedAt:
                repositoryPayload.observedAt,
            }),
        });
      }

      if (
        repositoryPayload.organizationId !==
        context.organizationId
      ) {
        return buildGuidanceResult({
          status:
            "INCONSISTENT",

          summary:
            "Composite Guidance organization scope is inconsistent.",

          ruleIds: [
            "OG-COMPOSITE-ORGANIZATION-SCOPE-PRESERVED",
            "OG-COMPOSITE-SOURCE-CONSISTENCY-REQUIRED",
          ],

          facts: [
            `Guidance context organization is ${context.organizationId}.`,
            `Repository Context organization is ${repositoryPayload.organizationId}.`,
          ],

          unresolvedConditions: [
            "The Guidance organization and Repository Context organization do not match.",
          ],

          sourceReferences:
            input.sourceReferences ?? [],

          failure: {
            code:
              "SOURCE_INCONSISTENT",

            message:
              "The Guidance organization and Repository Context organization do not match.",

            retryable:
              false,
          },

          metadata:
            createGuidanceMetadata({
              correlationId:
                context.correlationId,

              engineName:
                ENGINE_NAME,

              engineVersion:
                ENGINE_VERSION,

              generatedAt:
                repositoryPayload.observedAt,
            }),
        });
      }

      const status =
        aggregateStatus(input);

      const payload: CompositeGuidancePayload = {
        organizationId:
          repositoryPayload.organizationId,

        caseId:
          repositoryPayload.caseId,

        repositoryContext:
          input.repositoryContext,

        nextAction:
          input.nextAction,

        blocking:
          input.blocking,

        waitingOn:
          input.waitingOn,

        observedAt:
          repositoryPayload.observedAt,
      };

      return buildGuidanceResult({
        status,

        summary:
          "Composite Operational Guidance assembled the certified Repository Context, Next Action, Blocking, and Waiting-On results.",

        ruleIds: [
          "OG-COMPOSITE-ORGANIZATION-SCOPE-PRESERVED",
          "OG-COMPOSITE-SOURCE-REFERENCES-PRESERVED",
          "OG-COMPOSITE-DEPENDENCY-RESULTS-PRESERVED",
          "OG-COMPOSITE-NO-RESULT-RECOMPUTATION",
          "OG-COMPOSITE-NO-INDEPENDENT-SOURCE-QUERY",
          "OG-COMPOSITE-NO-RELATIONSHIP-INFERENCE",
          "OG-COMPOSITE-NO-WORKFLOW-MUTATION",
          "OG-COMPOSITE-NO-GOVERNANCE-RECOMPUTATION",
          "OG-COMPOSITE-NO-AUTHORITY-CREATION",
        ],

        facts: [
          `Repository Context status is ${input.repositoryContext.status}.`,
          `Next Action status is ${input.nextAction.status}.`,
          `Blocking status is ${input.blocking.status}.`,
          `Waiting-On status is ${input.waitingOn.status}.`,
          `Composite status is ${status}.`,
        ],

        unresolvedConditions:
          status === "INCOMPLETE"
            ? [
                "One or more component Guidance results remain unresolved or incomplete.",
              ]
            : [],

        sourceReferences:
          input.sourceReferences ?? [],

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
              repositoryPayload.observedAt,
          }),
      });
    },
  };