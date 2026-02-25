import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { sfQueryResult } from "@/lib/snowflake";
import { requireAdmin } from "@/lib/auth/require";

export async function POST(req: NextRequest, ctx: { params: { caseId: string } }) {
  try {
    await requireAdmin(req);

    const caseId = (ctx?.params?.caseId || "").trim();
    if (!caseId) {
      return NextResponse.json({ ok: false, error: "Missing caseId" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const notes = typeof body?.notes === "string" && body.notes.trim() ? body.notes.trim() : "Initial public registry publish";

    // Actor: record who triggered it from the app side
    const actorRes = await sfQueryResult<{ ACTOR: string }>(`SELECT CURRENT_USER() AS ACTOR`);
    const actor = actorRes.ok && actorRes.rows?.[0]?.ACTOR ? actorRes.rows[0].ACTOR : "unknown";

    const callRes = await sfQueryResult<any>(
      `CALL CORE.APPROVE_CASE_V1(?, ?, ?)`,
      [caseId, actor, notes]
    );

    if (!callRes.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Publish failed",
          details: callRes.error || "Unknown Snowflake error",
          hint:
            "If you see a role error, ensure the Snowflake user/role used by the app has permission to CALL CORE.APPROVE_CASE_V1 and any required role (e.g., GAFAIG_PUBLISHER).",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      caseId,
      actor,
      notes,
      result: callRes.rows?.[0] ?? null,
    });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Unknown error" }, { status: 500 });
  }
}