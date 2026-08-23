import assert from "node:assert/strict";
import test from "node:test";

import {
  buildWorkspaceGuidanceSnapshot,
} from "../lib/guidance/workspaceGuidance";

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