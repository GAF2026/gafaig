import { NextResponse } from "next/server";
import { executeQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "gafaig_admin";

function isAuthed(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  return cookieHeader.includes(`${COOKIE_NAME}=1`);
}

function ok(payload: any) {
  return NextResponse.json({ ok: true, ...payload });
}

function bad(error: string, status = 400, extra?: any) {
  return NextResponse.json({ ok: false, error, ...(extra || {}) }, { status });
}

/**
 * Persisted summaries live in GAFAIG_DB.CORE.EVIDENCE_SUMMARIES
 * (plural) with NO CASE_ID column (keyed by EVIDENCE_ID + STYLE + MODEL).
 */
function summariesTableFQN() {
  const db = process.env.SNOWFLAKE_DATABASE;
  const schema = process.env.SNOWFLAKE_SCHEMA;
  if (!db) throw new Error("Missing env: SNOWFLAKE_DATABASE");
  if (!schema) throw new Error("Missing env: SNOWFLAKE_SCHEMA");
  return `${db}.${schema}.EVIDENCE_SUMMARIES`;
}

async function ensureSummariesTable() {
  const fqn = summariesTableFQN();

  // Match the exact schema you created in Snowflake:
  // EVIDENCE_ID, STYLE, MODEL, SUMMARY, CORTEX_AVAILABLE, CORTEX_ERROR,
  // PROMPT_VERSION, INPUT_CHARS, OUTPUT_CHARS, CREATED_AT, UPDATED_AT
  const sql = `
    CREATE TABLE IF NOT EXISTS ${fqn} (
      EVIDENCE_ID       STRING   NOT NULL,
      STYLE             STRING   NOT NULL,
      MODEL             STRING   NOT NULL,
      SUMMARY           STRING   NOT NULL,

      CORTEX_AVAILABLE  BOOLEAN,
      CORTEX_ERROR      STRING,

      PROMPT_VERSION    STRING,
      INPUT_CHARS       NUMBER,
      OUTPUT_CHARS      NUMBER,

      CREATED_AT        TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP(),
      UPDATED_AT        TIMESTAMP_LTZ DEFAULT CURRENT_TIMESTAMP()
    )
  `;
  await executeQuery(sql, []);
}

function evidenceTableFQN() {
  const db = process.env.SNOWFLAKE_DATABASE;
  const schema = process.env.SNOWFLAKE_SCHEMA;
  if (!db) throw new Error("Missing env: SNOWFLAKE_DATABASE");
  if (!schema) throw new Error("Missing env: SNOWFLAKE_SCHEMA");
  return `${db}.${schema}.VERIFICATION_EVIDENCE`;
}

async function loadEvidenceForSummary(evidenceId: string) {
  const evFqn = evidenceTableFQN();

  // Pull the fields we can summarize without needing file content.
  const sql = `
    SELECT
      EVIDENCE_ID,
      CASE_ID,
      EVIDENCE_TYPE,
      TITLE,
      DESCRIPTION,
      SOURCE_URL,
      STORAGE_REF,
      SUBMITTED_BY,
      SUBMITTED_AT,
      CREATED_AT
    FROM ${evFqn}
    WHERE EVIDENCE_ID = ?
    LIMIT 1
  `;
  const rows: any[] = (await executeQuery(sql, [evidenceId])) || [];
  return rows[0] || null;
}

/**
 * Upsert keyed by (EVIDENCE_ID, STYLE, MODEL). No CASE_ID.
 */
async function upsertSummary(args: {
  evidenceId: string;
  style: string;
  model: string;
  summary: string;
  cortexAvailable?: boolean | null;
  cortexError?: string | null;
  promptVersion?: string | null;
  inputChars?: number | null;
  outputChars?: number | null;
}) {
  const fqn = summariesTableFQN();
  await ensureSummariesTable();

  const sql = `
    MERGE INTO ${fqn} t
    USING (
      SELECT
        ? AS EVIDENCE_ID,
        ? AS STYLE,
        ? AS MODEL,
        ? AS SUMMARY,
        ? AS CORTEX_AVAILABLE,
        ? AS CORTEX_ERROR,
        ? AS PROMPT_VERSION,
        ? AS INPUT_CHARS,
        ? AS OUTPUT_CHARS
    ) s
      ON t.EVIDENCE_ID = s.EVIDENCE_ID AND t.STYLE = s.STYLE AND t.MODEL = s.MODEL
    WHEN MATCHED THEN UPDATE SET
      t.SUMMARY = s.SUMMARY,
      t.CORTEX_AVAILABLE = s.CORTEX_AVAILABLE,
      t.CORTEX_ERROR = s.CORTEX_ERROR,
      t.PROMPT_VERSION = s.PROMPT_VERSION,
      t.INPUT_CHARS = s.INPUT_CHARS,
      t.OUTPUT_CHARS = s.OUTPUT_CHARS,
      t.UPDATED_AT = CURRENT_TIMESTAMP()
    WHEN NOT MATCHED THEN INSERT (
      EVIDENCE_ID,
      STYLE,
      MODEL,
      SUMMARY,
      CORTEX_AVAILABLE,
      CORTEX_ERROR,
      PROMPT_VERSION,
      INPUT_CHARS,
      OUTPUT_CHARS,
      CREATED_AT,
      UPDATED_AT
    ) VALUES (
      s.EVIDENCE_ID,
      s.STYLE,
      s.MODEL,
      s.SUMMARY,
      s.CORTEX_AVAILABLE,
      s.CORTEX_ERROR,
      s.PROMPT_VERSION,
      s.INPUT_CHARS,
      s.OUTPUT_CHARS,
      CURRENT_TIMESTAMP(),
      CURRENT_TIMESTAMP()
    )
  `;

  await executeQuery(sql, [
    args.evidenceId,
    args.style,
    args.model,
    args.summary,
    args.cortexAvailable ?? null,
    args.cortexError ?? null,
    args.promptVersion ?? null,
    args.inputChars ?? null,
    args.outputChars ?? null,
  ]);
}

async function getStoredSummariesForCase(caseId: string) {
  const sumFqn = summariesTableFQN();
  const evFqn = evidenceTableFQN();
  await ensureSummariesTable();

  /**
   * Join summaries -> evidence to filter by caseId (since summaries table has no CASE_ID).
   */
  const sql = `
    SELECT
      s.EVIDENCE_ID,
      s.STYLE,
      s.MODEL,
      s.SUMMARY,
      s.CORTEX_AVAILABLE,
      s.CORTEX_ERROR,
      s.PROMPT_VERSION,
      s.INPUT_CHARS,
      s.OUTPUT_CHARS,
      s.CREATED_AT,
      s.UPDATED_AT
    FROM ${sumFqn} s
    JOIN ${evFqn} e
      ON e.EVIDENCE_ID = s.EVIDENCE_ID
    WHERE e.CASE_ID = ?
    ORDER BY s.UPDATED_AT DESC
  `;
  const rows = await executeQuery(sql, [caseId]);
  return rows || [];
}

function buildPromptFromEvidence(e: any) {
  const safe = (v: any) => (v === null || v === undefined || v === "" ? "N/A" : String(v));

  // Keep it simple and deterministic. Later we can enrich with doc parsing.
  return [
    `Summarize the following GAFAIG verification evidence in ${"bullets"} format.`,
    ``,
    `Title: ${safe(e?.TITLE)}`,
    `Type: ${safe(e?.EVIDENCE_TYPE)}`,
    `Description: ${safe(e?.DESCRIPTION)}`,
    `Source URL: ${safe(e?.SOURCE_URL)}`,
    `Storage Ref: ${safe(e?.STORAGE_REF)}`,
    `Submitted: ${safe(e?.SUBMITTED_AT)}`,
    `Submitted By: ${safe(e?.SUBMITTED_BY)}`,
  ].join("\n");
}

async function tryCortexComplete(model: string, prompt: string) {
  // If Cortex isn't enabled/authorized, this may throw. We'll catch and fallback.
  const sql = `SELECT SNOWFLAKE.CORTEX.COMPLETE(?, ?) AS SUMMARY`;
  const rows: any[] = (await executeQuery(sql, [model, prompt])) || [];
  const summary = rows?.[0]?.SUMMARY;
  return typeof summary === "string" ? summary : "";
}

/**
 * GET /api/admin/verification/evidence/summary?caseId=CASE-0001
 * Returns stored summaries for a case (via join to VERIFICATION_EVIDENCE).
 */
export async function GET(req: Request) {
  if (!isAuthed(req)) return bad("Unauthorized", 401);

  const url = new URL(req.url);
  const caseId = url.searchParams.get("caseId") || "";
  if (!caseId) return bad("Missing query param: caseId", 400);

  try {
    const rows = await getStoredSummariesForCase(caseId);
    return ok({ rows });
  } catch (e: any) {
    return bad(e?.message || "Failed to load stored summaries", 500);
  }
}

/**
 * POST /api/admin/verification/evidence/summary
 * Body: { evidenceId, style, model, persist? }
 *
 * - Generates a summary (Cortex if available; fallback if not).
 * - If persist=true, upserts into EVIDENCE_SUMMARIES.
 */
export async function POST(req: Request) {
  if (!isAuthed(req)) return bad("Unauthorized", 401);

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const evidenceId = (body?.evidenceId || "").toString().trim();
  const style = (body?.style || "bullets").toString().trim();
  const model = (body?.model || "snowflake-arctic").toString().trim();
  const persist = !!body?.persist;

  if (!evidenceId) return bad("Missing body field: evidenceId", 400);

  const promptVersion = "v1";
  let cortexAvailable: boolean | null = null;
  let cortexError: string | null = null;

  try {
    const ev = await loadEvidenceForSummary(evidenceId);
    if (!ev) return bad(`Evidence not found: ${evidenceId}`, 404);

    // Build prompt (we can vary by style later; for now the UI passes style)
    const prompt = buildPromptFromEvidence(ev);
    const inputChars = prompt.length;

    // Try Cortex, fallback if it fails or returns empty
    let summary = "";
    try {
      summary = await tryCortexComplete(model, prompt);
      if (summary && summary.trim()) {
        cortexAvailable = true;
      } else {
        cortexAvailable = false;
      }
    } catch (err: any) {
      cortexAvailable = false;
      cortexError = err?.message || "Cortex call failed";
    }

    if (!summary || !summary.trim()) {
      // Deterministic fallback (what you saw working earlier)
      summary = [
        `- Title: ${ev?.TITLE ?? "N/A"}`,
        `- Type: ${ev?.EVIDENCE_TYPE ?? "N/A"}`,
        `- Description: ${ev?.DESCRIPTION ?? "N/A"}`,
        `- Source URL: ${ev?.SOURCE_URL ? `<${ev.SOURCE_URL}>` : "N/A"}`,
        `- Submitted: ${
          ev?.SUBMITTED_AT ? new Date(ev.SUBMITTED_AT).toString() : "N/A"
        }`,
        `- Submitted By: ${ev?.SUBMITTED_BY ?? "N/A"}`,
      ].join("\n");

      // If Cortex errored, keep cortexError; otherwise, just show fallback availability.
    }

    const outputChars = summary.length;

    if (persist) {
      await upsertSummary({
        evidenceId,
        style,
        model,
        summary,
        cortexAvailable,
        cortexError,
        promptVersion,
        inputChars,
        outputChars,
      });
    }

    return ok({
      evidenceId,
      style,
      model,
      cortexAvailable,
      summary,
      cortexError,
      persisted: persist,
    });
  } catch (e: any) {
    return bad(e?.message || "Summary generation failed", 500);
  }
}