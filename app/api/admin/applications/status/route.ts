import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { normalizeId } from "@/lib/ids";
import { snowflakeQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const ALLOWED_STATUSES = new Set([
  "received",
  "in_review",
  "approved",
  "rejected",
]);

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json(
        { ok: false, error: auth.error ?? "Unauthorized" },
        auth.status ?? 401
      );
    }

    const body = await req.json();
    const requestId = normalizeId(body?.requestId);
    const status = clean(body?.status).toLowerCase();

    if (!requestId || !status) {
      return json({ ok: false, error: "Missing requestId or status" }, 400);
    }

    if (!ALLOWED_STATUSES.has(status)) {
      return json(
        {
          ok: false,
          error: `Invalid status. Allowed values: ${Array.from(ALLOWED_STATUSES).join(", ")}`,
        },
        400
      );
    }

    const existsSql = `
      SELECT REQUEST_ID
      FROM GAFAIG_DB.CORE.APPLICATIONS
      WHERE TRIM(UPPER(COALESCE(REQUEST_ID, ''))) = TRIM(UPPER(?))
      LIMIT 1
    `;

    const existing = await snowflakeQuery<Record<string, unknown>>(existsSql, [
      requestId,
    ]);

    if (!existing.length) {
      return json({ ok: false, error: "Application not found" }, 404);
    }

    const updateSql = `
      UPDATE GAFAIG_DB.CORE.APPLICATIONS
      SET
        STATUS = ?,
        UPDATED_AT = CURRENT_TIMESTAMP()
      WHERE TRIM(UPPER(COALESCE(REQUEST_ID, ''))) = TRIM(UPPER(?))
    `;

    await snowflakeQuery(updateSql, [status, requestId]);

    return json({
      ok: true,
      requestId,
      status,
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update application status",
      },
      500
    );
  }
}