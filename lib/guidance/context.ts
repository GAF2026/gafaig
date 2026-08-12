import type { NextRequest } from "next/server";

import {
  cleanApplicantValue,
} from "@/lib/applicant/helpers";

import {
  normalizeId,
} from "@/lib/ids";

import {
  authorizeAdminGuidance,
  authorizeApplicantGuidance,
} from "./auth";

import {
  createGuidanceMetadata,
} from "./resultBuilders";

import {
  unresolvedGuidance,
} from "./failClosed";

import type {
  GuidanceContext,
  GuidanceResult,
} from "./types";

const CONTEXT_ENGINE_NAME = "guidance-context-loader";
const CONTEXT_ENGINE_VERSION = "1.0.0";

export type GuidanceContextResolution =
  | {
      readonly ok: true;
      readonly context: GuidanceContext;
    }
  | {
      readonly ok: false;
      readonly result: GuidanceResult;
    };

export function createGuidanceCorrelationId(
  supplied?: string | null,
): string {
  const cleaned = cleanApplicantValue(supplied);

  if (cleaned) {
    return cleaned;
  }

  return crypto.randomUUID();
}

function unresolvedContext(input: {
  readonly correlationId: string;
  readonly summary: string;
  readonly message: string;
  readonly generatedAt?: string;
}): GuidanceContextResolution {
  return {
    ok: false,
    result: unresolvedGuidance({
      summary: input.summary,
      metadata: createGuidanceMetadata({
        correlationId: input.correlationId,
        engineName: CONTEXT_ENGINE_NAME,
        engineVersion: CONTEXT_ENGINE_VERSION,
        generatedAt: input.generatedAt,
      }),
      unresolvedConditions: [input.message],
      failure: {
        code: "VALIDATION_FAILURE",
        message: input.message,
        retryable: false,
      },
    }),
  };
}

export async function loadApplicantGuidanceContext(input?: {
  readonly caseId?: string | null;
  readonly correlationId?: string | null;
  readonly requestedAt?: string;
}): Promise<GuidanceContextResolution> {
  const correlationId =
    createGuidanceCorrelationId(input?.correlationId);

  const requestedAt =
    input?.requestedAt ?? new Date().toISOString();

  const authorization =
    await authorizeApplicantGuidance({
      correlationId,
      generatedAt: requestedAt,
    });

  if (!authorization.ok) {
    return authorization;
  }

  const organizationId =
    cleanApplicantValue(
      authorization.session.organizationId,
    );

  if (!organizationId) {
    return unresolvedContext({
      correlationId,
      generatedAt: requestedAt,
      summary: "Applicant guidance context is incomplete.",
      message:
        "The authenticated applicant session does not contain an organization identifier.",
    });
  }

  const normalizedCaseId =
    cleanApplicantValue(input?.caseId)
      ? normalizeId(input?.caseId ?? "")
      : undefined;

  return {
    ok: true,
    context: {
      session: authorization.session,
      participant: authorization.participant,
      organizationId,
      ...(normalizedCaseId
        ? { caseId: normalizedCaseId }
        : {}),
      requestedAt,
      correlationId,
    },
  };
}

/**
 * Loads an administrative guidance context.
 *
 * Admin sessions do not currently carry organization scope, so callers must
 * supply organizationId explicitly. The loader never invents or infers it.
 */
export function loadAdminGuidanceContext(input: {
  readonly request: NextRequest;
  readonly organizationId: string | null | undefined;
  readonly caseId?: string | null;
  readonly correlationId?: string | null;
  readonly requestedAt?: string;
}): GuidanceContextResolution {
  const correlationId =
    createGuidanceCorrelationId(input.correlationId);

  const requestedAt =
    input.requestedAt ?? new Date().toISOString();

  const authorization =
    authorizeAdminGuidance({
      request: input.request,
      correlationId,
      generatedAt: requestedAt,
    });

  if (!authorization.ok) {
    return authorization;
  }

  const organizationId =
    cleanApplicantValue(input.organizationId);

  if (!organizationId) {
    return unresolvedContext({
      correlationId,
      generatedAt: requestedAt,
      summary: "Administrative guidance context is incomplete.",
      message:
        "Administrative guidance requires explicit organization scope.",
    });
  }

  const normalizedCaseId =
    cleanApplicantValue(input.caseId)
      ? normalizeId(input.caseId ?? "")
      : undefined;

  return {
    ok: true,
    context: {
      session: authorization.session,
      participant: authorization.participant,
      organizationId,
      ...(normalizedCaseId
        ? { caseId: normalizedCaseId }
        : {}),
      requestedAt,
      correlationId,
    },
  };
}
