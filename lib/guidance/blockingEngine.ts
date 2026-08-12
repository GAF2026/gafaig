import {
  buildGuidanceResult,
  createGuidanceMetadata,
} from "./resultBuilders";

import type {
  GuidanceEngine,
} from "./engine";

import {
  BLOCKING_RULES,
} from "./blockingRules";

import {
  resolveDeterministicBlocking,
} from "./blockingResolver";

import type {
  BlockingEngineInput,
  BlockingPayload,
} from "./blockingTypes";

import type {
  GuidanceContext,
  GuidanceResult,
} from "./types";

const ENGINE_NAME =
  "blocking";

const ENGINE_VERSION =
  "1.1.0";

function invalidContextResult(
  context: GuidanceContext,
  message: string,
): GuidanceResult<BlockingPayload> {
  return buildGuidanceResult({
    status:
      "UNRESOLVED",

    summary:
      "Blocking conditions could not be resolved.",

    ruleIds: [
      BLOCKING_RULES
        .CASE_SCOPE_REQUIRED,

      BLOCKING_RULES
        .ORGANIZATION_SCOPE_PRESERVED,

      BLOCKING_RULES
        .AUTHORITATIVE_CONTEXT_REQUIRED,

      BLOCKING_RULES
        .DETERMINISTIC_PRIORITY_REQUIRED,
    ],

    facts:
      [],

    unresolvedConditions: [
      message,
    ],

    sourceReferences:
      [],

    failure: {
      code:
        "DEPENDENCY_FAILURE",

      message,

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

export const blockingEngine:
  GuidanceEngine<
    BlockingEngineInput,
    BlockingPayload
  > = {
    name:
      ENGINE_NAME,

    version:
      ENGINE_VERSION,

    async execute({
      context,
      input,
    }): Promise<
      GuidanceResult<BlockingPayload>
    > {
      const repositoryContext =
        input.repositoryContext;

      if (!repositoryContext) {
        return invalidContextResult(
          context,
          "Blocking Guidance requires an authoritative Repository Context result.",
        );
      }

      if (!context.caseId) {
        return invalidContextResult(
          context,
          "Blocking Guidance requires explicit case scope.",
        );
      }

      if (
        repositoryContext.caseId !==
        context.caseId
      ) {
        return buildGuidanceResult({
          status:
            "INCONSISTENT",

          summary:
            "Blocking case context is inconsistent.",

          ruleIds: [
            BLOCKING_RULES
              .CASE_SCOPE_REQUIRED,

            BLOCKING_RULES
              .AUTHORITATIVE_CONTEXT_REQUIRED,

            BLOCKING_RULES
              .DETERMINISTIC_PRIORITY_REQUIRED,
          ],

          facts: [
            `Guidance context case is ${context.caseId}.`,
            `Repository context case is ${repositoryContext.caseId}.`,
          ],

          unresolvedConditions: [
            "The Guidance case scope and Repository Context case scope do not match.",
          ],

          sourceReferences:
            input.sourceReferences ?? [],

          failure: {
            code:
              "SOURCE_INCONSISTENT",

            message:
              "The Guidance case scope and Repository Context case scope do not match.",

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
                repositoryContext.observedAt,
            }),
        });
      }

      if (
        repositoryContext.organizationId !==
        context.organizationId
      ) {
        return buildGuidanceResult({
          status:
            "INCONSISTENT",

          summary:
            "Blocking organization context is inconsistent.",

          ruleIds: [
            BLOCKING_RULES
              .ORGANIZATION_SCOPE_PRESERVED,

            BLOCKING_RULES
              .AUTHORITATIVE_CONTEXT_REQUIRED,

            BLOCKING_RULES
              .DETERMINISTIC_PRIORITY_REQUIRED,
          ],

          facts: [
            `Guidance context organization is ${context.organizationId}.`,
            `Repository context organization is ${repositoryContext.organizationId}.`,
          ],

          unresolvedConditions: [
            "The Guidance organization scope and Repository Context organization scope do not match.",
          ],

          sourceReferences:
            input.sourceReferences ?? [],

          failure: {
            code:
              "SOURCE_INCONSISTENT",

            message:
              "The Guidance organization scope and Repository Context organization scope do not match.",

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
                repositoryContext.observedAt,
            }),
        });
      }

      const resolution =
        resolveDeterministicBlocking(
          repositoryContext,
          input,
        );

      const payload: BlockingPayload = {
        organizationId:
          repositoryContext.organizationId,

        caseId:
          repositoryContext.caseId,

        workflowStatus:
          repositoryContext.workflowStatus,

        workflowStage:
          repositoryContext.workflowStage,

        availability:
          resolution.availability,

        blocked:
          resolution.blocked,

        blockingConditions:
          resolution.blockingConditions,

        highestSeverity:
          resolution.highestSeverity,

        relationshipAvailability:
          repositoryContext
            .relationshipAvailability,

        observedAt:
          repositoryContext.observedAt,
      };

      if (
        resolution.availability ===
        "UNRESOLVED"
      ) {
        return buildGuidanceResult({
          status:
            "UNRESOLVED",

          summary:
            "Blocking status could not be fully resolved from the available authoritative context.",

          ruleIds: [
            BLOCKING_RULES
              .ORGANIZATION_SCOPE_PRESERVED,

            BLOCKING_RULES
              .PARTICIPANT_VISIBILITY_PRESERVED,

            BLOCKING_RULES
              .AUTHORITATIVE_CONTEXT_REQUIRED,

            BLOCKING_RULES
              .SOURCE_REFERENCES_PRESERVED,

            BLOCKING_RULES
              .NO_INDEPENDENT_SOURCE_QUERY,

            BLOCKING_RULES
              .NO_BLOCKER_INFERENCE,

            BLOCKING_RULES
              .NO_RELATIONSHIP_INFERENCE,

            BLOCKING_RULES
              .NO_PROTECTED_DETAIL_DISCLOSURE,

            BLOCKING_RULES
              .NO_AUTOMATIC_RESOLUTION,

            BLOCKING_RULES
              .NO_WORKFLOW_MUTATION,

            BLOCKING_RULES
              .NO_GOVERNANCE_RECOMPUTATION,

            BLOCKING_RULES
              .NO_AUTHORITY_CREATION,

            ...resolution.ruleIds,
          ],

          facts:
            resolution.facts,

          unresolvedConditions:
            resolution.unresolvedConditions,

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
                repositoryContext.observedAt,
            }),
        });
      }

      if (resolution.blocked) {
        return buildGuidanceResult({
          status:
            "BLOCKED",

          summary:
            `${resolution.blockingConditions.length} deterministic blocking condition${resolution.blockingConditions.length === 1 ? "" : "s"} prevent progression.`,

          ruleIds: [
            BLOCKING_RULES
              .ORGANIZATION_SCOPE_PRESERVED,

            BLOCKING_RULES
              .PARTICIPANT_VISIBILITY_PRESERVED,

            BLOCKING_RULES
              .AUTHORITATIVE_CONTEXT_REQUIRED,

            BLOCKING_RULES
              .SOURCE_REFERENCES_PRESERVED,

            BLOCKING_RULES
              .NO_INDEPENDENT_SOURCE_QUERY,

            BLOCKING_RULES
              .NO_PROTECTED_DETAIL_DISCLOSURE,

            BLOCKING_RULES
              .PARTICIPANT_VISIBLE_EXPLANATION_REQUIRED,

            BLOCKING_RULES
              .NO_AUTOMATIC_RESOLUTION,

            BLOCKING_RULES
              .NO_WORKFLOW_MUTATION,

            BLOCKING_RULES
              .NO_GOVERNANCE_RECOMPUTATION,

            BLOCKING_RULES
              .NO_AUTHORITY_CREATION,

            ...resolution.ruleIds,
          ],

          facts: [
            ...resolution.facts,
            `Highest blocking severity is ${resolution.highestSeverity ?? "unresolved"}.`,
          ],

          unresolvedConditions:
            resolution.unresolvedConditions,

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
                repositoryContext.observedAt,
            }),
        });
      }

      return buildGuidanceResult({
        status:
          "AVAILABLE",

        summary:
          "No authorized deterministic blocking condition is present in the available authoritative context.",

        ruleIds: [
          BLOCKING_RULES
            .ORGANIZATION_SCOPE_PRESERVED,

          BLOCKING_RULES
            .PARTICIPANT_VISIBILITY_PRESERVED,

          BLOCKING_RULES
            .AUTHORITATIVE_CONTEXT_REQUIRED,

          BLOCKING_RULES
            .SOURCE_REFERENCES_PRESERVED,

          BLOCKING_RULES
            .NO_INDEPENDENT_SOURCE_QUERY,

          BLOCKING_RULES
            .NO_BLOCKER_INFERENCE,

          BLOCKING_RULES
            .NO_PROTECTED_DETAIL_DISCLOSURE,

          BLOCKING_RULES
            .NO_AUTOMATIC_RESOLUTION,

          BLOCKING_RULES
            .NO_WORKFLOW_MUTATION,

          BLOCKING_RULES
            .NO_GOVERNANCE_RECOMPUTATION,

          BLOCKING_RULES
            .NO_AUTHORITY_CREATION,

          ...resolution.ruleIds,
        ],

        facts:
          resolution.facts,

        unresolvedConditions:
          resolution.unresolvedConditions,

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
              repositoryContext.observedAt,
          }),
      });
    },
  };