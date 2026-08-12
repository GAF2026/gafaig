import {
  buildGuidanceResult,
  createGuidanceMetadata,
} from "./resultBuilders";

import type {
  GuidanceEngine,
} from "./engine";

import {
  NEXT_ACTION_RULES,
} from "./nextActionRules";

import {
  resolveDeterministicNextAction,
} from "./nextActionResolver";

import type {
  NextActionEngineInput,
  NextActionPayload,
} from "./nextActionTypes";

import type {
  GuidanceContext,
  GuidanceResult,
} from "./types";

const ENGINE_NAME =
  "next-action";

const ENGINE_VERSION =
  "1.1.0";

function invalidContextResult(
  context: GuidanceContext,
  message: string,
): GuidanceResult<NextActionPayload> {
  return buildGuidanceResult({
    status:
      "UNRESOLVED",

    summary:
      "Next action could not be resolved.",

    ruleIds: [
      NEXT_ACTION_RULES
        .CASE_SCOPE_REQUIRED,

      NEXT_ACTION_RULES
        .ORGANIZATION_SCOPE_PRESERVED,

      NEXT_ACTION_RULES
        .AUTHORITATIVE_CONTEXT_REQUIRED,

      NEXT_ACTION_RULES
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

export const nextActionEngine:
  GuidanceEngine<
    NextActionEngineInput,
    NextActionPayload
  > = {
    name:
      ENGINE_NAME,

    version:
      ENGINE_VERSION,

    async execute({
      context,
      input,
    }): Promise<
      GuidanceResult<NextActionPayload>
    > {
      const repositoryContext =
        input.repositoryContext;

      if (!repositoryContext) {
        return invalidContextResult(
          context,
          "Next Action Guidance requires an authoritative Repository Context result.",
        );
      }

      if (!context.caseId) {
        return invalidContextResult(
          context,
          "Next Action Guidance requires explicit case scope.",
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
            "Next action case context is inconsistent.",

          ruleIds: [
            NEXT_ACTION_RULES
              .CASE_SCOPE_REQUIRED,

            NEXT_ACTION_RULES
              .AUTHORITATIVE_CONTEXT_REQUIRED,

            NEXT_ACTION_RULES
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
            "Next action organization context is inconsistent.",

          ruleIds: [
            NEXT_ACTION_RULES
              .ORGANIZATION_SCOPE_PRESERVED,

            NEXT_ACTION_RULES
              .AUTHORITATIVE_CONTEXT_REQUIRED,

            NEXT_ACTION_RULES
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
        resolveDeterministicNextAction(
          repositoryContext,
        );

      const payload: NextActionPayload = {
        organizationId:
          repositoryContext.organizationId,

        caseId:
          repositoryContext.caseId,

        workflowStatus:
          repositoryContext.workflowStatus,

        workflowStage:
          repositoryContext.workflowStage,

        availability:
          resolution.action
            ? "AVAILABLE"
            : "UNRESOLVED",

        action:
          resolution.action,

        blockingItems:
          resolution.blockingItems,

        waitingOn:
          resolution.waitingOn,

        repositoryCount:
          repositoryContext.repositoryCount,

        repositoriesWithRecords:
          repositoryContext
            .repositoriesWithRecords,

        emptyRepositories:
          repositoryContext
            .emptyRepositories,

        relationshipAvailability:
          repositoryContext
            .relationshipAvailability,

        observedAt:
          repositoryContext.observedAt,
      };

      if (!resolution.action) {
        return buildGuidanceResult({
          status:
            "UNRESOLVED",

          summary:
            "No deterministic next action could be resolved from the current authoritative context.",

          ruleIds: [
            NEXT_ACTION_RULES
              .ORGANIZATION_SCOPE_PRESERVED,

            NEXT_ACTION_RULES
              .PARTICIPANT_VISIBILITY_PRESERVED,

            NEXT_ACTION_RULES
              .AUTHORITATIVE_CONTEXT_REQUIRED,

            NEXT_ACTION_RULES
              .SOURCE_REFERENCES_PRESERVED,

            NEXT_ACTION_RULES
              .NO_INDEPENDENT_SOURCE_QUERY,

            NEXT_ACTION_RULES
              .NO_WORKFLOW_MUTATION,

            NEXT_ACTION_RULES
              .NO_GOVERNANCE_RECOMPUTATION,

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

      return buildGuidanceResult({
        status:
          "AVAILABLE",

        summary:
          `The deterministic next action is: ${resolution.action.title}.`,

        ruleIds: [
          NEXT_ACTION_RULES
            .ORGANIZATION_SCOPE_PRESERVED,

          NEXT_ACTION_RULES
            .PARTICIPANT_VISIBILITY_PRESERVED,

          NEXT_ACTION_RULES
            .AUTHORITATIVE_CONTEXT_REQUIRED,

          NEXT_ACTION_RULES
            .SOURCE_REFERENCES_PRESERVED,

          NEXT_ACTION_RULES
            .NO_INDEPENDENT_SOURCE_QUERY,

          NEXT_ACTION_RULES
            .NO_RELATIONSHIP_INFERENCE,

          NEXT_ACTION_RULES
            .NO_BLOCKER_INFERENCE,

          NEXT_ACTION_RULES
            .NO_WORKFLOW_MUTATION,

          NEXT_ACTION_RULES
            .NO_GOVERNANCE_RECOMPUTATION,

          ...resolution.ruleIds,
        ],

        facts: [
          ...resolution.facts,
          `Resolved action identifier is ${resolution.action.actionId}.`,
          `Resolved action owner is ${resolution.action.owner}.`,
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
    },
  };