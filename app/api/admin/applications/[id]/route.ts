import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

// View that powers the admin list
const VIEW_NAME = "GAFAIG_DB.CORE.V_ADMIN_SUBMISSIONS";

export async function GET(req: NextRequest, ctx: { params: { id: string } }) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json({ ok: false, error: auth.error ?? "Unauthorized" }, auth.status ?? 401);
    }

    const id = String(ctx?.params?.id ?? "").trim();
    if (!id) return json({ ok: false, error: "Missing id" }, 400);

    // IMPORTANT:
    // - Do NOT reference non-existent columns like PAYLOAD.
    // - Only select columns we know exist on the view/table family.
    // - Fill optional UI fields with NULL safely.
    const sql = `
      SELECT
        REQUEST_ID      AS "requestId",
        TYPE            AS "submissionType",
        ORG_NAME        AS "orgName",
        CONTACT_EMAIL   AS "contactEmail",
        STATUS          AS "status",
        NULL            AS "requestedTier",
        NULL            AS "renewalPeriod",
        NULL            AS "createdAt",
        UPDATED_AT      AS "updatedAt"
      FROM ${VIEW_NAME}
      WHERE REQUEST_ID = ?
        AND TYPE = 'application'
      LIMIT 1
    `;

    const rows = await sfQuery<any>(sql, [id]);
    const row = rows?.[0] ?? null;

    if (!row) return json({ ok: false, error: "Not found" }, 404);

    return json({ ok: true, row, view: VIEW_NAME });
  } catch (e: any) {
    return json({ ok: false, error: String(e?.message ?? e ?? "Unknown error") }, 500);
  }
}