import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { normalizeId } from "@/lib/ids";
import { snowflakeQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ConvertToCaseResult = {
  ok: boolean;
  error?: string;
  caseId?: string;
  applicationId?: string | null;
  requestId?: string | null;
  participantId?: string | null;
  orgId?: string | null;
  alreadyExisted?: boolean;
};

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function extractProcedureResult(
  rows: Record<string, unknown>[]
): ConvertToCaseResult | null {
  const first = rows?.[0];
  if (!first) return null;

  const raw =
    first["SP_CREATE_CASE_FROM_APPLICATION"] ??
    first["sp_create_case_from_application"];

  if (!raw) return null;

  if (typeof raw === "string") {
    return JSON.parse(raw) as ConvertToCaseResult;
  }

  return raw as ConvertToCaseResult;
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdmin(req);
    if (!auth.ok) {
      return json(
        { ok: false, error: auth.error ?? "Unauthorized" },
        auth.status ?? 401
      );
    }

    const body = await req.json();

    const requestId = normalizeId(String(body?.requestId ?? ""));
    const participantId = normalizeId(String(body?.participantId ?? ""));
    const actor = String(body?.actor ?? "admin").trim();

    if (!requestId) {
      return json({ ok: false, error: "Missing requestId" }, 400);
    }

    if (!participantId) {
      return json({ ok: false, error: "Missing participantId" }, 400);
    }

    const sql = `
      CALL GAFAIG_DB.CORE.SP_CREATE_CASE_FROM_APPLICATION(?, ?, ?)
    `;

    const rows = await snowflakeQuery<Record<string, unknown>>(sql, [
      requestId,
      participantId,
      actor,
    ]);

    const result = extractProcedureResult(rows);

    if (!result) {
      return json({ ok: false, error: "Procedure returned no result" }, 500);
    }

    if (!result.ok) {
      return json(
        { ok: false, error: result.error ?? "Case creation failed" },
        400
      );
    }

    return json({
      ok: true,
      caseId: result.caseId ?? null,
      applicationId: result.applicationId ?? null,
      requestId: result.requestId ?? requestId,
      participantId: result.participantId ?? participantId,
      orgId: result.orgId ?? null,
      alreadyExisted: Boolean(result.alreadyExisted),
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to convert application to case",
      },
      500
    );
  }
}