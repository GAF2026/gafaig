// app/registry/[registryId]/page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import StatusChip from "@/components/ui/StatusChip";
import MonoCodeBlock from "@/components/ui/MonoCodeBlock";
import AISystemCard from "@/components/registry/AISystemCard";

export const dynamic = "force-dynamic";

type RegistryRow = {
  registryId: string;
  applicationId: string;

  entityName: string;
  entityType: string | null;
  country: string | null;

  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string;

  validFrom: string | null;
  validTo: string | null;

  certifiedAt: string | null;
  lastActivityAt: string | null;
};

type RegistryApiResponse =
  | {
      ok: true;
      rows: RegistryRow[];
      total: number;
      limit: number;
      filters?: { q: string; country: string; registryId: string };
    }
  | { ok: false; error: string };

type RegistryAiSystemRow = {
  SYSTEM_ID: string;
  REGISTRY_ID: string;
  SYSTEM_NAME: string;
  SYSTEM_TYPE: string | null;
  INTENDED_USE: string | null;
  DEPLOYMENT_STATUS: string | null;
  OVERSIGHT_LEVEL: string | null;
  RISK_TIER: string | null;
  PUBLIC_SUMMARY: string | null;
  DISPLAY_ORDER: number | null;
};

type RegistryAiSystemsApiResponse =
  | {
      ok: true;
      rows: RegistryAiSystemRow[];
      total: number;
    }
  | { ok: false; error: string };

type VerifyApiResponse =
  | {
      ok: true;
      registryId: string;
      verified: boolean;
      record?: {
        registryId: string;
        applicationId: string;
        entityName: string;
        entityType: string | null;
        country: string | null;
        certifiedTier: string | null;
        certifiedBand: string | null;
        decisionStatus: string;
        validFrom: string | null;
        validTo: string | null;
        certifiedAt: string | null;
        lastActivityAt: string | null;
        isCurrentlyValid?: boolean;
      };
      proof?: {
        alg: string;
        signature: string;
        message: string;
        signedAt: string;
      };
      now?: string;
    }
  | {
      ok: false;
      error: string;
      verified?: false;
      registryId?: string;
    };

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

  const embedHtml = `<a href="${absoluteRecordUrl}" target="_blank" rel="noopener noreferrer">
  <img src="${badgeSrcAbsolute}" alt="Verified by GAFAIG" height="72" />
</a>`;

  const embedMarkdown = `[![Verified by GAFAIG](${badgeSrcAbsolute})](${absoluteRecordUrl})`;

  const verifyJsonExample = `fetch("${absoluteVerifyUrl}")
  .then((r) => r.json())
  .then(console.log);`;

  const isVerified = verifyData.ok ? !!verifyData.verified : false;
  const signature =
    verifyData.ok && verifyData.proof?.signature
      ? verifyData.proof.signature
      : null;
  const signedAt =
    verifyData.ok && verifyData.proof?.signedAt
      ? verifyData.proof.signedAt
      : null;

  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      <section className="pt-2 pb-8">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          Registry record
        </div>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="max-w-[980px] text-[40px] font-semibold leading-[1.15] text-black">
              {row?.entityName ?? "Registry record"}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatusChip>{registryId}</StatusChip>
              {row?.decisionStatus ? (
                <StatusChip>{row.decisionStatus}</StatusChip>
              ) : null}
              {verifyData.ok ? (
                <StatusChip>
                  {isVerified ? "verification active" : "not currently valid"}
                </StatusChip>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/registry"
              className="inline-flex items-center justify-center rounded-xl border border-black/15 px-4 py-2 text-[14px] font-semibold hover:bg-black/[0.04]"
            >
              Back to registry
            </Link>

            <a
              href={absoluteVerifyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-black px-4 py-2 text-[14px] font-semibold hover:bg-black hover:text-white"
            >
              Verify via API
            </a>

            <a
              href={absoluteRecordUrl}
              className="inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 text-[14px] font-semibold text-white hover:bg-black/90"
            >
              Permalink
            </a>
          </div>
        </div>

        <p className="mt-5 max-w-[920px] text-[16px] leading-[1.8] text-black/80">
          This registry record is a controlled disclosure: it confirms certification
          outcomes without exposing internal evidence, findings, reviewer rationales,
          or private assessment materials.
        </p>
      </section>

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
          <section className="grid grid-cols-1 gap-4 md:grid-cols-12">
            <div className="rounded-2xl border border-black/10 p-5 md:col-span-8">
              <h2 className="text-[16px] font-semibold text-black">
                Certification outcome
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                    Status
                  </div>
                  <div className="mt-2">
                    <StatusChip>{row.decisionStatus}</StatusChip>
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                    Tier
                  </div>
                  <div className="mt-2 text-[16px] font-semibold text-black">
                    {row.certifiedTier ?? "—"}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                    Band
                  </div>
                  <div className="mt-2 text-[16px] font-semibold text-black">
                    {row.certifiedBand ?? "—"}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                    Certified at
                  </div>
                  <div className="mt-2 text-[14px] text-black/85">
                    {formatDate(row.certifiedAt)}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                    Valid from
                  </div>
                  <div className="mt-2 text-[14px] text-black/85">
                    {formatDate(row.validFrom)}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                    Valid to
                  </div>
                  <div className="mt-2 text-[14px] text-black/85">
                    {formatDate(row.validTo)}
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-black/10 pt-4 text-[13px] text-black/60">
                Application ID:{" "}
                <span className="font-mono text-black/80">{row.applicationId}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 p-5 md:col-span-4">
              <h2 className="text-[16px] font-semibold text-black">Entity</h2>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                    Name
                  </div>
                  <div className="mt-2 text-[14px] font-semibold text-black">
                    {row.entityName}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                    Type
                  </div>
                  <div className="mt-2 text-[14px] text-black/85">
                    {row.entityType ?? "—"}
                  </div>
                </div>

                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                    Country
                  </div>
                  <div className="mt-2 text-[14px] text-black/85">
                    {row.country ?? "—"}
                  </div>
                </div>

                <div className="border-t border-black/10 pt-4 text-[13px] text-black/60">
                  Registry ID:{" "}
                  <span className="font-mono text-black/80">{row.registryId}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 border-t border-black/10 pt-8">
            <h2 className="text-[16px] font-semibold text-black">
              Verification endpoint
            </h2>

            <p className="mt-3 max-w-[920px] text-[14px] leading-[1.8] text-black/75">
              This certification can be validated programmatically through the public
              verification API. External websites, procurement workflows, and
              compliance tools can use this endpoint to confirm current certification
              status and retrieve signed proof metadata.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-black/10 p-5">
                <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                  Verification URL
                </div>
                <div className="mt-3">
                  <MonoCodeBlock>{absoluteVerifyUrl}</MonoCodeBlock>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href={absoluteVerifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl border border-black px-4 py-2 text-[14px] font-semibold hover:bg-black hover:text-white"
                  >
                    Open verification JSON
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 p-5">
                <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                  Verification status
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <StatusChip>
                    {verifyData.ok
                      ? isVerified
                        ? "verified"
                        : "not currently valid"
                      : "verification unavailable"}
                  </StatusChip>
                  {verifyData.ok && verifyData.proof?.alg ? (
                    <StatusChip>{verifyData.proof.alg}</StatusChip>
                  ) : null}
                </div>

                {verifyData.ok && signature ? (
                  <div className="mt-4">
                    <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                      Signature
                    </div>
                    <div className="mt-2">
                      <MonoCodeBlock>{signature}</MonoCodeBlock>
                    </div>
                  </div>
                ) : null}

                {signedAt ? (
                  <div className="mt-4 text-[13px] text-black/60">
                    Signed at:{" "}
                    <span className="font-mono text-black/80">{signedAt}</span>
                  </div>
                ) : verifyData.ok ? null : (
                  <div className="mt-4 text-[13px] text-red-700">
                    {(verifyData as { ok: false; error: string }).error}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-black/10 p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                Example usage
              </div>
              <div className="mt-3">
                <MonoCodeBlock>{verifyJsonExample}</MonoCodeBlock>
              </div>
            </div>
          </section>

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

          <section className="mt-10 border-t border-black/10 pt-8">
            <h2 className="text-[16px] font-semibold text-black">Verified by GAFAIG</h2>
            <p className="mt-3 max-w-[920px] text-[14px] leading-[1.8] text-black/75">
              Organizations that successfully complete independent verification may
              display the GAFAIG Verified badge on their website. The badge links
              directly to this public registry record.
            </p>

            <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-6">
              <a
                href={absoluteRecordUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <img
                  src={badgeSrcRelative}
                  alt="Verified by GAFAIG"
                  className="h-[96px] w-auto md:h-[110px]"
                />
              </a>

              <div className="mt-4 text-[13px] text-black/60">
                Click the badge or use this link:
                <span className="ml-2 font-mono text-black">{absoluteRecordUrl}</span>
              </div>

              <div className="mt-3 text-[13px] text-black/60">
                API verification:
                <span className="ml-2 font-mono text-black">{absoluteVerifyUrl}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-black/10 p-5">
                <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                  Embed code (HTML)
                </div>
                <div className="mt-3">
                  <MonoCodeBlock>{embedHtml}</MonoCodeBlock>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 p-5">
                <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
                  Embed code (Markdown)
                </div>
                <div className="mt-3">
                  <MonoCodeBlock>{embedMarkdown}</MonoCodeBlock>
                </div>
              </div>
            </div>

            <p className="mt-4 max-w-[980px] text-[12px] leading-[1.7] text-black/60">
              Note: This badge confirms certification status and tiering outcomes
              only. GAFAIG does not disclose internal evidence, findings, reviewer
              rationales, or private assessment materials through the public registry.
            </p>
          </section>

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