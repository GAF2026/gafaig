// app/api/admin/verification/decisions/route.ts
import { NextResponse } from "next/server";
import { sfQuery, executeQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin";

// Accept legacy cookie values to avoid breaking existing demo flow
function isAuthed(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  // supports: gafaig_admin=1 (new) and gafaig_admin=demo (legacy)
  return (
    cookieHeader.includes(`${COOKIE_NAME}=1`) ||
    cookieHeader.includes(`${COOKIE_NAME}=demo`)
  );
}

function requireField(obj: any, key: string) {
  const v = obj?.[key];
  if (typeof v !== "string" || v.trim().length === 0) {
    throw new Error(`Missing required field: ${key}`);
  }
  return v.trim();
}

function optionalString(obj: any, key: string) {
  const v = obj?.[key];
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t.length ? t : null;
}

async function getCaseStatus(caseId: string) {
  const rows = await sfQuery<any>(
    `
    SELECT STATUS
    FROM CORE.VERIFICATION_CASES
    WHERE CASE_ID = ?
    LIMIT 1
    `,
    [caseId]
  );
  return (rows?.[0]?.STATUS ?? null) as string | null;
}

async function getLatestSnapshot(caseId: string) {
  const rows = await sfQuery<any>(
    `
    SELECT
      SNAPSHOT_ID,
      SNAPSHOT_AT,
      TIER,
      BAND,
      SCORING_MODEL_VERSION
    FROM CORE.CASE_SCORE_SNAPSHOTS_V2
    WHERE CASE_ID = ?
    ORDER BY SNAPSHOT_AT DESC
    LIMIT 1
    `,
    [caseId]
  );
  return rows?.[0] ?? null;
}

export async function GET(req: Request) {
  try {
    if (!isAuthed(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const caseId = (searchParams.get("caseId") || "").trim();
    if (!caseId) {
      return NextResponse.json({ ok: false, error: "Missing required field: caseId" }, { status: 400 });
    }

    const rows = await executeQuery(
      `
      SELECT
        DECISION_ID AS "decisionId",
        CASE_ID AS "caseId",
        DECISION AS "decision",
        DECIDED_BY AS "decidedBy",
        DECIDED_AT AS "decidedAt",
        SUMMARY AS "summary",
        CONDITIONS AS "conditions"
      FROM CORE.VERIFICATION_DECISIONS
      WHERE CASE_ID = ?
      ORDER BY DECIDED_AT DESC
      LIMIT 1
      `,
      [caseId]
    );

    return NextResponse.json({ ok: true, row: rows?.[0] ?? null });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!isAuthed(req)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const caseId = requireField(body, "caseId");
    const decisionRaw = requireField(body, "decision").toLowerCase();

    const allowed = new Set(["approved", "rejected", "suspended", "in_review"]);
    if (!allowed.has(decisionRaw)) {
      return NextResponse.json(
        { ok: false, error: `Invalid decision. Allowed: ${Array.from(allowed).join(", ")}` },
        { status: 400 }
      );
    }

    // Write-lock: once approved, block further state changes via this endpoint
    const currentStatus = await getCaseStatus(caseId);
    if (currentStatus === "approved" && decisionRaw !== "approved") {
      return NextResponse.json(
        { ok: false, error: "Write-locked: approved cases cannot be modified via this endpoint." },
        { status: 409 }
      );
    }

    const decidedBy = optionalString(body, "decidedBy") || "admin";
    const summary = optionalString(body, "summary");
    const conditions = optionalString(body, "conditions");

    // Publish guard: approval requires an engine-produced snapshot with tier/band
    if (decisionRaw === "approved") {
      if (!summary) {
        return NextResponse.json(
          { ok: false, error: "Approval requires a non-empty summary." },
          { status: 400 }
        );
      }

      const snap = await getLatestSnapshot(caseId);
      if (!snap) {
        return NextResponse.json(
          { ok: false, error: "Approval blocked: no score snapshot exists for this case." },
          { status: 409 }
        );
      }

      const tier = snap?.TIER ?? null;
      const band = snap?.BAND ?? null;

      if (!tier || !band) {
        return NextResponse.json(
          { ok: false, error: "Approval blocked: snapshot missing Tier/Band." },
          { status: 409 }
        );
      }
    }

    const decisionId = `DEC-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;

    // 1) Insert decision
    await executeQuery(
      `
      INSERT INTO CORE.VERIFICATION_DECISIONS
        (DECISION_ID, CASE_ID, DECISION, DECIDED_BY, DECIDED_AT, SUMMARY, CONDITIONS, CREATED_AT)
      VALUES
        (?, ?, ?, ?, CURRENT_TIMESTAMP(), ?, ?, CURRENT_TIMESTAMP())
      `,
      [decisionId, caseId, decisionRaw, decidedBy, summary, conditions]
    );

    // 2) Update case status
    await executeQuery(
      `
      UPDATE CORE.VERIFICATION_CASES
      SET STATUS = ?, UPDATED_AT = CURRENT_TIMESTAMP()
      WHERE CASE_ID = ?
      `,
      [decisionRaw, caseId]
    );

    // 3) Add event (DETAILS is VARIANT)
    const eventId = `EVT-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
    const detailsJson = JSON.stringify({
      decision: decisionRaw,
      decidedBy,
      summary: summary || null,
      conditions: conditions || null,
      publishGuard: decisionRaw === "approved" ? "passed" : null,
    });

    await executeQuery(
      `
      INSERT INTO CORE.VERIFICATION_EVENTS
        (EVENT_ID, CASE_ID, EVENT_TYPE, ACTOR, DETAILS, CREATED_AT)
      SELECT
        ?, ?, ?, ?, PARSE_JSON(?), CURRENT_TIMESTAMP()
      `,
      [eventId, caseId, "decision", decidedBy, detailsJson]
    );

    return NextResponse.json({ ok: true, decisionId, caseId, decision: decisionRaw, eventId });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}