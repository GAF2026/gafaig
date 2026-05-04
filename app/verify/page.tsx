import { getLatestCertifiedRecord } from "@/lib/queries/explorer";
import VerifyClient from "./VerifyClient";

export const dynamic = "force-dynamic";

const FALLBACK_REGISTRY_ID = "GAFAIG-00000001";

export default async function VerifyPage() {
  const latest = await getLatestCertifiedRecord();
  const initialRegistryId = latest?.registryId ?? FALLBACK_REGISTRY_ID;

  return (
    <VerifyClient
      initialId={initialRegistryId}
      fallbackId={FALLBACK_REGISTRY_ID}
    />
  );
}