import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const s = String(value).trim();
    if (s) return s;
  }
  return null;
}

const VIEW_NAME = "GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS";

type Ctx = {
  params: { requestId: string } | Promise<{ requestId: string }>;
};

async function resolveParams(ctx: Ctx) {
  return await Promise.resolve(ctx.params);
}

export async function GET(req: NextRequest, ctx: Ctx) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json(
        { ok: false, error: auth.error ?? "Unauthorized" },
        auth.status ?? 401
      );
    }

    const { requestId: rawRequestId } = await resolveParams(ctx);
    const requestId = String(rawRequestId ?? "").trim();

    if (!requestId) {
      return json({ ok: false, error: "Missing requestId" }, 400);
    }

    const sql = `
      SELECT
        REQUEST_ID,
        ORG_NAME,
        CONTACT_EMAIL,
        STATUS,
        SOURCE_TABLE,
        TYPE,
        TO_VARCHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS CREATED_AT,
        TO_VARCHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT
      FROM ${VIEW_NAME}
      WHERE TRIM(UPPER(REQUEST_ID)) = TRIM(UPPER(?))
      ORDER BY UPDATED_AT DESC NULLS LAST, CREATED_AT DESC NULLS LAST
      LIMIT 1
    `;

    const rows = await sfQuery<Record<string, unknown>>(sql, [requestId]);
    const row = rows?.[0];

    if (!row) {
      return json({ ok: false, error: "Application not found" }, 404);
    }

    return json({
      ok: true,
      row: {
        requestId: firstString(row.REQUEST_ID) ?? requestId,
        submissionType: firstString(row.TYPE),
        orgName: firstString(row.ORG_NAME),
        contactEmail: firstString(row.CONTACT_EMAIL),
        status: firstString(row.STATUS),
        requestedTier: null,
        renewalPeriod: null,
        sourceTable: firstString(row.SOURCE_TABLE),
        createdAt: firstString(row.CREATED_AT),
        updatedAt: firstString(row.UPDATED_AT),
      },
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to load application",
      },
      500
    );
  }
}

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json(
        { ok: false, error: auth.error ?? "Unauthorized" },
        auth.status ?? 401
      );
    }

    const { requestId: rawRequestId } = await resolveParams(ctx);
    const requestId = String(rawRequestId ?? "").trim().toUpperCase();

    if (!requestId) {
      return json({ ok: false, error: "Missing requestId" }, 400);
    }

    const body = (await req.json().catch(() => ({}))) as {
      participantId?: string;
      actor?: string;
    };

    const participantId = String(body?.participantId ?? "")
      .trim()
      .toUpperCase();
    const actor = String(body?.actor ?? "admin").trim();

    if (!participantId) {
      return json({ ok: false, error: "Missing participantId" }, 400);
    }

    const callSql =
      "CALL GAFAIG_DB.CORE.SP_CREATE_CASE_FROM_APPLICATION(?, ?, ?)";

    const rows = await sfQuery<Record<string, unknown>>(callSql, [
      requestId,
      participantId,
      actor,
    ]);

    const procRow = rows?.[0];
    const procValue = procRow ? Object.values(procRow)[0] : null;

    let payload: any = procValue;
    if (typeof procValue === "string") {
      try {
        payload = JSON.parse(procValue);
      } catch {
        payload = null;
      }
    }

    if (!payload || !payload.ok) {
      return json(
        {
          ok: false,
          error: payload?.error ?? "Failed to convert application to case",
          debug: {
            requestId,
            participantId,
            actor,
            procedureReturned: payload ?? procValue ?? null,
          },
        },
        400
      );
    }

    return json({
      ok: true,
      caseId: firstString(payload.caseId),
      requestId: firstString(payload.requestId) ?? requestId,
      participantId: firstString(payload.participantId) ?? participantId,
      alreadyExisted: Boolean(payload.alreadyExisted),
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to convert application to case",
      },
      500
    );
  }
}