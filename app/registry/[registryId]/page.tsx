import RegistryVerificationPanel from "@/components/registry/RegistryVerificationPanel";

export const dynamic = "force-dynamic";

async function getRegistry(registryId: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/registry?registryId=${registryId}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;
  return res.json();
}

async function getVerifyData(registryId: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify/${registryId}`,
      { cache: "no-store" }
    );

    if (!res.ok) return null;

    return res.json();
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

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-xl font-semibold">Registry record not found</h1>
      </div>
    );
  }

  const row = data?.data?.[0] || {};
  const entityName = row.ENTITY_NAME || "Unknown Entity";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">{entityName}</h1>

      {/* ✅ Verification Panel */}
      <RegistryVerificationPanel
        registryId={registryId}
        entityName={entityName}
        verifyData={verifyData}
      />
    </div>
  );
}