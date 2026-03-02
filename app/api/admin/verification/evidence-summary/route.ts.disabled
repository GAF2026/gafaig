import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin";

/**
 * Basic cookie check (same pattern as decisions route)
 */
function isAuthed(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader.includes(`${COOKIE_NAME}=1`);
}

/**
 * Safe JSON response helpers
 */
function ok(payload: any) {
  return NextResponse.json({ ok: true, ...payload });
}

function bad(error: string, status = 400, extra?: any) {
  return NextResponse.json(
    { ok: false, error, ...(extra || {}) },
    { status }
  );
}

/**
 * POST /api/admin/verification/evidence-summary
 *
 * Body:
 * {
 *   evidenceId: string,
 *   style?: "bullets" | "paragraph",
 *   model?: string
 * }
 */
export async function POST(req: Request) {
  try {
    if (!isAuthed(req)) {
      return bad("Unauthorized", 401);
    }

    const body = await req.json();
    const evidenceId = String(body?.evidenceId || "").trim();
    const style = String(body?.style || "bullets");
    const model = String(body?.model || "snowflake-arctic");

    if (!evidenceId) {
      return bad("Missing evidenceId");
    }

    // 1️⃣ Fetch evidence record
    const rows = await executeQuery(
      `
      SELECT
        EVIDENCE_ID,
        EVIDENCE_TYPE,
        TITLE,
        DESCRIPTION,
        SOURCE_URL,
        SUBMITTED_AT,
        SUBMITTED_BY
      FROM CORE.VERIFICATION_EVIDENCE
      WHERE EVIDENCE_ID = ?
      LIMIT 1
      `,
      [evidenceId]
    );

    if (!rows || rows.length === 0) {
      return bad("Evidence not found", 404);
    }

    const r = rows[0];

    const title = r.TITLE || "Untitled evidence";
    const type = r.EVIDENCE_TYPE || "unknown";
    const desc = r.DESCRIPTION || "";
    const sourceUrl = r.SOURCE_URL || "";
    const submittedAt = r.SUBMITTED_AT || "";
    const submittedBy = r.SUBMITTED_BY || "";

    /**
     * 2️⃣ Build prompt for Cortex
     */
    const prompt = `
You are an AI governance auditor.
Summarize the following evidence clearly and concisely.

Title: ${title}
Type: ${type}
Description: ${desc}
Source URL: ${sourceUrl}
Submitted: ${submittedAt}
Submitted By: ${submittedBy}

Return the summary in ${style === "bullets" ? "bullet point format" : "a concise paragraph"}.
`;

    let summary = "";
    let cortexAvailable = true;
    let cortexError: string | null = null;

    /**
     * 3️⃣ Attempt Cortex completion
     */
    try {
      const cortexRows = await executeQuery(
        `
        SELECT
          SNOWFLAKE.CORTEX.COMPLETE(?, ?) AS RESPONSE
        `,
        [model, prompt]
      );

      summary =
        cortexRows?.[0]?.RESPONSE ||
        cortexRows?.[0]?.response ||
        "";

      if (!summary) {
        throw new Error("Empty Cortex response");
      }
    } catch (err: any) {
      /**
       * 4️⃣ Fallback mode (no Cortex available)
       */
      cortexAvailable = false;
      cortexError = err?.message || String(err);

      const bullets: string[] = [];

      bullets.push(`- Evidence: ${title}`);
      bullets.push(`- Type: ${type}`);

      if (desc) bullets.push(`- Notes: ${desc}`);
      if (sourceUrl) bullets.push(`- Source: ${sourceUrl}`);

      if (submittedAt) {
        bullets.push(
          `- Submitted: ${submittedAt}${
            submittedBy ? ` by ${submittedBy}` : ""
          }`
        );
      }

      summary =
        style === "paragraph"
          ? bullets.join(". ")
          : bullets.join("\n");
    }

    return ok({
      evidenceId,
      style,
      model,
      cortexAvailable,
      summary,
      warning: cortexAvailable
        ? undefined
        : "Cortex model is unavailable in this Snowflake region. Enable Cross-Region Inference (AWS_US / AZURE_US / ANY_REGION) to turn on live Cortex summaries.",
      cortexError,
    });
  } catch (e: any) {
    return bad(e?.message || "Unexpected server error", 500);
  }
}