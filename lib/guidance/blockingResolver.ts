import type {
  GuidanceRepositoryName,
} from "./repositoryCatalog";

import type {
  RepositoryContextPayload,
} from "./repositoryContextEngine";

import {
  BLOCKING_RULES,
  type BlockingRuleId,
} from "./blockingRules";

import type {
  BlockingCondition,
  BlockingEngineInput,
  BlockingSeverity,
} from "./blockingTypes";

export interface BlockingResolution {
  readonly availability:
    "AVAILABLE" | "UNRESOLVED";

  readonly blocked:
    boolean | null;

  readonly blockingConditions:
    readonly BlockingCondition[];

  readonly highestSeverity:
    BlockingSeverity | null;

  readonly facts:
    readonly string[];

  readonly ruleIds:
    readonly BlockingRuleId[];

  readonly unresolvedConditions:
    readonly string[];
}

function normalizeWorkflowValue(
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

function severityRank(
  severity: BlockingSeverity,
): number {
  switch (severity) {
    case "PROGRESSION_BLOCKED":
      return 3;

    case "ACTION_REQUIRED":
      return 2;

    case "INFORMATIONAL":
      return 1;

    default:
      return 0;
  }
}

function highestSeverity(
  conditions:
    readonly BlockingCondition[],
): BlockingSeverity | null {
  if (conditions.length === 0) {
    return null;
  }

  return conditions.reduce(
    (
      highest,
      condition,
    ) =>
      severityRank(
        condition.severity,
      ) >
      severityRank(highest)
        ? condition.severity
        : highest,
    conditions[0].severity,
  );
}

function sortBlockingConditions(
  conditions:
    readonly BlockingCondition[],
): readonly BlockingCondition[] {
  return [...conditions].sort(
    (left, right) =>
      severityRank(right.severity) -
      severityRank(left.severity),
  );
}

function commonFacts(
  context: RepositoryContextPayload,
): readonly string[] {
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

  return [
    `Workflow status is ${context.workflowStatus ?? "unresolved"}.`,
    `Workflow stage is ${context.workflowStage ?? "unresolved"}.`,
    `Evidence repository record count is ${evidenceCount}.`,
    `Information Request repository record count is ${informationRequestCount}.`,
    `Remediation repository record count is ${remediationCount}.`,
    `Relationship availability is ${context.relationshipAvailability}.`,
  ];
}

function informationRequestBlocker(
  context: RepositoryContextPayload,
): BlockingCondition {
  return {
    conditionId:
      "INFORMATION_REQUEST_RESPONSE_REQUIRED",

    title:
      "Information Request Response Required",

    description:
      "The current workflow requires an applicant response to an information request before progression can continue.",

    severity:
      "PROGRESSION_BLOCKED",

    responsibleParticipant:
      "APPLICANT",

    relatedRepository:
      "INFORMATION_REQUEST",

    relatedStage:
      context.workflowStage,

    participantExplanation:
      "Respond to the outstanding information request through the applicant Information Request repository.",
  };
}

function remediationBlocker(
  context: RepositoryContextPayload,
): BlockingCondition {
  return {
    conditionId:
      "REMEDIATION_REQUIRED",

    title:
      "Remediation Required",

    description:
      "The current workflow requires a remediation submission before progression can continue.",

    severity:
      "PROGRESSION_BLOCKED",

    responsibleParticipant:
      "APPLICANT",

    relatedRepository:
      "REMEDIATION",

    relatedStage:
      context.workflowStage,

    participantExplanation:
      "Submit the required remediation response through the applicant Remediation repository.",
  };
}

function evidenceBlocker(
  context: RepositoryContextPayload,
): BlockingCondition {
  return {
    conditionId:
      "EVIDENCE_REQUIRED",

    title:
      "Evidence Required",

    description:
      "The current workflow requires supporting evidence before progression can continue.",

    severity:
      "PROGRESSION_BLOCKED",

    responsibleParticipant:
      "APPLICANT",

    relatedRepository:
      "EVIDENCE",

    relatedStage:
      context.workflowStage,

    participantExplanation:
      "Upload the required supporting evidence through the applicant Evidence repository.",
  };
}

/**
 * Resolves participant-visible blocking conditions from authoritative
 * operational context.
 *
 * The resolver does not:
 *
 * - query Snowflake;
 * - infer protected governance reasoning;
 * - expose internal reviewer notes;
 * - clear blocking conditions;
 * - modify workflow state;
 * - create repository relationships;
 * - create constitutional or governance authority.
 */
export function resolveDeterministicBlocking(
  repositoryContext:
    RepositoryContextPayload,

  input:
    BlockingEngineInput,
): BlockingResolution {
  const workflowStatus =
    normalizeWorkflowValue(
      repositoryContext.workflowStatus,
    );

  const workflowStage =
    normalizeWorkflowValue(
      repositoryContext.workflowStage,
    );

  const combinedWorkflow =
    `${workflowStatus} ${workflowStage}`;

  const evidenceCount =
    repositoryRecordCount(
      repositoryContext,
      "EVIDENCE",
    );

  const informationRequestCount =
    repositoryRecordCount(
      repositoryContext,
      "INFORMATION_REQUEST",
    );

  const remediationCount =
    repositoryRecordCount(
      repositoryContext,
      "REMEDIATION",
    );

  const facts =
    commonFacts(repositoryContext);

  /*
   * Priority 1 — Explicit authoritative conditions
   *
   * Explicitly supplied conditions are consumed as authoritative inputs.
   * They are not expanded, reinterpreted, or automatically cleared.
   */
  if (
    input.authoritativeConditions &&
    input.authoritativeConditions.length > 0
  ) {
    const conditions =
      sortBlockingConditions(
        input.authoritativeConditions,
      );

    return {
      availability:
        "AVAILABLE",

      blocked:
        conditions.some(
          (condition) =>
            condition.severity ===
              "PROGRESSION_BLOCKED" ||
            condition.severity ===
              "ACTION_REQUIRED",
        ),

      blockingConditions:
        conditions,

      highestSeverity:
        highestSeverity(conditions),

      facts: [
        ...facts,
        `${conditions.length} explicit authoritative blocking conditions were supplied.`,
      ],

      ruleIds: [
        BLOCKING_RULES
          .EXPLICIT_AUTHORITATIVE_CONDITIONS_PRESERVED,

        BLOCKING_RULES
          .DETERMINISTIC_PRIORITY_REQUIRED,

        BLOCKING_RULES
          .NO_AUTOMATIC_RESOLUTION,
      ],

      unresolvedConditions:
        [],
    };
  }

  /*
   * Priority 2 — Missing authoritative workflow state
   */
  if (
    !workflowStatus &&
    !workflowStage
  ) {
    return {
      availability:
        "UNRESOLVED",

      blocked:
        null,

      blockingConditions:
        [],

      highestSeverity:
        null,

      facts,

      ruleIds: [
        BLOCKING_RULES
          .WORKFLOW_STATE_REQUIRED,

        BLOCKING_RULES
          .AUTHORITATIVE_CONTEXT_REQUIRED,
      ],

      unresolvedConditions: [
        "Authoritative workflow status and workflow stage are unavailable.",
      ],
    };
  }

  /*
   * Priority 3 — Information Request response required
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
    const condition =
      informationRequestBlocker(
        repositoryContext,
      );

    return {
      availability:
        "AVAILABLE",

      blocked:
        true,

      blockingConditions: [
        condition,
      ],

      highestSeverity:
        condition.severity,

      facts,

      ruleIds: [
        BLOCKING_RULES
          .INFORMATION_REQUEST_RESPONSE_BLOCKS_PROGRESSION,

        BLOCKING_RULES
          .FIRST_SATISFIED_RULE_WINS,

        BLOCKING_RULES
          .PARTICIPANT_VISIBLE_EXPLANATION_REQUIRED,
      ],

      unresolvedConditions:
        [],
    };
  }

  /*
   * Priority 4 — Remediation required
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
    const condition =
      remediationBlocker(
        repositoryContext,
      );

    return {
      availability:
        "AVAILABLE",

      blocked:
        true,

      blockingConditions: [
        condition,
      ],

      highestSeverity:
        condition.severity,

      facts,

      ruleIds: [
        BLOCKING_RULES
          .REMEDIATION_REQUIRED_BLOCKS_PROGRESSION,

        BLOCKING_RULES
          .FIRST_SATISFIED_RULE_WINS,

        BLOCKING_RULES
          .PARTICIPANT_VISIBLE_EXPLANATION_REQUIRED,
      ],

      unresolvedConditions:
        [],
    };
  }

  /*
   * Priority 5 — Evidence required
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
    const condition =
      evidenceBlocker(
        repositoryContext,
      );

    return {
      availability:
        "AVAILABLE",

      blocked:
        true,

      blockingConditions: [
        condition,
      ],

      highestSeverity:
        condition.severity,

      facts,

      ruleIds: [
        BLOCKING_RULES
          .EVIDENCE_REQUIRED_BLOCKS_PROGRESSION,

        BLOCKING_RULES
          .FIRST_SATISFIED_RULE_WINS,

        BLOCKING_RULES
          .PARTICIPANT_VISIBLE_EXPLANATION_REQUIRED,
      ],

      unresolvedConditions:
        [],
    };
  }

  /*
   * Priority 6 — Relationship context unresolved
   *
   * The engine does not claim that no blocker exists while canonical
   * relationship context remains unresolved. It therefore fails closed
   * rather than returning blocked=false.
   */
  if (
    repositoryContext
      .relationshipAvailability ===
    "UNRESOLVED"
  ) {
    return {
      availability:
        "UNRESOLVED",

      blocked:
        null,

      blockingConditions:
        [],

      highestSeverity:
        null,

      facts,

      ruleIds: [
        BLOCKING_RULES
          .RELATIONSHIP_CONTEXT_REQUIRED,

        BLOCKING_RULES
          .NO_RELATIONSHIP_INFERENCE,

        BLOCKING_RULES
          .NO_BLOCKER_INFERENCE,
      ],

      unresolvedConditions: [
        "Canonical repository relationship context remains unresolved.",
        "The Blocking Engine cannot deterministically certify that no blocking condition exists.",
      ],
    };
  }

  /*
   * No authorized blocking rule was satisfied and the required
   * authoritative context is complete.
   */
  return {
    availability:
      "AVAILABLE",

    blocked:
      false,

    blockingConditions:
      [],

    highestSeverity:
      null,

    facts,

    ruleIds: [
      BLOCKING_RULES
        .NO_AUTHORIZED_BLOCKING_RULE_SATISFIED,

      BLOCKING_RULES
        .DETERMINISTIC_PRIORITY_REQUIRED,

      BLOCKING_RULES
        .NO_AUTOMATIC_RESOLUTION,
    ],

    unresolvedConditions:
      [],
  };
}