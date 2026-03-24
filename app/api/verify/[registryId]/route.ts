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

function canonicalizeVerificationMessage(record: Awaited<ReturnType<typeof getRegistryByRegistryId>>) {
  if (!record) return "";

  return JSON.stringify({
    registryId: record.registryId,
    applicationId: record.applicationId,
    caseId: record.caseId,
    entityName: record.entityName,
    entityType: record.entityType,
    country: record.country,
    certificationStatus: record.certificationStatus,
    certifiedScore: record.certifiedScore,
    certifiedTier: record.certifiedTier,
    certifiedBand: record.certifiedBand,
    decisionStatus: record.decisionStatus,
    certifiedAt: asIsoString(record.certifiedAt),
    validFrom: asIsoString(record.validFrom),
    validTo: asIsoString(record.validTo),
    lastActivityAt: asIsoString(record.lastActivityAt),
    snapshotId: record.snapshotId,
    modelVersion: record.modelVersion,
    renewalStatus: record.renewalStatus,
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

    const record = await getRegistryByRegistryId(registryId);

    if (!record) {
      return NextResponse.json(
        {
          ok: false,
          error: "Registry record not found",
        },
        { status: 404 }
      );
    }

    const verified =
      String(record.decisionStatus || "").toLowerCase() === "published";

    const message = canonicalizeVerificationMessage(record);
    const signature = createHash("sha256").update(message).digest("hex");
    const signedAt = asIsoString(record.lastActivityAt ?? record.certifiedAt);

    return NextResponse.json({
      ok: true,
      registryId: record.registryId,
      verified,
      record: {
        registryId: record.registryId,
        applicationId: record.applicationId,
        caseId: record.caseId,
        entityName: record.entityName,
        entityType: record.entityType,
        country: record.country,
        certificationStatus: record.certificationStatus,
        certifiedScore: record.certifiedScore,
        certifiedTier: record.certifiedTier,
        certifiedBand: record.certifiedBand,
        decisionStatus: record.decisionStatus,
        certifiedAt: asIsoString(record.certifiedAt),
        validFrom: asIsoString(record.validFrom),
        validTo: asIsoString(record.validTo),
        lastActivityAt: asIsoString(record.lastActivityAt),
        snapshotId: record.snapshotId,
        modelVersion: record.modelVersion,
        renewalStatus: record.renewalStatus,
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