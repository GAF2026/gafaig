import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

import { requireAdmin } from "@/lib/auth/require";
import { getApplicantSession } from "@/lib/applicant-auth";
import { executeQuery, snowflakeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const REQUEST_VIEW_NAME = "GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS";

type RequestScopeRow = {
  REQUEST_ID: string | null;
  ORG: string | null;
  STATUS: string | null;
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function stripRequestPrefix(requestId: string) {
  return requestId.startsWith("REQ-") ? requestId : requestId;
}

async function verifyApplicantRequestScope(
  requestId: string,
  organizationName: string,
) {
  const rows = await snowflakeQuery<RequestScopeRow>(
    `
    SELECT
      REQUEST_ID::STRING AS REQUEST_ID,
      COALESCE(ORG_NAME, ORGANIZATION_NAME)::STRING AS ORG,
      STATUS::STRING AS STATUS
    FROM ${REQUEST_VIEW_NAME}
    WHERE REQUEST_ID::STRING = ?
    LIMIT 1
    `,
    [requestId],
  );

  const row = rows[0];

  if (!row) return null;

  const rowOrg = clean(row.ORG).toLowerCase();
  const sessionOrg = clean(organizationName).toLowerCase();

  if (!rowOrg || rowOrg !== sessionOrg) return null;

  return row;
}

export async function POST(
  req: NextRequest,
  {
    params,
  }: {
    params: {
      requestId: string;
    };
  },
) {
  try {
    const auth = await requireAdmin(req);

    if (!auth.ok) {
      return json(
        {
          ok: false,
          error: auth.error ?? "Applicant authentication required.",
        },
        auth.status ?? 401,
      );
    }

    const session = await getApplicantSession();

    if (!session) {
      return json(
        {
          ok: false,
          error: "Applicant session unavailable.",
        },
        401,
      );
    }

    const requestId = clean(
      stripRequestPrefix(decodeURIComponent(params.requestId)),
    );

    if (!requestId) {
      return json(
        {
          ok: false,
          error: "requestId is required.",
        },
        400,
      );
    }

    const scopedRequest = await verifyApplicantRequestScope(
      requestId,
      session.organizationName,
    );

    if (!scopedRequest) {
      return json(
        {
          ok: false,
          error: "Request is outside applicant organization scope.",
        },
        403,
      );
    }

    const form = await req.formData();

    const responseTitle =
      clean(form.get("title")) || `Applicant response for ${requestId}`;

    const responseBody = clean(form.get("response"));

    const responseType =
      clean(form.get("responseType")) || "applicant_response";

    const sourceUrlRaw = clean(form.get("sourceUrl"));
    const sourceUrl = sourceUrlRaw || null;

    if (!responseBody) {
      return json(
        {
          ok: false,
          error: "response is required.",
        },
        400,
      );
    }

    const responseId = `RESP-${crypto.randomUUID()}`;
    const evidenceId = `EVD-${crypto.randomUUID()}`;

    await executeQuery(
      `
      INSERT INTO GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
        (
          EVIDENCE_ID,
          CASE_ID,
          EVIDENCE_TYPE,
          TITLE,
          DESCRIPTION,
          SOURCE_URL,
          STORAGE_REF,
          SUBMITTED_BY
        )
      VALUES
        (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        evidenceId,
        requestId,
        `response:${responseType}`,
        responseTitle,
        responseBody,
        sourceUrl,
        null,
        session.email,
      ],
    );

    return json({
      ok: true,
      responseId,
      evidenceId,
      requestId,
      caseId: requestId,
      responseType,
      title: responseTitle,
      submittedBy: session.email,
      organizationName: session.organizationName,
      status: "SUBMITTED",
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Applicant request response submission failed.",
      },
      500,
    );
  }
}