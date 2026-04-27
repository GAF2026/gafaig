import { NextRequest, NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";
import { requireAdmin } from "@/lib/auth/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonError(message: string, status = 500) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function normalizeRows<T = any>(result: any): T[] {
  if (!result) return [];
  if (Array.isArray(result)) return result as T[];
  if (Array.isArray((result as any).rows)) return (result as any).rows as T[];
  return [];
}

function extractProcedurePayload(result: any): any | null {
  const rows = normalizeRows<any>(result);
  const row = rows?.[0];
  if (!row) return null;
  const values = Object.values(row);
  return values.length > 0 ? values[0] : null;
}

function pickStr(v: any) {
  if (v === null || v === undefined) return "";
  return String(v);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { caseId: string } }
) {
  if (!requireAdmin(req, true)) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const caseId = String(params?.caseId || "").trim();
    if (!caseId) return jsonError("Missing caseId", 400);

    const result = await executeQuery(
      `
      SELECT
        EVIDENCE_ID  AS "evidenceId",
        CASE_ID      AS "caseId",
        EVIDENCE_TYPE AS "evidenceType",
        TITLE        AS "title",
        DESCRIPTION  AS "description",
        SOURCE_URL   AS "sourceUrl",
        STORAGE_REF  AS "storageRef",
        SUBMITTED_BY AS "submittedBy",
        SUBMITTED_AT AS "submittedAt",
        CREATED_AT   AS "createdAt",
        UPDATED_AT   AS "updatedAt"
      FROM GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
      WHERE CASE_ID = ?
      ORDER BY CREATED_AT DESC
      `,
      [caseId]
    );

    const rows = normalizeRows(result);

    return NextResponse.json({
      ok: true,
      rows,
      total: rows.length,
      source: "snowflake",
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to load evidence");
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { caseId: string } }
) {
  if (!requireAdmin(req, true)) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const caseId = String(params?.caseId || "").trim();
    if (!caseId) return jsonError("Missing caseId", 400);

    const body = await req.json().catch(() => ({}));

    const evidenceType = pickStr(body?.evidenceType).trim() || "document";
    const title = pickStr(body?.title).trim();
    const description =
      body?.description === undefined ? null : pickStr(body.description);
    const sourceUrl =
      body?.sourceUrl === undefined ? null : pickStr(body.sourceUrl);

    if (!title) {
      return jsonError("Missing required field: title", 400);
    }

    const result = await executeQuery(
      `
      CALL GAFAIG_DB.CORE.SP_CREATE_EVIDENCE(
        ?, ?, ?, ?, ?
      )
      `,
      [caseId, evidenceType, title, description, sourceUrl]
    );

    const payload = extractProcedurePayload(result);

    if (!payload?.evidenceId) {
      return jsonError("Invalid evidence procedure response", 500);
    }

    return NextResponse.json({
      ok: true,
      row: {
        evidenceId: payload.evidenceId,
        caseId: payload.caseId ?? caseId,
        evidenceType,
        title,
        description,
        sourceUrl,
      },
      source: "snowflake",
    });
  } catch (e: any) {
    return jsonError(e?.message ?? "Failed to create evidence");
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { caseId: string } }
) {
  if (!requireAdmin(req, true)) {
    return jsonError("Unauthorized", 401);
  }

  return jsonError(
    "DELETE not yet implemented for Snowflake evidence (intentional fail-closed)",
    501
  );
}