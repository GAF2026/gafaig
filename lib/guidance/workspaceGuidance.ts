import type {
  CompositeGuidanceComponents,
} from "./compositeGuidanceTypes";

import type {
  NextActionPayload,
} from "./nextActionTypes";

import type {
  GuidanceResult,
} from "./types";

export interface WorkspaceGuidanceSnapshot {
  readonly organizationId:
    string | null;

  readonly caseId:
    string | null;

  readonly overallStatus:
    GuidanceResult<unknown>["status"];

  readonly repositoryContextStatus:
    CompositeGuidanceComponents[
      "repositoryContext"
    ]["status"];

  readonly nextActionStatus:
    CompositeGuidanceComponents[
      "nextAction"
    ]["status"];

  readonly blockingStatus:
    CompositeGuidanceComponents[
      "blocking"
    ]["status"];

  readonly waitingOnStatus:
    CompositeGuidanceComponents[
      "waitingOn"
    ]["status"];

  readonly workflowStatus:
    string | null;

  readonly workflowStage:
    string | null;

  readonly nextAction:
    NextActionPayload["action"] | null;

  readonly blocked:
    boolean | null;

  readonly blockingConditionCount:
    number;

  readonly waiting:
    boolean | null;

  readonly waitingOn:
    CompositeGuidanceComponents[
      "waitingOn"
    ]["payload"] extends
      infer TPayload
        ? TPayload extends {
            readonly waitingOn:
              infer TWaitingOn;
          }
          ? TWaitingOn
          : never
        : never;

  readonly currentOwner:
    CompositeGuidanceComponents[
      "waitingOn"
    ]["payload"] extends
      infer TPayload
        ? TPayload extends {
            readonly currentOwner:
              infer TCurrentOwner;
          }
          ? TCurrentOwner
          : never
        : never;

  readonly observedAt:
    string | null;
}

/**
 * Creates a stable, UI-neutral projection for future Case Workspace use.
 *
 * The projection does not modify or reinterpret any component result.
 * It only exposes selected participant-visible fields already resolved by
 * the certified Guidance engines.
 */
export function buildWorkspaceGuidanceSnapshot(
  components:
    CompositeGuidanceComponents,

  overallResult:
    GuidanceResult<unknown>,
): WorkspaceGuidanceSnapshot {
  const repositoryPayload =
    components.repositoryContext.payload;

  const nextActionPayload =
    components.nextAction.payload;

  const blockingPayload =
    components.blocking.payload;

  const waitingOnPayload =
    components.waitingOn.payload;

  return {
    organizationId:
      repositoryPayload
        ?.organizationId ??
      nextActionPayload
        ?.organizationId ??
      blockingPayload
        ?.organizationId ??
      waitingOnPayload
        ?.organizationId ??
      null,

    caseId:
      repositoryPayload
        ?.caseId ??
      nextActionPayload
        ?.caseId ??
      blockingPayload
        ?.caseId ??
      waitingOnPayload
        ?.caseId ??
      null,

    overallStatus:
      overallResult.status,

    repositoryContextStatus:
      components
        .repositoryContext
        .status,

    nextActionStatus:
      components
        .nextAction
        .status,

    blockingStatus:
      components
        .blocking
        .status,

    waitingOnStatus:
      components
        .waitingOn
        .status,

    workflowStatus:
      repositoryPayload
        ?.workflowStatus ??
      null,

    workflowStage:
      repositoryPayload
        ?.workflowStage ??
      null,

    nextAction:
      nextActionPayload
        ?.action ??
      null,

    blocked:
      blockingPayload
        ?.blocked ??
      null,

    blockingConditionCount:
      blockingPayload
        ?.blockingConditions
        .length ??
      0,

    waiting:
      waitingOnPayload
        ?.waiting ??
      null,

    waitingOn:
      waitingOnPayload
        ?.waitingOn ??
      null,

    currentOwner:
      waitingOnPayload
        ?.currentOwner ??
      null,

    observedAt:
      repositoryPayload
        ?.observedAt ??
      null,
  };
}