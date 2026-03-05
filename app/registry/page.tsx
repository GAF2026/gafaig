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

type ApiResponse =
  | {
      ok: true;
      rows: RegistryRow[];
      total: number;
      limit: number;
      filters?: { q: string; country: string; registryId: string };
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

function inputClass() {
  return "w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-[14px] text-black placeholder:text-black/45 focus:outline-none focus:ring-2 focus:ring-black/10";
}

function buttonClass(variant: "primary" | "secondary" = "secondary") {
  if (variant === "primary") {
    return "inline-flex items-center justify-center rounded-xl px-4 py-2 text-[14px] font-semibold bg-black text-white hover:bg-black/90";
  }
  return "inline-flex items-center justify-center rounded-xl px-4 py-2 text-[14px] font-semibold border border-black/15 hover:bg-black/[0.04]";
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

async function getRegistry(params: { q?: string; country?: string; registryId?: string }): Promise<ApiResponse> {
  try {
    const base = getBaseUrl();
    const sp = new URLSearchParams();
    sp.set("limit", "50");

    const q = (params.q || "").trim();
    const country = (params.country || "").trim();
    const registryId = (params.registryId || "").trim();

    if (q) sp.set("q", q);
    if (country) sp.set("country", country);
    if (registryId) sp.set("registryId", registryId);

    const res = await fetch(`${base}/api/registry?${sp.toString()}`, { cache: "no-store" });
    return (await res.json()) as ApiResponse;
  } catch (e: any) {
    return { ok: false, error: e?.message || "Failed to load registry." };
  }
}

function cellLinkClass() {
  return "block px-4 py-3 hover:bg-black/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20";
}

export default async function RegistryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q : "";
  const country = typeof sp.country === "string" ? sp.country : "";
  const registryId = typeof sp.registryId === "string" ? sp.registryId : "";

  const data = await getRegistry({ q, country, registryId });
  const rows = data.ok ? data.rows : [];
  const total = data.ok ? data.total : 0;

  const hasFilters = Boolean((q || "").trim() || (country || "").trim() || (registryId || "").trim());

  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">

      {/* Hero */}
      <section className="pt-2 pb-8">
        <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">
          Registry
        </div>

        <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">
          Public certification status for independent verification of human oversight for AI systems
        </h1>

        <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[920px]">
          The GAFAIG Registry publishes controlled disclosures only: certification status and tiering outcomes.
          Internal evidence, findings, and any AI inventory remain private.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/framework"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            Read the Framework
          </Link>

          <Link
            href="/mission"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90"
          >
            Mission & Boundaries
          </Link>
        </div>
      </section>

      {/* Search section unchanged */}

      {/* Registry records */}
      <section className="mt-8 pt-8 border-t border-black/10">

        <div className="mt-5 overflow-hidden border border-black/10 rounded-2xl">
          <div className="overflow-x-auto">

            <table className="w-full text-left">

              <thead className="bg-black/[0.02]">
                <tr className="text-[12px] uppercase tracking-[0.16em] text-black/60">
                  <th className="px-4 py-3 font-semibold">Entity</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Tier</th>
                  <th className="px-4 py-3 font-semibold">Band</th>
                  <th className="px-4 py-3 font-semibold">Registry ID</th>
                  <th className="px-4 py-3 font-semibold">Certified</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-black/10">

                {rows.map((r) => {
                  const href = `/registry/${encodeURIComponent(r.registryId)}`;

                  return (
                    <tr
                      key={r.registryId}
                      className="text-[14px] text-black/85 hover:bg-black/[0.04] transition-colors"
                    >

                      <td className="p-0 align-top">
                        <Link href={href} className={cellLinkClass()}>
                          <div className="font-semibold text-black">
                            {r.entityName}
                          </div>

                          <div className="mt-1 text-[12px] text-black/60">
                            {(r.entityType ?? "—") + (r.country ? ` · ${r.country}` : "")}
                          </div>
                        </Link>
                      </td>

                      <td className="p-0 align-top">
                        <Link href={href} className={cellLinkClass()}>
                          <span className={chipClass()}>
                            {r.decisionStatus}
                          </span>
                        </Link>
                      </td>

                      <td className="p-0 align-top">
                        <Link href={href} className={cellLinkClass()}>
                          {r.certifiedTier ?? "—"}
                        </Link>
                      </td>

                      <td className="p-0 align-top">
                        <Link href={href} className={cellLinkClass()}>
                          {r.certifiedBand ?? "—"}
                        </Link>
                      </td>

                      <td className="p-0 align-top">
                        <Link href={href} className={cellLinkClass()}>
                          <span className="font-mono text-[12px] underline text-black">
                            {r.registryId}
                          </span>
                        </Link>
                      </td>

                      <td className="p-0 align-top">
                        <Link href={href} className={cellLinkClass()}>
                          {formatDate(r.certifiedAt)}
                        </Link>
                      </td>

                    </tr>
                  );
                })}

              </tbody>
            </table>

          </div>
        </div>

      </section>

      {/* Privacy boundary */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">
          Privacy boundary
        </h2>

        <p className="mt-3 text-[16px] leading-[1.8] text-black/80 max-w-[920px]">
          The registry confirms certification without exposing internal evidence,
          findings, reviewer rationales, or AI inventories.
        </p>
      </section>

    </main>
  );
}