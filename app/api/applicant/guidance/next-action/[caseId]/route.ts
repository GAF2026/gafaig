import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  loadApplicantGuidanceContext,
} from "@/lib/guidance/context";

import {
  resolveNextAction,
} from "@/lib/guidance/nextActionService";

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
) {
  return NextResponse.json(
    data,
    {
      status,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate",
      },
    },
  );
}

function responseStatusForGuidance<TPayload>(
  result: GuidanceResult<TPayload>,
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
  result: GuidanceResult<TPayload>,
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
 * Authenticated read-only endpoint for deterministic Next Action Guidance.
 *
 * The endpoint:
 *
 * - resolves applicant identity and organization scope server-side;
 * - resolves case-scoped Repository Context;
 * - executes the registered Next Action Engine;
 * - returns Repository Context and Next Action execution traces;
 * - performs no workflow, repository, governance, certification,
 *   publication, registry, or verification mutation.
 */
export async function GET(
  request: NextRequest,
  routeContext: RouteContext,
) {
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

  const contextResolution =
    await loadApplicantGuidanceContext({
      caseId:
        rawCaseId,

      correlationId:
        request.headers.get(
          "x-correlation-id",
        ),

      requestedAt,
    });

  if (!contextResolution.ok) {
    return json(
      {
        ok: false,
        status:
          contextResolution.result.status,

        guidance:
          contextResolution.result,

        repositoryContext:
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
    await resolveNextAction({
      context:
        contextResolution.context,

      /*
       * Next Action rules require visibility into empty repository
       * categories so missing-record rules remain deterministic.
       */
      includeEmptyRepositories:
        true,
    });

  const status =
    responseStatusForGuidance(
      response.result,
    );

  return json(
    {
      ok:
        successfulGuidance(
          response.result,
        ),

      status:
        response.result.status,

      guidance:
        response.result,

      repositoryContext:
        response.repositoryContext.result,

      traces: {
        repositoryContext:
          response.repositoryContext.trace,

        nextAction:
          response.trace,
      },

      authorityBoundary: {
        readOnly:
          true,

        workflowMutation:
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
    status,
  );
}