import type {
  GuidanceExecutionTrace,
} from "./executor";

import type {
  RepositoryContextPayload,
} from "./repositoryContextEngine";

import type {
  NextActionPayload,
} from "./nextActionTypes";

import type {
  BlockingPayload,
} from "./blockingTypes";

import type {
  WaitingOnPayload,
} from "./waitingOnTypes";

import type {
  GuidanceResult,
  GuidanceSourceReference,
} from "./types";

export interface CompositeGuidanceEngineInput {
  readonly repositoryContext:
    GuidanceResult<RepositoryContextPayload>;

  readonly nextAction:
    GuidanceResult<NextActionPayload>;

  readonly blocking:
    GuidanceResult<BlockingPayload>;

  readonly waitingOn:
    GuidanceResult<WaitingOnPayload>;

  readonly sourceReferences?:
    readonly GuidanceSourceReference[];
}

export interface CompositeGuidanceComponents {
  readonly repositoryContext:
    GuidanceResult<RepositoryContextPayload>;

  readonly nextAction:
    GuidanceResult<NextActionPayload>;

  readonly blocking:
    GuidanceResult<BlockingPayload>;

  readonly waitingOn:
    GuidanceResult<WaitingOnPayload>;
}

export interface CompositeGuidancePayload {
  readonly organizationId:
    string;

  readonly caseId:
    string;

  readonly repositoryContext:
    GuidanceResult<RepositoryContextPayload>;

  readonly nextAction:
    GuidanceResult<NextActionPayload>;

  readonly blocking:
    GuidanceResult<BlockingPayload>;

  readonly waitingOn:
    GuidanceResult<WaitingOnPayload>;

  readonly observedAt:
    string;
}

export interface CompositeGuidanceTraces {
  readonly repositoryContext:
    GuidanceExecutionTrace;

  readonly nextAction:
    GuidanceExecutionTrace;

  readonly blocking:
    GuidanceExecutionTrace;

  readonly waitingOn:
    GuidanceExecutionTrace;

  readonly composite:
    GuidanceExecutionTrace;
}

export interface CompositeGuidanceExecution {
  /**
   * Component results are preserved independently from the Composite result.
   *
   * This ensures that dependency failures remain visible even when the
   * Composite Engine fails closed and cannot return a payload.
   */
  readonly components:
    CompositeGuidanceComponents;

  readonly result:
    GuidanceResult<CompositeGuidancePayload>;

  readonly traces:
    CompositeGuidanceTraces;
}