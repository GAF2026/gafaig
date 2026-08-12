import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  loadApplicantGuidanceContext,
} from "@/lib/guidance/context";

import {
  resolveRepositoryContext,
} from "@/lib/guidance/repositoryContextService";

import type {
  GuidanceResult,
} from "@/lib/guidance/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function json(
  data: unknown,
  status = 200,
): NextResponse {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control":
        "no-store, no-cache, must-revalidate",
    },
  });
}

function parseBooleanQueryValue(
  value: string | null,
  defaultValue: boolean,
): boolean {
  if (value === null) {
    return defaultValue;
  }

  const normalized =
    value.trim().toLowerCase();

  if (
    normalized === "true" ||
    normalized === "1" ||
    normalized === "yes"
  ) {
    return true;
  }

  if (
    normalized === "false" ||
    normalized === "0" ||
    normalized === "no"
  ) {
    return false;
  }

  return defaultValue;
}

function responseStatusForGuidance<TPayload>(
  result: GuidanceResult<TPayload>,
): number {
  switch (result.failure?.code) {
    case "AUTHENTICATION_REQUIRED":
      return 401;

    case "PARTICIPANT_SCOPE_INVALID":
      return 403;

    case "CASE_SCOPE_INVALID":
      return result.status === "NOT_VISIBLE"
        ? 404
        : 400;

    case "SOURCE_INCONSISTENT":
      return 409;

    case "SOURCE_UNAVAILABLE":
    case "DEPENDENCY_FAILURE":
      return 503;

    case "VALIDATION_FAILURE":
      return 400;

    default:
      break;
  }

  switch (result.status) {
    case "NOT_VISIBLE":
      return 404;

    case "INCONSISTENT":
      return 409;

    case "UNAVAILABLE":
      return 503;

    case "ERROR":
      return 500;

    default:
      return 200;
  }
}

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: {
      caseId: string;
    };
  },
): Promise<NextResponse> {
  const requestedAt =
    new Date().toISOString();

  const suppliedCorrelationId =
    request.headers.get(
      "x-guidance-correlation-id",
    );

  const contextResolution =
    await loadApplicantGuidanceContext({
      caseId: params.caseId,
      correlationId:
        suppliedCorrelationId,
      requestedAt,
    });

  if (!contextResolution.ok) {
    return json(
      {
        ok: false,
        guidance:
          contextResolution.result,
      },
      responseStatusForGuidance(
        contextResolution.result,
      ),
    );
  }

  const includeEmptyRepositories =
    parseBooleanQueryValue(
      request.nextUrl.searchParams.get(
        "includeEmptyRepositories",
      ),
      true,
    );

  const response =
    await resolveRepositoryContext({
      context:
        contextResolution.context,
      includeEmptyRepositories,
    });

  return json(
    {
      ok:
        response.result.status ===
          "AVAILABLE" ||
        response.result.status ===
          "INCOMPLETE",

      guidance: response.result,
      trace: response.trace,
    },
    responseStatusForGuidance(
      response.result,
    ),
  );
}