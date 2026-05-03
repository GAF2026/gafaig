import { getLatestCertifiedRecord } from "@/lib/queries/explorer";
import VerifyClient from "./VerifyClient";

export const dynamic = "force-dynamic";

const EXAMPLE_ID = "GAFAIG-00000001";

export default async function VerifyPage() {
  const latest = await getLatestCertifiedRecord();
  const initialId = latest?.registryId ?? EXAMPLE_ID;

  return <VerifyClient initialId={initialId} fallbackId={EXAMPLE_ID} />;
}