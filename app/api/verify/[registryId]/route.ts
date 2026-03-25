import { NextRequest, NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { getRegistryByRegistryId } from "@/lib/queries/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function asIsoString(value: string | null | undefined): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString();
}

function canonicalizeVerificationMessage(record: any) {
  return JSON.stringify({
    registryId: record.registryId,
    entityName: record.entityName,
    entityType: record.entityType,
    country: record.country,
    applicationId: record.applicationId,
    caseId: record.caseId,
    certificationStatus: record.certificationStatus,
    certifiedScore: record.certifiedScore,
    certifiedTier: record.certifiedTier,
    certifiedBand: record.certifiedBand,
    decisionStatus: record.decisionStatus,
    certifiedAt: asIsoString(record.certifiedAt),
    validFrom: asIsoString(record.validFrom),
    validTo: asIsoString(record.validTo),
    lastActivityAt: asIsoString(record.lastActivityAt),
  });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { registryId: string } }
) {
  try {
    const registryId = decodeURIComponent(params.registryId || "").trim();

    if (!registryId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Missing registryId",
        },
        { status: 400 }
      );
    }

    const row = await getRegistryByRegistryId(registryId);

    if (!row) {
      return NextResponse.json(
        {
          ok: false,
          error: "Registry record not found",
        },
        { status: 404 }
      );
    }

    const verified = row.certificationStatus === "Certified";
    const message = canonicalizeVerificationMessage(row);
    const signature = createHash("sha256").update(message).digest("hex");
    const signedAt = asIsoString(
      row.lastActivityAt ?? row.certifiedAt ?? row.validFrom
    );

    return NextResponse.json({
      ok: true,
      verified,
      registryId: row.registryId,
      entity: row.entityName,
      entityType: row.entityType,
      country: row.country,
      applicationId: row.applicationId,
      caseId: row.caseId,
      status: row.certificationStatus,
      tier: row.certifiedTier,
      band: row.certifiedBand,
      score: row.certifiedScore,
      decisionStatus: row.decisionStatus,
      certifiedAt: asIsoString(row.certifiedAt),
      validFrom: asIsoString(row.validFrom),
      validTo: asIsoString(row.validTo),
      lastActivityAt: asIsoString(row.lastActivityAt),
      record: {
        registryId: row.registryId,
        entityName: row.entityName,
        entityType: row.entityType,
        country: row.country,
        applicationId: row.applicationId,
        caseId: row.caseId,
        certificationStatus: row.certificationStatus,
        certifiedScore: row.certifiedScore,
        certifiedTier: row.certifiedTier,
        certifiedBand: row.certifiedBand,
        decisionStatus: row.decisionStatus,
        certifiedAt: asIsoString(row.certifiedAt),
        validFrom: asIsoString(row.validFrom),
        validTo: asIsoString(row.validTo),
        lastActivityAt: asIsoString(row.lastActivityAt),
      },
      proof: {
        alg: "sha256",
        signature,
        message,
        signedAt,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Verification lookup failed";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}