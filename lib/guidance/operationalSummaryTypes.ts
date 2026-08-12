import type {
  GuidanceExecutionTrace,
} from "./executor";

import type {
  CompositeGuidanceComponents,
  CompositeGuidancePayload,
} from "./compositeGuidanceTypes";

import type {
  NextActionDefinition,
} from "./nextActionTypes";

import type {
  GuidanceParticipant,
  GuidanceResult,
  GuidanceRuleId,
  GuidanceSourceReference,
} from "./types";

export interface OperationalSummaryRepositorySummary {
  readonly repositoryCount:
    number;

  readonly repositoriesWithRecords:
    readonly string[];

  readonly emptyRepositories:
    readonly string[];

  readonly relationshipAvailability:
    CompositeGuidancePayload[
      "repositoryContext"
    ]["payload"] extends infer TPayload
      ? TPayload extends {
          readonly relationshipAvailability:
            infer TAvailability;
        }
        ? TAvailability
        : "UNRESOLVED"
      : "UNRESOLVED";
}

export interface OperationalSummaryBlockingSummary {
  readonly status:
    CompositeGuidanceComponents[
      "blocking"
    ]["status"];

  readonly blocked:
    boolean | null;

  readonly conditionCount:
    number;

  readonly participantVisibleConditions:
    readonly string[];
}

export interface OperationalSummaryWaitingSummary {
  readonly status:
    CompositeGuidanceComponents[
      "waitingOn"
    ]["status"];

  readonly waiting:
    boolean | null;

  readonly waitingOn:
    GuidanceParticipant | null;

  readonly currentOwner:
    GuidanceParticipant | null;

  readonly conditionCount:
    number;

  readonly participantVisibleConditions:
    readonly string[];
}

export interface OperationalSummaryExplainabilityBasis {
  readonly componentStatuses: {
    readonly repositoryContext:
      CompositeGuidanceComponents[
        "repositoryContext"
      ]["status"];

    readonly nextAction:
      CompositeGuidanceComponents[
        "nextAction"
      ]["status"];

    readonly blocking:
      CompositeGuidanceComponents[
        "blocking"
      ]["status"];

    readonly waitingOn:
      CompositeGuidanceComponents[
        "waitingOn"
      ]["status"];

    readonly composite:
      GuidanceResult<
        CompositeGuidancePayload
      >["status"];
  };

  readonly appliedRuleIds:
    readonly GuidanceRuleId[];

  readonly sourceReferenceCount:
    number;
}

export interface OperationalSummaryEngineInput {
  /**
   * Already-resolved Composite Guidance result.
   *
   * The Operational Summary Engine must not execute Composite Guidance
   * or any dependency engine itself.
   */
  readonly composite:
    GuidanceResult<
      CompositeGuidancePayload
    >;

  /**
   * Preserved component results from the same Composite execution.
   */
  readonly components:
    CompositeGuidanceComponents;

  /**
   * Preserved authoritative source references.
   */
  readonly sourceReferences?:
    readonly GuidanceSourceReference[];
}

export interface OperationalSummaryPayload {
  readonly organizationId:
    string;

  readonly caseId:
    string;

  readonly aggregatedStatus:
    GuidanceResult["status"];

  readonly currentStage:
    string | null;

  readonly currentOwner:
    GuidanceParticipant | null;

  readonly nextRequiredAction:
    NextActionDefinition | null;

  readonly repositorySummary:
    OperationalSummaryRepositorySummary;

  readonly blockingSummary:
    OperationalSummaryBlockingSummary;

  readonly waitingSummary:
    OperationalSummaryWaitingSummary;

  /**
   * No independently certified Completion Engine output is present in the
   * current Phase 9A dependency set.
   *
   * This remains null rather than being inferred.
   */
  readonly completionSummary:
    null;

  /**
   * No independently certified Transition Engine output is present in the
   * current Phase 9A dependency set.
   *
   * This remains null rather than being inferred.
   */
  readonly transitionSummary:
    null;

  readonly unresolvedConditions:
    readonly string[];

  readonly participantSummary:
    string;

  readonly explainabilityBasis:
    OperationalSummaryExplainabilityBasis;

  readonly observedAt:
    string;
}

export interface OperationalSummaryExecution {
  readonly result:
    GuidanceResult<
      OperationalSummaryPayload
    >;

  readonly trace:
    GuidanceExecutionTrace;
}