import type {
  GuidanceParticipant,
} from "./types";

import type {
  GuidanceRepositoryName,
} from "./repositoryCatalog";

import type {
  RepositoryContextPayload,
} from "./repositoryContextEngine";

import {
  NEXT_ACTION_RULES,
  type NextActionRuleId,
} from "./nextActionRules";

import type {
  NextActionDefinition,
} from "./nextActionTypes";

export interface NextActionResolution {
  readonly action:
    NextActionDefinition | null;

  readonly blockingItems:
    readonly string[];

  readonly waitingOn:
    GuidanceParticipant | null;

  readonly facts:
    readonly string[];

  readonly ruleIds:
    readonly NextActionRuleId[];

  readonly unresolvedConditions:
    readonly string[];
}

function normalizedWorkflowValue(
  value: string | null,
): string {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replaceAll("-", "_")
    .replaceAll(" ", "_");
}

function containsAny(
  value: string,
  tokens: readonly string[],
): boolean {
  return tokens.some(
    (token) => value.includes(token),
  );
}

function repositoryRecordCount(
  context: RepositoryContextPayload,
  repository: GuidanceRepositoryName,
): number {
  return (
    context.repositories.find(
      (item) =>
        item.repository === repository,
    )?.recordCount ?? 0
  );
}

function applicantAction(input: {
  readonly actionId:
    NextActionDefinition["actionId"];

  readonly title: string;

  readonly description: string;

  readonly relatedStage: string | null;

  readonly relatedRepository:
    GuidanceRepositoryName | null;
}): NextActionDefinition {
  return {
    actionId:
      input.actionId,

    title:
      input.title,

    description:
      input.description,

    owner:
      "APPLICANT",

    relatedStage:
      input.relatedStage,

    relatedRepository:
      input.relatedRepository,
  };
}

function operationsAction(input: {
  readonly actionId:
    NextActionDefinition["actionId"];

  readonly title: string;

  readonly description: string;

  readonly relatedStage: string | null;

  readonly relatedRepository:
    GuidanceRepositoryName | null;
}): NextActionDefinition {
  return {
    actionId:
      input.actionId,

    title:
      input.title,

    description:
      input.description,

    owner:
      "GAFAIG_OPERATIONS_REVIEWER",

    relatedStage:
      input.relatedStage,

    relatedRepository:
      input.relatedRepository,
  };
}

/**
 * Resolves exactly one highest-priority operational action.
 *
 * Resolution uses only values already present in the authoritative,
 * organization-scoped Repository Context payload.
 *
 * The resolver does not:
 *
 * - query Snowflake;
 * - create workflow state;
 * - infer governance findings;
 * - infer repository relationships;
 * - infer blockers;
 * - infer waiting conditions from absent records.
 */
export function resolveDeterministicNextAction(
  context: RepositoryContextPayload,
): NextActionResolution {
  const workflowStatus =
    normalizedWorkflowValue(
      context.workflowStatus,
    );

  const workflowStage =
    normalizedWorkflowValue(
      context.workflowStage,
    );

  const combinedWorkflow =
    `${workflowStatus} ${workflowStage}`;

  const evidenceCount =
    repositoryRecordCount(
      context,
      "EVIDENCE",
    );

  const informationRequestCount =
    repositoryRecordCount(
      context,
      "INFORMATION_REQUEST",
    );

  const remediationCount =
    repositoryRecordCount(
      context,
      "REMEDIATION",
    );

  const certificationCount =
    repositoryRecordCount(
      context,
      "CERTIFICATION",
    );

  const commonFacts = [
    `Workflow status is ${context.workflowStatus ?? "unresolved"}.`,
    `Workflow stage is ${context.workflowStage ?? "unresolved"}.`,
    `Evidence repository record count is ${evidenceCount}.`,
    `Information Request repository record count is ${informationRequestCount}.`,
    `Remediation repository record count is ${remediationCount}.`,
    `Certification repository record count is ${certificationCount}.`,
  ];

  /*
   * Priority 1
   *
   * An authoritative workflow state explicitly identifying an information
   * request requires an applicant response when no visible response record
   * exists in the Information Request repository.
   */
  if (
    containsAny(
      combinedWorkflow,
      [
        "INFORMATION_REQUEST",
        "REQUEST_FOR_INFORMATION",
        "ADDITIONAL_INFORMATION",
        "APPLICANT_RESPONSE_REQUIRED",
      ],
    ) &&
    informationRequestCount === 0
  ) {
    return {
      action:
        applicantAction({
          actionId:
            "RESPOND_TO_INFORMATION_REQUEST",

          title:
            "Respond to Information Request",

          description:
            "Provide the requested information through the applicant Information Request repository.",

          relatedStage:
            context.workflowStage,

          relatedRepository:
            "INFORMATION_REQUEST",
        }),

      blockingItems:
        [],

      waitingOn:
        "APPLICANT",

      facts:
        commonFacts,

      ruleIds: [
        NEXT_ACTION_RULES
          .INFORMATION_REQUEST_RESPONSE_REQUIRED,

        NEXT_ACTION_RULES
          .FIRST_SATISFIED_RULE_WINS,

        NEXT_ACTION_RULES
          .SINGLE_ACTION_ONLY,
      ],

      unresolvedConditions:
        [],
    };
  }

  /*
   * Priority 2
   *
   * An authoritative deficiency or remediation state requires an applicant
   * remediation submission when no visible remediation record exists.
   */
  if (
    containsAny(
      combinedWorkflow,
      [
        "DEFICIENCY",
        "REMEDIATION_REQUIRED",
        "REMEDIATION_REQUESTED",
        "CORRECTIVE_ACTION_REQUIRED",
      ],
    ) &&
    remediationCount === 0
  ) {
    return {
      action:
        applicantAction({
          actionId:
            "SUBMIT_REMEDIATION",

          title:
            "Submit Remediation",

          description:
            "Submit the required remediation response through the applicant Remediation repository.",

          relatedStage:
            context.workflowStage,

          relatedRepository:
            "REMEDIATION",
        }),

      blockingItems:
        [],

      waitingOn:
        "APPLICANT",

      facts:
        commonFacts,

      ruleIds: [
        NEXT_ACTION_RULES
          .REMEDIATION_SUBMISSION_REQUIRED,

        NEXT_ACTION_RULES
          .FIRST_SATISFIED_RULE_WINS,

        NEXT_ACTION_RULES
          .SINGLE_ACTION_ONLY,
      ],

      unresolvedConditions:
        [],
    };
  }

  /*
   * Priority 3
   *
   * Evidence submission is recommended only where the authoritative workflow
   * vocabulary explicitly identifies intake or evidence collection and the
   * visible Evidence repository is empty.
   */
  if (
    containsAny(
      combinedWorkflow,
      [
        "EVIDENCE_REQUIRED",
        "EVIDENCE_COLLECTION",
        "EVIDENCE_SUBMISSION",
        "INTAKE_REVIEW",
        "APPLICATION_SUBMITTED",
      ],
    ) &&
    evidenceCount === 0
  ) {
    return {
      action:
        applicantAction({
          actionId:
            "SUBMIT_EVIDENCE",

          title:
            "Submit Evidence",

          description:
            "Upload the required supporting evidence through the applicant Evidence repository.",

          relatedStage:
            context.workflowStage,

          relatedRepository:
            "EVIDENCE",
        }),

      blockingItems:
        [],

      waitingOn:
        "APPLICANT",

      facts:
        commonFacts,

      ruleIds: [
        NEXT_ACTION_RULES
          .EVIDENCE_SUBMISSION_REQUIRED,

        NEXT_ACTION_RULES
          .FIRST_SATISFIED_RULE_WINS,

        NEXT_ACTION_RULES
          .SINGLE_ACTION_ONLY,
      ],

      unresolvedConditions:
        [],
    };
  }

  /*
   * Priority 4
   *
   * Approved or certified workflow state gives the applicant a deterministic
   * read-only action to review certification status. It does not represent a
   * new certification decision.
   */
  if (
    containsAny(
      combinedWorkflow,
      [
        "APPROVED",
        "CERTIFIED",
        "CERTIFICATION_ISSUED",
      ],
    )
  ) {
    return {
      action:
        applicantAction({
          actionId:
            "REVIEW_CERTIFICATION_STATUS",

          title:
            "Review Certification Status",

          description:
            certificationCount > 0
              ? "Review the visible certification record and current certification lifecycle status."
              : "Review the current certification status while certification records are prepared or made visible.",

          relatedStage:
            context.workflowStage,

          relatedRepository:
            "CERTIFICATION",
        }),

      blockingItems:
        [],

      waitingOn:
        certificationCount > 0
          ? null
          : "CERTIFICATION_AUTHORITY",

      facts:
        commonFacts,

      ruleIds: [
        NEXT_ACTION_RULES
          .APPROVED_STATUS_REVIEW,

        NEXT_ACTION_RULES
          .FIRST_SATISFIED_RULE_WINS,

        NEXT_ACTION_RULES
          .SINGLE_ACTION_ONLY,
      ],

      unresolvedConditions:
        [],
    };
  }

  /*
   * Priority 5
   *
   * Explicit review vocabulary or a submitted response/remediation record
   * indicates that the next applicant-visible action is to await authorized
   * operational review.
   */
  if (
    containsAny(
      combinedWorkflow,
      [
        "UNDER_REVIEW",
        "REVIEW_PENDING",
        "PENDING_REVIEW",
        "GOVERNANCE_REVIEW",
        "REMEDIATION_REVIEW",
        "EVIDENCE_REVIEW",
      ],
    ) ||
    informationRequestCount > 0 ||
    remediationCount > 0
  ) {
    return {
      action:
        operationsAction({
          actionId:
            "AWAIT_AUTHORIZED_REVIEW",

          title:
            "Await Authorized Review",

          description:
            "No additional applicant submission is deterministically required from the current repository context. Await review by the authorized operational participant.",

          relatedStage:
            context.workflowStage,

          relatedRepository:
            null,
        }),

      blockingItems:
        [],

      waitingOn:
        "GAFAIG_OPERATIONS_REVIEWER",

      facts:
        commonFacts,

      ruleIds: [
        NEXT_ACTION_RULES
          .AUTHORIZED_REVIEW_PENDING,

        NEXT_ACTION_RULES
          .FIRST_SATISFIED_RULE_WINS,

        NEXT_ACTION_RULES
          .SINGLE_ACTION_ONLY,
      ],

      unresolvedConditions:
        [],
    };
  }

  /*
   * Priority 6
   *
   * Relationship context is not inferred. When no earlier operational rule
   * applies and canonical relationship context remains unresolved, the engine
   * provides only an explicit waiting action.
   */
  if (
    context.relationshipAvailability ===
    "UNRESOLVED"
  ) {
    return {
      action:
        operationsAction({
          actionId:
            "AWAIT_RELATIONSHIP_CONTEXT",

          title:
            "Await Relationship Context",

          description:
            "Canonical repository relationship context remains unresolved. No more specific next action can be asserted from the currently available authoritative state.",

          relatedStage:
            context.workflowStage,

          relatedRepository:
            null,
        }),

      blockingItems: [
        "Canonical repository relationship context is unresolved.",
      ],

      waitingOn:
        "GAFAIG_OPERATIONS_REVIEWER",

      facts: [
        ...commonFacts,
        "Repository relationship availability is UNRESOLVED.",
      ],

      ruleIds: [
        NEXT_ACTION_RULES
          .RELATIONSHIP_CONTEXT_UNRESOLVED,

        NEXT_ACTION_RULES
          .NO_RELATIONSHIP_INFERENCE,

        NEXT_ACTION_RULES
          .FIRST_SATISFIED_RULE_WINS,

        NEXT_ACTION_RULES
          .SINGLE_ACTION_ONLY,
      ],

      unresolvedConditions: [
        "Canonical repository relationship context remains unresolved.",
      ],
    };
  }

  return {
    action:
      null,

    blockingItems:
      [],

    waitingOn:
      null,

    facts:
      commonFacts,

    ruleIds: [
      NEXT_ACTION_RULES
        .NO_AUTHORIZED_RULE_SATISFIED,

      NEXT_ACTION_RULES
        .DETERMINISTIC_PRIORITY_REQUIRED,
    ],

    unresolvedConditions: [
      "No authorized deterministic Next Action rule is satisfied by the current workflow and repository context.",
    ],
  };
}