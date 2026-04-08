import { NextResponse } from "next/server";
import crypto from "crypto";
import { sfQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type ApplyPayload = {
  orgName?: string;
  email?: string;
  country?: string;
  systemName?: string;
  systemType?: string;
};

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function normalizeUpper(value: unknown): string {
  return clean(value).toUpperCase();
}

function makeId(prefix: string) {
  const yyyyMMdd =
    new Date().getFullYear().toString() +
    String(new Date().getMonth() + 1).padStart(2, "0") +
    String(new Date().getDate()).padStart(2, "0");

  const rand = crypto.randomBytes(4).toString("hex");
  return `${prefix}-${yyyyMMdd}-${rand}`.trim().toUpperCase();
}

export async function POST(req: Request) {
  let body: ApplyPayload = {};

  try {
    body = (await req.json()) as ApplyPayload;
  } catch {
    body = {};
  }

  const orgName = clean(body.orgName);
  const email = clean(body.email);
  const country = clean(body.country);
  const systemName = clean(body.systemName);
  const systemType = clean(body.systemType);

  if (!orgName) {
    return NextResponse.json(
      { ok: false, error: "Organization name is required." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Contact email is required." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const requestId = makeId("REQ");
  const applicationId = makeId("APP");

  try {
    await sfQuery(
      `
      INSERT INTO GAFAIG_DB.CORE.APPLICATIONS
      (
        REQUEST_ID,
        TYPE,
        STATUS,
        ORG_NAME,
        EMAIL,
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
        ?,
        ?,
        ?
      `,
      [
        normalizeUpper(requestId),
        systemName ? clean(systemName) : "AI system application",
        "received",
        clean(orgName),
        clean(email),
        normalizeUpper(applicationId),
        systemType ? clean(systemType) : "Organization",
        country ? clean(country) : null,
      ]
    );

    return NextResponse.json(
      {
        ok: true,
        requestId: normalizeUpper(requestId),
        applicationId: normalizeUpper(applicationId),
        message: "Application received.",
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Application submission failed.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}