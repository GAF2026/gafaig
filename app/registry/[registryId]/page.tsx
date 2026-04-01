import RegistryVerificationPanel from "@/components/registry/RegistryVerificationPanel";
import RegistryTrustTools from "@/components/registry/RegistryTrustTools";

export const dynamic = "force-dynamic";

type RegistryApiResult = {
  registryId?: string;
  entityName?: string | null;
  entityType?: string | null;
  country?: string | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  decisionStatus?: string | null;
  certifiedAt?: string | null;
  validTo?: string | null;
};

type RegistryApiResponse = {
  ok?: boolean;
  count?: number;
  results?: RegistryApiResult[];
};

type VerifyApiResponse = {
  ok?: boolean;
  verified?: boolean;
  registryId?: string;
  record?: {
    registryId?: string | null;
    entityName?: string | null;
    entityType?: string | null;
    country?: string | null;
    applicationId?: string | null;
    caseId?: string | null;
    certificationStatus?: string | null;
    certifiedTier?: string | null;
    certifiedBand?: string | null;
    decisionStatus?: string | null;
    certifiedAt?: string | null;
    validFrom?: string | null;
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
  error?: string;
};

async function getRegistry(
  registryId: string
): Promise<RegistryApiResponse | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/registry?registryId=${encodeURIComponent(
        registryId
      )}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    return (await res.json()) as RegistryApiResponse;
  } catch {
    return null;
  }
}

async function getVerifyData(
  registryId: string
): Promise<VerifyApiResponse | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify/${encodeURIComponent(
        registryId
      )}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;
    return (await res.json()) as VerifyApiResponse;
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

  const data = await getRegistry(registryId);
  const verifyData = await getVerifyData(registryId);

  if (!data?.results?.length && !verifyData?.record) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-xl font-semibold">Registry record not found</h1>
      </div>
    );
  }

  const row = data?.results?.[0] || {};

  const entityName =
    row.entityName ||
    verifyData?.record?.entityName ||
    "Unknown Entity";

  const normalizedVerifyData = verifyData
    ? {
        ok: Boolean(verifyData.ok),
        verified: Boolean(verifyData.verified),
        registryId: String(verifyData.registryId || registryId),
        record: verifyData.record
          ? {
              entityName: verifyData.record.entityName ?? null,
              entityType: verifyData.record.entityType ?? null,
              country: verifyData.record.country ?? null,
              decisionStatus: verifyData.record.decisionStatus ?? null,
              certifiedTier: verifyData.record.certifiedTier ?? null,
              certifiedBand: verifyData.record.certifiedBand ?? null,
              validTo: verifyData.record.validTo ?? null,
            }
          : null,
        proof: verifyData.proof
          ? {
              alg: verifyData.proof.alg ?? null,
              kid: verifyData.proof.kid ?? null,
              signature: verifyData.proof.signature ?? null,
              signedAt: verifyData.proof.signedAt ?? null,
              verificationKeyUrl: verifyData.proof.verificationKeyUrl ?? null,
              message: verifyData.proof.message ?? null,
              messageString: verifyData.proof.messageString ?? null,
            }
          : null,
        error: verifyData.error,
      }
    : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">{entityName}</h1>

      <RegistryVerificationPanel
        registryId={registryId}
        entityName={entityName}
        verifyData={normalizedVerifyData}
      />

      <RegistryTrustTools
        registryId={registryId}
        entityName={entityName}
      />
    </div>
  );
}