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
  WAITING_ON_RULES,
  type WaitingOnRuleId,
} from "./waitingOnRules";

import type {
  WaitingOnCondition,
  WaitingOnEngineInput,
} from "./waitingOnTypes";

export interface WaitingOnResolution {
  readonly availability:
    "AVAILABLE" | "UNRESOLVED";

  readonly waiting:
    boolean | null;

  readonly waitingOn:
    GuidanceParticipant | null;

  readonly currentOwner:
    GuidanceParticipant | null;

  readonly conditions:
    readonly WaitingOnCondition[];

  readonly facts:
    readonly string[];

  readonly ruleIds:
    readonly WaitingOnRuleId[];

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

function commonFacts(
  context: RepositoryContextPayload,
): readonly string[] {
  return [
    `Workflow status is ${context.workflowStatus ?? "unresolved"}.`,
    `Workflow stage is ${context.workflowStage ?? "unresolved"}.`,
    `Evidence repository record count is ${repositoryRecordCount(context, "EVIDENCE")}.`,
    `Information Request repository record count is ${repositoryRecordCount(context, "INFORMATION_REQUEST")}.`,
    `Remediation repository record count is ${repositoryRecordCount(context, "REMEDIATION")}.`,
    `Certification repository record count is ${repositoryRecordCount(context, "CERTIFICATION")}.`,
    `Relationship availability is ${context.relationshipAvailability}.`,
  ];
}

function applicantCondition(input: {
  readonly conditionId:
    WaitingOnCondition["conditionId"];

  readonly title:
    string;

  readonly description:
    string;

  readonly relatedRepository:
    GuidanceRepositoryName | null;

  readonly relatedStage:
    string | null;

  readonly participantExplanation:
    string;
}): WaitingOnCondition {
  return {
    conditionId:
      input.conditionId,

    title:
      input.title,

    description:
      input.description,

    state:
      "ACTION_REQUIRED",

    waitingOn:
      "APPLICANT",

    currentOwner:
      "APPLICANT",

    relatedRepository:
      input.relatedRepository,

    relatedStage:
      input.relatedStage,

    participantExplanation:
      input.participantExplanation,
  };
}

function reviewCondition(input: {
  readonly conditionId:
    WaitingOnCondition["conditionId"];

  readonly title:
    string;

  readonly description:
    string;

  readonly waitingOn:
    GuidanceParticipant;

  readonly relatedRepository:
    GuidanceRepositoryName | null;

  readonly relatedStage:
    string | null;

  readonly participantExplanation:
    string;
}): WaitingOnCondition {
  return {
    conditionId:
      input.conditionId,

    title:
      input.title,

    description:
      input.description,

    state:
      "REVIEW_PENDING",

    waitingOn:
      input.waitingOn,

    currentOwner:
      input.waitingOn,

    relatedRepository:
      input.relatedRepository,

    relatedStage:
      input.relatedStage,

    participantExplanation:
      input.participantExplanation,
  };
}

function explicitConditionResolution(
  conditions:
    readonly WaitingOnCondition[],

  facts:
    readonly string[],
): WaitingOnResolution {
  const firstCondition =
    conditions[0];

  const sameWaitingParty =
    conditions.every(
      (condition) =>
        condition.waitingOn ===
        firstCondition.waitingOn,
    );

  const sameOwner =
    conditions.every(
      (condition) =>
        condition.currentOwner ===
        firstCondition.currentOwner,
    );

  if (
    !sameWaitingParty ||
    !sameOwner
  ) {
    return {
      availability:
        "UNRESOLVED",

      waiting:
        null,

      waitingOn:
        null,

      currentOwner:
        null,

      conditions,

      facts: [
        ...facts,
        `${conditions.length} explicit authoritative waiting conditions were supplied.`,
      ],

      ruleIds: [
        WAITING_ON_RULES
          .EXPLICIT_AUTHORITATIVE_CONDITIONS_PRESERVED,

        WAITING_ON_RULES
          .SINGLE_WAITING_PARTY_REQUIRED,

        WAITING_ON_RULES
          .DETERMINISTIC_PRIORITY_REQUIRED,
      ],

      unresolvedConditions: [
        "The explicit authoritative conditions identify more than one waiting party or current owner.",
      ],
    };
  }

  return {
    availability:
      "AVAILABLE",

    waiting:
      true,

    waitingOn:
      firstCondition.waitingOn,

    currentOwner:
      firstCondition.currentOwner,

    conditions,

    facts: [
      ...facts,
      `${conditions.length} explicit authoritative waiting conditions were supplied.`,
    ],

    ruleIds: [
      WAITING_ON_RULES
        .EXPLICIT_AUTHORITATIVE_CONDITIONS_PRESERVED,

      WAITING_ON_RULES
        .SINGLE_WAITING_PARTY_REQUIRED,

      WAITING_ON_RULES
        .DETERMINISTIC_PRIORITY_REQUIRED,

      WAITING_ON_RULES
        .NO_AUTOMATIC_REASSIGNMENT,
    ],

    unresolvedConditions:
      [],
  };
}

/**
 * Resolves one deterministic waiting party and current owner.
 *
 * The resolver does not:
 *
 * - query Snowflake;
 * - infer protected governance reasoning;
 * - expose confidential reviewer notes;
 * - assign or reassign workflow ownership;
 * - create or clear waiting conditions;
 * - mutate workflow state;
 * - infer repository relationships;
 * - create constitutional or governance authority.
 */
export function resolveDeterministicWaitingOn(
  repositoryContext:
    RepositoryContextPayload,

  input:
    WaitingOnEngineInput,
): WaitingOnResolution {
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

  const certificationCount =
    repositoryRecordCount(
      repositoryContext,
      "CERTIFICATION",
    );

  const facts =
    commonFacts(repositoryContext);

  /*
   * Priority 1 — Explicit authoritative waiting conditions
   */
  if (
    input.authoritativeConditions &&
    input.authoritativeConditions.length > 0
  ) {
    return explicitConditionResolution(
      input.authoritativeConditions,
      facts,
    );
  }

  /*
   * Priority 2 — Certified Blocking conditions
   *
   * A blocking condition with one responsible participant may be consumed
   * without reinterpreting the blocker.
   */
  if (
    input.blockingConditions &&
    input.blockingConditions.length > 0
  ) {
    const responsibleParticipants =
      input.blockingConditions
        .map(
          (condition) =>
            condition.responsibleParticipant,
        )
        .filter(
          (
            participant,
          ): participant is GuidanceParticipant =>
            participant !== null,
        );

    const uniqueParticipants =
      Array.from(
        new Set(
          responsibleParticipants,
        ),
      );

    if (uniqueParticipants.length === 1) {
      const waitingOn =
        uniqueParticipants[0];

      const condition: WaitingOnCondition = {
        conditionId:
          waitingOn === "APPLICANT"
            ? "WAITING_ON_APPLICANT_EVIDENCE"
            : "WAITING_ON_OPERATIONS_REVIEW",

        title:
          waitingOn === "APPLICANT"
            ? "Applicant Action Required"
            : "Authorized Review Required",

        description:
          "A certified blocking condition identifies the participant whose action is required before progression can continue.",

        state:
          waitingOn === "APPLICANT"
            ? "ACTION_REQUIRED"
            : "REVIEW_PENDING",

        waitingOn,

        currentOwner:
          waitingOn,

        relatedRepository:
          input.blockingConditions[0]
            .relatedRepository,

        relatedStage:
          repositoryContext.workflowStage,

        participantExplanation:
          waitingOn === "APPLICANT"
            ? "Applicant action is required before the case can progress."
            : "The case is awaiting action by the authorized operational participant.",
      };

      return {
        availability:
          "AVAILABLE",

        waiting:
          true,

        waitingOn,

        currentOwner:
          waitingOn,

        conditions: [
          condition,
        ],

        facts: [
          ...facts,
          `${input.blockingConditions.length} certified blocking conditions were supplied.`,
        ],

        ruleIds: [
          WAITING_ON_RULES
            .CERTIFIED_BLOCKING_PARTICIPANT_PRESERVED,

          WAITING_ON_RULES
            .SINGLE_WAITING_PARTY_REQUIRED,

          WAITING_ON_RULES
            .FIRST_SATISFIED_RULE_WINS,

          WAITING_ON_RULES
            .NO_AUTOMATIC_REASSIGNMENT,
        ],

        unresolvedConditions:
          [],
      };
    }

    return {
      availability:
        "UNRESOLVED",

      waiting:
        null,

      waitingOn:
        null,

      currentOwner:
        null,

      conditions:
        [],

      facts: [
        ...facts,
        `${input.blockingConditions.length} certified blocking conditions were supplied.`,
      ],

      ruleIds: [
        WAITING_ON_RULES
          .CERTIFIED_BLOCKING_PARTICIPANT_PRESERVED,

        WAITING_ON_RULES
          .SINGLE_WAITING_PARTY_REQUIRED,

        WAITING_ON_RULES
          .DETERMINISTIC_PRIORITY_REQUIRED,
      ],

      unresolvedConditions: [
        "The supplied blocking conditions do not identify exactly one responsible participant.",
      ],
    };
  }

  /*
   * Priority 3 — Missing authoritative workflow state
   */
  if (
    !workflowStatus &&
    !workflowStage
  ) {
    return {
      availability:
        "UNRESOLVED",

      waiting:
        null,

      waitingOn:
        null,

      currentOwner:
        null,

      conditions:
        [],

      facts,

      ruleIds: [
        WAITING_ON_RULES
          .WORKFLOW_STATE_REQUIRED,

        WAITING_ON_RULES
          .AUTHORITATIVE_CONTEXT_REQUIRED,
      ],

      unresolvedConditions: [
        "Authoritative workflow status and workflow stage are unavailable.",
      ],
    };
  }

  /*
   * Priority 4 — Applicant information response
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
      applicantCondition({
        conditionId:
          "WAITING_ON_APPLICANT_INFORMATION_RESPONSE",

        title:
          "Waiting on Applicant Information Response",

        description:
          "The current workflow requires an applicant response to an information request.",

        relatedRepository:
          "INFORMATION_REQUEST",

        relatedStage:
          repositoryContext.workflowStage,

        participantExplanation:
          "Respond to the outstanding information request through the applicant Information Request repository.",
      });

    return {
      availability:
        "AVAILABLE",

      waiting:
        true,

      waitingOn:
        condition.waitingOn,

      currentOwner:
        condition.currentOwner,

      conditions: [
        condition,
      ],

      facts,

      ruleIds: [
        WAITING_ON_RULES
          .APPLICANT_INFORMATION_RESPONSE_REQUIRED,

        WAITING_ON_RULES
          .FIRST_SATISFIED_RULE_WINS,

        WAITING_ON_RULES
          .SINGLE_WAITING_PARTY_REQUIRED,

        WAITING_ON_RULES
          .PARTICIPANT_VISIBLE_EXPLANATION_REQUIRED,
      ],

      unresolvedConditions:
        [],
    };
  }

  /*
   * Priority 5 — Applicant remediation
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
      applicantCondition({
        conditionId:
          "WAITING_ON_APPLICANT_REMEDIATION",

        title:
          "Waiting on Applicant Remediation",

        description:
          "The current workflow requires an applicant remediation submission.",

        relatedRepository:
          "REMEDIATION",

        relatedStage:
          repositoryContext.workflowStage,

        participantExplanation:
          "Submit the required remediation response through the applicant Remediation repository.",
      });

    return {
      availability:
        "AVAILABLE",

      waiting:
        true,

      waitingOn:
        condition.waitingOn,

      currentOwner:
        condition.currentOwner,

      conditions: [
        condition,
      ],

      facts,

      ruleIds: [
        WAITING_ON_RULES
          .APPLICANT_REMEDIATION_REQUIRED,

        WAITING_ON_RULES
          .FIRST_SATISFIED_RULE_WINS,

        WAITING_ON_RULES
          .SINGLE_WAITING_PARTY_REQUIRED,

        WAITING_ON_RULES
          .PARTICIPANT_VISIBLE_EXPLANATION_REQUIRED,
      ],

      unresolvedConditions:
        [],
    };
  }

  /*
   * Priority 6 — Applicant evidence
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
      applicantCondition({
        conditionId:
          "WAITING_ON_APPLICANT_EVIDENCE",

        title:
          "Waiting on Applicant Evidence",

        description:
          "The current workflow requires an applicant evidence submission.",

        relatedRepository:
          "EVIDENCE",

        relatedStage:
          repositoryContext.workflowStage,

        participantExplanation:
          "Upload the required supporting evidence through the applicant Evidence repository.",
      });

    return {
      availability:
        "AVAILABLE",

      waiting:
        true,

      waitingOn:
        condition.waitingOn,

      currentOwner:
        condition.currentOwner,

      conditions: [
        condition,
      ],

      facts,

      ruleIds: [
        WAITING_ON_RULES
          .APPLICANT_EVIDENCE_REQUIRED,

        WAITING_ON_RULES
          .FIRST_SATISFIED_RULE_WINS,

        WAITING_ON_RULES
          .SINGLE_WAITING_PARTY_REQUIRED,

        WAITING_ON_RULES
          .PARTICIPANT_VISIBLE_EXPLANATION_REQUIRED,
      ],

      unresolvedConditions:
        [],
    };
  }

  /*
   * Priority 7 — Governance review
   */
  if (
    containsAny(
      combinedWorkflow,
      [
        "GOVERNANCE_REVIEW",
        "GOVERNANCE_PENDING",
        "AWAITING_GOVERNANCE",
      ],
    )
  ) {
    const condition =
      reviewCondition({
        conditionId:
          "WAITING_ON_GOVERNANCE_REVIEW",

        title:
          "Waiting on Governance Review",

        description:
          "The authoritative workflow state indicates that governance review is pending.",

        waitingOn:
          "GOVERNANCE_REVIEWER",

        relatedRepository:
          null,

        relatedStage:
          repositoryContext.workflowStage,

        participantExplanation:
          "No additional applicant action is currently identified. The case is awaiting authorized governance review.",
      });

    return {
      availability:
        "AVAILABLE",

      waiting:
        true,

      waitingOn:
        condition.waitingOn,

      currentOwner:
        condition.currentOwner,

      conditions: [
        condition,
      ],

      facts,

      ruleIds: [
        WAITING_ON_RULES
          .GOVERNANCE_REVIEW_PENDING,

        WAITING_ON_RULES
          .FIRST_SATISFIED_RULE_WINS,

        WAITING_ON_RULES
          .SINGLE_WAITING_PARTY_REQUIRED,
      ],

      unresolvedConditions:
        [],
    };
  }

  /*
   * Priority 8 — Certification Authority
   */
  if (
    containsAny(
      combinedWorkflow,
      [
        "CERTIFICATION_PENDING",
        "AWAITING_CERTIFICATION",
        "CERTIFICATION_REVIEW",
      ],
    ) ||
    (
      containsAny(
        combinedWorkflow,
        [
          "APPROVED",
          "DECISION_APPROVED",
        ],
      ) &&
      certificationCount === 0
    )
  ) {
    const condition =
      reviewCondition({
        conditionId:
          "WAITING_ON_CERTIFICATION_AUTHORITY",

        title:
          "Waiting on Certification Authority",

        description:
          "The authoritative workflow state indicates that certification processing or review is pending.",

        waitingOn:
          "CERTIFICATION_AUTHORITY",

        relatedRepository:
          "CERTIFICATION",

        relatedStage:
          repositoryContext.workflowStage,

        participantExplanation:
          "No additional applicant action is currently identified. The case is awaiting authorized certification processing.",
      });

    return {
      availability:
        "AVAILABLE",

      waiting:
        true,

      waitingOn:
        condition.waitingOn,

      currentOwner:
        condition.currentOwner,

      conditions: [
        condition,
      ],

      facts,

      ruleIds: [
        WAITING_ON_RULES
          .CERTIFICATION_AUTHORITY_PENDING,

        WAITING_ON_RULES
          .FIRST_SATISFIED_RULE_WINS,

        WAITING_ON_RULES
          .SINGLE_WAITING_PARTY_REQUIRED,
      ],

      unresolvedConditions:
        [],
    };
  }

  /*
   * Priority 9 — Operations review
   */
  if (
    containsAny(
      combinedWorkflow,
      [
        "UNDER_REVIEW",
        "REVIEW_PENDING",
        "PENDING_REVIEW",
        "EVIDENCE_REVIEW",
        "REMEDIATION_REVIEW",
        "INTAKE_REVIEW",
      ],
    ) ||
    informationRequestCount > 0 ||
    remediationCount > 0
  ) {
    const condition =
      reviewCondition({
        conditionId:
          "WAITING_ON_OPERATIONS_REVIEW",

        title:
          "Waiting on Operations Review",

        description:
          "The authoritative workflow and repository state indicate that operational review is pending.",

        waitingOn:
          "GAFAIG_OPERATIONS_REVIEWER",

        relatedRepository:
          null,

        relatedStage:
          repositoryContext.workflowStage,

        participantExplanation:
          "No additional applicant action is currently identified. The case is awaiting authorized operational review.",
      });

    return {
      availability:
        "AVAILABLE",

      waiting:
        true,

      waitingOn:
        condition.waitingOn,

      currentOwner:
        condition.currentOwner,

      conditions: [
        condition,
      ],

      facts,

      ruleIds: [
        WAITING_ON_RULES
          .OPERATIONS_REVIEW_PENDING,

        WAITING_ON_RULES
          .FIRST_SATISFIED_RULE_WINS,

        WAITING_ON_RULES
          .SINGLE_WAITING_PARTY_REQUIRED,
      ],

      unresolvedConditions:
        [],
    };
  }

  /*
   * Priority 10 — Relationship context unresolved
   */
  if (
    repositoryContext
      .relationshipAvailability ===
    "UNRESOLVED"
  ) {
    const condition: WaitingOnCondition = {
      conditionId:
        "WAITING_ON_RELATIONSHIP_CONTEXT",

      title:
        "Waiting on Relationship Context",

      description:
        "Canonical repository relationship context remains unresolved.",

      state:
        "EXTERNAL_DEPENDENCY",

      waitingOn:
        "GAFAIG_OPERATIONS_REVIEWER",

      currentOwner:
        null,

      relatedRepository:
        null,

      relatedStage:
        repositoryContext.workflowStage,

      participantExplanation:
        "No more specific waiting party can be asserted until canonical repository relationship context is available.",
    };

    return {
      availability:
        "UNRESOLVED",

      waiting:
        null,

      waitingOn:
        null,

      currentOwner:
        null,

      conditions: [
        condition,
      ],

      facts,

      ruleIds: [
        WAITING_ON_RULES
          .RELATIONSHIP_CONTEXT_REQUIRED,

        WAITING_ON_RULES
          .NO_RELATIONSHIP_INFERENCE,

        WAITING_ON_RULES
          .NO_WAITING_INFERENCE,

        WAITING_ON_RULES
          .NO_OWNER_INFERENCE,
      ],

      unresolvedConditions: [
        "Canonical repository relationship context remains unresolved.",
        "The Waiting-On Engine cannot deterministically certify one waiting party and current owner.",
      ],
    };
  }

  return {
    availability:
      "AVAILABLE",

    waiting:
      false,

    waitingOn:
      null,

    currentOwner:
      null,

    conditions:
      [],

    facts,

    ruleIds: [
      WAITING_ON_RULES
        .NO_AUTHORIZED_WAITING_RULE_SATISFIED,

      WAITING_ON_RULES
        .DETERMINISTIC_PRIORITY_REQUIRED,

      WAITING_ON_RULES
        .NO_AUTOMATIC_REASSIGNMENT,
    ],

    unresolvedConditions:
      [],
  };
}