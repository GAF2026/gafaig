import type {
  RegistryApiResponse,
  RegistryAiSystemsApiResponse,
  VerifyApiResponse,
} from "@/types/registry";
import { getBaseUrl } from "@/lib/registry/urls";

export async function getRegistryRecord(
  registryId: string
): Promise<RegistryApiResponse> {
  try {
    const base = getBaseUrl();
    const sp = new URLSearchParams();
    sp.set("limit", "1");
    sp.set("registryId", registryId);

    const res = await fetch(`${base}/api/registry?${sp.toString()}`, {
      cache: "no-store",
    });
    return (await res.json()) as RegistryApiResponse;
  } catch (e: any) {
    return { ok: false, error: e?.message || "Failed to load registry record." };
  }
}

export async function getRegistryAiSystems(
  registryId: string
): Promise<RegistryAiSystemsApiResponse> {
  try {
    const base = getBaseUrl();
    const res = await fetch(
      `${base}/api/registry/${encodeURIComponent(registryId)}/ai-systems`,
      {
        cache: "no-store",
      }
    );
    return (await res.json()) as RegistryAiSystemsApiResponse;
  } catch (e: any) {
    return { ok: false, error: e?.message || "Failed to load registry AI systems." };
  }
}

export async function getVerification(
  registryId: string
): Promise<VerifyApiResponse> {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/verify/${encodeURIComponent(registryId)}`, {
      cache: "no-store",
    });
    return (await res.json()) as VerifyApiResponse;
  } catch (e: any) {
    return { ok: false, error: e?.message || "Failed to load verification record." };
  }
}