import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { snowflakeQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ParticipantRow = {
  participantId: string;
  applicationId: string | null;
  name: string | null;
  entityName: string | null;
  participantType: string | null;
  entityType: string | null;
  country: string | null;
  verificationStatus: string | null;
  contactEmail: string | null;
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function clean(value: string | null): string {
  return String(value ?? "").trim();
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

    const url = new URL(req.url);
    const q = clean(url.searchParams.get("q"));
    const applicationId = clean(url.searchParams.get("applicationId"));
    const limitRaw = Number(url.searchParams.get("limit") || "20");
    const limit = Math.min(Math.max(limitRaw || 20, 1), 100);

    const where: string[] = [];
    const binds: Array<string | number> = [];

    if (applicationId) {
      where.push(`TRIM(UPPER(COALESCE(APPLICATION_ID, ''))) = TRIM(UPPER(?))`);
      binds.push(applicationId);
    }

    if (q) {
      where.push(`
        (
          COALESCE(PARTICIPANT_ID::STRING, '') ILIKE '%' || ? || '%'
          OR COALESCE(NAME::STRING, '') ILIKE '%' || ? || '%'
          OR COALESCE(ENTITY_NAME::STRING, '') ILIKE '%' || ? || '%'
          OR COALESCE(CONTACT_EMAIL::STRING, '') ILIKE '%' || ? || '%'
          OR COALESCE(COUNTRY::STRING, '') ILIKE '%' || ? || '%'
        )
      `);
      binds.push(q, q, q, q, q);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    const sql = `
      SELECT
        PARTICIPANT_ID,
        APPLICATION_ID,
        NAME,
        ENTITY_NAME,
        PARTICIPANT_TYPE,
        ENTITY_TYPE,
        COUNTRY,
        VERIFICATION_STATUS,
        CONTACT_EMAIL
      FROM GAFAIG_DB.CORE.PARTICIPANTS
      ${whereSql}
      ORDER BY UPDATED_AT DESC NULLS LAST, CREATED_AT DESC NULLS LAST, PARTICIPANT_ID ASC
      LIMIT ?
    `;

    const raw = await snowflakeQuery<Record<string, unknown>>(sql, [
      ...binds,
      limit,
    ]);

    const rows: ParticipantRow[] = raw.map((row) => ({
      participantId: String(row.PARTICIPANT_ID ?? ""),
      applicationId:
        row.APPLICATION_ID == null || String(row.APPLICATION_ID).trim() === ""
          ? null
          : String(row.APPLICATION_ID).trim(),
      name:
        row.NAME == null || String(row.NAME).trim() === ""
          ? null
          : String(row.NAME).trim(),
      entityName:
        row.ENTITY_NAME == null || String(row.ENTITY_NAME).trim() === ""
          ? null
          : String(row.ENTITY_NAME).trim(),
      participantType:
        row.PARTICIPANT_TYPE == null || String(row.PARTICIPANT_TYPE).trim() === ""
          ? null
          : String(row.PARTICIPANT_TYPE).trim(),
      entityType:
        row.ENTITY_TYPE == null || String(row.ENTITY_TYPE).trim() === ""
          ? null
          : String(row.ENTITY_TYPE).trim(),
      country:
        row.COUNTRY == null || String(row.COUNTRY).trim() === ""
          ? null
          : String(row.COUNTRY).trim(),
      verificationStatus:
        row.VERIFICATION_STATUS == null || String(row.VERIFICATION_STATUS).trim() === ""
          ? null
          : String(row.VERIFICATION_STATUS).trim(),
      contactEmail:
        row.CONTACT_EMAIL == null || String(row.CONTACT_EMAIL).trim() === ""
          ? null
          : String(row.CONTACT_EMAIL).trim(),
    }));

    return json({
      ok: true,
      rows,
      total: rows.length,
      filters: {
        q,
        applicationId,
      },
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to search participants",
      },
      500
    );
  }
}