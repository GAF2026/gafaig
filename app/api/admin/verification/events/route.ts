// app/api/admin/verification/events/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/admin";
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

function inferActor(req: NextRequest): string {
  // Today we only have a cookie-based admin model.
  // Middleware + login set gafaig_admin to "demo" or "1".
  // For now we record the cookie value in actor.
  const v = req.cookies.get("gafaig_admin")?.value;
  if (v === "1") return "admin";
  if (v === "demo") return "demo";
  return "unknown";
}

export async function GET(req: NextRequest) {
  // Demo allowed: cookie "demo" or "1"
  if (!requireAdmin(req, true)) {
    return jsonError("Unauthorized", 401);
  }

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

export async function POST(req: NextRequest) {
  // Demo allowed: cookie "demo" or "1"
  if (!requireAdmin(req, true)) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const bodyText = await req.text();
    const parsed = safeJsonParse(bodyText);
    if (!parsed.ok) return jsonError(`Invalid JSON: ${parsed.error}`, 400);

    const { caseId, eventType, actor, details } = parsed.value || {};

    const cid = pickStr(caseId).trim();
    const et = pickStr(eventType).trim();
    const actInput = pickStr(actor).trim();

    if (!cid) return jsonError("Missing required field: caseId", 400);
    if (!et) return jsonError("Missing required field: eventType", 400);

    // If actor not provided, infer from cookie
    const act = actInput || inferActor(req);

    // DETAILS is VARIANT. We'll store it as JSON -> PARSE_JSON -> VARIANT.
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