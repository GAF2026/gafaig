import {
  errorGuidance,
  unavailableGuidance,
} from "./failClosed";

import {
  createGuidanceMetadata,
} from "./resultBuilders";

import {
  recordGuidanceEngineUnavailable,
  recordGuidanceExecution,
} from "./telemetry";

import type {
  GuidanceEngine,
} from "./engine";

import type {
  GuidanceContext,
  GuidanceResult,
} from "./types";

const EXECUTOR_ENGINE_VERSION =
  "1.0.0";

export interface GuidanceExecutionTrace {
  readonly engineName:
    string;

  readonly engineVersion:
    string;

  readonly correlationId:
    string;

  readonly startedAt:
    string;

  readonly completedAt:
    string;

  readonly durationMs:
    number;

  readonly status:
    GuidanceResult["status"];
}

export type GuidanceExecutionOutcome<
  TPayload =
    Readonly<
      Record<
        string,
        unknown
      >
    >,
> = {
  readonly result:
    GuidanceResult<TPayload>;

  readonly trace:
    GuidanceExecutionTrace;
};

function elapsedMilliseconds(
  start: number,
  end: number,
): number {
  return Math.max(
    0,
    end - start,
  );
}

function hasCaseScope(
  context:
    GuidanceContext,
): boolean {
  return Boolean(
    context.caseId,
  );
}

export async function executeGuidanceEngine<
  TInput =
    Readonly<
      Record<
        string,
        unknown
      >
    >,
  TPayload =
    Readonly<
      Record<
        string,
        unknown
      >
    >,
>(input: {
  readonly engine:
    GuidanceEngine<
      TInput,
      TPayload
    > | null;

  readonly context:
    GuidanceContext;

  readonly input:
    TInput;
}): Promise<
  GuidanceExecutionOutcome<
    TPayload
  >
> {
  const startedAt =
    new Date()
      .toISOString();

  const start =
    Date.now();

  if (!input.engine) {
    const completedAt =
      new Date()
        .toISOString();

    const durationMs =
      elapsedMilliseconds(
        start,
        Date.now(),
      );

    const result =
      unavailableGuidance({
        summary:
          "Guidance engine is unavailable.",

        metadata:
          createGuidanceMetadata({
            correlationId:
              input.context
                .correlationId,

            engineName:
              "guidance-executor",

            engineVersion:
              EXECUTOR_ENGINE_VERSION,

            generatedAt:
              completedAt,
          }),

        unresolvedConditions: [
          "The requested guidance engine is not registered.",
        ],

        failure: {
          code:
            "DEPENDENCY_FAILURE",

          message:
            "The requested guidance engine is not registered.",

          retryable:
            false,
        },
      }) as
        GuidanceResult<TPayload>;

    recordGuidanceEngineUnavailable({
      correlationId:
        input.context
          .correlationId,

      status:
        result.status,

      startedAt,

      completedAt,

      durationMs,

      hasCaseScope:
        hasCaseScope(
          input.context,
        ),
    });

    return {
      result,

      trace: {
        engineName:
          "unregistered",

        engineVersion:
          "unknown",

        correlationId:
          input.context
            .correlationId,

        startedAt,

        completedAt,

        durationMs,

        status:
          result.status,
      },
    };
  }

  try {
    const result =
      await input.engine
        .execute({
          context:
            input.context,

          input:
            input.input,
        });

    const completedAt =
      new Date()
        .toISOString();

    const durationMs =
      elapsedMilliseconds(
        start,
        Date.now(),
      );

    recordGuidanceExecution({
      correlationId:
        input.context
          .correlationId,

      engineName:
        input.engine.name,

      engineVersion:
        input.engine.version,

      status:
        result.status,

      startedAt,

      completedAt,

      durationMs,

      failureCode:
        result.failure
          ?.code,

      retryable:
        result.failure
          ?.retryable,

      hasCaseScope:
        hasCaseScope(
          input.context,
        ),
    });

    return {
      result,

      trace: {
        engineName:
          input.engine.name,

        engineVersion:
          input.engine.version,

        correlationId:
          input.context
            .correlationId,

        startedAt,

        completedAt,

        durationMs,

        status:
          result.status,
      },
    };
  } catch (error) {
    const completedAt =
      new Date()
        .toISOString();

    const durationMs =
      elapsedMilliseconds(
        start,
        Date.now(),
      );

    const result =
      errorGuidance({
        error,

        summary:
          "Guidance engine execution failed closed.",

        metadata:
          createGuidanceMetadata({
            correlationId:
              input.context
                .correlationId,

            engineName:
              input.engine.name,

            engineVersion:
              input.engine.version,

            generatedAt:
              completedAt,
          }),

        unresolvedConditions: [
          "The guidance engine did not complete successfully.",
        ],
      }) as
        GuidanceResult<TPayload>;

    recordGuidanceExecution({
      correlationId:
        input.context
          .correlationId,

      engineName:
        input.engine.name,

      engineVersion:
        input.engine.version,

      status:
        result.status,

      startedAt,

      completedAt,

      durationMs,

      failureCode:
        result.failure
          ?.code,

      retryable:
        result.failure
          ?.retryable,

      hasCaseScope:
        hasCaseScope(
          input.context,
        ),
    });

    return {
      result,

      trace: {
        engineName:
          input.engine.name,

        engineVersion:
          input.engine.version,

        correlationId:
          input.context
            .correlationId,

        startedAt,

        completedAt,

        durationMs,

        status:
          result.status,
      },
    };
  }
}