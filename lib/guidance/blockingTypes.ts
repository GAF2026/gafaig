import type {
  GuidanceParticipant,
  GuidanceSourceReference,
} from "./types";

import type {
  GuidanceRepositoryName,
} from "./repositoryCatalog";

import type {
  RepositoryContextPayload,
} from "./repositoryContextEngine";

export type BlockingAvailability =
  | "AVAILABLE"
  | "UNRESOLVED";

export type BlockingConditionId =
  | "EVIDENCE_REQUIRED"
  | "INFORMATION_REQUEST_RESPONSE_REQUIRED"
  | "REMEDIATION_REQUIRED"
  | "REPOSITORY_CONTEXT_UNAVAILABLE"
  | "RELATIONSHIP_CONTEXT_UNRESOLVED"
  | "WORKFLOW_STATE_UNRESOLVED"
  | "NO_BLOCKING_CONDITION_RESOLVED";

export type BlockingSeverity =
  | "INFORMATIONAL"
  | "ACTION_REQUIRED"
  | "PROGRESSION_BLOCKED";

export interface BlockingCondition {
  readonly conditionId:
    BlockingConditionId;

  readonly title:
    string;

  readonly description:
    string;

  readonly severity:
    BlockingSeverity;

  readonly responsibleParticipant:
    GuidanceParticipant | null;

  readonly relatedRepository:
    GuidanceRepositoryName | null;

  readonly relatedStage:
    string | null;

  /**
   * Participant-visible explanation only.
   *
   * This field must never disclose protected governance reasoning,
   * internal reviewer notes, confidential findings, or restricted data.
   */
  readonly participantExplanation:
    string;
}

export interface BlockingEngineInput {
  /**
   * Authoritative, organization-scoped Repository Context produced by the
   * validated Repository Context engine.
   *
   * The Blocking Engine does not independently query Snowflake.
   */
  readonly repositoryContext?:
    RepositoryContextPayload;

  /**
   * Authoritative source references inherited from Repository Context.
   */
  readonly sourceReferences?:
    readonly GuidanceSourceReference[];

  /**
   * Reserved for later authorized blocker inputs.
   *
   * Phase 4A does not infer deficiencies, transition prerequisites,
   * information-request obligations, or remediation requirements.
   */
  readonly authoritativeConditions?:
    readonly BlockingCondition[];
}

export interface BlockingPayload {
  readonly organizationId:
    string;

  readonly caseId:
    string;

  readonly workflowStatus:
    string | null;

  readonly workflowStage:
    string | null;

  readonly availability:
    BlockingAvailability;

  readonly blocked:
    boolean | null;

  readonly blockingConditions:
    readonly BlockingCondition[];

  readonly highestSeverity:
    BlockingSeverity | null;

  readonly relationshipAvailability:
    RepositoryContextPayload["relationshipAvailability"];

  readonly observedAt:
    string;
}