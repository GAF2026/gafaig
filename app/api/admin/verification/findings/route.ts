import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { executeQuery, snowflakeCtx } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function getParam(req: NextRequest, key: string) {
  return (req.nextUrl?.searchParams?.get(key) || "").trim();
}

const FINDINGS_TABLE =
  process.env.GAFAIG_FINDINGS_TABLE ||
  "GAFAIG_DB.CORE.VERIFICATION_FINDINGS";

function makeFindingId() {
  return `FND-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json(
        { ok: false, error: auth.error ?? "Unauthorized" },
        auth.status ?? 401
      );
    }

    const caseId = getParam(req, "caseId");
    if (!caseId) {
      return json({ ok: false, error: "Missing query param: caseId" }, 400);
    }

    const sql = `
      SELECT
        FINDING_ID,
        CASE_ID,
        CONTROL_ID,
        CONTROL_TITLE,
        RESULT,
        SEVERITY,
        RATIONALE,
        ORG_ID,
        TO_VARCHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS CREATED_AT,
        TO_VARCHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT
      FROM ${FINDINGS_TABLE}
      WHERE TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))
      ORDER BY UPDATED_AT DESC, CREATED_AT DESC
    `;

    const rows = await executeQuery<Record<string, unknown>>(sql, [caseId]);

    return json({
      ok: true,
      rows: (rows ?? []).map((row) => ({
        findingId: row.FINDING_ID ?? null,
        caseId: row.CASE_ID ?? null,
        controlId: row.CONTROL_ID ?? null,
        controlTitle: row.CONTROL_TITLE ?? null,
        result: row.RESULT ?? null,
        severity: row.SEVERITY ?? null,
        rationale: row.RATIONALE ?? null,
        orgId: row.ORG_ID ?? null,
        createdAt: row.CREATED_AT ?? null,
        updatedAt: row.UPDATED_AT ?? null,
      })),
      ctx: snowflakeCtx(),
      table: FINDINGS_TABLE,
    });
  } catch (e: any) {
    return json(
      {
        ok: false,
        error: e?.message || "Failed to load findings",
        ctx: snowflakeCtx(),
        table: FINDINGS_TABLE,
      },
      500
    );
  }
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

    const body = await req.json().catch(() => ({}));

    const caseId = String(body?.caseId || "").trim();
    const controlId = String(body?.controlId || body?.control_id || "").trim();
    const controlTitle = String(
      body?.controlTitle || body?.control_title || body?.title || ""
    ).trim();
    const result = String(body?.result || body?.decision || "").trim();
    const severity = String(body?.severity || "").trim();
    const rationale = String(body?.rationale || "").trim();

    const findingId = String(body?.findingId || "").trim() || makeFindingId();

    if (!caseId) {
      return json({ ok: false, error: "Missing body field: caseId" }, 400);
    }

    if (!controlId || !controlTitle || !result) {
      return json(
        {
          ok: false,
          error: "Missing required fields: controlId, controlTitle, result",
        },
        400
      );
    }

    const caseRows = await executeQuery<Record<string, unknown>>(
      `
      SELECT ORG_ID
      FROM GAFAIG_DB.CORE.VERIFICATION_CASES
      WHERE TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))
      LIMIT 1
      `,
      [caseId]
    );

    const orgId = String(caseRows?.[0]?.ORG_ID ?? "").trim() || null;

    const insertSql = `
      INSERT INTO ${FINDINGS_TABLE} (
        FINDING_ID,
        CASE_ID,
        CONTROL_ID,
        CONTROL_TITLE,
        RESULT,
        SEVERITY,
        RATIONALE,
        ORG_ID,
        CREATED_AT,
        UPDATED_AT
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())
    `;

    await executeQuery(insertSql, [
      findingId,
      caseId,
      controlId,
      controlTitle,
      result,
      severity || "medium",
      rationale || null,
      orgId,
    ]);

    const verifySql = `
      SELECT
        FINDING_ID,
        CASE_ID,
        CONTROL_ID,
        CONTROL_TITLE,
        RESULT,
        SEVERITY,
        RATIONALE,
        ORG_ID,
        TO_VARCHAR(CREATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS CREATED_AT,
        TO_VARCHAR(UPDATED_AT, 'YYYY-MM-DD HH24:MI:SS') AS UPDATED_AT
      FROM ${FINDINGS_TABLE}
      WHERE TRIM(UPPER(FINDING_ID)) = TRIM(UPPER(?))
      LIMIT 1
    `;

    const verifyRows = await executeQuery<Record<string, unknown>>(verifySql, [
      findingId,
    ]);

    const insertedRow = verifyRows?.[0];

    if (!insertedRow) {
      return json(
        {
          ok: false,
          error: "Insert verification failed",
          findingId,
          caseId,
          attemptedOrgId: orgId,
          ctx: snowflakeCtx(),
          table: FINDINGS_TABLE,
        },
        500
      );
    }

    return json({
      ok: true,
      findingId,
      caseId,
      row: {
        findingId: insertedRow.FINDING_ID ?? null,
        caseId: insertedRow.CASE_ID ?? null,
        controlId: insertedRow.CONTROL_ID ?? null,
        controlTitle: insertedRow.CONTROL_TITLE ?? null,
        result: insertedRow.RESULT ?? null,
        severity: insertedRow.SEVERITY ?? null,
        rationale: insertedRow.RATIONALE ?? null,
        orgId: insertedRow.ORG_ID ?? null,
        createdAt: insertedRow.CREATED_AT ?? null,
        updatedAt: insertedRow.UPDATED_AT ?? null,
      },
      ctx: snowflakeCtx(),
      table: FINDINGS_TABLE,
    });
  } catch (e: any) {
    return json(
      {
        ok: false,
        error: e?.message || "Failed to create finding",
        ctx: snowflakeCtx(),
        table: FINDINGS_TABLE,
      },
      500
    );
  }
}