import { NextResponse } from "next/server";
import crypto from "crypto";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";

function ok(payload: any) {
  return NextResponse.json({ ok: true, ...payload });
}

function bad(error: string, status = 400) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const deficiencyId = String(body.deficiencyId ?? "").trim();
    const caseId = String(body.caseId ?? "").trim();

    const remediationTitle = String(
      body.remediationTitle ?? ""
    ).trim();

    const remediationDescription = String(
      body.remediationDescription ?? ""
    ).trim();

    const sourceUrl = body.sourceUrl
      ? String(body.sourceUrl).trim()
      : null;

    if (!deficiencyId) {
      return bad("deficiencyId is required");
    }

    if (!caseId) {
      return bad("caseId is required");
    }

    if (!remediationTitle) {
      return bad("remediationTitle is required");
    }

    if (!remediationDescription) {
      return bad("remediationDescription is required");
    }

    const remediationId = `REM-${crypto.randomUUID()}`;
    const evidenceId = `EVD-${crypto.randomUUID()}`;

    const submittedBy = "applicant@gafaig.com";
    const organizationName = "Roche";

    await executeQuery(
      `
      INSERT INTO GAFAIG_DB.CORE.VERIFICATION_EVIDENCE
      (
        EVIDENCE_ID,
        CASE_ID,
        EVIDENCE_TYPE,
        TITLE,
        DESCRIPTION,
        SOURCE_URL,
        STORAGE_REF,
        SUBMITTED_BY
      )
      VALUES
      (
        ?, ?, ?, ?, ?, ?, ?, ?
      )
      `,
      [
        evidenceId,
        caseId,
        "remediation_submission",
        remediationTitle,
        remediationDescription,
        sourceUrl,
        deficiencyId,
        submittedBy,
      ]
    );

    return ok({
      remediationId,
      evidenceId,
      deficiencyId,
      caseId,
      submittedBy,
      organizationName,
      status: "SUBMITTED",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error?.message ??
          "Unable to submit remediation.",
      },
      {
        status: 500,
      }
    );
  }
}