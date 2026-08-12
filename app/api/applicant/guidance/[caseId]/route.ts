import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  loadApplicantGuidanceContext,
} from "@/lib/guidance/context";

import {
  parseGuidanceApiView,
} from "@/lib/guidance/guidanceApiTypes";

import {
  resolveGuidanceApiRequest,
} from "@/lib/guidance/guidanceApiService";

import type {
  GuidanceResult,
} from "@/lib/guidance/types";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

export const revalidate =
  0;

type RouteContext = {
  readonly params: {
    readonly caseId: string;
  };
};

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

  switch (
    value
      .trim()
      .toLowerCase()
  ) {
    case "true":
    case "1":
    case "yes":
      return true;

    case "false":
    case "0":
    case "no":
      return false;

    default:
      return defaultValue;
  }
}

function responseStatusForGuidance<TPayload>(
  result:
    GuidanceResult<TPayload>,
): number {
  switch (result.status) {
    case "UNAUTHORIZED":
      return 403;

    case "NOT_VISIBLE":
      return 404;

    case "INCONSISTENT":
    case "STALE":
      return 409;

    case "UNRESOLVED":
    case "UNAVAILABLE":
      return 422;

    case "ERROR":
      return 500;

    default:
      break;
  }

  switch (result.failure?.code) {
    case "AUTHENTICATION_REQUIRED":
      return 401;

    case "ORGANIZATION_SCOPE_INVALID":
    case "PARTICIPANT_SCOPE_INVALID":
      return 403;

    case "CASE_SCOPE_INVALID":
      return 404;

    case "SOURCE_INCONSISTENT":
    case "SOURCE_STALE":
      return 409;

    case "DEPENDENCY_FAILURE":
    case "VALIDATION_FAILURE":
      return 422;

    case "SOURCE_UNAVAILABLE":
    case "INTERNAL_ERROR":
      return 500;

    default:
      return 200;
  }
}

function successfulGuidance<TPayload>(
  result:
    GuidanceResult<TPayload>,
): boolean {
  return (
    result.status === "AVAILABLE" ||
    result.status === "BLOCKED" ||
    result.status === "WAITING" ||
    result.status === "INCOMPLETE" ||
    result.status === "READY" ||
    result.status === "NOT_ELIGIBLE"
  );
}

/**
 * Consolidated authenticated Operational Guidance endpoint.
 *
 * Supported views:
 *
 * - composite (default)
 * - repository-context
 * - next-action
 * - blocking
 * - waiting-on
 *
 * The endpoint is read-only and performs no automatic action, ownership
 * reassignment, blocker resolution, workflow mutation, or repository
 * mutation.
 */
export async function GET(
  request: NextRequest,
  routeContext: RouteContext,
): Promise<NextResponse> {
  const requestedAt =
    new Date().toISOString();

  const rawCaseId =
    routeContext.params.caseId;

  if (
    !rawCaseId ||
    rawCaseId.trim().length === 0
  ) {
    return json(
      {
        ok: false,
        status: "UNRESOLVED",
        error:
          "A case identifier is required.",
      },
      400,
    );
  }

  const view =
    parseGuidanceApiView(
      request.nextUrl.searchParams.get(
        "view",
      ),
    );

  const includeEmptyRepositories =
    parseBooleanQueryValue(
      request.nextUrl.searchParams.get(
        "includeEmptyRepositories",
      ),
      true,
    );

  const contextResolution =
    await loadApplicantGuidanceContext({
      caseId:
        rawCaseId,

      correlationId:
        request.headers.get(
          "x-guidance-correlation-id",
        ) ??
        request.headers.get(
          "x-correlation-id",
        ),

      requestedAt,
    });

  if (!contextResolution.ok) {
    return json(
      {
        ok: false,

        view,

        status:
          contextResolution.result.status,

        guidance:
          contextResolution.result,

        components:
          null,

        workspace:
          null,

        traces:
          null,
      },
      responseStatusForGuidance(
        contextResolution.result,
      ),
    );
  }

  const response =
    await resolveGuidanceApiRequest({
      context:
        contextResolution.context,

      view,

      includeEmptyRepositories,
    });

  return json(
    {
      ok:
        successfulGuidance(
          response.result,
        ),

      view:
        response.view,

      status:
        response.result.status,

      guidance:
        response.result,

      components:
        response.components,

      workspace:
        response.workspace,

      traces:
        response.traces,

      authorityBoundary: {
        readOnly:
          true,

        automaticActionExecution:
          false,

        automaticBlockerResolution:
          false,

        automaticReassignment:
          false,

        automaticWaitingResolution:
          false,

        workflowMutation:
          false,

        repositoryMutation:
          false,

        governanceAuthority:
          false,

        certificationAuthority:
          false,

        publicationAuthority:
          false,

        registryAuthority:
          false,

        verificationAuthority:
          false,
      },
    },
    responseStatusForGuidance(
      response.result,
    ),
  );
}