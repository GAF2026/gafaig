import Link from "next/link";
import { headers } from "next/headers";
import PublicPageHero from "../_components/PublicPageHero";

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
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
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

async function getRegistry(params: {
  q?: string;
  country?: string;
  registryId?: string;
}): Promise<ApiResponse> {
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

    const res = await fetch(`${base}/api/registry?${sp.toString()}`, {
      cache: "no-store",
    });
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

  const hasFilters = Boolean(
    (q || "").trim() || (country || "").trim() || (registryId || "").trim()
  );

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="REGISTRY"
        title="Public certification outcomes for independent verification of human oversight across AI infrastructure"
        description="The GAFAIG Registry publishes certification outcomes for organizations that have undergone independent verification of AI oversight. Controlled public disclosures confirm certification status while internal evidence, findings, and assessment materials remain private."
        actions={
          <>
            <Link
              href="/framework"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Read the Framework
            </Link>

            <Link
              href="/mission"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Mission &amp; Boundaries
            </Link>
          </>
        }
      />

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          SEARCH THE REGISTRY
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Search certified organizations
        </h2>

        <p className="mt-5 max-w-[920px] text-[16px] leading-[1.85] text-black/80">
          Search certified organizations by name, country, or registry ID. Each
          public record confirms certification outcomes and links to the
          associated certification detail page.
        </p>

        <form className="mt-6 grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Organization
            </label>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by organization name"
              className={inputClass()}
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Country
            </label>
            <input
              type="text"
              name="country"
              defaultValue={country}
              placeholder="Country"
              className={inputClass()}
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Registry ID
            </label>
            <input
              type="text"
              name="registryId"
              defaultValue={registryId}
              placeholder="GAFAIG-00000001"
              className={inputClass()}
            />
          </div>

          <div className="md:col-span-4 flex flex-wrap gap-2 pt-1">
            <button type="submit" className={buttonClass("primary")}>
              Search Registry
            </button>

            <Link href="/registry" className={buttonClass("secondary")}>
              Clear Filters
            </Link>
          </div>
        </form>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              CERTIFIED ORGANIZATIONS
            </div>
            <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              Public certification records
            </h2>
            <p className="mt-4 text-[14px] leading-[1.8] text-black/72">
              Organizations listed below have completed a GAFAIG governance
              verification process.
            </p>
          </div>

          <div className="text-[14px] text-black/65">
            {data.ok ? (
              <>
                {total} record{total === 1 ? "" : "s"}
                {hasFilters ? " matching current filters" : ""}
              </>
            ) : (
              "Registry unavailable"
            )}
          </div>
        </div>

        {!data.ok ? (
          <div className="mt-6 rounded-2xl border border-black/10 p-5">
            <div className="font-semibold text-black">Unable to load registry</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/70">
              {data.error}
            </p>
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-black/10 p-5">
            <div className="font-semibold text-black">No matching records</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/70">
              No public certification records matched the current search.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-black/10">
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
                        className="text-[14px] text-black/85 transition-colors hover:bg-black/[0.04]"
                      >
                        <td className="p-0 align-top">
                          <Link href={href} className={cellLinkClass()}>
                            <div className="font-semibold text-black">
                              {r.entityName}
                            </div>

                            <div className="mt-1 text-[12px] text-black/60">
                              {(r.entityType ?? "—") +
                                (r.country ? ` · ${r.country}` : "")}
                            </div>
                          </Link>
                        </td>

                        <td className="p-0 align-top">
                          <Link href={href} className={cellLinkClass()}>
                            <span className={chipClass()}>{r.decisionStatus}</span>
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
                            <span className="font-mono text-[12px] text-black underline">
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
        )}
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          PRIVACY BOUNDARY
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Public trust without exposing internal reviewer materials
        </h2>

        <p className="mt-5 max-w-[920px] text-[16px] leading-[1.85] text-black/80">
          The registry confirms certification outcomes without exposing internal
          evidence, findings, reviewer rationales, or private assessment
          materials.
        </p>
      </section>
    </main>
  );
}