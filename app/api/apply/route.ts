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
  systemDescription?: string;
  deploymentStage?: string;
};

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function limitLength(value: string, max: number): string {
  return value.length > max ? value.slice(0, max) : value;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function noStoreHeaders() {
  return { "Cache-Control": "no-store" };
}

export async function POST(req: Request) {
  let body: ApplyPayload = {};

  try {
    body = (await req.json()) as ApplyPayload;
  } catch {
    body = {};
  }

  const orgName = limitLength(clean(body.orgName), 200);
  const email = limitLength(clean(body.email), 200);
  const country = limitLength(clean(body.country), 100);
  const systemName = limitLength(clean(body.systemName), 200);
  const systemType = limitLength(clean(body.systemType), 100);
  const systemDescription = limitLength(
    clean(body.systemDescription),
    2000
  );
  const deploymentStage = limitLength(
    clean(body.deploymentStage),
    100
  );

  if (!orgName) {
    return NextResponse.json(
      { ok: false, error: "Organization name is required." },
      { status: 400, headers: noStoreHeaders() }
    );
  }

  if (orgName.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Organization name must be at least 2 characters." },
      { status: 400, headers: noStoreHeaders() }
    );
  }

  if (!email) {
    return NextResponse.json(
      { ok: false, error: "Contact email is required." },
      { status: 400, headers: noStoreHeaders() }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Invalid email format." },
      { status: 400, headers: noStoreHeaders() }
    );
  }

  try {
    const result = await sfQuery(
      `
      CALL GAFAIG_DB.CORE.SP_CREATE_APPLICATION(
        ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
      `,
      [
        systemName || "certification",
        orgName,
        email,
        systemType || "Organization",
        country || null,
        systemName || null,
        systemType || null,
        systemDescription || null,
        deploymentStage || null,
      ]
    );

    const row = result?.[0];
    const payload = row ? (Object.values(row)[0] as any) : null;

    if (
      !payload ||
      typeof payload.REQUEST_ID !== "string" ||
      typeof payload.APPLICATION_ID !== "string"
    ) {
      throw new Error("Invalid procedure response");
    }

    return NextResponse.json(
      {
        ok: true,
        requestId: payload.REQUEST_ID,
        applicationId: payload.APPLICATION_ID,
        intakeStage: payload.INTAKE_STAGE ?? "APPLICATION_RECEIVED",
        intakeStatus: payload.INTAKE_STATUS ?? "PRIVATE_REVIEW_QUEUED",
        reviewStatus: payload.REVIEW_STATUS ?? "PENDING",
        message: "Application received.",
      },
      { headers: noStoreHeaders() }
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
      { status: 500, headers: noStoreHeaders() }
    );
  }
}