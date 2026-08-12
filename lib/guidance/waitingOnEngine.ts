import {
  buildGuidanceResult,
  createGuidanceMetadata,
} from "./resultBuilders";

import type {
  GuidanceEngine,
} from "./engine";

import {
  WAITING_ON_RULES,
} from "./waitingOnRules";

import {
  resolveDeterministicWaitingOn,
} from "./waitingOnResolver";

import type {
  WaitingOnEngineInput,
  WaitingOnPayload,
} from "./waitingOnTypes";

import type {
  GuidanceContext,
  GuidanceResult,
} from "./types";

const ENGINE_NAME =
  "waiting-on";

const ENGINE_VERSION =
  "1.1.0";

function invalidContextResult(
  context: GuidanceContext,
  message: string,
): GuidanceResult<WaitingOnPayload> {
  return buildGuidanceResult({
    status:
      "UNRESOLVED",

    summary:
      "Waiting-On status could not be resolved.",

    ruleIds: [
      WAITING_ON_RULES
        .CASE_SCOPE_REQUIRED,

      WAITING_ON_RULES
        .ORGANIZATION_SCOPE_PRESERVED,

      WAITING_ON_RULES
        .AUTHORITATIVE_CONTEXT_REQUIRED,

      WAITING_ON_RULES
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

export const waitingOnEngine:
  GuidanceEngine<
    WaitingOnEngineInput,
    WaitingOnPayload
  > = {
    name:
      ENGINE_NAME,

    version:
      ENGINE_VERSION,

    async execute({
      context,
      input,
    }): Promise<
      GuidanceResult<WaitingOnPayload>
    > {
      const repositoryContext =
        input.repositoryContext;

      if (!repositoryContext) {
        return invalidContextResult(
          context,
          "Waiting-On Guidance requires an authoritative Repository Context result.",
        );
      }

      if (!context.caseId) {
        return invalidContextResult(
          context,
          "Waiting-On Guidance requires explicit case scope.",
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
            "Waiting-On case context is inconsistent.",

          ruleIds: [
            WAITING_ON_RULES
              .CASE_SCOPE_REQUIRED,

            WAITING_ON_RULES
              .AUTHORITATIVE_CONTEXT_REQUIRED,

            WAITING_ON_RULES
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
            "Waiting-On organization context is inconsistent.",

          ruleIds: [
            WAITING_ON_RULES
              .ORGANIZATION_SCOPE_PRESERVED,

            WAITING_ON_RULES
              .AUTHORITATIVE_CONTEXT_REQUIRED,

            WAITING_ON_RULES
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
        resolveDeterministicWaitingOn(
          repositoryContext,
          input,
        );

      const payload: WaitingOnPayload = {
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

        waiting:
          resolution.waiting,

        waitingOn:
          resolution.waitingOn,

        currentOwner:
          resolution.currentOwner,

        conditions:
          resolution.conditions,

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
            "Waiting-On status could not be fully resolved from the available authoritative context.",

          ruleIds: [
            WAITING_ON_RULES
              .ORGANIZATION_SCOPE_PRESERVED,

            WAITING_ON_RULES
              .PARTICIPANT_VISIBILITY_PRESERVED,

            WAITING_ON_RULES
              .AUTHORITATIVE_CONTEXT_REQUIRED,

            WAITING_ON_RULES
              .SOURCE_REFERENCES_PRESERVED,

            WAITING_ON_RULES
              .NO_INDEPENDENT_SOURCE_QUERY,

            WAITING_ON_RULES
              .NO_WAITING_INFERENCE,

            WAITING_ON_RULES
              .NO_OWNER_INFERENCE,

            WAITING_ON_RULES
              .NO_RELATIONSHIP_INFERENCE,

            WAITING_ON_RULES
              .NO_PROTECTED_DETAIL_DISCLOSURE,

            WAITING_ON_RULES
              .NO_AUTOMATIC_REASSIGNMENT,

            WAITING_ON_RULES
              .NO_WORKFLOW_MUTATION,

            WAITING_ON_RULES
              .NO_GOVERNANCE_RECOMPUTATION,

            WAITING_ON_RULES
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

      if (resolution.waiting) {
        return buildGuidanceResult({
          status:
            "WAITING",

          summary:
            `The case is deterministically waiting on ${resolution.waitingOn ?? "an unresolved participant"}.`,

          ruleIds: [
            WAITING_ON_RULES
              .ORGANIZATION_SCOPE_PRESERVED,

            WAITING_ON_RULES
              .PARTICIPANT_VISIBILITY_PRESERVED,

            WAITING_ON_RULES
              .AUTHORITATIVE_CONTEXT_REQUIRED,

            WAITING_ON_RULES
              .SOURCE_REFERENCES_PRESERVED,

            WAITING_ON_RULES
              .NO_INDEPENDENT_SOURCE_QUERY,

            WAITING_ON_RULES
              .NO_PROTECTED_DETAIL_DISCLOSURE,

            WAITING_ON_RULES
              .PARTICIPANT_VISIBLE_EXPLANATION_REQUIRED,

            WAITING_ON_RULES
              .SINGLE_WAITING_PARTY_REQUIRED,

            WAITING_ON_RULES
              .NO_AUTOMATIC_REASSIGNMENT,

            WAITING_ON_RULES
              .NO_WORKFLOW_MUTATION,

            WAITING_ON_RULES
              .NO_GOVERNANCE_RECOMPUTATION,

            WAITING_ON_RULES
              .NO_AUTHORITY_CREATION,

            ...resolution.ruleIds,
          ],

          facts: [
            ...resolution.facts,
            `Resolved waiting party is ${resolution.waitingOn ?? "unresolved"}.`,
            `Resolved current owner is ${resolution.currentOwner ?? "unresolved"}.`,
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
          "No authorized deterministic waiting condition is present in the available authoritative context.",

        ruleIds: [
          WAITING_ON_RULES
            .ORGANIZATION_SCOPE_PRESERVED,

          WAITING_ON_RULES
            .PARTICIPANT_VISIBILITY_PRESERVED,

          WAITING_ON_RULES
            .AUTHORITATIVE_CONTEXT_REQUIRED,

          WAITING_ON_RULES
            .SOURCE_REFERENCES_PRESERVED,

          WAITING_ON_RULES
            .NO_INDEPENDENT_SOURCE_QUERY,

          WAITING_ON_RULES
            .NO_WAITING_INFERENCE,

          WAITING_ON_RULES
            .NO_OWNER_INFERENCE,

          WAITING_ON_RULES
            .NO_PROTECTED_DETAIL_DISCLOSURE,

          WAITING_ON_RULES
            .NO_AUTOMATIC_REASSIGNMENT,

          WAITING_ON_RULES
            .NO_WORKFLOW_MUTATION,

          WAITING_ON_RULES
            .NO_GOVERNANCE_RECOMPUTATION,

          WAITING_ON_RULES
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