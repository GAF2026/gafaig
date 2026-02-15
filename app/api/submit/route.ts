import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

function nowIso() {
  return new Date().toISOString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));

    const submissionType = String(body?.submissionType ?? "application");

    const requestId =
      submissionType === "renewal"
        ? `REN-${Date.now()}`
        : `APP-${Date.now()}`;

    const orgName = String(body?.orgName ?? "");
    const contactEmail = String(body?.contactEmail ?? "");
    const requestedTier = String(body?.requestedTier ?? "");
    const renewalPeriod = String(body?.renewalPeriod ?? "");

    const ts = nowIso();
    const rawJson = JSON.stringify(body ?? {});

    await executeQuery(
      `INSERT INTO GAFAIG_DB.CORE.SUBMISSIONS (
        request_id,
        submission_type,
        org_name,
        contact_email,
        status,
        requested_tier,
        renewal_period,
        created_at,
        updated_at,
        raw
      )
      SELECT
        ?, ?, ?, ?, ?, ?, ?, ?, ?, TO_VARIANT(PARSE_JSON(?))`,
      [
        requestId,
        submissionType,
        orgName,
        contactEmail,
        "received",
        requestedTier || null,
        renewalPeriod || null,
        ts,
        ts,
        rawJson,
      ]
    );

    return NextResponse.json({ ok: true, requestId });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Failed to save submission" },
      { status: 500 }
    );
  }
}