import type {
  GuidanceExecutionTrace,
} from "./executor";

import type {
  CompositeGuidanceComponents,
} from "./compositeGuidanceTypes";

import type {
  WorkspaceGuidanceSnapshot,
} from "./workspaceGuidance";

import type {
  GuidanceResult,
} from "./types";

export const GUIDANCE_API_VIEWS = [
  "composite",
  "operational-summary",
  "repository-context",
  "next-action",
  "blocking",
  "waiting-on",
] as const;

export type GuidanceApiView =
  (typeof GUIDANCE_API_VIEWS)[number];

export interface GuidanceApiTraces {
  readonly repositoryContext?:
    GuidanceExecutionTrace;

  readonly nextAction?:
    GuidanceExecutionTrace;

  readonly blocking?:
    GuidanceExecutionTrace;

  readonly waitingOn?:
    GuidanceExecutionTrace;

  readonly composite?:
    GuidanceExecutionTrace;

  readonly operationalSummary?:
    GuidanceExecutionTrace;
}

export interface GuidanceApiResolution {
  /**
   * The requested Guidance view.
   */
  readonly view:
    GuidanceApiView;

  /**
   * Canonical Guidance result returned by the selected engine or service.
   */
  readonly result:
    GuidanceResult<unknown>;

  /**
   * Composite component results are preserved for Composite Guidance and
   * Operational Summary because both views use the same resolved component
   * execution.
   */
  readonly components:
    CompositeGuidanceComponents | null;

  /**
   * UI-neutral workspace projection.
   *
   * This is available for Composite Guidance and Operational Summary because
   * both paths have the complete certified component set.
   */
  readonly workspace:
    WorkspaceGuidanceSnapshot | null;

  /**
   * Every execution trace involved in resolving the selected view.
   */
  readonly traces:
    GuidanceApiTraces;
}

export function isGuidanceApiView(
  value: unknown,
): value is GuidanceApiView {
  return (
    typeof value === "string" &&
    (
      GUIDANCE_API_VIEWS as
        readonly string[]
    ).includes(value)
  );
}

export function parseGuidanceApiView(
  value: string | null,
): GuidanceApiView {
  if (!value) {
    return "composite";
  }

  const normalized =
    value
      .trim()
      .toLowerCase()
      .replaceAll("_", "-")
      .replaceAll(" ", "-");

  return isGuidanceApiView(normalized)
    ? normalized
    : "composite";
}