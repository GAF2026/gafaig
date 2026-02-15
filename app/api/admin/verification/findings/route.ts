import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

function requireString(v: any, name: string) {
  const s = typeof v === "string" ? v.trim() : "";
  if (!s) throw new Error(`Missing required field: ${name}`);
  return s;
}

function safeJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// -------------------------------
// GET /api/admin/verification/findings?caseId=CASE-0001
// Lists findings for a case
// -------------------------------
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const caseId = (searchParams.get("caseId") || "").trim();
    if (!caseId) {
      return NextResponse.json(
        { ok: false, error: "Missing required query param: caseId" },
        { status: 400 }
      );
    }

    const rows = await executeQuery(
      `
      SELECT
        FINDING_ID   as "findingId",
        CASE_ID      as "caseId",
        CONTROL_ID   as "controlId",
        CONTROL_TITLE as "controlTitle",
        RESULT       as "result",
        SEVERITY     as "severity",
        RATIONALE    as "rationale",
        CREATED_AT   as "createdAt",
        UPDATED_AT   as "updatedAt"
      FROM CORE.VERIFICATION_FINDINGS
      WHERE CASE_ID = ?
      ORDER BY UPDATED_AT DESC, CREATED_AT DESC
      `,
      [caseId]
    );

    return NextResponse.json({ ok: true, rows: rows || [] });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}

// -------------------------------
// POST /api/admin/verification/findings
// Adds a finding for a case
// Body:
// {
//   caseId, controlId, controlTitle, result, severity, rationale?
// }
// -------------------------------
export async function POST(req: Request) {
  try {
    const raw = await req.text();
    const body = safeJsonParse(raw);
    if (!body) {
      return NextResponse.json(
        { ok: false, error: "Request body must be valid JSON." },
        { status: 400 }
      );
    }

    const caseId = requireString(body.caseId, "caseId");
    const controlId = requireString(body.controlId, "controlId");
    const controlTitle = requireString(body.controlTitle, "controlTitle");
    const result = requireString(body.result, "result");
    const severity = (typeof body.severity === "string" ? body.severity.trim() : "medium") || "medium";
    const rationale = typeof body.rationale === "string" ? body.rationale.trim() : null;

    const findingId = `FND-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

    await executeQuery(
      `
      INSERT INTO CORE.VERIFICATION_FINDINGS (
        FINDING_ID,
        CASE_ID,
        CONTROL_ID,
        CONTROL_TITLE,
        RESULT,
        SEVERITY,
        RATIONALE,
        CREATED_AT,
        UPDATED_AT
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())
      `,
      [findingId, caseId, controlId, controlTitle, result, severity, rationale]
    );

    // Optional: add an event for audit trail (if table exists)
    try {
      const eventId = `EVT-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
      await executeQuery(
        `
        INSERT INTO CORE.VERIFICATION_EVENTS (
          EVENT_ID, CASE_ID, EVENT_TYPE, ACTOR, DETAILS, CREATED_AT
        )
        VALUES (
          ?, ?, 'finding_added', 'admin', PARSE_JSON(?), CURRENT_TIMESTAMP()
        )
        `,
        [
          eventId,
          caseId,
          JSON.stringify({
            findingId,
            controlId,
            result,
            severity,
          }),
        ]
      );
    } catch {
      // ignore if events table missing or PARSE_JSON restrictions
    }

    return NextResponse.json({ ok: true, findingId });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}