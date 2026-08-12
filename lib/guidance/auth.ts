import type { NextRequest } from "next/server";

import {
  getApplicantSession,
  type ApplicantSession,
} from "@/lib/applicant-auth";

import {
  requireRoles,
} from "@/lib/auth/require";

import type {
  Role,
  Session,
} from "@/lib/auth/session";

import {
  createGuidanceMetadata,
} from "./resultBuilders";

import {
  unauthorizedGuidance,
} from "./failClosed";

import {
  mapAdminRoleToGuidanceParticipant,
  mapApplicantSessionToGuidanceParticipant,
} from "./participant";

import type {
  GuidanceParticipant,
  GuidanceResult,
} from "./types";

const AUTH_ENGINE_NAME = "guidance-context-auth";
const AUTH_ENGINE_VERSION = "1.0.0";

export type GuidanceAuthorizationSuccess<
  TSession extends ApplicantSession | Session,
> = {
  readonly ok: true;
  readonly session: TSession;
  readonly participant: GuidanceParticipant;
};

export type GuidanceAuthorizationFailure = {
  readonly ok: false;
  readonly result: GuidanceResult;
};

export type GuidanceAuthorizationResult<
  TSession extends ApplicantSession | Session,
> =
  | GuidanceAuthorizationSuccess<TSession>
  | GuidanceAuthorizationFailure;

function authorizationFailure(input: {
  readonly correlationId: string;
  readonly summary: string;
  readonly code:
    | "AUTHENTICATION_REQUIRED"
    | "PARTICIPANT_SCOPE_INVALID";
  readonly message: string;
  readonly generatedAt?: string;
}): GuidanceAuthorizationFailure {
  return {
    ok: false,
    result: unauthorizedGuidance({
      summary: input.summary,
      metadata: createGuidanceMetadata({
        correlationId: input.correlationId,
        engineName: AUTH_ENGINE_NAME,
        engineVersion: AUTH_ENGINE_VERSION,
        generatedAt: input.generatedAt,
      }),
      unresolvedConditions: [input.message],
      failure: {
        code: input.code,
        message: input.message,
        retryable: false,
      },
    }),
  };
}

export async function authorizeApplicantGuidance(input: {
  readonly correlationId: string;
  readonly generatedAt?: string;
}): Promise<GuidanceAuthorizationResult<ApplicantSession>> {
  const session = await getApplicantSession();

  if (!session) {
    return authorizationFailure({
      correlationId: input.correlationId,
      generatedAt: input.generatedAt,
      summary: "Applicant guidance authorization failed.",
      code: "AUTHENTICATION_REQUIRED",
      message: "An authenticated applicant session is required.",
    });
  }

  const participant =
    mapApplicantSessionToGuidanceParticipant(session);

  if (!participant) {
    return authorizationFailure({
      correlationId: input.correlationId,
      generatedAt: input.generatedAt,
      summary: "Applicant guidance participant could not be resolved.",
      code: "PARTICIPANT_SCOPE_INVALID",
      message:
        "The applicant runtime role is not mapped to an authorized guidance participant.",
    });
  }

  return {
    ok: true,
    session,
    participant,
  };
}

export function authorizeAdminGuidance(input: {
  readonly request: NextRequest;
  readonly correlationId: string;
  readonly allowedRoles?: readonly Role[];
  readonly generatedAt?: string;
}): GuidanceAuthorizationResult<Session> {
  const allowedRoles: Role[] = [
    ...(input.allowedRoles ??
      ["SUPER_ADMIN", "REVIEWER", "DEMO"]),
  ];

  const auth = requireRoles(
    input.request,
    allowedRoles,
  );

  if (!auth.ok || !auth.session) {
    return authorizationFailure({
      correlationId: input.correlationId,
      generatedAt: input.generatedAt,
      summary: "Administrative guidance authorization failed.",
      code: "AUTHENTICATION_REQUIRED",
      message: auth.error ?? "An authenticated administrative session is required.",
    });
  }

  const participant =
    mapAdminRoleToGuidanceParticipant(auth.session.role);

  if (!participant) {
    return authorizationFailure({
      correlationId: input.correlationId,
      generatedAt: input.generatedAt,
      summary: "Administrative guidance participant could not be resolved.",
      code: "PARTICIPANT_SCOPE_INVALID",
      message:
        "The administrative runtime role is not mapped to an authorized guidance participant.",
    });
  }

  return {
    ok: true,
    session: auth.session,
    participant,
  };
}
