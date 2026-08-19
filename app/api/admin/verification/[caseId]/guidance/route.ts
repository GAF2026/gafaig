import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  executeQuery,
} from "@/lib/snowflake";

import {
  createGuidanceCorrelationId,
  loadAdminGuidanceContext,
} from "@/lib/guidance/context";

import {
  resolveCompositeGuidance,
} from "@/lib/guidance/compositeGuidanceService";

import {
  resolveOperationalSummary,
} from "@/lib/guidance/operationalSummaryService";

import type {
  GuidanceResult,
} from "@/lib/guidance/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  readonly params: {
    readonly caseId: string;
  };
};

type CaseScopeRow = {
  ORG_ID?: unknown;
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

function clean(value: unknown): string {
  return String(value ?? "").trim();
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
 * Authenticated read-only endpoint for reviewer Composite Operational Guidance.
 *
 * Organization scope is resolved from the canonical Snowflake case row.
 * It is never inferred from reviewer identity, request parameters, or UI state.
 *
 * This endpoint:
 *
 * - authenticates through the existing administrative guidance context;
 * - resolves canonical case organization scope from VERIFICATION_CASES;
 * - executes existing Composite Operational Guidance;
 * - resolves the existing Operational Summary from the same Composite execution;
 * - creates no new guidance rules;
 * - performs no automatic action;
 * - performs no reassignment;
 * - performs no workflow or repository mutation;
 * - creates no governance, certification, publication, registry,
 *   verification, scoring, or constitutional authority.
 */
export async function GET(
  request: NextRequest,
  routeContext: RouteContext,
): Promise<NextResponse> {
  const requestedAt = new Date().toISOString();

  const correlationId =
    createGuidanceCorrelationId(
      request.headers.get(
        "x-guidance-correlation-id",
      ) ??
        request.headers.get(
          "x-correlation-id",
        ),
    );

  const rawCaseId =
    clean(routeContext.params.caseId);

  if (!rawCaseId) {
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

  try {
    /*
     * Resolve organization scope from the canonical Snowflake case row.
     *
     * No organization scope is accepted from the browser or inferred
     * from reviewer identity.
     */
    const caseRows =
      await executeQuery<CaseScopeRow>(
        `
        SELECT
          ORG_ID
        FROM GAFAIG_DB.CORE.VERIFICATION_CASES
        WHERE TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))
        LIMIT 1
        `,
        [rawCaseId],
      );

    const caseRow =
      caseRows?.[0] ?? null;

    if (!caseRow) {
      return json(
        {
          ok: false,
          status: "NOT_VISIBLE",
          error: "Case not found.",
        },
        404,
      );
    }

    const organizationId =
      clean(caseRow.ORG_ID);

    if (!organizationId) {
      return json(
        {
          ok: false,
          status: "UNRESOLVED",
          error:
            "The canonical case does not contain an organization identifier.",
        },
        422,
      );
    }

    const contextResolution =
      loadAdminGuidanceContext({
        request,
        organizationId,
        caseId: rawCaseId,
        correlationId,
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

          components:
            null,

          traces:
            null,

          operationalSummary:
            null,

          operationalSummaryTrace:
            null,
        },
        responseStatusForGuidance(
          contextResolution.result,
        ),
      );
    }

    const response =
      await resolveCompositeGuidance({
        context:
          contextResolution.context,

        includeEmptyRepositories:
          true,
      });

    const operationalSummary =
      await resolveOperationalSummary({
        context:
          contextResolution.context,

        composite:
          response,
      });

    const compositeOk =
      successfulGuidance(
        response.result,
      );

    const operationalSummaryOk =
      successfulGuidance(
        operationalSummary.result,
      );

    const responseStatus =
      !compositeOk
        ? responseStatusForGuidance(
            response.result,
          )
        : !operationalSummaryOk
          ? responseStatusForGuidance(
              operationalSummary.result,
            )
          : 200;

    return json(
      {
        ok:
          compositeOk &&
          operationalSummaryOk,

        status:
          response.result.status,

        guidance:
          response.result,

        components:
          response.components,

        traces:
          response.traces,

        operationalSummary:
          operationalSummary.result,

        operationalSummaryTrace:
          operationalSummary.trace,

        scope: {
          caseId:
            contextResolution.context.caseId ??
            rawCaseId,

          organizationId:
            contextResolution.context.organizationId,

          participant:
            contextResolution.context.participant,
        },

        authorityBoundary: {
          readOnly: true,

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

          scoringAuthority:
            false,
        },
      },
      responseStatus,
    );
  } catch (error) {
    return json(
      {
        ok: false,
        status: "ERROR",
        error:
          error instanceof Error
            ? error.message
            : "Reviewer guidance query failed.",
      },
      500,
    );
  }
}