import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin";

function isAdmin(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader.includes(`${COOKIE_NAME}=1`);
}

function uuid(prefix = "") {
  // good enough for dev IDs; store as STRING in Snowflake
  const id = crypto.randomUUID();
  return prefix ? `${prefix}${id}` : id;
}

function nowIso() {
  return new Date().toISOString();
}

async function columnExists(schema: string, table: string, col: string) {
  const rows = await executeQuery(
    `
    SELECT 1
    FROM GAFAIG_DB.INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = ?
      AND TABLE_NAME = ?
      AND COLUMN_NAME = ?
    LIMIT 1
    `,
    [schema.toUpperCase(), table.toUpperCase(), col.toUpperCase()]
  );
  return Array.isArray(rows) && rows.length > 0;
}

/**
 * GET /api/admin/verification/cases?page=1&pageSize=10&status=all&participantId=&standardCode=
 * Admin-only list endpoint
 */
export async function GET(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    const page = Math.max(1, Number(searchParams.get("page") || "1"));
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize") || "10")));

    const status = (searchParams.get("status") || "all").trim();
    const participantId = (searchParams.get("participantId") || "").trim();
    const standardCode = (searchParams.get("standardCode") || "").trim();

    const where: string[] = [];
    const binds: any[] = [];

    if (status && status !== "all") {
      where.push("STATUS = ?");
      binds.push(status);
    }
    if (participantId) {
      where.push("PARTICIPANT_ID = ?");
      binds.push(participantId);
    }
    if (standardCode) {
      where.push("STANDARD_CODE = ?");
      binds.push(standardCode);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // include optional columns if present
    const hasEntityName = await columnExists("CORE", "VERIFICATION_CASES", "ENTITY_NAME");
    const hasVerificationType = await columnExists("CORE", "VERIFICATION_CASES", "VERIFICATION_TYPE");

    const selectEntityName = hasEntityName ? `ENTITY_NAME as "entityName",` : `"unknown" as "entityName",`;
    const selectVerificationType = hasVerificationType
      ? `VERIFICATION_TYPE as "verificationType",`
      : `"unknown" as "verificationType",`;

    const countSql = `
      SELECT COUNT(*) as "total"
      FROM GAFAIG_DB.CORE.VERIFICATION_CASES
      ${whereSql}
    `;
    const countRows = await executeQuery(countSql, binds);
    const total = Number(countRows?.[0]?.total || 0);

    const offset = (page - 1) * pageSize;

    // IMPORTANT: bind LIMIT/OFFSET (avoid string interpolation)
    const listSql = `
      SELECT
        CASE_ID as "caseId",
        PARTICIPANT_ID as "participantId",
        ${selectEntityName}
        ${selectVerificationType}
        STANDARD_CODE as "standardCode",
        STANDARD_VERSION as "standardVersion",
        STATUS as "status",
        PRIORITY as "priority",
        SUBMITTED_AT as "submittedAt",
        CREATED_AT as "createdAt",
        UPDATED_AT as "updatedAt"
      FROM GAFAIG_DB.CORE.VERIFICATION_CASES
      ${whereSql}
      ORDER BY UPDATED_AT DESC
      LIMIT ?
      OFFSET ?
    `;

    const rows = await executeQuery(listSql, [...binds, pageSize, offset]);

    return NextResponse.json({
      ok: true,
      rows: rows || [],
      total,
      page,
      pageSize,
      filters: { status, participantId, standardCode },
    });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}

/**
 * POST /api/admin/verification/cases
 * Body: { participantId, standardCode, standardVersion, priority?, entityName?, verificationType? }
 *
 * Creates a case + a "submitted" event.
 * Includes idempotency: if an active case already exists for the same participant+standard, return it.
 */
export async function POST(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    const participantId = String(body?.participantId || "").trim();
    const standardCode = String(body?.standardCode || "").trim();
    const standardVersion = String(body?.standardVersion || "").trim();
    const priority = String(body?.priority || "normal").trim();

    // new fields (optional but recommended)
    const entityName = String(body?.entityName || "").trim();
    const verificationType = String(body?.verificationType || "").trim(); // e.g. "submission" | "participant"

    if (!participantId || !standardCode || !standardVersion) {
      return NextResponse.json(
        { ok: false, error: "Missing participantId, standardCode, or standardVersion" },
        { status: 400 }
      );
    }

    // ✅ Idempotency: if a case exists for this participant + standard + version and is still active, return it.
    const existing = await executeQuery(
      `
      SELECT CASE_ID as "caseId", STATUS as "status"
      FROM GAFAIG_DB.CORE.VERIFICATION_CASES
      WHERE PARTICIPANT_ID = ?
        AND STANDARD_CODE = ?
        AND STANDARD_VERSION = ?
        AND STATUS IN ('received','in_review','needs_more_info','approved')
      ORDER BY UPDATED_AT DESC
      LIMIT 1
      `,
      [participantId, standardCode, standardVersion]
    );

    if (existing?.[0]?.caseId) {
      return NextResponse.json({
        ok: true,
        caseId: existing[0].caseId,
        status: existing[0].status || "received",
        reused: true,
      });
    }

    // optional columns
    const hasEntityName = await columnExists("CORE", "VERIFICATION_CASES", "ENTITY_NAME");
    const hasVerificationType = await columnExists("CORE", "VERIFICATION_CASES", "VERIFICATION_TYPE");

    const caseId = uuid("CASE-");
    const eventId = uuid("EVT-");

    // Build INSERT dynamically depending on optional columns
    const cols: string[] = [
      "CASE_ID",
      "PARTICIPANT_ID",
      "STANDARD_CODE",
      "STANDARD_VERSION",
      "STATUS",
      "PRIORITY",
      "SUBMITTED_AT",
      "CREATED_AT",
      "UPDATED_AT",
    ];
    const placeholders: string[] = ["?", "?", "?", "?", "?", "?", "CURRENT_TIMESTAMP()", "CURRENT_TIMESTAMP()", "CURRENT_TIMESTAMP()"];
    const binds: any[] = [caseId, participantId, standardCode, standardVersion, "received", priority];

    if (hasEntityName) {
      cols.splice(2, 0, "ENTITY_NAME"); // after PARTICIPANT_ID
      placeholders.splice(2, 0, "?");
      binds.splice(2, 0, entityName || "Unknown entity");
    }

    if (hasVerificationType) {
      cols.splice(2, 0, "VERIFICATION_TYPE"); // after PARTICIPANT_ID (and after entity name if inserted)
      placeholders.splice(2, 0, "?");
      binds.splice(2, 0, verificationType || "submission");
    }

    const insertCaseSql = `
      INSERT INTO GAFAIG_DB.CORE.VERIFICATION_CASES
      (${cols.join(", ")})
      VALUES (${placeholders.join(", ")})
    `;

    await executeQuery(insertCaseSql, binds);

    // ✅ Event insert (avoid PARSE_JSON(?) errors)
    // TRY_PARSE_JSON returns VARIANT; safe for DETAILS VARIANT column
    const insertEventSql = `
      INSERT INTO GAFAIG_DB.CORE.VERIFICATION_EVENTS
      (EVENT_ID, CASE_ID, EVENT_TYPE, ACTOR, DETAILS, CREATED_AT)
      SELECT ?, ?, ?, ?, TRY_PARSE_JSON(?), CURRENT_TIMESTAMP()
    `;

    await executeQuery(insertEventSql, [
      eventId,
      caseId,
      "submitted",
      "admin",
      JSON.stringify({
        at: nowIso(),
        participantId,
        standardCode,
        standardVersion,
        priority,
        entityName: entityName || null,
        verificationType: verificationType || null,
      }),
    ]);

    return NextResponse.json({ ok: true, caseId, status: "received", reused: false });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || String(err) }, { status: 500 });
  }
}