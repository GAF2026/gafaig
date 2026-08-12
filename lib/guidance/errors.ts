import type { GuidanceFailure, GuidanceFailureCode } from "./types";

export class GuidanceRuntimeError extends Error {
  readonly code: GuidanceFailureCode;
  readonly retryable: boolean;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(
    code: GuidanceFailureCode,
    message: string,
    options?: {
      readonly retryable?: boolean;
      readonly details?: Readonly<Record<string, unknown>>;
      readonly cause?: unknown;
    },
  ) {
    super(message, { cause: options?.cause });
    this.name = "GuidanceRuntimeError";
    this.code = code;
    this.retryable = options?.retryable ?? false;
    this.details = options?.details;
  }

  toFailure(): GuidanceFailure {
    return {
      code: this.code,
      message: this.message,
      retryable: this.retryable,
      ...(this.details ? { details: this.details } : {}),
    };
  }
}

export function isGuidanceRuntimeError(
  value: unknown,
): value is GuidanceRuntimeError {
  return value instanceof GuidanceRuntimeError;
}

export function normalizeGuidanceFailure(
  error: unknown,
): GuidanceFailure {
  if (isGuidanceRuntimeError(error)) {
    return error.toFailure();
  }

  if (error instanceof Error) {
    return {
      code: "INTERNAL_ERROR",
      message: error.message || "Operational guidance failed.",
      retryable: false,
    };
  }

  return {
    code: "INTERNAL_ERROR",
    message: "Operational guidance failed.",
    retryable: false,
    details: { receivedType: typeof error },
  };
}
