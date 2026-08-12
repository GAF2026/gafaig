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

export type WaitingOnAvailability =
  | "AVAILABLE"
  | "UNRESOLVED";

export type WaitingOnConditionId =
  | "WAITING_ON_APPLICANT_EVIDENCE"
  | "WAITING_ON_APPLICANT_INFORMATION_RESPONSE"
  | "WAITING_ON_APPLICANT_REMEDIATION"
  | "WAITING_ON_OPERATIONS_REVIEW"
  | "WAITING_ON_GOVERNANCE_REVIEW"
  | "WAITING_ON_CERTIFICATION_AUTHORITY"
  | "WAITING_ON_RELATIONSHIP_CONTEXT"
  | "WORKFLOW_STATE_UNRESOLVED"
  | "NO_WAITING_CONDITION_RESOLVED";

export type WaitingOnState =
  | "ACTION_REQUIRED"
  | "REVIEW_PENDING"
  | "PROCESSING_PENDING"
  | "EXTERNAL_DEPENDENCY"
  | "UNRESOLVED";

export interface WaitingOnCondition {
  readonly conditionId:
    WaitingOnConditionId;

  readonly title:
    string;

  readonly description:
    string;

  readonly state:
    WaitingOnState;

  readonly waitingOn:
    GuidanceParticipant;

  readonly currentOwner:
    GuidanceParticipant | null;

  readonly relatedRepository:
    GuidanceRepositoryName | null;

  readonly relatedStage:
    string | null;

  /**
   * Participant-visible explanation only.
   *
   * This field must not expose protected governance reasoning,
   * confidential reviewer notes, restricted findings, or internal
   * decision deliberations.
   */
  readonly participantExplanation:
    string;
}

export interface WaitingOnEngineInput {
  /**
   * Authoritative organization-scoped Repository Context produced by the
   * validated Repository Context engine.
   *
   * The Waiting-On Engine does not independently query Snowflake.
   */
  readonly repositoryContext?:
    RepositoryContextPayload;

  /**
   * Authoritative source references inherited from Repository Context.
   */
  readonly sourceReferences?:
    readonly GuidanceSourceReference[];

  /**
   * Reserved for later certified integration with Blocking Guidance.
   *
   * Phase 5A does not derive waiting state from inferred blockers.
   */
  readonly blockingConditions?:
    readonly {
      readonly conditionId:
        string;

      readonly responsibleParticipant:
        GuidanceParticipant | null;

      readonly relatedRepository:
        GuidanceRepositoryName | null;
    }[];

  /**
   * Explicit authoritative waiting conditions may be supplied by a
   * previously validated source.
   *
   * Phase 5A does not create, reinterpret, or clear these conditions.
   */
  readonly authoritativeConditions?:
    readonly WaitingOnCondition[];
}

export interface WaitingOnPayload {
  readonly organizationId:
    string;

  readonly caseId:
    string;

  readonly workflowStatus:
    string | null;

  readonly workflowStage:
    string | null;

  readonly availability:
    WaitingOnAvailability;

  readonly waiting:
    boolean | null;

  readonly waitingOn:
    GuidanceParticipant | null;

  readonly currentOwner:
    GuidanceParticipant | null;

  readonly conditions:
    readonly WaitingOnCondition[];

  readonly relationshipAvailability:
    RepositoryContextPayload["relationshipAvailability"];

  readonly observedAt:
    string;
}