import { NextResponse } from "next/server";
import crypto from "crypto";
import { sfQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function nowIso() {
  return new Date().toISOString();
}

function makeId(prefix = "APP") {
  const yyyyMMdd =
    new Date().getFullYear().toString() +
    String(new Date().getMonth() + 1).padStart(2, "0") +
    String(new Date().getDate()).padStart(2, "0");
  const rand = crypto.randomBytes(4).toString("hex");
  return `${prefix}-${yyyyMMdd}-${rand}`;
}

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(req: Request) {
  let payload: Record<string, unknown> = {};

  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  const orgName = clean(payload.orgName);
  const email = clean(payload.email);
  const country = clean(payload.country);
  const systemName = clean(payload.systemName);
  const systemType = clean(payload.systemType);

  if (!orgName || !email) {
    return json(
      {
        ok: false,
        error: "Organization name and email are required.",
      },
      400
    );
  }

  const requestId = makeId("APP");
  const applicationId = makeId("APP-DEMO");
  const createdAt = nowIso();

  try {
    await sfQuery(
      `
      INSERT INTO GAFAIG_DB.CORE.APPLICATIONS (
        REQUEST_ID,
        TYPE,
        STATUS,
        ORG_NAME,
        EMAIL,
        CREATED_AT,
        UPDATED_AT,
        APPLICATION_ID,
        ORG_TYPE,
        COUNTRY
      )
      SELECT
        ?,
        ?,
        ?,
        ?,
        ?,
        CURRENT_TIMESTAMP(),
        CURRENT_TIMESTAMP(),
        ?,
        ?,
        ?
      `,
      [
        requestId,
        systemType || "AI_SYSTEM",
        "PENDING",
        orgName,
        email,
        applicationId,
        systemName || "Organization",
        country || null,
      ]
    );

    return json({
      ok: true,
      requestId,
      applicationId,
      createdAt,
      message: "Application received.",
      intake: {
        orgName,
        email,
        country: country || null,
        systemName: systemName || null,
        systemType: systemType || null,
      },
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error ? error.message : "Application submission failed.",
      },
      500
    );
  }
}