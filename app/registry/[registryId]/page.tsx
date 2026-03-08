// app/registry/[registryId]/page.tsx
import Link from "next/link";
import { headers } from "next/headers";

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

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function chipClass() {
  return "inline-flex items-center rounded-full border border-black/15 bg-black/[0.04] px-2.5 py-1 text-[12px] font-semibold leading-none text-black";
}

function monoBox() {
  return "w-full rounded-2xl border border-black/10 bg-white p-4 font-mono text-[12px] leading-[1.6] text-black/85 overflow-x-auto";
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

    const res = await fetch(`${base}/api/registry?${sp.toString()}`, { cache: "no-store" });
    return (await res.json()) as RegistryApiResponse;
  } catch (e: any) {
    return { ok: false, error: e?.message || "Failed to load registry record." };
  }
}

async function getRegistryAiSystems(registryId: string): Promise<RegistryAiSystemsApiResponse> {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/api/registry/${encodeURIComponent(registryId)}/ai-systems`, {
      cache: "no-store",
    });
    return (await res.json()) as RegistryAiSystemsApiResponse;
  } catch (e: any) {
    return { ok: false, error: e?.message || "Failed to load registry AI systems." };
  }
}

export default async function RegistryRecordPage({ params }: { params: { registryId: string } }) {
  const registryId = params.registryId;

  const [data, aiSystemsData] = await Promise.all([
    getRegistryRecord(registryId),
    getRegistryAiSystems(registryId),
  ]);

  const row = data.ok && data.rows.length ? data.rows[0] : null;
  const aiSystems = aiSystemsData.ok ? dataOrEmpty(aiSystemsData.rows) : [];

  const baseUrl = getBaseUrl();
  const absoluteRecordUrl = `${baseUrl}/registry/${encodeURIComponent(registryId)}`;

  const badgeSrcAbsolute = `${baseUrl}/images/gafaig-badge-verified-new.png`;
  const badgeSrcRelative = `/images/gafaig-badge-verified-new.png`;

  const embedHtml = `<a href="${absoluteRecordUrl}" target="_blank" rel="noopener noreferrer">
  <img src="${badgeSrcAbsolute}" alt="Verified by GAFAIG" height="72" />
</a>`;

  const embedMarkdown = `[![Verified by GAFAIG](${badgeSrcAbsolute})](${absoluteRecordUrl})`;

  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      <section className="pt-2 pb-8">
        <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">Registry record</div>

        <div className="mt-4 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">
              {row?.entityName ?? "Registry record"}
            </h1>

            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className={chipClass()}>{registryId}</span>
              {row?.decisionStatus ? <span className={chipClass()}>{row.decisionStatus}</span> : null}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/registry"
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-[14px] font-semibold border border-black/15 hover:bg-black/[0.04]"
            >
              Back to registry
            </Link>

            <a
              href={absoluteRecordUrl}
              className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-[14px] font-semibold bg-black text-white hover:bg-black/90"
            >
              Permalink
            </a>
          </div>
        </div>

        <p className="mt-5 text-[16px] leading-[1.8] text-black/80 max-w-[920px]">
          This registry record is a controlled disclosure: it confirms certification outcomes without exposing internal
          evidence, findings, reviewer rationales, or AI inventories.
        </p>
      </section>

      {!data.ok ? (
        <section className="border border-black/10 rounded-2xl p-5">
          <div className="font-semibold text-black">Unable to load record</div>
          <p className="mt-2 text-[14px] leading-[1.7] text-black/70">{data.error}</p>
        </section>
      ) : !row ? (
        <section className="border border-black/10 rounded-2xl p-5">
          <div className="font-semibold text-black">Record not found</div>
          <p className="mt-2 text-[14px] leading-[1.7] text-black/70">
            No public registry record exists for <span className="font-mono">{registryId}</span>.
          </p>
        </section>
      ) : (
        <>
          <section className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 border border-black/10 rounded-2xl p-5">
              <h2 className="text-[16px] font-semibold text-black">Certification outcome</h2>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.16em] text-black/60 font-semibold">Status</div>
                  <div className="mt-2">
                    <span className={chipClass()}>{row.decisionStatus}</span>
                  </div>
                </div>

                <div>
                  <div className="text-[12px] uppercase tracking-[0.16em] text-black/60 font-semibold">Tier</div>
                  <div className="mt-2 text-[16px] font-semibold text-black">{row.certifiedTier ?? "—"}</div>
                </div>

                <div>
                  <div className="text-[12px] uppercase tracking-[0.16em] text-black/60 font-semibold">Band</div>
                  <div className="mt-2 text-[16px] font-semibold text-black">{row.certifiedBand ?? "—"}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.16em] text-black/60 font-semibold">Certified at</div>
                  <div className="mt-2 text-[14px] text-black/85">{formatDate(row.certifiedAt)}</div>
                </div>

                <div>
                  <div className="text-[12px] uppercase tracking-[0.16em] text-black/60 font-semibold">Valid from</div>
                  <div className="mt-2 text-[14px] text-black/85">{formatDate(row.validFrom)}</div>
                </div>

                <div>
                  <div className="text-[12px] uppercase tracking-[0.16em] text-black/60 font-semibold">Valid to</div>
                  <div className="mt-2 text-[14px] text-black/85">{formatDate(row.validTo)}</div>
                </div>
              </div>

              <div className="mt-6 border-t border-black/10 pt-4 text-[13px] text-black/60">
                Application ID: <span className="font-mono text-black/80">{row.applicationId}</span>
              </div>
            </div>

            <div className="md:col-span-4 border border-black/10 rounded-2xl p-5">
              <h2 className="text-[16px] font-semibold text-black">Entity</h2>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-[12px] uppercase tracking-[0.16em] text-black/60 font-semibold">Name</div>
                  <div className="mt-2 text-[14px] font-semibold text-black">{row.entityName}</div>
                </div>

                <div>
                  <div className="text-[12px] uppercase tracking-[0.16em] text-black/60 font-semibold">Type</div>
                  <div className="mt-2 text-[14px] text-black/85">{row.entityType ?? "—"}</div>
                </div>

                <div>
                  <div className="text-[12px] uppercase tracking-[0.16em] text-black/60 font-semibold">Country</div>
                  <div className="mt-2 text-[14px] text-black/85">{row.country ?? "—"}</div>
                </div>

                <div className="border-t border-black/10 pt-4 text-[13px] text-black/60">
                  Registry ID: <span className="font-mono text-black/80">{row.registryId}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 pt-8 border-t border-black/10">
            <h2 className="text-[16px] font-semibold text-black">AI systems covered by this certification</h2>

            <p className="mt-3 text-[14px] leading-[1.8] text-black/75 max-w-[920px]">
              These are the public AI system disclosures included within the scope of this certification.
            </p>

            {!aiSystemsData.ok ? (
              <div className="mt-6 border border-black/10 rounded-2xl p-5">
                <div className="font-semibold text-black">Unable to load AI systems</div>
                <p className="mt-2 text-[14px] leading-[1.7] text-black/70">{aiSystemsData.error}</p>
              </div>
            ) : aiSystems.length === 0 ? (
              <div className="mt-6 border border-black/10 rounded-2xl p-5 text-[14px] text-black/70">
                No AI systems have been published for this certification record.
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4">
                {aiSystems.map((s) => (
                  <div key={s.SYSTEM_ID} className="border border-black/10 rounded-2xl p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-[20px] leading-[1.3] font-semibold text-black">{s.SYSTEM_NAME}</h3>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {s.SYSTEM_TYPE ? <span className={chipClass()}>{s.SYSTEM_TYPE}</span> : null}
                          {s.DEPLOYMENT_STATUS ? <span className={chipClass()}>{s.DEPLOYMENT_STATUS}</span> : null}
                          {s.OVERSIGHT_LEVEL ? <span className={chipClass()}>{s.OVERSIGHT_LEVEL}</span> : null}
                          {s.RISK_TIER ? <span className={chipClass()}>{s.RISK_TIER}</span> : null}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-[12px] uppercase tracking-[0.16em] text-black/60 font-semibold">
                          Intended use
                        </div>
                        <div className="mt-2 text-[14px] text-black/85">{s.INTENDED_USE ?? "—"}</div>
                      </div>

                      <div>
                        <div className="text-[12px] uppercase tracking-[0.16em] text-black/60 font-semibold">
                          Public summary
                        </div>
                        <div className="mt-2 text-[14px] text-black/85">{s.PUBLIC_SUMMARY ?? "—"}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10 pt-8 border-t border-black/10">
            <h2 className="text-[16px] font-semibold text-black">Verified by GAFAIG</h2>
            <p className="mt-3 text-[14px] leading-[1.8] text-black/75 max-w-[920px]">
              Organizations that successfully complete independent verification may display the GAFAIG Verified badge on
              their website. The badge links directly to this public registry record.
            </p>

            <div className="mt-6 border border-black/10 rounded-2xl p-6 bg-black/[0.02]">
              <a href={absoluteRecordUrl} target="_blank" rel="noopener noreferrer" className="inline-block">
                <img
                  src={badgeSrcRelative}
                  alt="Verified by GAFAIG"
                  className="h-[96px] md:h-[110px] w-auto"
                />
              </a>

              <div className="mt-4 text-[13px] text-black/60">
                Click the badge or use this link:
                <span className="font-mono text-black ml-2">{absoluteRecordUrl}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-black/10 rounded-2xl p-5">
                <div className="text-[12px] uppercase tracking-[0.16em] text-black/60 font-semibold">Embed code (HTML)</div>
                <div className="mt-3">
                  <pre className={monoBox()}>{embedHtml}</pre>
                </div>
              </div>

              <div className="border border-black/10 rounded-2xl p-5">
                <div className="text-[12px] uppercase tracking-[0.16em] text-black/60 font-semibold">Embed code (Markdown)</div>
                <div className="mt-3">
                  <pre className={monoBox()}>{embedMarkdown}</pre>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[12px] leading-[1.7] text-black/60 max-w-[980px]">
              Note: This badge confirms certification status and tiering outcomes only. GAFAIG does not disclose internal
              evidence, findings, reviewer rationales, or AI inventories through the public registry.
            </p>
          </section>

          <section className="mt-10 pt-8 border-t border-black/10">
            <h2 className="text-[16px] font-semibold text-black">Privacy boundary</h2>
            <p className="mt-3 text-[16px] leading-[1.8] text-black/80 max-w-[920px]">
              The registry confirms certification without exposing internal evidence, findings, reviewer rationales, or AI
              inventories.
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