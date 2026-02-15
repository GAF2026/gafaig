import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

function requireParam(url: URL, key: string) {
  const v = (url.searchParams.get(key) || "").trim();
  if (!v) throw new Error(`Missing required field: ${key}`);
  return v;
}

function requireBodyField(body: any, key: string) {
  const v = (body?.[key] ?? "").toString().trim();
  if (!v) throw new Error(`Missing required field: ${key}`);
  return v;
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const caseId = requireParam(url, "caseId");

    const sql = `
      SELECT
        ASSIGNMENT_ID AS "assignmentId",
        CASE_ID       AS "caseId",
        ASSIGNED_TO   AS "assignedTo",
        ROLE          AS "role",
        ASSIGNED_AT   AS "assignedAt",
        CREATED_AT    AS "createdAt"
      FROM CORE.VERIFICATION_ASSIGNMENTS
      WHERE CASE_ID = ?
      ORDER BY ASSIGNED_AT DESC
    `;

    const rows = await executeQuery(sql, [caseId]);
    return NextResponse.json({ ok: true, rows: rows || [] });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const caseId = requireBodyField(body, "caseId");
    const assignedTo = requireBodyField(body, "assignedTo");
    const role = (body?.role ?? "reviewer").toString().trim() || "reviewer";

    const assignmentId = `ASN-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

    const sql = `
      INSERT INTO CORE.VERIFICATION_ASSIGNMENTS (
        ASSIGNMENT_ID,
        CASE_ID,
        ASSIGNED_TO,
        ROLE,
        ASSIGNED_AT,
        CREATED_AT
      )
      VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())
    `;

    await executeQuery(sql, [assignmentId, caseId, assignedTo, role]);

    return NextResponse.json({ ok: true, assignmentId });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}