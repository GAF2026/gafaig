import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function clean(value: unknown): string {
  return String(value ?? "").trim();
}

function unwrapSnowflakeRow(row: any): any {
  if (!row) return null;
  const values = Object.values(row);
  return values.length ? values[0] : row;
}

export async function GET(
  _req: Request,
  { params }: { params: { applicationId: string } }
) {
  const applicationId = clean(params.applicationId);

  if (!applicationId) {
    return NextResponse.json(
      { ok: false, error: "Application ID is required." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const result = await sfQuery(
      `
      SELECT
        APPLICATION_ID,
        REQUEST_ID,
        ORG_NAME,
        CONTACT_EMAIL,
        COUNTRY,
        SYSTEM_NAME,
        SYSTEM_TYPE,
        STATUS,
        CREATED_AT
      FROM GAFAIG_DB.CORE.APPLICATIONS
      WHERE APPLICATION_ID = ?
      LIMIT 1
      `,
      [applicationId]
    );

    const row = result?.[0];

    if (!row) {
      return NextResponse.json(
        { ok: false, error: "Application not found." },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        application: {
          applicationId: row.APPLICATION_ID ?? row.application_id ?? applicationId,
          requestId: row.REQUEST_ID ?? row.request_id ?? null,
          orgName: row.ORG_NAME ?? row.org_name ?? null,
          contactEmail: row.CONTACT_EMAIL ?? row.contact_email ?? null,
          country: row.COUNTRY ?? row.country ?? null,
          systemName: row.SYSTEM_NAME ?? row.system_name ?? null,
          systemType: row.SYSTEM_TYPE ?? row.system_type ?? null,
          status: row.STATUS ?? row.status ?? "INTAKE_RECEIVED",
          createdAt: row.CREATED_AT ?? row.created_at ?? null,
          publicVisibility: false,
          nextStep: "GAFAIG review before structured verification.",
        },
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
            : "Application lookup failed.",
      },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}