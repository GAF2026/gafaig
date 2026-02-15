import { NextResponse } from "next/server";
import { querySnowflake } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin";

function isAdmin(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader.includes(`${COOKIE_NAME}=1`);
}

// Normalize to a consistent, lowercase status key
function normStatus(s: any) {
  return String(s || "").trim().toLowerCase();
}

// Allowed transitions (Model 1 – you can refine later)
const ALLOWED_NEXT: Record<string, string[]> = {
  received: ["in_review", "rejected", "needs_more_info"],
  in_review: ["approved", "rejected", "needs_more_info", "suspended"],
  needs_more_info: ["in_review", "rejected", "suspended"],
  approved: ["suspended"], // approved can be suspended later (e.g., incident / noncompliance)
  rejected: [],            // terminal by default
  suspended: ["in_review", "approved", "rejected"], // can reinstate or finalize
};

function uuid(prefix: string) {
  return `${prefix}-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`;
}

export async function POST(req: Request) {
  try {
    if (!isAdmin(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));

    const caseId = String(body?.caseId || "").trim();
    const requested = normStatus(body?.status);
    const actor = String(body?.actor || "admin").trim();
    const note = String(body?.note || "").trim();

    if (!caseId) {
      return NextResponse.json({ ok: false, error: "Missing required field: caseId" }, { status: 400 });
    }
    if (!requested) {
      return NextResponse.json({ ok: false, error: "Missing required field: status" }, { status: 400 });
    }

    // Load current status
    const currentRows = await querySnowflake(
      `
      SELECT STATUS
      FROM GAFAIG_DB.CORE.VERIFICATION_CASES
      WHERE CASE_ID = ?
      LIMIT 1
      `,
      [caseId]
    );

    if (!currentRows || currentRows.length === 0) {
      return NextResponse.json({ ok: false, error: `Case not found: ${caseId}` }, { status: 404 });
    }

    const from = normStatus(currentRows[0]?.STATUS);

    // Allow no-op (same -> same), but still log if you want.
    // For now: treat as OK and log a status_changed event.
    const allowed = ALLOWED_NEXT[from] ?? [];

    if (requested !== from && !allowed.includes(requested)) {
      return NextResponse.json(
        {
          ok: false,
          error: `Invalid status transition: "${from}" -> "${requested}". Allowed next: ${allowed.length ? allowed.join(", ") : "(none)"}`,
          from,
          to: requested,
          allowedNext: allowed,
        },
        { status: 400 }
      );
    }

    // Update case status
    await querySnowflake(
      `
      UPDATE GAFAIG_DB.CORE.VERIFICATION_CASES
      SET STATUS = ?, UPDATED_AT = CURRENT_TIMESTAMP()
      WHERE CASE_ID = ?
      `,
      [requested, caseId]
    );

    // Write event row (avoid PARSE_JSON(...) in VALUES — use SELECT pattern)
    const eventId = uuid("EVT");

    const details = {
      at: new Date().toISOString(),
      from,
      to: requested,
      note: note || null,
    };

    await querySnowflake(
      `
      INSERT INTO GAFAIG_DB.CORE.VERIFICATION_EVENTS
        (EVENT_ID, CASE_ID, EVENT_TYPE, ACTOR, DETAILS, CREATED_AT)
      SELECT
        ?, ?, 'status_changed', ?, PARSE_JSON(?), CURRENT_TIMESTAMP()
      `,
      [eventId, caseId, actor, JSON.stringify(details)]
    );

    return NextResponse.json({
      ok: true,
      caseId,
      from,
      to: requested,
      eventId,
    });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message || String(e) },
      { status: 500 }
    );
  }
}