import { sfQuery } from "@/lib/snowflake";
import RegistryVerificationPanel from "@/components/registry/RegistryVerificationPanel";

export const dynamic = "force-dynamic";

type RegistryRow = {
  REGISTRY_ID: string;
  ENTITY_NAME: string | null;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  VALID_TO: string | null;
};

type VerifyApiResponse = {
  ok: boolean;
  verified: boolean;
  registryId: string;
  record?: {
    entityName?: string | null;
    entityType?: string | null;
    country?: string | null;
    decisionStatus?: string | null;
    certifiedTier?: string | null;
    certifiedBand?: string | null;
    validTo?: string | null;
  } | null;
  proof?: {
    alg?: string | null;
    kid?: string | null;
    signature?: string | null;
    signedAt?: string | null;
    verificationKeyUrl?: string | null;
    message?: Record<string, unknown> | null;
    messageString?: string | null;
  } | null;
};

async function getRegistry(registryId: string) {
  const rows = await sfQuery<RegistryRow>(
    `
    SELECT
      REGISTRY_ID,
      ENTITY_NAME,
      ENTITY_TYPE,
      COUNTRY,
      CERTIFIED_TIER,
      CERTIFIED_BAND,
      VALID_TO
    FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
    WHERE REGISTRY_ID = ?
    LIMIT 1
    `,
    [registryId]
  );

  return rows[0] || null;
}

async function getVerifyData(
  registryId: string
): Promise<VerifyApiResponse | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL}/api/verify/${registryId}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    const json = await res.json();

    return {
      ok: json.ok,
      verified: json.verified,
      registryId: json.registryId,
      record: {
        entityName: json.record?.entityName ?? null,
        entityType: json.record?.entityType ?? null,
        country: json.record?.country ?? null,
        decisionStatus: json.record?.decisionStatus ?? null,
        certifiedTier: json.record?.certifiedTier ?? null,
        certifiedBand: json.record?.certifiedBand ?? null,
        validTo: json.record?.validTo ?? null,
      },
      proof: {
        alg: json.proof?.alg ?? null,
        kid: json.proof?.kid ?? null,
        signature: json.proof?.signature ?? null,
        signedAt: json.proof?.signedAt ?? null,
        verificationKeyUrl: json.proof?.verificationKeyUrl ?? null,
        message: json.proof?.message ?? null,
        messageString:
          typeof json.proof?.messageString === "string"
            ? json.proof.messageString
            : JSON.stringify(json.proof?.message ?? {}),
      },
    };
  } catch {
    return null;
  }
}

export default async function RegistryPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = params.registryId;

  const row = await getRegistry(registryId);
  const verifyData = await getVerifyData(registryId);

  if (!row) {
    return (
      <div className="p-10 text-center text-sm text-black/70">
        Registry record not found
      </div>
    );
  }

  const entityName = row.ENTITY_NAME || "Unknown Entity";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">{entityName}</h1>

      <RegistryVerificationPanel
        registryId={row.REGISTRY_ID}
        entityName={entityName}
        verifyData={verifyData}
      />
    </div>
  );
}