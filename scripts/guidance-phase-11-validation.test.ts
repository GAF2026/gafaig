import assert from "node:assert/strict";
import test from "node:test";

import {
  buildWorkspaceGuidanceSnapshot,
} from "../lib/guidance/workspaceGuidance";

import {
  operationalSummaryEngine,
} from "../lib/guidance/operationalSummaryEngine";

import {
  errorGuidance,
  inconsistentGuidance,
  notVisibleGuidance,
  staleGuidance,
  unauthorizedGuidance,
  unavailableGuidance,
  unresolvedGuidance,
} from "../lib/guidance/failClosed";

import {
  mapAdminRoleToGuidanceParticipant,
  mapApplicantSessionToGuidanceParticipant,
  mapRuntimeSessionToGuidanceParticipant,
} from "../lib/guidance/participant";

import type {
  GuidanceResultMetadata,
  GuidanceRuntimeSession,
} from "../lib/guidance/types";

import {
  applicantRepositoryRowBelongsToScope,
  repositoryScopeFromSession,
} from "../lib/applicant/scope";

const FIXED_GENERATED_AT =
  "2026-08-23T16:00:00.000Z";

const CORRELATION_ID =
  "GUIDANCE-PHASE-11-VALIDATION";

const metadata:
  GuidanceResultMetadata = {
    generatedAt:
      FIXED_GENERATED_AT,

    correlationId:
      CORRELATION_ID,

    engineName:
      "phase-11-validation",

    engineVersion:
      "1.0.0",
  };

const applicantSession =
  {
    userId:
      "phase-11-applicant",

    email:
      "phase-11-applicant@gafaig.test",

    role:
      "ORG_USER",

    organizationId:
      "ORG-PHASE-11",

    organizationName:
      "GAFAIG Phase 11",
  } as GuidanceRuntimeSession;

test(
  "applicant organization roles map only to APPLICANT guidance participation",
  () => {
    assert.equal(
      mapApplicantSessionToGuidanceParticipant(
        {
          ...applicantSession,
          role:
            "ORG_USER",
        } as any,
      ),
      "APPLICANT",
    );

    assert.equal(
      mapApplicantSessionToGuidanceParticipant(
        {
          ...applicantSession,
          role:
            "ORG_ADMIN",
        } as any,
      ),
      "APPLICANT",
    );

    assert.equal(
      mapApplicantSessionToGuidanceParticipant(
        {
          ...applicantSession,
          role:
            "PUBLIC",
        } as any,
      ),
      null,
    );
  },
);

test(
  "administrative roles preserve least-privilege participant classification",
  () => {
    assert.equal(
      mapAdminRoleToGuidanceParticipant(
        "SUPER_ADMIN",
      ),
      "PLATFORM_ADMINISTRATOR",
    );

    assert.equal(
      mapAdminRoleToGuidanceParticipant(
        "REVIEWER",
      ),
      "GAFAIG_OPERATIONS_REVIEWER",
    );

    assert.equal(
      mapAdminRoleToGuidanceParticipant(
        "DEMO",
      ),
      "GAFAIG_OPERATIONS_REVIEWER",
    );

    assert.equal(
      mapAdminRoleToGuidanceParticipant(
        "ORG_USER",
      ),
      "APPLICANT",
    );

    assert.equal(
      mapAdminRoleToGuidanceParticipant(
        "PUBLIC",
      ),
      null,
    );
  },
);

test(
  "runtime applicant session resolves to APPLICANT without creating elevated authority",
  () => {
    assert.equal(
      mapRuntimeSessionToGuidanceParticipant(
        applicantSession,
      ),
      "APPLICANT",
    );
  },
);

test(
  "fail-closed builders preserve explicit non-positive guidance states",
  () => {
    const common = {
      summary:
        "Phase 11 fail-closed validation.",

      metadata,

      ruleIds: [
        "PHASE_11_FAIL_CLOSED",
      ],

      facts: [],

      unresolvedConditions: [
        "Authoritative resolution is intentionally unavailable.",
      ],

      failure: {
        code:
          "VALIDATION_FAILURE" as const,

        message:
          "Phase 11 validation failure.",

        retryable:
          false,
      },
    };

    assert.equal(
      unresolvedGuidance(
        common,
      ).status,
      "UNRESOLVED",
    );

    assert.equal(
      unavailableGuidance(
        common,
      ).status,
      "UNAVAILABLE",
    );

    assert.equal(
      inconsistentGuidance(
        common,
      ).status,
      "INCONSISTENT",
    );

    assert.equal(
      unauthorizedGuidance(
        common,
      ).status,
      "UNAUTHORIZED",
    );

    assert.equal(
      notVisibleGuidance(
        common,
      ).status,
      "NOT_VISIBLE",
    );

    assert.equal(
      staleGuidance(
        common,
      ).status,
      "STALE",
    );
  },
);

test(
  "fail-closed result preserves metadata, explanation, and failure classification",
  () => {
    const result =
      inconsistentGuidance({
        summary:
          "Authoritative inputs conflict.",

        metadata,

        ruleIds: [
          "PHASE_11_SOURCE_CONFLICT",
        ],

        facts: [
          "Two authoritative inputs disagree.",
        ],

        unresolvedConditions: [
          "Conflicting authoritative state must be resolved.",
        ],

        failure: {
          code:
            "SOURCE_INCONSISTENT",

          message:
            "Conflicting authoritative inputs.",

          retryable:
            false,
        },
      });

    assert.equal(
      result.status,
      "INCONSISTENT",
    );

    assert.equal(
      result.metadata
        .correlationId,
      CORRELATION_ID,
    );

    assert.equal(
      result.metadata
        .engineName,
      "phase-11-validation",
    );

    assert.deepEqual(
      result.explanation
        .ruleIds,
      [
        "PHASE_11_SOURCE_CONFLICT",
      ],
    );

    assert.deepEqual(
      result.explanation
        .unresolvedConditions,
      [
        "Conflicting authoritative state must be resolved.",
      ],
    );

    assert.equal(
      result.failure?.code,
      "SOURCE_INCONSISTENT",
    );

    assert.equal(
      result.failure?.retryable,
      false,
    );
  },
);

test(
  "stale authoritative state remains STALE and never becomes positive guidance",
  () => {
    const result =
      staleGuidance({
        summary:
          "Authoritative guidance input is stale.",

        metadata,

        unresolvedConditions: [
          "A fresh authoritative observation is required.",
        ],

        failure: {
          code:
            "SOURCE_STALE",

          message:
            "The authoritative source is stale.",

          retryable:
            true,
        },
      });

    assert.equal(
      result.status,
      "STALE",
    );

    assert.notEqual(
      result.status,
      "AVAILABLE",
    );

    assert.equal(
      result.failure?.code,
      "SOURCE_STALE",
    );

    assert.equal(
      result.failure?.retryable,
      true,
    );
  },
);

test(
  "runtime error guidance fails closed as ERROR",
  () => {
    const result =
      errorGuidance({
        error:
          new Error(
            "Intentional Phase 11 runtime failure.",
          ),

        summary:
          "Phase 11 runtime validation failed closed.",

        metadata,
      });

    assert.equal(
      result.status,
      "ERROR",
    );

    assert.equal(
      result.metadata
        .correlationId,
      CORRELATION_ID,
    );

    assert.ok(
      result.failure,
    );

    assert.ok(
      result.explanation
        .unresolvedConditions
        .length > 0,
    );
  },
);

test(
  "workspace snapshot deterministically projects approved component outputs",
  () => {
    const components =
      {
        repositoryContext: {
          status:
            "INCOMPLETE",

          payload: {
            organizationId:
              "ORG-PHASE-11",

            caseId:
              "CASE-PHASE-11",

            workflowStatus:
              "approved",

            workflowStage:
              "APPLICATIONS",

            repositoryCount:
              1,

            repositoriesWithRecords: [
              "EVIDENCE",
            ],

            emptyRepositories: [
              "ARTIFACT",
              "INFORMATION_REQUEST",
              "DEFICIENCY",
              "REMEDIATION",
              "CERTIFICATION",
              "PROGRESS",
            ],

            repositories: [],

            relationshipAvailability:
              "UNRESOLVED",

            observedAt:
              FIXED_GENERATED_AT,
          },

          explanation: {
            summary:
              "Repository context is incomplete.",

            ruleIds: [],

            facts: [],

            unresolvedConditions: [],
          },

          sourceReferences: [],

          metadata,
        },

        nextAction: {
          status:
            "AVAILABLE",

          payload: {
            organizationId:
              "ORG-PHASE-11",

            caseId:
              "CASE-PHASE-11",

            action: {
              actionId:
                "REVIEW_CERTIFICATION_STATUS",

              title:
                "Review Certification Status",

              description:
                "Review the authoritative certification status.",

              owner:
                "CERTIFICATION_AUTHORITY",

              availability:
                "AVAILABLE",

              relatedStage:
                "APPLICATIONS",

              relatedRepository:
                "CERTIFICATION",
            },
          },

          explanation: {
            summary:
              "Next action is available.",

            ruleIds: [],

            facts: [],

            unresolvedConditions: [],
          },

          sourceReferences: [],

          metadata,
        },

        blocking: {
          status:
            "UNRESOLVED",

          payload: {
            organizationId:
              "ORG-PHASE-11",

            caseId:
              "CASE-PHASE-11",

            blocked:
              false,

            blockingConditions: [],
          },

          explanation: {
            summary:
              "Blocking determination is unresolved.",

            ruleIds: [],

            facts: [],

            unresolvedConditions: [],
          },

          sourceReferences: [],

          metadata,
        },

        waitingOn: {
          status:
            "WAITING",

          payload: {
            organizationId:
              "ORG-PHASE-11",

            caseId:
              "CASE-PHASE-11",

            waiting:
              true,

            waitingOn:
              "CERTIFICATION_AUTHORITY",

            currentOwner:
              "CERTIFICATION_AUTHORITY",

            conditions: [],
          },

          explanation: {
            summary:
              "Waiting on Certification Authority.",

            ruleIds: [],

            facts: [],

            unresolvedConditions: [],
          },

          sourceReferences: [],

          metadata,
        },
      } as any;

    const overallResult =
      {
        status:
          "INCOMPLETE",

        explanation: {
          summary:
            "Composite guidance remains incomplete.",

          ruleIds: [],

          facts: [],

          unresolvedConditions: [],
        },

        sourceReferences: [],

        metadata,
      } as any;

    const snapshot =
      buildWorkspaceGuidanceSnapshot(
        components,
        overallResult,
      );

    assert.deepEqual(
      snapshot,
      {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        overallStatus:
          "INCOMPLETE",

        repositoryContextStatus:
          "INCOMPLETE",

        nextActionStatus:
          "AVAILABLE",

        blockingStatus:
          "UNRESOLVED",

        waitingOnStatus:
          "WAITING",

        workflowStatus:
          "approved",

        workflowStage:
          "APPLICATIONS",

        nextAction:
          components
            .nextAction
            .payload
            .action,

        blocked:
          false,

        blockingConditionCount:
          0,

        waiting:
          true,

        waitingOn:
          "CERTIFICATION_AUTHORITY",

        currentOwner:
          "CERTIFICATION_AUTHORITY",

        observedAt:
          FIXED_GENERATED_AT,
      },
    );
  },
);

test(
  "workspace snapshot fails neutral when component payloads are unavailable",
  () => {
    const components =
      {
        repositoryContext: {
          status:
            "UNAVAILABLE",

          payload:
            undefined,
        },

        nextAction: {
          status:
            "UNRESOLVED",

          payload:
            undefined,
        },

        blocking: {
          status:
            "UNRESOLVED",

          payload:
            undefined,
        },

        waitingOn: {
          status:
            "UNRESOLVED",

          payload:
            undefined,
        },
      } as any;

    const overallResult =
      {
        status:
          "INCOMPLETE",
      } as any;

    const snapshot =
      buildWorkspaceGuidanceSnapshot(
        components,
        overallResult,
      );

    assert.equal(
      snapshot.organizationId,
      null,
    );

    assert.equal(
      snapshot.caseId,
      null,
    );

    assert.equal(
      snapshot.workflowStatus,
      null,
    );

    assert.equal(
      snapshot.workflowStage,
      null,
    );

    assert.equal(
      snapshot.nextAction,
      null,
    );

    assert.equal(
      snapshot.blocked,
      null,
    );

    assert.equal(
      snapshot.blockingConditionCount,
      0,
    );

    assert.equal(
      snapshot.waiting,
      null,
    );

    assert.equal(
      snapshot.waitingOn,
      null,
    );

    assert.equal(
      snapshot.currentOwner,
      null,
    );

    assert.equal(
      snapshot.observedAt,
      null,
    );
  },
);

test(
  "repository scope accepts a row belonging to the authenticated organization by organization name",
  () => {
    const scope =
      repositoryScopeFromSession({
        organizationId:
          "ORG-PHASE-11",
        organizationName:
          "GAFAIG Phase 11",
        email:
          "phase-11-applicant@gafaig.test",
      });

    const row = {
      CASE_ID:
        "CASE-PHASE-11",

      ORG_NAME:
        "GAFAIG Phase 11",

      ORG_ID:
        "ORG-OTHER",

      SUBMITTED_BY:
        "other@gafaig.test",
    };

    assert.equal(
      applicantRepositoryRowBelongsToScope(
        row,
        scope,
      ),
      true,
    );
  },
);

test(
  "repository scope accepts normalized organization identifier matching",
  () => {
    const scope =
      repositoryScopeFromSession({
        organizationId:
          "ORG-PHASE-11",
        organizationName:
          "GAFAIG Phase 11",
        email:
          "phase-11-applicant@gafaig.test",
      });

    const row = {
      CASE_ID:
        "CASE-PHASE-11",

      ORG_NAME:
        "Different Organization",

      ORG_ID:
        "  org-phase-11  ",

      SUBMITTED_BY:
        "other@gafaig.test",
    };

    assert.equal(
      applicantRepositoryRowBelongsToScope(
        row,
        scope,
      ),
      true,
    );
  },
);

test(
  "repository scope accepts a row submitted by the authenticated applicant identity",
  () => {
    const scope =
      repositoryScopeFromSession({
        organizationId:
          "ORG-PHASE-11",
        organizationName:
          "GAFAIG Phase 11",
        email:
          "phase-11-applicant@gafaig.test",
      });

    const row = {
      CASE_ID:
        "CASE-OTHER",

      ORG_NAME:
        "Different Organization",

      ORG_ID:
        "ORG-OTHER",

      SUBMITTED_BY:
        "  PHASE-11-APPLICANT@GAFAIG.TEST  ",
    };

    assert.equal(
      applicantRepositoryRowBelongsToScope(
        row,
        scope,
      ),
      true,
    );
  },
);

test(
  "repository scope accepts only explicitly supplied workflow case membership",
  () => {
    const scope =
      repositoryScopeFromSession(
        {
          organizationId:
            "ORG-PHASE-11",

          organizationName:
            "GAFAIG Phase 11",

          email:
            "phase-11-applicant@gafaig.test",
        },
        new Set([
          "CASE-SCOPED-WORKFLOW",
        ]),
      );

    const scopedRow = {
      CASE_ID:
        "CASE-SCOPED-WORKFLOW",

      ORG_NAME:
        "Different Organization",

      ORG_ID:
        "ORG-OTHER",

      SUBMITTED_BY:
        "other@gafaig.test",
    };

    const unscopedRow = {
      CASE_ID:
        "CASE-NOT-SCOPED",

      ORG_NAME:
        "Different Organization",

      ORG_ID:
        "ORG-OTHER",

      SUBMITTED_BY:
        "other@gafaig.test",
    };

    assert.equal(
      applicantRepositoryRowBelongsToScope(
        scopedRow,
        scope,
      ),
      true,
    );

    assert.equal(
      applicantRepositoryRowBelongsToScope(
        unscopedRow,
        scope,
      ),
      false,
    );
  },
);

test(
  "repository scope rejects a completely foreign organization row",
  () => {
    const scope =
      repositoryScopeFromSession(
        {
          organizationId:
            "ORG-PHASE-11",

          organizationName:
            "GAFAIG Phase 11",

          email:
            "phase-11-applicant@gafaig.test",
        },
        new Set([
          "CASE-PHASE-11",
        ]),
      );

    const foreignRow = {
      CASE_ID:
        "CASE-FOREIGN",

      ORG_NAME:
        "Foreign Organization",

      ORG_ID:
        "ORG-FOREIGN",

      SUBMITTED_BY:
        "foreign@gafaig.test",
    };

    assert.equal(
      applicantRepositoryRowBelongsToScope(
        foreignRow,
        scope,
      ),
      false,
    );
  },
);

test(
  "operational summary exposes participant explanations without protected blocking or waiting detail fields",
  async () => {
    const protectedBlockingTitle =
      "PROTECTED BLOCKING TITLE";

    const protectedBlockingDescription =
      "CONFIDENTIAL REVIEWER BLOCKING DETAIL";

    const protectedWaitingTitle =
      "PROTECTED WAITING TITLE";

    const protectedWaitingDescription =
      "INTERNAL DECISION DELIBERATION DETAIL";

    const blockingParticipantExplanation =
      "Participant-visible blocking explanation.";

    const waitingParticipantExplanation =
      "Participant-visible waiting explanation.";

    const repositoryContext = {
      status:
        "AVAILABLE",

      payload: {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        workflowStatus:
          "approved",

        workflowStage:
          "APPLICATIONS",

        repositoryCount:
          1,

        repositoriesWithRecords: [
          "EVIDENCE",
        ],

        emptyRepositories: [
          "ARTIFACT",
          "INFORMATION_REQUEST",
          "DEFICIENCY",
          "REMEDIATION",
          "CERTIFICATION",
          "PROGRESS",
        ],

        repositories: [],

        relationshipAvailability:
          "AVAILABLE",

        observedAt:
          FIXED_GENERATED_AT,
      },

      explanation: {
        summary:
          "Repository context is available.",

        ruleIds: [],

        facts: [],

        unresolvedConditions: [],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const nextAction = {
      status:
        "AVAILABLE",

      payload: {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        action: {
          actionId:
            "REVIEW_CERTIFICATION_STATUS",

          title:
            "Review Certification Status",

          description:
            "Review the authoritative certification status.",

          owner:
            "CERTIFICATION_AUTHORITY",

          availability:
            "AVAILABLE",

          relatedStage:
            "APPLICATIONS",

          relatedRepository:
            "CERTIFICATION",
        },
      },

      explanation: {
        summary:
          "Next action is available.",

        ruleIds: [],

        facts: [],

        unresolvedConditions: [],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const blocking = {
      status:
        "BLOCKED",

      payload: {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        workflowStatus:
          "approved",

        workflowStage:
          "APPLICATIONS",

        availability:
          "AVAILABLE",

        blocked:
          true,

        blockingConditions: [
          {
            conditionId:
              "EVIDENCE_REQUIRED",

            title:
              protectedBlockingTitle,

            description:
              protectedBlockingDescription,

            severity:
              "PROGRESSION_BLOCKED",

            responsibleParticipant:
              "APPLICANT",

            relatedRepository:
              "EVIDENCE",

            relatedStage:
              "APPLICATIONS",

            participantExplanation:
              blockingParticipantExplanation,
          },
        ],

        highestSeverity:
          "PROGRESSION_BLOCKED",

        relationshipAvailability:
          "AVAILABLE",

        observedAt:
          FIXED_GENERATED_AT,
      },

      explanation: {
        summary:
          "Participant-visible blocking condition is active.",

        ruleIds: [],

        facts: [],

        unresolvedConditions: [],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const waitingOn = {
      status:
        "WAITING",

      payload: {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        workflowStatus:
          "approved",

        workflowStage:
          "APPLICATIONS",

        availability:
          "AVAILABLE",

        waiting:
          true,

        waitingOn:
          "CERTIFICATION_AUTHORITY",

        currentOwner:
          "CERTIFICATION_AUTHORITY",

        conditions: [
          {
            conditionId:
              "WAITING_ON_CERTIFICATION_AUTHORITY",

            title:
              protectedWaitingTitle,

            description:
              protectedWaitingDescription,

            state:
              "REVIEW_PENDING",

            waitingOn:
              "CERTIFICATION_AUTHORITY",

            currentOwner:
              "CERTIFICATION_AUTHORITY",

            relatedRepository:
              "CERTIFICATION",

            relatedStage:
              "APPLICATIONS",

            participantExplanation:
              waitingParticipantExplanation,
          },
        ],

        relationshipAvailability:
          "AVAILABLE",

        observedAt:
          FIXED_GENERATED_AT,
      },

      explanation: {
        summary:
          "Waiting on Certification Authority.",

        ruleIds: [],

        facts: [],

        unresolvedConditions: [],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const components = {
      repositoryContext,
      nextAction,
      blocking,
      waitingOn,
    } as any;

    const composite = {
      status:
        "BLOCKED",

      payload: {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        repositoryContext,
        nextAction,
        blocking,
        waitingOn,

        observedAt:
          FIXED_GENERATED_AT,
      },

      explanation: {
        summary:
          "Composite guidance is blocked.",

        ruleIds: [],

        facts: [],

        unresolvedConditions: [],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const context = {
      session:
        applicantSession,

      participant:
        "APPLICANT",

      organizationId:
        "ORG-PHASE-11",

      caseId:
        "CASE-PHASE-11",

      requestedAt:
        FIXED_GENERATED_AT,

      correlationId:
        CORRELATION_ID,
    } as any;

    const result =
      await operationalSummaryEngine.execute({
        context,
        input: {
          composite,
          components,
          sourceReferences: [],
        },
      });

    assert.ok(
      result.payload,
    );

    assert.deepEqual(
      result.payload
        ?.blockingSummary
        .participantVisibleConditions,
      [
        blockingParticipantExplanation,
      ],
    );

    assert.deepEqual(
      result.payload
        ?.waitingSummary
        .participantVisibleConditions,
      [
        waitingParticipantExplanation,
      ],
    );

    const serializedPayload =
      JSON.stringify(
        result.payload,
      );

    assert.equal(
      serializedPayload.includes(
        protectedBlockingTitle,
      ),
      false,
    );

    assert.equal(
      serializedPayload.includes(
        protectedBlockingDescription,
      ),
      false,
    );

    assert.equal(
      serializedPayload.includes(
        protectedWaitingTitle,
      ),
      false,
    );

    assert.equal(
      serializedPayload.includes(
        protectedWaitingDescription,
      ),
      false,
    );

    assert.equal(
      serializedPayload.includes(
        blockingParticipantExplanation,
      ),
      true,
    );

    assert.equal(
      serializedPayload.includes(
        waitingParticipantExplanation,
      ),
      true,
    );
  },
);

test(
  "operational summary participant narrative omits protected condition details",
  async () => {
    const protectedConditionDetail =
      "CONFIDENTIAL INTERNAL GOVERNANCE REASONING";

    const participantExplanation =
      "Participant-visible evidence action is required.";

    const repositoryContext = {
      status:
        "AVAILABLE",

      payload: {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        workflowStatus:
          "approved",

        workflowStage:
          "APPLICATIONS",

        repositoryCount:
          1,

        repositoriesWithRecords: [
          "EVIDENCE",
        ],

        emptyRepositories: [],

        repositories: [],

        relationshipAvailability:
          "AVAILABLE",

        observedAt:
          FIXED_GENERATED_AT,
      },

      explanation: {
        summary:
          "Repository context is available.",

        ruleIds: [],

        facts: [],

        unresolvedConditions: [],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const nextAction = {
      status:
        "AVAILABLE",

      payload: {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        action: {
          actionId:
            "REVIEW_EVIDENCE",

          title:
            "Review Evidence",

          description:
            "Review participant-visible evidence status.",

          owner:
            "GAFAIG_OPERATIONS_REVIEWER",

          availability:
            "AVAILABLE",

          relatedStage:
            "APPLICATIONS",

          relatedRepository:
            "EVIDENCE",
        },
      },

      explanation: {
        summary:
          "Next action is available.",

        ruleIds: [],

        facts: [],

        unresolvedConditions: [],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const blocking = {
      status:
        "BLOCKED",

      payload: {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        workflowStatus:
          "approved",

        workflowStage:
          "APPLICATIONS",

        availability:
          "AVAILABLE",

        blocked:
          true,

        blockingConditions: [
          {
            conditionId:
              "EVIDENCE_REQUIRED",

            title:
              "Internal evidence blocker",

            description:
              protectedConditionDetail,

            severity:
              "ACTION_REQUIRED",

            responsibleParticipant:
              "APPLICANT",

            relatedRepository:
              "EVIDENCE",

            relatedStage:
              "APPLICATIONS",

            participantExplanation:
              participantExplanation,
          },
        ],

        highestSeverity:
          "ACTION_REQUIRED",

        relationshipAvailability:
          "AVAILABLE",

        observedAt:
          FIXED_GENERATED_AT,
      },

      explanation: {
        summary:
          "Blocking condition is active.",

        ruleIds: [],

        facts: [],

        unresolvedConditions: [],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const waitingOn = {
      status:
        "AVAILABLE",

      payload: {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        workflowStatus:
          "approved",

        workflowStage:
          "APPLICATIONS",

        availability:
          "AVAILABLE",

        waiting:
          false,

        waitingOn:
          null,

        currentOwner:
          "GAFAIG_OPERATIONS_REVIEWER",

        conditions: [],

        relationshipAvailability:
          "AVAILABLE",

        observedAt:
          FIXED_GENERATED_AT,
      },

      explanation: {
        summary:
          "No waiting condition is active.",

        ruleIds: [],

        facts: [],

        unresolvedConditions: [],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const components = {
      repositoryContext,
      nextAction,
      blocking,
      waitingOn,
    } as any;

    const composite = {
      status:
        "BLOCKED",

      payload: {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        repositoryContext,
        nextAction,
        blocking,
        waitingOn,

        observedAt:
          FIXED_GENERATED_AT,
      },

      explanation: {
        summary:
          "Composite guidance is blocked.",

        ruleIds: [],

        facts: [],

        unresolvedConditions: [],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const context = {
      session:
        applicantSession,

      participant:
        "APPLICANT",

      organizationId:
        "ORG-PHASE-11",

      caseId:
        "CASE-PHASE-11",

      requestedAt:
        FIXED_GENERATED_AT,

      correlationId:
        CORRELATION_ID,
    } as any;

    const result =
      await operationalSummaryEngine.execute({
        context,
        input: {
          composite,
          components,
          sourceReferences: [],
        },
      });

    assert.ok(
      result.payload,
    );

    assert.equal(
      result.payload
        ?.participantSummary
        .includes(
          protectedConditionDetail,
        ),
      false,
    );

    assert.equal(
      result.explanation
        .summary
        .includes(
          protectedConditionDetail,
        ),
      false,
    );

    assert.equal(
      result.payload
        ?.blockingSummary
        .participantVisibleConditions[0],
      participantExplanation,
    );
  },
);

test(
  "guidance API view contract preserves canonical supported views and deterministic normalization",
  async () => {
    const {
      GUIDANCE_API_VIEWS,
      isGuidanceApiView,
      parseGuidanceApiView,
    } =
      await import(
        "../lib/guidance/guidanceApiTypes"
      );

    assert.deepEqual(
      GUIDANCE_API_VIEWS,
      [
        "composite",
        "operational-summary",
        "repository-context",
        "next-action",
        "blocking",
        "waiting-on",
      ],
    );

    for (
      const view of
      GUIDANCE_API_VIEWS
    ) {
      assert.equal(
        isGuidanceApiView(view),
        true,
      );

      assert.equal(
        parseGuidanceApiView(view),
        view,
      );
    }

    assert.equal(
      parseGuidanceApiView(
        "OPERATIONAL_SUMMARY",
      ),
      "operational-summary",
    );

    assert.equal(
      parseGuidanceApiView(
        " repository context ",
      ),
      "repository-context",
    );

    assert.equal(
      parseGuidanceApiView(
        "NEXT_ACTION",
      ),
      "next-action",
    );

    assert.equal(
      parseGuidanceApiView(null),
      "composite",
    );

    assert.equal(
      parseGuidanceApiView(
        "unsupported-guidance-view",
      ),
      "composite",
    );

    assert.equal(
      isGuidanceApiView(
        "unsupported-guidance-view",
      ),
      false,
    );
  },
);

test(
  "guidance API view contract does not admit authority-bearing mutation views",
  async () => {
    const {
      isGuidanceApiView,
      parseGuidanceApiView,
    } =
      await import(
        "../lib/guidance/guidanceApiTypes"
      );

    const prohibitedViews = [
      "approve",
      "deny",
      "publish",
      "certify",
      "score",
      "reassign",
      "resolve-blocker",
      "resolve-waiting",
      "mutate-workflow",
      "mutate-repository",
    ];

    for (
      const view of
      prohibitedViews
    ) {
      assert.equal(
        isGuidanceApiView(view),
        false,
      );

      assert.equal(
        parseGuidanceApiView(view),
        "composite",
      );
    }
  },
);

function phase11CompositeContext() {
  return {
    session:
      applicantSession,

    participant:
      "APPLICANT",

    organizationId:
      "ORG-PHASE-11",

    caseId:
      "CASE-PHASE-11",

    requestedAt:
      FIXED_GENERATED_AT,

    correlationId:
      CORRELATION_ID,
  } as any;
}

function phase11CompositeResult(
  status: string,
  payload?: unknown,
) {
  return {
    status,

    ...(payload === undefined
      ? {}
      : {
          payload,
        }),

    explanation: {
      summary:
        `Phase 11 ${status} dependency fixture.`,

      ruleIds: [],

      facts: [],

      unresolvedConditions: [],
    },

    sourceReferences: [],

    metadata,
  } as any;
}

function phase11RepositoryPayload(input?: {
  readonly organizationId?: string;
  readonly caseId?: string;
}) {
  return {
    organizationId:
      input?.organizationId ??
      "ORG-PHASE-11",

    caseId:
      input?.caseId ??
      "CASE-PHASE-11",

    observedAt:
      FIXED_GENERATED_AT,
  } as any;
}

test(
  "composite guidance fails closed when authoritative repository context payload is unavailable",
  async () => {
    const {
      compositeGuidanceEngine,
    } =
      await import(
        "../lib/guidance/compositeGuidanceEngine"
      );

    const sourceReferences = [
      {
        sourceSystem:
          "SNOWFLAKE",

        database:
          "GAFAIG_DB",

        schema:
          "CORE",

        objectName:
          "V_VERIFICATION_CASES",

        recordId:
          "CASE-PHASE-11",

        observedAt:
          FIXED_GENERATED_AT,
      },
    ] as any;

    const result =
      await compositeGuidanceEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          repositoryContext:
            phase11CompositeResult(
              "UNAVAILABLE",
            ),

          nextAction:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          blocking:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          waitingOn:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          sourceReferences,
        } as any,
      });

    assert.equal(
      result.status,
      "UNRESOLVED",
    );

    assert.equal(
      result.failure?.code,
      "DEPENDENCY_FAILURE",
    );

    assert.equal(
      result.payload,
      undefined,
    );

    assert.deepEqual(
      result.sourceReferences,
      sourceReferences,
    );

    assert.ok(
      result.explanation
        .unresolvedConditions
        .includes(
          "No authoritative Repository Context payload is available.",
        ),
    );
  },
);

test(
  "composite guidance preserves dependency ERROR status without recomputing it",
  async () => {
    const {
      compositeGuidanceEngine,
    } =
      await import(
        "../lib/guidance/compositeGuidanceEngine"
      );

    const repositoryContext =
      phase11CompositeResult(
        "AVAILABLE",
        phase11RepositoryPayload(),
      );

    const nextAction =
      phase11CompositeResult(
        "ERROR",
      );

    const blocking =
      phase11CompositeResult(
        "AVAILABLE",
      );

    const waitingOn =
      phase11CompositeResult(
        "AVAILABLE",
      );

    const result =
      await compositeGuidanceEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          repositoryContext,
          nextAction,
          blocking,
          waitingOn,
          sourceReferences: [],
        } as any,
      });

    assert.equal(
      result.status,
      "ERROR",
    );

    assert.ok(
      result.payload,
    );

    assert.equal(
      result.payload
        ?.nextAction,
      nextAction,
    );

    assert.equal(
      result.failure,
      undefined,
    );
  },
);

test(
  "composite guidance rejects inconsistent organization scope before positive aggregation",
  async () => {
    const {
      compositeGuidanceEngine,
    } =
      await import(
        "../lib/guidance/compositeGuidanceEngine"
      );

    const result =
      await compositeGuidanceEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          repositoryContext:
            phase11CompositeResult(
              "AVAILABLE",
              phase11RepositoryPayload({
                organizationId:
                  "ORG-FOREIGN",
              }),
            ),

          nextAction:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          blocking:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          waitingOn:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          sourceReferences: [],
        } as any,
      });

    assert.equal(
      result.status,
      "INCONSISTENT",
    );

    assert.equal(
      result.failure?.code,
      "SOURCE_INCONSISTENT",
    );

    assert.equal(
      result.payload,
      undefined,
    );

    assert.ok(
      result.explanation
        .unresolvedConditions
        .includes(
          "The Guidance organization and Repository Context organization do not match.",
        ),
    );
  },
);

test(
  "composite guidance recovers deterministically after dependency restoration without stale failure state",
  async () => {
    const {
      compositeGuidanceEngine,
    } =
      await import(
        "../lib/guidance/compositeGuidanceEngine"
      );

    const context =
      phase11CompositeContext();

    const failed =
      await compositeGuidanceEngine.execute({
        context,

        input: {
          repositoryContext:
            phase11CompositeResult(
              "UNAVAILABLE",
            ),

          nextAction:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          blocking:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          waitingOn:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          sourceReferences: [],
        } as any,
      });

    assert.equal(
      failed.status,
      "UNRESOLVED",
    );

    assert.equal(
      failed.failure?.code,
      "DEPENDENCY_FAILURE",
    );

    const restoredInput = {
      repositoryContext:
        phase11CompositeResult(
          "AVAILABLE",
          phase11RepositoryPayload(),
        ),

      nextAction:
        phase11CompositeResult(
          "AVAILABLE",
        ),

      blocking:
        phase11CompositeResult(
          "AVAILABLE",
        ),

      waitingOn:
        phase11CompositeResult(
          "AVAILABLE",
        ),

      sourceReferences: [],
    } as any;

    const recovered =
      await compositeGuidanceEngine.execute({
        context,
        input:
          restoredInput,
      });

    const repeated =
      await compositeGuidanceEngine.execute({
        context,
        input:
          restoredInput,
      });

    assert.equal(
      recovered.status,
      "AVAILABLE",
    );

    assert.equal(
      recovered.failure,
      undefined,
    );

    assert.deepEqual(
      recovered.explanation
        .unresolvedConditions,
      [],
    );

    assert.ok(
      recovered.payload,
    );

    assert.equal(
      recovered.payload
        ?.organizationId,
      "ORG-PHASE-11",
    );

    assert.equal(
      recovered.payload
        ?.caseId,
      "CASE-PHASE-11",
    );

    assert.deepEqual(
      recovered,
      repeated,
    );
  },
);

test(
  "composite guidance applies implemented status precedence across competing component statuses",
  async () => {
    const {
      compositeGuidanceEngine,
    } =
      await import(
        "../lib/guidance/compositeGuidanceEngine"
      );

    const precedenceCases = [
      {
        higher:
          "ERROR",
        lower:
          "UNAUTHORIZED",
        expected:
          "ERROR",
      },
      {
        higher:
          "UNAUTHORIZED",
        lower:
          "NOT_VISIBLE",
        expected:
          "UNAUTHORIZED",
      },
      {
        higher:
          "NOT_VISIBLE",
        lower:
          "INCONSISTENT",
        expected:
          "NOT_VISIBLE",
      },
      {
        higher:
          "INCONSISTENT",
        lower:
          "STALE",
        expected:
          "INCONSISTENT",
      },
      {
        higher:
          "STALE",
        lower:
          "UNAVAILABLE",
        expected:
          "STALE",
      },
      {
        higher:
          "UNAVAILABLE",
        lower:
          "UNRESOLVED",
        expected:
          "UNAVAILABLE",
      },
      {
        higher:
          "UNRESOLVED",
        lower:
          "BLOCKED",
        expected:
          "INCOMPLETE",
      },
      {
        higher:
          "BLOCKED",
        lower:
          "WAITING",
        expected:
          "BLOCKED",
      },
      {
        higher:
          "WAITING",
        lower:
          "INCOMPLETE",
        expected:
          "WAITING",
      },
      {
        higher:
          "INCOMPLETE",
        lower:
          "READY",
        expected:
          "INCOMPLETE",
      },
    ] as const;

    for (
      const precedenceCase of
      precedenceCases
    ) {
      const result =
        await compositeGuidanceEngine.execute({
          context:
            phase11CompositeContext(),

          input: {
            repositoryContext:
              phase11CompositeResult(
                "AVAILABLE",
                phase11RepositoryPayload(),
              ),

            nextAction:
              phase11CompositeResult(
                precedenceCase.higher,
              ),

            blocking:
              phase11CompositeResult(
                precedenceCase.lower,
              ),

            waitingOn:
              phase11CompositeResult(
                "AVAILABLE",
              ),

            sourceReferences: [],
          } as any,
        });

      assert.equal(
        result.status,
        precedenceCase.expected,
      );

      assert.ok(
        result.payload,
      );

      assert.equal(
        result.payload
          ?.nextAction.status,
        precedenceCase.higher,
      );

      assert.equal(
        result.payload
          ?.blocking.status,
        precedenceCase.lower,
      );
    }
  },
);

test(
  "composite guidance converts UNRESOLVED dependency input to INCOMPLETE without producing positive guidance",
  async () => {
    const {
      compositeGuidanceEngine,
    } =
      await import(
        "../lib/guidance/compositeGuidanceEngine"
      );

    const result =
      await compositeGuidanceEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          repositoryContext:
            phase11CompositeResult(
              "AVAILABLE",
              phase11RepositoryPayload(),
            ),

          nextAction:
            phase11CompositeResult(
              "UNRESOLVED",
            ),

          blocking:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          waitingOn:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          sourceReferences: [],
        } as any,
      });

    assert.equal(
      result.status,
      "INCOMPLETE",
    );

    assert.notEqual(
      result.status,
      "AVAILABLE",
    );

    assert.ok(
      result.payload,
    );

    assert.equal(
      result.payload
        ?.nextAction.status,
      "UNRESOLVED",
    );

    assert.deepEqual(
      result.explanation
        .unresolvedConditions,
      [
        "One or more component Guidance results remain unresolved or incomplete.",
      ],
    );
  },
);

test(
  "composite guidance preserves current READY and NOT_ELIGIBLE fallthrough behavior",
  async () => {
    const {
      compositeGuidanceEngine,
    } =
      await import(
        "../lib/guidance/compositeGuidanceEngine"
      );

    const fallthroughCases = [
      {
        nextAction:
          "READY",
        blocking:
          "AVAILABLE",
        waitingOn:
          "AVAILABLE",
      },
      {
        nextAction:
          "NOT_ELIGIBLE",
        blocking:
          "AVAILABLE",
        waitingOn:
          "AVAILABLE",
      },
      {
        nextAction:
          "READY",
        blocking:
          "NOT_ELIGIBLE",
        waitingOn:
          "AVAILABLE",
      },
    ] as const;

    for (
      const fallthroughCase of
      fallthroughCases
    ) {
      const result =
        await compositeGuidanceEngine.execute({
          context:
            phase11CompositeContext(),

          input: {
            repositoryContext:
              phase11CompositeResult(
                "AVAILABLE",
                phase11RepositoryPayload(),
              ),

            nextAction:
              phase11CompositeResult(
                fallthroughCase.nextAction,
              ),

            blocking:
              phase11CompositeResult(
                fallthroughCase.blocking,
              ),

            waitingOn:
              phase11CompositeResult(
                fallthroughCase.waitingOn,
              ),

            sourceReferences: [],
          } as any,
        });

      assert.equal(
        result.status,
        "AVAILABLE",
      );

      assert.ok(
        result.payload,
      );

      assert.equal(
        result.payload
          ?.nextAction.status,
        fallthroughCase.nextAction,
      );

      assert.equal(
        result.payload
          ?.blocking.status,
        fallthroughCase.blocking,
      );

      assert.equal(
        result.payload
          ?.waitingOn.status,
        fallthroughCase.waitingOn,
      );
    }
  },
);

test(
  "composite guidance fails closed when explicit case scope is missing",
  async () => {
    const {
      compositeGuidanceEngine,
    } =
      await import(
        "../lib/guidance/compositeGuidanceEngine"
      );

    const sourceReferences = [
      {
        sourceSystem:
          "SNOWFLAKE",

        database:
          "GAFAIG_DB",

        schema:
          "CORE",

        objectName:
          "V_VERIFICATION_CASES",

        recordId:
          "CASE-PHASE-11",

        observedAt:
          FIXED_GENERATED_AT,
      },
    ] as any;

    const context = {
      ...phase11CompositeContext(),
      caseId:
        undefined,
    } as any;

    const result =
      await compositeGuidanceEngine.execute({
        context,

        input: {
          repositoryContext:
            phase11CompositeResult(
              "AVAILABLE",
              phase11RepositoryPayload(),
            ),

          nextAction:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          blocking:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          waitingOn:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          sourceReferences,
        } as any,
      });

    assert.equal(
      result.status,
      "UNRESOLVED",
    );

    assert.equal(
      result.failure?.code,
      "VALIDATION_FAILURE",
    );

    assert.equal(
      result.failure?.retryable,
      false,
    );

    assert.equal(
      result.payload,
      undefined,
    );

    assert.deepEqual(
      result.sourceReferences,
      sourceReferences,
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-COMPOSITE-CASE-SCOPE-REQUIRED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-COMPOSITE-FAIL-CLOSED",
        ),
    );

    assert.ok(
      result.explanation
        .unresolvedConditions
        .includes(
          "A case identifier is required.",
        ),
    );
  },
);

test(
  "composite guidance rejects inconsistent case scope before aggregation",
  async () => {
    const {
      compositeGuidanceEngine,
    } =
      await import(
        "../lib/guidance/compositeGuidanceEngine"
      );

    const sourceReferences = [
      {
        sourceSystem:
          "SNOWFLAKE",

        database:
          "GAFAIG_DB",

        schema:
          "CORE",

        objectName:
          "V_VERIFICATION_CASES",

        recordId:
          "CASE-FOREIGN",

        observedAt:
          FIXED_GENERATED_AT,
      },
    ] as any;

    const result =
      await compositeGuidanceEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          repositoryContext:
            phase11CompositeResult(
              "AVAILABLE",
              phase11RepositoryPayload({
                caseId:
                  "CASE-FOREIGN",
              }),
            ),

          nextAction:
            phase11CompositeResult(
              "ERROR",
            ),

          blocking:
            phase11CompositeResult(
              "BLOCKED",
            ),

          waitingOn:
            phase11CompositeResult(
              "WAITING",
            ),

          sourceReferences,
        } as any,
      });

    assert.equal(
      result.status,
      "INCONSISTENT",
    );

    assert.equal(
      result.failure?.code,
      "SOURCE_INCONSISTENT",
    );

    assert.equal(
      result.failure?.retryable,
      false,
    );

    assert.equal(
      result.payload,
      undefined,
    );

    assert.deepEqual(
      result.sourceReferences,
      sourceReferences,
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-COMPOSITE-CASE-SCOPE-REQUIRED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-COMPOSITE-SOURCE-CONSISTENCY-REQUIRED",
        ),
    );

    assert.ok(
      result.explanation
        .unresolvedConditions
        .includes(
          "The Guidance case and Repository Context case do not match.",
        ),
    );
  },
);

test(
  "composite guidance preserves all dependency results and source references on successful aggregation",
  async () => {
    const {
      compositeGuidanceEngine,
    } =
      await import(
        "../lib/guidance/compositeGuidanceEngine"
      );

    const repositoryContext =
      phase11CompositeResult(
        "AVAILABLE",
        phase11RepositoryPayload(),
      );

    const nextAction =
      phase11CompositeResult(
        "READY",
      );

    const blocking =
      phase11CompositeResult(
        "AVAILABLE",
      );

    const waitingOn =
      phase11CompositeResult(
        "WAITING",
      );

    const sourceReferences = [
      {
        sourceSystem:
          "SNOWFLAKE",

        database:
          "GAFAIG_DB",

        schema:
          "CORE",

        objectName:
          "V_VERIFICATION_CASES",

        recordId:
          "CASE-PHASE-11",

        observedAt:
          FIXED_GENERATED_AT,
      },
    ] as any;

    const result =
      await compositeGuidanceEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          repositoryContext,
          nextAction,
          blocking,
          waitingOn,
          sourceReferences,
        } as any,
      });

    assert.equal(
      result.status,
      "WAITING",
    );

    assert.ok(
      result.payload,
    );

    assert.equal(
      result.payload
        ?.repositoryContext,
      repositoryContext,
    );

    assert.equal(
      result.payload
        ?.nextAction,
      nextAction,
    );

    assert.equal(
      result.payload
        ?.blocking,
      blocking,
    );

    assert.equal(
      result.payload
        ?.waitingOn,
      waitingOn,
    );

    assert.deepEqual(
      result.sourceReferences,
      sourceReferences,
    );

    assert.equal(
      result.failure,
      undefined,
    );
  },
);

test(
  "composite guidance exposes successful-path preservation and authority-boundary rules",
  async () => {
    const {
      compositeGuidanceEngine,
    } =
      await import(
        "../lib/guidance/compositeGuidanceEngine"
      );

    const result =
      await compositeGuidanceEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          repositoryContext:
            phase11CompositeResult(
              "AVAILABLE",
              phase11RepositoryPayload(),
            ),

          nextAction:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          blocking:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          waitingOn:
            phase11CompositeResult(
              "AVAILABLE",
            ),

          sourceReferences: [],
        } as any,
      });

    const expectedRuleIds = [
      "OG-COMPOSITE-ORGANIZATION-SCOPE-PRESERVED",
      "OG-COMPOSITE-SOURCE-REFERENCES-PRESERVED",
      "OG-COMPOSITE-DEPENDENCY-RESULTS-PRESERVED",
      "OG-COMPOSITE-NO-RESULT-RECOMPUTATION",
      "OG-COMPOSITE-NO-INDEPENDENT-SOURCE-QUERY",
      "OG-COMPOSITE-NO-RELATIONSHIP-INFERENCE",
      "OG-COMPOSITE-NO-WORKFLOW-MUTATION",
      "OG-COMPOSITE-NO-GOVERNANCE-RECOMPUTATION",
      "OG-COMPOSITE-NO-AUTHORITY-CREATION",
    ] as const;

    assert.equal(
      result.status,
      "AVAILABLE",
    );

    assert.ok(
      result.payload,
    );

    for (
      const ruleId of
      expectedRuleIds
    ) {
      assert.ok(
        result.explanation
          .ruleIds
          .includes(ruleId),
      );
    }

    assert.equal(
      result.failure,
      undefined,
    );
  },
);

test(
  "next action guidance resolves the first satisfied deterministic rule from authoritative repository context",
  async () => {
    const {
      nextActionEngine,
    } =
      await import(
        "../lib/guidance/nextActionEngine"
      );

    const repositoryContext = {
      organizationId:
        "ORG-PHASE-11",

      caseId:
        "CASE-PHASE-11",

      workflowStatus:
        "INFORMATION_REQUEST",

      workflowStage:
        "DEFICIENCY",

      repositoryCount:
        0,

      repositoriesWithRecords: [],

      emptyRepositories: [
        "EVIDENCE",
        "ARTIFACT",
        "INFORMATION_REQUEST",
        "DEFICIENCY",
        "REMEDIATION",
        "CERTIFICATION",
        "PROGRESS",
      ],

      repositories: [
        {
          repository:
            "EVIDENCE",
          recordCount:
            0,
          visibleRecordIds: [],
          sourceReferences: [],
        },
        {
          repository:
            "ARTIFACT",
          recordCount:
            0,
          visibleRecordIds: [],
          sourceReferences: [],
        },
        {
          repository:
            "INFORMATION_REQUEST",
          recordCount:
            0,
          visibleRecordIds: [],
          sourceReferences: [],
        },
        {
          repository:
            "DEFICIENCY",
          recordCount:
            0,
          visibleRecordIds: [],
          sourceReferences: [],
        },
        {
          repository:
            "REMEDIATION",
          recordCount:
            0,
          visibleRecordIds: [],
          sourceReferences: [],
        },
        {
          repository:
            "CERTIFICATION",
          recordCount:
            0,
          visibleRecordIds: [],
          sourceReferences: [],
        },
        {
          repository:
            "PROGRESS",
          recordCount:
            0,
          visibleRecordIds: [],
          sourceReferences: [],
        },
      ],

      relationshipAvailability:
        "UNRESOLVED",

      observedAt:
        FIXED_GENERATED_AT,
    } as any;

    const sourceReferences = [
      {
        sourceSystem:
          "SNOWFLAKE",

        database:
          "GAFAIG_DB",

        schema:
          "CORE",

        objectName:
          "V_VERIFICATION_CASES",

        recordId:
          "CASE-PHASE-11",

        observedAt:
          FIXED_GENERATED_AT,
      },
    ] as any;

    const result =
      await nextActionEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          repositoryContext,
          sourceReferences,
        },
      });

    assert.equal(
      result.status,
      "AVAILABLE",
    );

    assert.ok(
      result.payload,
    );

    assert.equal(
      result.payload
        ?.availability,
      "AVAILABLE",
    );

    assert.equal(
      result.payload
        ?.action
        ?.actionId,
      "RESPOND_TO_INFORMATION_REQUEST",
    );

    assert.equal(
      result.payload
        ?.action
        ?.owner,
      "APPLICANT",
    );

    assert.equal(
      result.payload
        ?.waitingOn,
      "APPLICANT",
    );

    assert.deepEqual(
      result.sourceReferences,
      sourceReferences,
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-NEXT-ACTION-INFORMATION-REQUEST-RESPONSE-REQUIRED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-NEXT-ACTION-FIRST-SATISFIED-RULE-WINS",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-NEXT-ACTION-SINGLE-ACTION-ONLY",
        ),
    );
  },
);

test(
  "next action guidance fails closed when no authorized deterministic rule is satisfied",
  async () => {
    const {
      nextActionEngine,
    } =
      await import(
        "../lib/guidance/nextActionEngine"
      );

    const repositoryContext = {
      organizationId:
        "ORG-PHASE-11",

      caseId:
        "CASE-PHASE-11",

      workflowStatus:
        "UNKNOWN",

      workflowStage:
        "UNKNOWN",

      repositoryCount:
        0,

      repositoriesWithRecords: [],

      emptyRepositories: [
        "EVIDENCE",
        "ARTIFACT",
        "INFORMATION_REQUEST",
        "DEFICIENCY",
        "REMEDIATION",
        "CERTIFICATION",
        "PROGRESS",
      ],

      repositories: [
        {
          repository:
            "EVIDENCE",
          recordCount:
            0,
          visibleRecordIds: [],
          sourceReferences: [],
        },
        {
          repository:
            "ARTIFACT",
          recordCount:
            0,
          visibleRecordIds: [],
          sourceReferences: [],
        },
        {
          repository:
            "INFORMATION_REQUEST",
          recordCount:
            0,
          visibleRecordIds: [],
          sourceReferences: [],
        },
        {
          repository:
            "DEFICIENCY",
          recordCount:
            0,
          visibleRecordIds: [],
          sourceReferences: [],
        },
        {
          repository:
            "REMEDIATION",
          recordCount:
            0,
          visibleRecordIds: [],
          sourceReferences: [],
        },
        {
          repository:
            "CERTIFICATION",
          recordCount:
            0,
          visibleRecordIds: [],
          sourceReferences: [],
        },
        {
          repository:
            "PROGRESS",
          recordCount:
            0,
          visibleRecordIds: [],
          sourceReferences: [],
        },
      ],

      relationshipAvailability:
        "AVAILABLE",

      observedAt:
        FIXED_GENERATED_AT,
    } as any;

    const result =
      await nextActionEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          repositoryContext,
          sourceReferences: [],
        },
      });

    assert.equal(
      result.status,
      "UNRESOLVED",
    );

    assert.ok(
      result.payload,
    );

    assert.equal(
      result.payload
        ?.availability,
      "UNRESOLVED",
    );

    assert.equal(
      result.payload
        ?.action,
      null,
    );

    assert.equal(
      result.payload
        ?.waitingOn,
      null,
    );

    assert.deepEqual(
      result.payload
        ?.blockingItems,
      [],
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-NEXT-ACTION-NO-AUTHORIZED-RULE-SATISFIED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-NEXT-ACTION-DETERMINISTIC-PRIORITY-REQUIRED",
        ),
    );

    assert.ok(
      result.explanation
        .unresolvedConditions
        .includes(
          "No authorized deterministic Next Action rule is satisfied by the current workflow and repository context.",
        ),
    );

    assert.equal(
      result.failure,
      undefined,
    );
  },
);

test(
  "blocking guidance preserves authoritative conditions and resolves highest severity deterministically",
  async () => {
    const {
      blockingEngine,
    } =
      await import(
        "../lib/guidance/blockingEngine"
      );

    const repositoryContext = {
      organizationId:
        "ORG-PHASE-11",

      caseId:
        "CASE-PHASE-11",

      workflowStatus:
        "UNDER_REVIEW",

      workflowStage:
        "EVIDENCE_REVIEW",

      repositoryCount:
        0,

      repositoriesWithRecords: [],

      emptyRepositories: [],

      repositories: [],

      relationshipAvailability:
        "UNRESOLVED",

      observedAt:
        FIXED_GENERATED_AT,
    } as any;

    const informationalCondition = {
      conditionId:
        "NO_BLOCKING_CONDITION_RESOLVED",

      title:
        "Informational Condition",

      description:
        "Participant-visible informational condition.",

      severity:
        "INFORMATIONAL",

      responsibleParticipant:
        "APPLICANT",

      relatedRepository:
        null,

      relatedStage:
        "EVIDENCE_REVIEW",

      participantExplanation:
        "Informational guidance only.",
    } as any;

    const progressionBlockedCondition = {
      conditionId:
        "EVIDENCE_REQUIRED",

      title:
        "Evidence Required",

      description:
        "Supporting evidence is required before progression.",

      severity:
        "PROGRESSION_BLOCKED",

      responsibleParticipant:
        "APPLICANT",

      relatedRepository:
        "EVIDENCE",

      relatedStage:
        "EVIDENCE_REVIEW",

      participantExplanation:
        "Upload the required supporting evidence.",
    } as any;

    const result =
      await blockingEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          repositoryContext,

          authoritativeConditions: [
            informationalCondition,
            progressionBlockedCondition,
          ],

          sourceReferences: [],
        },
      });

    assert.equal(
      result.status,
      "BLOCKED",
    );

    assert.ok(
      result.payload,
    );

    assert.equal(
      result.payload
        ?.availability,
      "AVAILABLE",
    );

    assert.equal(
      result.payload
        ?.blocked,
      true,
    );

    assert.equal(
      result.payload
        ?.highestSeverity,
      "PROGRESSION_BLOCKED",
    );

    assert.equal(
      result.payload
        ?.blockingConditions[0],
      progressionBlockedCondition,
    );

    assert.equal(
      result.payload
        ?.blockingConditions[1],
      informationalCondition,
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-BLOCKING-EXPLICIT-AUTHORITATIVE-CONDITIONS-PRESERVED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-BLOCKING-NO-AUTOMATIC-RESOLUTION",
        ),
    );
  },
);

test(
  "blocking guidance fails closed while canonical relationship context is unresolved",
  async () => {
    const {
      blockingEngine,
    } =
      await import(
        "../lib/guidance/blockingEngine"
      );

    const repositoryContext = {
      organizationId:
        "ORG-PHASE-11",

      caseId:
        "CASE-PHASE-11",

      workflowStatus:
        "UNDER_REVIEW",

      workflowStage:
        "REVIEW_PENDING",

      repositoryCount:
        0,

      repositoriesWithRecords: [],

      emptyRepositories: [],

      repositories: [],

      relationshipAvailability:
        "UNRESOLVED",

      observedAt:
        FIXED_GENERATED_AT,
    } as any;

    const result =
      await blockingEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          repositoryContext,
          sourceReferences: [],
        },
      });

    assert.equal(
      result.status,
      "UNRESOLVED",
    );

    assert.ok(
      result.payload,
    );

    assert.equal(
      result.payload
        ?.availability,
      "UNRESOLVED",
    );

    assert.equal(
      result.payload
        ?.blocked,
      null,
    );

    assert.deepEqual(
      result.payload
        ?.blockingConditions,
      [],
    );

    assert.equal(
      result.payload
        ?.highestSeverity,
      null,
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-BLOCKING-RELATIONSHIP-CONTEXT-REQUIRED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-BLOCKING-NO-RELATIONSHIP-INFERENCE",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-BLOCKING-NO-BLOCKER-INFERENCE",
        ),
    );

    assert.ok(
      result.explanation
        .unresolvedConditions
        .includes(
          "The Blocking Engine cannot deterministically certify that no blocking condition exists.",
        ),
    );
  },
);

test(
  "blocking guidance returns available only when no authorized blocking rule is satisfied",
  async () => {
    const {
      blockingEngine,
    } =
      await import(
        "../lib/guidance/blockingEngine"
      );

    const repositoryContext = {
      organizationId:
        "ORG-PHASE-11",

      caseId:
        "CASE-PHASE-11",

      workflowStatus:
        "COMPLETE",

      workflowStage:
        "COMPLETE",

      repositoryCount:
        0,

      repositoriesWithRecords: [],

      emptyRepositories: [],

      repositories: [],

      relationshipAvailability:
        "AVAILABLE",

      observedAt:
        FIXED_GENERATED_AT,
    } as any;

    const result =
      await blockingEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          repositoryContext,
          sourceReferences: [],
        },
      });

    assert.equal(
      result.status,
      "AVAILABLE",
    );

    assert.ok(
      result.payload,
    );

    assert.equal(
      result.payload
        ?.availability,
      "AVAILABLE",
    );

    assert.equal(
      result.payload
        ?.blocked,
      false,
    );

    assert.deepEqual(
      result.payload
        ?.blockingConditions,
      [],
    );

    assert.equal(
      result.payload
        ?.highestSeverity,
      null,
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-BLOCKING-NO-AUTHORIZED-BLOCKING-RULE-SATISFIED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-BLOCKING-NO-AUTOMATIC-RESOLUTION",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-BLOCKING-NO-AUTHORITY-CREATION",
        ),
    );
  },
);

test(
  "waiting-on guidance preserves explicit authoritative conditions and resolves one deterministic waiting party",
  async () => {
    const {
      waitingOnEngine,
    } =
      await import(
        "../lib/guidance/waitingOnEngine"
      );

    const repositoryContext = {
      organizationId:
        "ORG-PHASE-11",

      caseId:
        "CASE-PHASE-11",

      workflowStatus:
        "UNDER_REVIEW",

      workflowStage:
        "REVIEW_PENDING",

      repositoryCount:
        0,

      repositoriesWithRecords: [],

      emptyRepositories: [],

      repositories: [],

      relationshipAvailability:
        "UNRESOLVED",

      observedAt:
        FIXED_GENERATED_AT,
    } as any;

    const authoritativeCondition = {
      conditionId:
        "WAITING_ON_GOVERNANCE_REVIEW",

      title:
        "Waiting on Governance Review",

      description:
        "Governance review is pending.",

      state:
        "REVIEW_PENDING",

      waitingOn:
        "GOVERNANCE_REVIEWER",

      currentOwner:
        "GOVERNANCE_REVIEWER",

      relatedRepository:
        null,

      relatedStage:
        "REVIEW_PENDING",

      participantExplanation:
        "The case is awaiting authorized governance review.",
    } as any;

    const result =
      await waitingOnEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          repositoryContext,

          authoritativeConditions: [
            authoritativeCondition,
          ],

          sourceReferences: [],
        },
      });

    assert.equal(
      result.status,
      "WAITING",
    );

    assert.ok(
      result.payload,
    );

    assert.equal(
      result.payload
        ?.availability,
      "AVAILABLE",
    );

    assert.equal(
      result.payload
        ?.waiting,
      true,
    );

    assert.equal(
      result.payload
        ?.waitingOn,
      "GOVERNANCE_REVIEWER",
    );

    assert.equal(
      result.payload
        ?.currentOwner,
      "GOVERNANCE_REVIEWER",
    );

    assert.equal(
      result.payload
        ?.conditions[0],
      authoritativeCondition,
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-WAITING-ON-EXPLICIT-AUTHORITATIVE-CONDITIONS-PRESERVED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-WAITING-ON-SINGLE-WAITING-PARTY-REQUIRED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-WAITING-ON-NO-AUTOMATIC-REASSIGNMENT",
        ),
    );
  },
);

test(
  "waiting-on guidance fails closed while canonical relationship context is unresolved",
  async () => {
    const {
      waitingOnEngine,
    } =
      await import(
        "../lib/guidance/waitingOnEngine"
      );

    const repositoryContext = {
      organizationId:
        "ORG-PHASE-11",

      caseId:
        "CASE-PHASE-11",

      workflowStatus:
        "COMPLETE",

      workflowStage:
        "COMPLETE",

      repositoryCount:
        0,

      repositoriesWithRecords: [],

      emptyRepositories: [],

      repositories: [],

      relationshipAvailability:
        "UNRESOLVED",

      observedAt:
        FIXED_GENERATED_AT,
    } as any;

    const result =
      await waitingOnEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          repositoryContext,
          sourceReferences: [],
        },
      });

    assert.equal(
      result.status,
      "UNRESOLVED",
    );

    assert.ok(
      result.payload,
    );

    assert.equal(
      result.payload
        ?.availability,
      "UNRESOLVED",
    );

    assert.equal(
      result.payload
        ?.waiting,
      null,
    );

    assert.equal(
      result.payload
        ?.waitingOn,
      null,
    );

    assert.equal(
      result.payload
        ?.currentOwner,
      null,
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-WAITING-ON-RELATIONSHIP-CONTEXT-REQUIRED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-WAITING-ON-NO-RELATIONSHIP-INFERENCE",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-WAITING-ON-NO-WAITING-INFERENCE",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-WAITING-ON-NO-OWNER-INFERENCE",
        ),
    );

    assert.ok(
      result.explanation
        .unresolvedConditions
        .includes(
          "The Waiting-On Engine cannot deterministically certify one waiting party and current owner.",
        ),
    );
  },
);

test(
  "waiting-on guidance returns available only when no authorized waiting rule is satisfied",
  async () => {
    const {
      waitingOnEngine,
    } =
      await import(
        "../lib/guidance/waitingOnEngine"
      );

    const repositoryContext = {
      organizationId:
        "ORG-PHASE-11",

      caseId:
        "CASE-PHASE-11",

      workflowStatus:
        "COMPLETE",

      workflowStage:
        "COMPLETE",

      repositoryCount:
        0,

      repositoriesWithRecords: [],

      emptyRepositories: [],

      repositories: [],

      relationshipAvailability:
        "AVAILABLE",

      observedAt:
        FIXED_GENERATED_AT,
    } as any;

    const result =
      await waitingOnEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          repositoryContext,
          sourceReferences: [],
        },
      });

    assert.equal(
      result.status,
      "AVAILABLE",
    );

    assert.ok(
      result.payload,
    );

    assert.equal(
      result.payload
        ?.availability,
      "AVAILABLE",
    );

    assert.equal(
      result.payload
        ?.waiting,
      false,
    );

    assert.equal(
      result.payload
        ?.waitingOn,
      null,
    );

    assert.equal(
      result.payload
        ?.currentOwner,
      null,
    );

    assert.deepEqual(
      result.payload
        ?.conditions,
      [],
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-WAITING-ON-NO-AUTHORIZED-WAITING-RULE-SATISFIED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-WAITING-ON-NO-AUTOMATIC-REASSIGNMENT",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-WAITING-ON-NO-AUTHORITY-CREATION",
        ),
    );
  },
);

test(
  "operational summary preserves composite status, component state, and non-inferred completion boundaries",
  async () => {
    const {
      operationalSummaryEngine,
    } =
      await import(
        "../lib/guidance/operationalSummaryEngine"
      );

    const repositoryContext = {
      status:
        "AVAILABLE",

      payload: {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        workflowStatus:
          "UNDER_REVIEW",

        workflowStage:
          "EVIDENCE_REVIEW",

        repositoryCount:
          1,

        repositoriesWithRecords: [
          "EVIDENCE",
        ],

        emptyRepositories: [
          "CERTIFICATION",
        ],

        repositories: [],

        relationshipAvailability:
          "AVAILABLE",

        observedAt:
          FIXED_GENERATED_AT,
      },

      explanation: {
        summary:
          "Repository context is available.",

        ruleIds: [
          "OG-PHASE-11-REPOSITORY-RULE",
        ],

        facts: [],

        unresolvedConditions: [],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const nextAction = {
      status:
        "AVAILABLE",

      payload: {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        workflowStatus:
          "UNDER_REVIEW",

        workflowStage:
          "EVIDENCE_REVIEW",

        availability:
          "AVAILABLE",

        action: {
          actionId:
            "AWAIT_AUTHORIZED_REVIEW",

          title:
            "Await Authorized Review",

          description:
            "Await review by the authorized operational participant.",

          owner:
            "GAFAIG_OPERATIONS_REVIEWER",

          relatedStage:
            "EVIDENCE_REVIEW",

          relatedRepository:
            null,
        },

        blockingItems: [],

        waitingOn:
          "GAFAIG_OPERATIONS_REVIEWER",

        repositoryCount:
          1,

        repositoriesWithRecords: [
          "EVIDENCE",
        ],

        emptyRepositories: [
          "CERTIFICATION",
        ],

        relationshipAvailability:
          "AVAILABLE",

        observedAt:
          FIXED_GENERATED_AT,
      },

      explanation: {
        summary:
          "Next action is available.",

        ruleIds: [
          "OG-PHASE-11-NEXT-ACTION-RULE",
        ],

        facts: [],

        unresolvedConditions: [],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const blocking = {
      status:
        "AVAILABLE",

      payload: {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        workflowStatus:
          "UNDER_REVIEW",

        workflowStage:
          "EVIDENCE_REVIEW",

        availability:
          "AVAILABLE",

        blocked:
          false,

        blockingConditions: [],

        highestSeverity:
          null,

        relationshipAvailability:
          "AVAILABLE",

        observedAt:
          FIXED_GENERATED_AT,
      },

      explanation: {
        summary:
          "No blocking condition is active.",

        ruleIds: [
          "OG-PHASE-11-BLOCKING-RULE",
        ],

        facts: [],

        unresolvedConditions: [],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const waitingOn = {
      status:
        "WAITING",

      payload: {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        workflowStatus:
          "UNDER_REVIEW",

        workflowStage:
          "EVIDENCE_REVIEW",

        availability:
          "AVAILABLE",

        waiting:
          true,

        waitingOn:
          "GAFAIG_OPERATIONS_REVIEWER",

        currentOwner:
          "GAFAIG_OPERATIONS_REVIEWER",

        conditions: [],

        relationshipAvailability:
          "AVAILABLE",

        observedAt:
          FIXED_GENERATED_AT,
      },

      explanation: {
        summary:
          "Waiting on authorized review.",

        ruleIds: [
          "OG-PHASE-11-WAITING-RULE",
        ],

        facts: [],

        unresolvedConditions: [],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const components = {
      repositoryContext,
      nextAction,
      blocking,
      waitingOn,
    } as any;

    const composite = {
      status:
        "WAITING",

      payload: {
        organizationId:
          "ORG-PHASE-11",

        caseId:
          "CASE-PHASE-11",

        repositoryContext,
        nextAction,
        blocking,
        waitingOn,

        observedAt:
          FIXED_GENERATED_AT,
      },

      explanation: {
        summary:
          "Composite guidance is waiting.",

        ruleIds: [
          "OG-PHASE-11-COMPOSITE-RULE",
        ],

        facts: [],

        unresolvedConditions: [],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const result =
      await operationalSummaryEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          composite,
          components,
          sourceReferences: [],
        },
      });

    assert.equal(
      result.status,
      "WAITING",
    );

    assert.ok(
      result.payload,
    );

    assert.equal(
      result.payload
        ?.aggregatedStatus,
      "WAITING",
    );

    assert.equal(
      result.payload
        ?.currentStage,
      "EVIDENCE_REVIEW",
    );

    assert.equal(
      result.payload
        ?.currentOwner,
      "GAFAIG_OPERATIONS_REVIEWER",
    );

    assert.equal(
      result.payload
        ?.nextRequiredAction
        ?.actionId,
      "AWAIT_AUTHORIZED_REVIEW",
    );

    assert.equal(
      result.payload
        ?.completionSummary,
      null,
    );

    assert.equal(
      result.payload
        ?.transitionSummary,
      null,
    );

    assert.deepEqual(
      result.payload
        ?.explainabilityBasis
        .componentStatuses,
      {
        repositoryContext:
          "AVAILABLE",

        nextAction:
          "AVAILABLE",

        blocking:
          "AVAILABLE",

        waitingOn:
          "WAITING",

        composite:
          "WAITING",
      },
    );

    for (
      const ruleId of [
        "OG-PHASE-11-REPOSITORY-RULE",
        "OG-PHASE-11-NEXT-ACTION-RULE",
        "OG-PHASE-11-BLOCKING-RULE",
        "OG-PHASE-11-WAITING-RULE",
        "OG-PHASE-11-COMPOSITE-RULE",
      ]
    ) {
      assert.ok(
        result.payload
          ?.explainabilityBasis
          .appliedRuleIds
          .includes(ruleId),
      );
    }

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-OPERATIONAL-SUMMARY-NO-RESULT-RECOMPUTATION",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-OPERATIONAL-SUMMARY-NO-NEW-CONCLUSION",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-OPERATIONAL-SUMMARY-NO-WORKFLOW-MUTATION",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-OPERATIONAL-SUMMARY-NO-AUTHORITY-CREATION",
        ),
    );
  },
);

test(
  "operational summary fails closed when authoritative composite payload is unavailable",
  async () => {
    const {
      operationalSummaryEngine,
    } =
      await import(
        "../lib/guidance/operationalSummaryEngine"
      );

    const unavailableComposite = {
      status:
        "UNAVAILABLE",

      explanation: {
        summary:
          "Composite guidance is unavailable.",

        ruleIds: [],

        facts: [],

        unresolvedConditions: [
          "Composite dependency is unavailable.",
        ],
      },

      sourceReferences: [],

      metadata,
    } as any;

    const components = {
      repositoryContext:
        phase11CompositeResult(
          "AVAILABLE",
          phase11RepositoryPayload(),
        ),

      nextAction:
        phase11CompositeResult(
          "AVAILABLE",
        ),

      blocking:
        phase11CompositeResult(
          "AVAILABLE",
        ),

      waitingOn:
        phase11CompositeResult(
          "AVAILABLE",
        ),
    } as any;

    const result =
      await operationalSummaryEngine.execute({
        context:
          phase11CompositeContext(),

        input: {
          composite:
            unavailableComposite,

          components,

          sourceReferences: [],
        },
      });

    assert.equal(
      result.status,
      "UNRESOLVED",
    );

    assert.equal(
      result.failure?.code,
      "DEPENDENCY_FAILURE",
    );

    assert.equal(
      result.failure?.retryable,
      false,
    );

    assert.equal(
      result.payload,
      undefined,
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-OPERATIONAL-SUMMARY-COMPOSITE-INPUT-REQUIRED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-OPERATIONAL-SUMMARY-FAIL-CLOSED",
        ),
    );

    assert.ok(
      result.explanation
        .unresolvedConditions
        .includes(
          "No authoritative Composite Guidance payload is available.",
        ),
    );

    assert.ok(
      result.explanation
        .unresolvedConditions
        .includes(
          "Composite dependency is unavailable.",
        ),
    );
  },
);

test(
  "repository context guidance fails closed before source access when explicit case scope is missing",
  async () => {
    const {
      repositoryContextEngine,
    } =
      await import(
        "../lib/guidance/repositoryContextEngine"
      );

    const context = {
      ...phase11CompositeContext(),

      caseId:
        undefined,
    } as any;

    const result =
      await repositoryContextEngine.execute({
        context,

        input: {
          includeEmptyRepositories:
            true,
        },
      });

    assert.equal(
      result.status,
      "UNRESOLVED",
    );

    assert.equal(
      result.failure?.code,
      "CASE_SCOPE_INVALID",
    );

    assert.equal(
      result.failure?.retryable,
      false,
    );

    assert.equal(
      result.failure?.message,
      "Repository context requires an explicit case identifier.",
    );

    assert.equal(
      result.payload,
      undefined,
    );

    assert.deepEqual(
      result.sourceReferences,
      [],
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-REPOSITORY-CONTEXT-CASE-SCOPE-REQUIRED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-REPOSITORY-CONTEXT-ORGANIZATION-SCOPE-PRESERVED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-REPOSITORY-CONTEXT-AUTHORITATIVE-RECORDS-ONLY",
        ),
    );

    assert.ok(
      result.explanation
        .unresolvedConditions
        .includes(
          "Repository context requires an explicit case identifier.",
        ),
    );
  },
);

test(
  "repository context guidance rejects unrecognized runtime session before source access",
  async () => {
    const {
      repositoryContextEngine,
    } =
      await import(
        "../lib/guidance/repositoryContextEngine"
      );

    const context = {
      ...phase11CompositeContext(),

      session: {
        role:
          "PUBLIC",
      },
    } as any;

    const result =
      await repositoryContextEngine.execute({
        context,

        input: {
          includeEmptyRepositories:
            true,
        },
      });

    assert.equal(
      result.status,
      "NOT_VISIBLE",
    );

    assert.equal(
      result.failure?.code,
      "PARTICIPANT_SCOPE_INVALID",
    );

    assert.equal(
      result.failure?.retryable,
      false,
    );

    assert.equal(
      result.failure?.message,
      "Repository context requires a recognized applicant or administrative guidance session.",
    );

    assert.equal(
      result.payload,
      undefined,
    );

    assert.deepEqual(
      result.sourceReferences,
      [],
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-REPOSITORY-CONTEXT-CASE-SCOPE-REQUIRED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-REPOSITORY-CONTEXT-ORGANIZATION-SCOPE-PRESERVED",
        ),
    );

    assert.ok(
      result.explanation
        .ruleIds
        .includes(
          "OG-REPOSITORY-CONTEXT-AUTHORITATIVE-RECORDS-ONLY",
        ),
    );

    assert.ok(
      result.explanation
        .unresolvedConditions
        .includes(
          "Repository context requires a recognized applicant or administrative guidance session.",
        ),
    );
  },
);
