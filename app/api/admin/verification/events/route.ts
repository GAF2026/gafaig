import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function safeJsonParse(text: string) {
  try {
    return { ok: true as const, value: JSON.parse(text) };
  } catch (e: any) {
    return { ok: false as const, error: e?.message || "Invalid JSON" };
  }
}

function pickStr(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const caseId = (searchParams.get("caseId") || "").trim();
    if (!caseId) return jsonError("Missing required field: caseId", 400);

    const sql = `
      SELECT
        EVENT_ID   AS "eventId",
        CASE_ID    AS "caseId",
        EVENT_TYPE AS "eventType",
        ACTOR      AS "actor",
        DETAILS    AS "details",
        CREATED_AT AS "createdAt"
      FROM CORE.VERIFICATION_EVENTS
      WHERE CASE_ID = ?
      ORDER BY CREATED_AT DESC
      LIMIT 200
    `;

    const rows = await executeQuery(sql, [caseId]);

    return NextResponse.json({ ok: true, rows: rows || [] });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const parsed = safeJsonParse(bodyText);
    if (!parsed.ok) return jsonError(`Invalid JSON: ${parsed.error}`, 400);

    const { caseId, eventType, actor, details } = parsed.value || {};

    const cid = pickStr(caseId).trim();
    const et = pickStr(eventType).trim();
    const act = pickStr(actor).trim();

    if (!cid) return jsonError("Missing required field: caseId", 400);
    if (!et) return jsonError("Missing required field: eventType", 400);

    // DETAILS is VARIANT. Safest: pass a JS object as JSON string and PARSE_JSON it in SELECT-only contexts.
    // For INSERT, we'll store as a JSON string and cast to VARIANT using TO_VARIANT(PARSE_JSON(?)).
    const detailsJson = details === undefined ? null : JSON.stringify(details);

    const eventId = `EVT-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

    const sql = `
      INSERT INTO CORE.VERIFICATION_EVENTS
        (EVENT_ID, CASE_ID, EVENT_TYPE, ACTOR, DETAILS, CREATED_AT)
      SELECT
        ?, ?, ?, ?,
        IFF(? IS NULL, NULL, TO_VARIANT(PARSE_JSON(?))),
        CURRENT_TIMESTAMP()
    `;

    // note: we pass detailsJson twice to match the two ? placeholders
    await executeQuery(sql, [eventId, cid, et, act || null, detailsJson, detailsJson]);

    return NextResponse.json({ ok: true, eventId });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}