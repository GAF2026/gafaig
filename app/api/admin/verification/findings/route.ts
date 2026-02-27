import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

/**
 * Diagnostic: who am I in Snowflake?
 */
async function getSnowflakeIdentity() {
  const rows = await sfQuery<any>(`SELECT CURRENT_USER() AS U, CURRENT_ROLE() AS R`);
  return {
    user: rows?.[0]?.U ?? null,
    role: rows?.[0]?.R ?? null,
  };
}

/**
 * Resolve org_id for a case (optional)
 */
async function getOrgIdForCase(caseId: string): Promise<string | null> {
  try {
    const rows = await sfQuery<any>(
      `
      SELECT ORG_ID
      FROM CORE.CASES
      WHERE CASE_ID = ?
      LIMIT 1
      `,
      [caseId]
    );
    return rows?.[0]?.ORG_ID ?? null;
  } catch {
    // If CORE.CASES doesn't exist in some environments, don't break the endpoint.
    return null;
  }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: auth.status });
  }

  const { searchParams } = new URL(req.url);
  const caseId = String(searchParams.get("caseId") ?? "").trim();
  if (!caseId) {
    return NextResponse.json({ ok: false, error: "Missing query param: caseId" }, { status: 400 });
  }

  const identity = await getSnowflakeIdentity();
  const orgId = await getOrgIdForCase(caseId);

  const rows = await sfQuery<any>(
    `
    SELECT *
    FROM CORE.FINDINGS
    WHERE CASE_ID = ?
    ORDER BY CREATED_AT DESC
    `,
    [caseId]
  );

  return NextResponse.json({
    ok: true,
    caseId,
    orgId,
    snowflake: identity,
    rows,
  });
}