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

export type NextActionAvailability =
  | "AVAILABLE"
  | "UNRESOLVED";

export type NextActionId =
  | "SUBMIT_EVIDENCE"
  | "SUBMIT_ARTIFACT"
  | "RESPOND_TO_INFORMATION_REQUEST"
  | "REVIEW_INFORMATION_REQUEST_RESPONSE"
  | "SUBMIT_REMEDIATION"
  | "REVIEW_REMEDIATION"
  | "REVIEW_CASE"
  | "REVIEW_DECISION_STATUS"
  | "REVIEW_CERTIFICATION_STATUS"
  | "AWAIT_AUTHORIZED_REVIEW"
  | "AWAIT_RELATIONSHIP_CONTEXT"
  | "NO_ACTION_RESOLVED";

export interface NextActionDefinition {
  readonly actionId: NextActionId;
  readonly title: string;
  readonly description: string;
  readonly owner: GuidanceParticipant;
  readonly relatedStage: string | null;
  readonly relatedRepository:
    GuidanceRepositoryName | null;
}

export interface NextActionDependencyContext {
  readonly blockingItems:
    readonly string[];
  readonly waitingOn:
    GuidanceParticipant | null;
  readonly unresolvedConditions:
    readonly string[];
}

export interface NextActionEngineInput {
  /**
   * Repository Context Guidance is the authoritative Phase 3A input.
   *
   * The Next Action Engine does not independently query Snowflake or
   * reinterpret repository records.
   */
  readonly repositoryContext?:
    RepositoryContextPayload;

  /**
   * Authoritative source references inherited from the validated
   * Repository Context execution.
   */
  readonly sourceReferences?:
    readonly GuidanceSourceReference[];

  /**
   * Reserved dependency context for later authorized engines.
   *
   * Phase 3A does not infer blocking or waiting conditions.
   */
  readonly dependencies?:
    NextActionDependencyContext;
}

export interface NextActionPayload {
  readonly organizationId: string;
  readonly caseId: string;
  readonly workflowStatus: string | null;
  readonly workflowStage: string | null;

  readonly availability:
    NextActionAvailability;

  readonly action:
    NextActionDefinition | null;

  readonly blockingItems:
    readonly string[];

  readonly waitingOn:
    GuidanceParticipant | null;

  readonly repositoryCount: number;

  readonly repositoriesWithRecords:
    readonly GuidanceRepositoryName[];

  readonly emptyRepositories:
    readonly GuidanceRepositoryName[];

  readonly relationshipAvailability:
    RepositoryContextPayload["relationshipAvailability"];

  readonly observedAt: string;
}