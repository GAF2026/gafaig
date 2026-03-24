import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/require";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

function firstString(...values: unknown[]): string | null {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const s = String(value).trim();
    if (s) return s;
  }
  return null;
}

function firstNumber(...values: unknown[]): number | null {
  for (const value of values) {
    if (value === null || value === undefined) continue;
    const n = Number(value);
    if (!Number.isNaN(n)) return n;
  }
  return null;
}

export async function POST(
  req: NextRequest,
  context: { params: { caseId: string } }
) {
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return json({ ok: false, error: auth.error ?? "Unauthorized" }, auth.status ?? 401);
  }

  try {
    const caseId = String(context.params.caseId || "").trim();
    if (!caseId) {
      return json({ ok: false, error: "Missing caseId" }, 400);
    }

    const body = await req.json().catch(() => ({}));
    const actor = String(body?.actor || "admin").trim() || "admin";
    const notes = firstString(body?.notes) ?? null;

    // 1) Load current score/status row
    const scoreRows = await sfQuery<Record<string, unknown>>(
      `
      SELECT
        CASE_ID,
        ORG_ID,
        FINAL_SCORE,
        TIER,
        BAND
      FROM GAFAIG_DB.CORE.V_GOVERNANCE_SCORE_CASE
      WHERE TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))
      LIMIT 1
      `,
      [caseId]
    );

    const scoreRow = scoreRows?.[0];
    if (!scoreRow) {
      return json(
        { ok: false, error: `Case ${caseId} not found in V_GOVERNANCE_SCORE_CASE` },
        404
      );
    }

    // 2) Publish using CALL, because this is a PROCEDURE not a FUNCTION
    const callRows = await sfQuery<Record<string, unknown>>(
      `
      CALL GAFAIG_DB.CORE.SP_PUBLISH_CASE_TO_REGISTRY_V4(?, ?)
      `,
      [caseId, actor]
    );

    const callRow = callRows?.[0] ?? null;
    const callPayload = callRow
      ? (Object.values(callRow)[0] as Record<string, unknown>)
      : null;

    const ok =
      !!callPayload &&
      (callPayload.ok === true ||
        String(callPayload.ok).toLowerCase() === "true");

    if (!ok) {
      const errorMessage =
        firstString(callPayload?.error) ?? "Publish procedure returned failure";
      return json({ ok: false, error: errorMessage, result: callPayload }, 500);
    }

    // 3) Resolve latest published snapshot
    const snapshotRows = await sfQuery<Record<string, unknown>>(
      `
      SELECT
        REGISTRY_ID,
        REGISTRY_SNAPSHOT_ID,
        CASE_ID,
        ENTITY_NAME,
        VERIFICATION_TYPE,
        MODEL_VERSION,
        SCORE,
        TIER,
        BAND,
        CERTIFIED_SCORE,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        CERTIFIED_AT,
        REGISTRY_STATUS,
        CREATED_AT
      FROM GAFAIG_DB.CORE.REGISTRY_SNAPSHOTS
      WHERE TRIM(UPPER(CASE_ID)) = TRIM(UPPER(?))
      ORDER BY CREATED_AT DESC
      LIMIT 1
      `,
      [caseId]
    );

    const snapshot = snapshotRows?.[0];
    if (!snapshot) {
      return json(
        { ok: false, error: "Publish completed but no registry snapshot was found" },
        500
      );
    }

    // 4) Return clean API payload
    return json({
      ok: true,
      caseId,
      actor,
      notes,
      registryId:
        firstString(snapshot.REGISTRY_ID) ??
        firstString(callPayload?.registryId),
      registrySnapshotId:
        firstString(snapshot.REGISTRY_SNAPSHOT_ID) ??
        firstString(callPayload?.registrySnapshotId),
      entityName: firstString(snapshot.ENTITY_NAME),
      verificationType: firstString(snapshot.VERIFICATION_TYPE),
      modelVersion: firstString(snapshot.MODEL_VERSION),
      score:
        firstNumber(snapshot.CERTIFIED_SCORE, snapshot.SCORE, callPayload?.score),
      tier:
        firstString(snapshot.CERTIFIED_TIER, snapshot.TIER, callPayload?.tier),
      band:
        firstString(snapshot.CERTIFIED_BAND, snapshot.BAND, callPayload?.band),
      certifiedAt: firstString(snapshot.CERTIFIED_AT),
      registryStatus: firstString(snapshot.REGISTRY_STATUS),
      result: callPayload,
    });
  } catch (e) {
    return json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Unknown error",
      },
      500
    );
  }
}