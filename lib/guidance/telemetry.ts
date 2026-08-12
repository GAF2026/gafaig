import type {
  GuidanceResult,
} from "./types";

export type GuidanceTelemetryLevel =
  | "info"
  | "warn"
  | "error";

export type GuidanceTelemetryEvent =
  | "guidance.execution.completed"
  | "guidance.execution.failed"
  | "guidance.engine.unavailable"
  | "guidance.execution.slow";

export interface GuidanceTelemetryRecord {
  readonly event:
    GuidanceTelemetryEvent;

  readonly level:
    GuidanceTelemetryLevel;

  readonly correlationId:
    string;

  readonly engineName:
    string;

  readonly engineVersion:
    string;

  readonly status:
    GuidanceResult["status"];

  readonly startedAt:
    string;

  readonly completedAt:
    string;

  readonly durationMs:
    number;

  readonly failureCode?:
    string;

  readonly retryable?:
    boolean;

  readonly hasCaseScope:
    boolean;
}

const DEFAULT_SLOW_THRESHOLD_MS =
  2000;

function clean(
  value: unknown,
): string {
  return String(
    value ?? "",
  ).trim();
}

function slowThresholdMs():
  number {
  const configured =
    Number(
      process.env
        .GAFAIG_GUIDANCE_SLOW_THRESHOLD_MS,
    );

  if (
    Number.isFinite(
      configured,
    ) &&
    configured > 0
  ) {
    return configured;
  }

  return DEFAULT_SLOW_THRESHOLD_MS;
}

function telemetryEnabled():
  boolean {
  return (
    clean(
      process.env
        .GAFAIG_GUIDANCE_TELEMETRY_ENABLED ??
        "true",
    ).toLowerCase() !==
    "false"
  );
}

function writeTelemetry(
  record:
    GuidanceTelemetryRecord,
): void {
  if (
    !telemetryEnabled()
  ) {
    return;
  }

  const serialized =
    JSON.stringify({
      component:
        "operational-guidance",

      ...record,
    });

  switch (
    record.level
  ) {
    case "error":
      console.error(
        serialized,
      );
      break;

    case "warn":
      console.warn(
        serialized,
      );
      break;

    case "info":
    default:
      console.info(
        serialized,
      );
      break;
  }
}

export function recordGuidanceExecution(
  input: {
    readonly correlationId:
      string;

    readonly engineName:
      string;

    readonly engineVersion:
      string;

    readonly status:
      GuidanceResult["status"];

    readonly startedAt:
      string;

    readonly completedAt:
      string;

    readonly durationMs:
      number;

    readonly failureCode?:
      string;

    readonly retryable?:
      boolean;

    readonly hasCaseScope:
      boolean;
  },
): void {
  const failed =
    input.status ===
      "ERROR" ||
    input.status ===
      "UNAUTHORIZED" ||
    input.status ===
      "NOT_VISIBLE" ||
    input.status ===
      "INCONSISTENT" ||
    input.status ===
      "UNAVAILABLE";

  const level:
    GuidanceTelemetryLevel =
    failed
      ? input.status ===
          "ERROR"
        ? "error"
        : "warn"
      : "info";

  writeTelemetry({
    event:
      failed
        ? "guidance.execution.failed"
        : "guidance.execution.completed",

    level,

    correlationId:
      input.correlationId,

    engineName:
      input.engineName,

    engineVersion:
      input.engineVersion,

    status:
      input.status,

    startedAt:
      input.startedAt,

    completedAt:
      input.completedAt,

    durationMs:
      input.durationMs,

    failureCode:
      input.failureCode,

    retryable:
      input.retryable,

    hasCaseScope:
      input.hasCaseScope,
  });

  if (
    input.durationMs >=
    slowThresholdMs()
  ) {
    writeTelemetry({
      event:
        "guidance.execution.slow",

      level:
        "warn",

      correlationId:
        input.correlationId,

      engineName:
        input.engineName,

      engineVersion:
        input.engineVersion,

      status:
        input.status,

      startedAt:
        input.startedAt,

      completedAt:
        input.completedAt,

      durationMs:
        input.durationMs,

      failureCode:
        input.failureCode,

      retryable:
        input.retryable,

      hasCaseScope:
        input.hasCaseScope,
    });
  }
}

export function recordGuidanceEngineUnavailable(
  input: {
    readonly correlationId:
      string;

    readonly status:
      GuidanceResult["status"];

    readonly startedAt:
      string;

    readonly completedAt:
      string;

    readonly durationMs:
      number;

    readonly hasCaseScope:
      boolean;
  },
): void {
  writeTelemetry({
    event:
      "guidance.engine.unavailable",

    level:
      "error",

    correlationId:
      input.correlationId,

    engineName:
      "unregistered",

    engineVersion:
      "unknown",

    status:
      input.status,

    startedAt:
      input.startedAt,

    completedAt:
      input.completedAt,

    durationMs:
      input.durationMs,

    failureCode:
      "DEPENDENCY_FAILURE",

    retryable:
      false,

    hasCaseScope:
      input.hasCaseScope,
  });
}