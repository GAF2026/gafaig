import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";
import { requireAdmin } from "@/lib/auth/admin";

function json(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

function badRequest(msg: string) {
  return json({ ok: false, error: msg }, 400);
}

async function getCtx() {
  // Helps confirm what Snowflake user/role the API is running as
  const r = await sfQuery<any>(`SELECT CURRENT_USER() AS U, CURRENT_ROLE() AS R`);
  return {
    u: r.rows?.[0]?.U ?? null,
    r: r.rows?.[0]?.R ?? null,
  };
}

async function getOrgIdForCase(caseId: string): Promise<string | null> {
  const r = await sfQuery<any>(
    `SELECT ORG_ID
     FROM GAFAIG_DB.CORE.VERIFICATION_CASES
     WHERE CASE_ID = ?
     LIMIT 1`,
    [caseId]
  );

  return r.rows?.[0]?.ORG_ID ?? null;
}

/**
 * Snowflake returns columns as UPPERCASE keys by default.
 * The UI typically expects camelCase keys. Normalize here.
 */
function normalizeFindingRow(x: any) {
  return {
    // common API/UI expectations:
    findingId: x.FINDING_ID ?? x.findingId ?? null,
    caseId: x.CASE_ID ?? x.caseId ?? null,
    orgId: x.ORG_ID ?? x.orgId ?? null,

    controlId: x.CONTROL_ID ?? x.controlId ?? null,
    controlTitle: x.CONTROL_TITLE ?? x.controlTitle ?? null,

    result: x.RESULT ?? x.result ?? null,
    severity: x.SEVERITY ?? x.severity ?? null,
    rationale: x.RATIONALE ?? x.rationale ?? null,

    createdAt: x.CREATED_AT ?? x.createdAt ?? null,
    updatedAt: x.UPDATED_AT ?? x.updatedAt ?? null,
  };
}

export async function GET(req: Request) {
  const ctx = await getCtx();

  try {
    await requireAdmin(req);

    const url = new URL(req.url);
    const caseId = url.searchParams.get("caseId");
    if (!caseId) return badRequest("Missing query param: caseId");

    const orgId = await getOrgIdForCase(caseId);
    if (!orgId) {
      return json(
        {
          ok: false,
          error:
            `Cannot determine ORG_ID for caseId=${caseId}. ` +
            `Row Access Policy requires ORG_ID to read/write findings. ` +
            `Fix: ensure CORE.VERIFICATION_CASES has a row for ${caseId} with ORG_ID set ` +
            `and that GAFAIG_APP_USER has access via CORE.USER_ORG_ACCESS.`,
          ctx,
        },
        500
      );
    }

    const r = await sfQuery<any>(
      `SELECT
         FINDING_ID,
         CASE_ID,
         ORG_ID,
         CONTROL_ID,
         CONTROL_TITLE,
         RESULT,
         SEVERITY,
         RATIONALE,
         CREATED_AT,
         UPDATED_AT
       FROM GAFAIG_DB.CORE.VERIFICATION_FINDINGS
       WHERE CASE_ID = ? AND ORG_ID = ?
       ORDER BY UPDATED_AT DESC`,
      [caseId, orgId]
    );

    const rows = (r.rows || []).map(normalizeFindingRow);

    return json({ ok: true, rows, caseId, orgId, ctx }, 200);
  } catch (e: any) {
    return json(
      { ok: false, error: e?.message || "Failed to load findings.", ctx },
      500
    );
  }
}

export async function POST(req: Request) {
  const ctx = await getCtx();

  try {
    await requireAdmin(req);

    const body = await req.json().catch(() => ({}));
    const caseId = String(body?.caseId || "");
    const controlId = String(body?.controlId || "");
    const controlTitle = String(body?.controlTitle || "");
    const result = String(body?.result || "");
    const severity = String(body?.severity || "");
    const rationale = String(body?.rationale || "");

    if (!caseId) return badRequest("Missing body field: caseId");
    if (!controlId) return badRequest("Missing body field: controlId");
    if (!controlTitle) return badRequest("Missing body field: controlTitle");
    if (!result) return badRequest("Missing body field: result");
    if (!severity) return badRequest("Missing body field: severity");

    const orgId = await getOrgIdForCase(caseId);
    if (!orgId) {
      return json(
        {
          ok: false,
          error:
            `Cannot determine ORG_ID for caseId=${caseId}. ` +
            `Row Access Policy requires ORG_ID to read/write findings. ` +
            `Fix: ensure CORE.VERIFICATION_CASES has a row for ${caseId} with ORG_ID set ` +
            `and that GAFAIG_APP_USER has access via CORE.USER_ORG_ACCESS.`,
          ctx,
        },
        500
      );
    }

    const findingId = `FND-${Date.now()}-${Math.random()
      .toString(16)
      .slice(2, 8)}`;

    await sfQuery(
      `INSERT INTO GAFAIG_DB.CORE.VERIFICATION_FINDINGS
        (FINDING_ID, CASE_ID, ORG_ID, CONTROL_ID, CONTROL_TITLE, RESULT, SEVERITY, RATIONALE, CREATED_AT, UPDATED_AT)
       VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())`,
      [
        findingId,
        caseId,
        orgId,
        controlId,
        controlTitle,
        result,
        severity,
        rationale || null,
      ]
    );

    // Verify row is visible under RLS (critical)
    const verify = await sfQuery<any>(
      `SELECT
         FINDING_ID,
         CASE_ID,
         ORG_ID,
         CONTROL_ID,
         CONTROL_TITLE,
         RESULT,
         SEVERITY,
         RATIONALE,
         CREATED_AT,
         UPDATED_AT
       FROM GAFAIG_DB.CORE.VERIFICATION_FINDINGS
       WHERE FINDING_ID = ? AND CASE_ID = ? AND ORG_ID = ?
       LIMIT 1`,
      [findingId, caseId, orgId]
    );

    const found = verify.rows?.[0];
    if (!found) {
      throw new Error(
        `Insert executed but row is not visible under current Row Access Policy. ` +
          `caseId=${caseId}, orgId=${orgId}, ctx.user=${ctx.u}, ctx.role=${ctx.r}`
      );
    }

    // Return normalized row so UI can use it immediately if it wants
    const row = normalizeFindingRow(found);

    return json({ ok: true, findingId, orgId, row, ctx }, 200);
  } catch (e: any) {
    return json(
      { ok: false, error: e?.message || "Failed to add finding.", ctx },
      500
    );
  }
}