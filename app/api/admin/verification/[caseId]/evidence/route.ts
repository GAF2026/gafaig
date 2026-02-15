import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin";

function isAuthed(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader.includes(`${COOKIE_NAME}=1`);
}

function asInt(v: string | null, fallback: number) {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

function genId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function safeString(v: any) {
  return v == null ? "" : String(v);
}

function tryParseJson(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * GET /api/admin/verification/[caseId]/evidence?page=1&pageSize=20
 * Returns evidence rows for a case.
 */
export async function GET(req: Request, { params }: { params: { caseId: string } }) {
  try {
    if (!isAuthed(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const caseId = params?.caseId;
    if (!caseId) {
      return NextResponse.json({ ok: false, error: "Missing caseId" }, { status: 400 });
    }

    const { searchParams } = new URL(req.url);
    const page = asInt(searchParams.get("page"), 1);
    const pageSize = Math.min(asInt(searchParams.get("pageSize"), 20), 100);
    const offset = (page - 1) * pageSize;

    const countSql = `
      SELECT COUNT(*) AS TOTAL
      FROM CORE.VERIFICATION_EVIDENCE
      WHERE CASE_ID = ?
    `;
    const totalRows = await executeQuery(countSql, [caseId]);
    const total = Number(totalRows?.[0]?.TOTAL || 0);

    const listSql = `
      SELECT
        EVIDENCE_ID   AS "evidenceId",
        CASE_ID       AS "caseId",
        EVIDENCE_TYPE AS "evidenceType",
        TITLE         AS "title",
        DESCRIPTION   AS "description",
        SOURCE_URL    AS "sourceUrl",
        STORAGE_REF   AS "storageRef",
        SUBMITTED_BY  AS "submittedBy",
        SUBMITTED_AT  AS "submittedAt",
        CREATED_AT    AS "createdAt",
        UPDATED_AT    AS "updatedAt"
      FROM CORE.VERIFICATION_EVIDENCE
      WHERE CASE_ID = ?
      ORDER BY SUBMITTED_AT DESC
      LIMIT ?
      OFFSET ?
    `;

    const rows = await executeQuery(listSql, [caseId, pageSize, offset]);

    return NextResponse.json({ ok: true, rows, total, page, pageSize });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}

/**
 * POST /api/admin/verification/[caseId]/evidence
 * Body: { evidenceType, title, description?, sourceUrl?, storageRef?, submittedBy? }
 */
export async function POST(req: Request, { params }: { params: { caseId: string } }) {
  try {
    if (!isAuthed(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const caseId = params?.caseId;
    if (!caseId) {
      return NextResponse.json({ ok: false, error: "Missing caseId" }, { status: 400 });
    }

    // IMPORTANT: parse body via raw text first to avoid req.json() stream issues
    const contentType = req.headers.get("content-type") || "";
    const raw = await req.text();
    const body = raw ? (tryParseJson(raw) ?? {}) : {};

    const evidenceType = safeString((body as any)?.evidenceType).trim();
    const title = safeString((body as any)?.title).trim();

    const description = (body as any)?.description != null ? String((body as any).description) : null;
    const sourceUrl = (body as any)?.sourceUrl != null ? String((body as any).sourceUrl) : null;
    const storageRef = (body as any)?.storageRef != null ? String((body as any).storageRef) : null;
    const submittedBy = (body as any)?.submittedBy != null ? String((body as any).submittedBy) : null;

    if (!evidenceType) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing evidenceType",
          debug: {
            contentType,
            rawLength: raw.length,
            rawPreview: raw.slice(0, 200),
            parsedKeys: Object.keys(body as any),
          },
        },
        { status: 400 }
      );
    }
    if (!title) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing title",
          debug: {
            contentType,
            rawLength: raw.length,
            rawPreview: raw.slice(0, 200),
            parsedKeys: Object.keys(body as any),
          },
        },
        { status: 400 }
      );
    }

    const evidenceId = genId("EVD");

    const insertSql = `
      INSERT INTO CORE.VERIFICATION_EVIDENCE
      (EVIDENCE_ID, CASE_ID, EVIDENCE_TYPE, TITLE, DESCRIPTION, SOURCE_URL, STORAGE_REF, SUBMITTED_BY, SUBMITTED_AT, CREATED_AT, UPDATED_AT)
      VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP())
    `;

    await executeQuery(insertSql, [
      evidenceId,
      caseId,
      evidenceType,
      title,
      description,
      sourceUrl,
      storageRef,
      submittedBy,
    ]);

    const detailsJson = JSON.stringify({ evidenceId, evidenceType, title });

    const eventSql = `
      INSERT INTO CORE.VERIFICATION_EVENTS
      (EVENT_ID, CASE_ID, EVENT_TYPE, ACTOR, DETAILS, CREATED_AT)
      SELECT
        ?,
        ?,
        'evidence_added',
        ?,
        PARSE_JSON(?),
        CURRENT_TIMESTAMP()
    `;

    await executeQuery(eventSql, [
      genId("EVT"),
      caseId,
      submittedBy || "admin",
      detailsJson,
    ]);

    return NextResponse.json({ ok: true, evidenceId });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}