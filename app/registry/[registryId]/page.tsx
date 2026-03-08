// app/registry/[registryId]/page.tsx
import AISystemCard from "@/components/registry/AISystemCard";
import RegistryBadgePanel from "@/components/registry/RegistryBadgePanel";
import RegistryCertificationSummary from "@/components/registry/RegistryCertificationSummary";
import RegistryHeaderPanel from "@/components/registry/RegistryHeaderPanel";
import RegistryVerificationPanel from "@/components/registry/RegistryVerificationPanel";
import { headers } from "next/headers";
import type {
  RegistryApiResponse,
  RegistryAiSystemsApiResponse,
  VerifyApiResponse,
} from "@/types/registry";

export const dynamic = "force-dynamic";

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");

  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (host) return `${proto}://${host}`;

  return "http://localhost:3000";
}

async function getRegistryRecord(registryId: string): Promise<RegistryApiResponse> {
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

async function getRegistryAiSystems(
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

async function getVerification(
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

export default async function RegistryRecordPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = params.registryId;

  const [data, aiSystemsData, verifyData] = await Promise.all([
    getRegistryRecord(registryId),
    getRegistryAiSystems(registryId),
    getVerification(registryId),
  ]);

  const row = data.ok && data.rows.length ? data.rows[0] : null;
  const aiSystems = aiSystemsData.ok ? dataOrEmpty(aiSystemsData.rows) : [];

  const baseUrl = getBaseUrl();
  const absoluteRecordUrl = `${baseUrl}/registry/${encodeURIComponent(registryId)}`;
  const absoluteVerifyUrl = `${baseUrl}/api/verify/${encodeURIComponent(registryId)}`;

  const badgeSrcAbsolute = `${baseUrl}/images/gafaig-badge-verified-new.png`;
  const badgeSrcRelative = `/images/gafaig-badge-verified-new.png`;

  const isVerified = verifyData.ok ? !!verifyData.verified : false;

  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      <RegistryHeaderPanel
        registryId={registryId}
        entityName={row?.entityName}
        decisionStatus={row?.decisionStatus}
        showVerificationState={verifyData.ok}
        isVerified={isVerified}
        absoluteVerifyUrl={absoluteVerifyUrl}
        absoluteRecordUrl={absoluteRecordUrl}
      />

      {!data.ok ? (
        <section className="rounded-2xl border border-black/10 p-5">
          <div className="font-semibold text-black">Unable to load record</div>
          <p className="mt-2 text-[14px] leading-[1.7] text-black/70">
            {data.error}
          </p>
        </section>
      ) : !row ? (
        <section className="rounded-2xl border border-black/10 p-5">
          <div className="font-semibold text-black">Record not found</div>
          <p className="mt-2 text-[14px] leading-[1.7] text-black/70">
            No public registry record exists for{" "}
            <span className="font-mono">{registryId}</span>.
          </p>
        </section>
      ) : (
        <>
          <RegistryCertificationSummary row={row} formatDate={formatDate} />

          <RegistryVerificationPanel
            absoluteVerifyUrl={absoluteVerifyUrl}
            verifyData={verifyData}
          />

          <section className="mt-10 border-t border-black/10 pt-8">
            <h2 className="text-[16px] font-semibold text-black">
              AI systems covered by this certification
            </h2>

            <p className="mt-3 max-w-[920px] text-[14px] leading-[1.8] text-black/75">
              These are the public AI system disclosures included within the scope
              of this certification.
            </p>

            {!aiSystemsData.ok ? (
              <div className="mt-6 rounded-2xl border border-black/10 p-5">
                <div className="font-semibold text-black">Unable to load AI systems</div>
                <p className="mt-2 text-[14px] leading-[1.7] text-black/70">
                  {aiSystemsData.error}
                </p>
              </div>
            ) : aiSystems.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-black/10 p-5 text-[14px] text-black/70">
                No AI systems have been published for this certification record.
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4">
                {aiSystems.map((s) => (
                  <AISystemCard key={s.SYSTEM_ID} system={s} />
                ))}
              </div>
            )}
          </section>

          <RegistryBadgePanel
            absoluteRecordUrl={absoluteRecordUrl}
            absoluteVerifyUrl={absoluteVerifyUrl}
            badgeSrcAbsolute={badgeSrcAbsolute}
            badgeSrcRelative={badgeSrcRelative}
          />

          <section className="mt-10 border-t border-black/10 pt-8">
            <h2 className="text-[16px] font-semibold text-black">Privacy boundary</h2>
            <p className="mt-3 max-w-[920px] text-[16px] leading-[1.8] text-black/80">
              The registry confirms certification without exposing internal evidence,
              findings, reviewer rationales, or private assessment materials.
            </p>
          </section>
        </>
      )}
    </main>
  );
}

function dataOrEmpty<T>(rows: T[] | undefined | null): T[] {
  return Array.isArray(rows) ? rows : [];
}