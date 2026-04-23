import { NextResponse } from "next/server";
import { sfQuery } from "@/lib/snowflake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function escapeSqlString(value: string): string {
  return String(value).replace(/'/g, "''");
}

function toIsoString(value: unknown): string | null {
  if (!value) return null;
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export async function GET(
  _req: Request,
  context: { params: { registryId: string } }
) {
  try {
    const registryId = String(context.params.registryId ?? "").trim();

    if (!registryId) {
      return NextResponse.json(
        { ok: false, error: "Missing registryId" },
        { status: 400 }
      );
    }

    const rows = await sfQuery<any>(`
      SELECT
        REGISTRY_ID,
        ENTITY_NAME,
        CERTIFICATION_STATUS,
        CERTIFIED_AT
      FROM CORE.V_REGISTRY_PUBLIC
      WHERE UPPER(TRIM(REGISTRY_ID)) = UPPER(TRIM('${escapeSqlString(registryId)}'))
      LIMIT 1
    `);

    if (!rows.length) {
      return NextResponse.json(
        { ok: false, error: "Registry record not found" },
        { status: 404 }
      );
    }

    const r = rows[0];

    const certificationStatus = String(r.CERTIFICATION_STATUS ?? "").trim().toUpperCase();
    const isCertified = certificationStatus === "CERTIFIED";

    const badge = {
      status: isCertified ? "CERTIFIED" : "NOT_CERTIFIED",
      label: isCertified ? "GAFAIG Certified" : "Not Certified",
      imageUrl: isCertified
        ? "/badges/gafaig-certified.svg"
        : "/badges/gafaig-not-certified.svg",
    };

    return NextResponse.json({
      ok: true,
      registryId: r.REGISTRY_ID,
      entityName: r.ENTITY_NAME ?? null,
      certificationStatus: r.CERTIFICATION_STATUS ?? null,
      certifiedAt: toIsoString(r.CERTIFIED_AT),
      badge,
      verifyUrl: `/verify/${r.REGISTRY_ID}`,
      registryUrl: `/registry/${r.REGISTRY_ID}`,
      widgetUrl: `/widget-preview/${r.REGISTRY_ID}`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Badge endpoint failed",
      },
      { status: 500 }
    );
  }
}