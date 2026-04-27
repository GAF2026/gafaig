import { NextResponse } from "next/server";
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

  try {
    const result = await sfQuery(
      `
      CALL CORE.SP_CREATE_APPLICATION(
        ?, ?, ?, ?, ?
      )
      `,
      [
        systemName ? clean(systemName) : "certification",
        clean(orgName),
        clean(email),
        systemType ? clean(systemType) : "Organization",
        country ? clean(country) : null,
      ]
    );

    // Snowflake returns result as VARIANT in first row/column
    const row = result?.[0];
    const payload = row ? Object.values(row)[0] as any : null;

    if (!payload || !payload.REQUEST_ID || !payload.APPLICATION_ID) {
      throw new Error("Invalid procedure response");
    }

    return NextResponse.json(
      {
        ok: true,
        requestId: payload.REQUEST_ID,
        applicationId: payload.APPLICATION_ID,
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