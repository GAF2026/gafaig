import Link from "next/link";

export const revalidate = 300;

type RegistryRow = {
  registryId?: string;
  entityName?: string | null;
  country?: string | null;
  certifiedScore?: string | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  decisionStatus?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  certifiedAt?: string | null;
};

type RegistryResponse = {
  ok?: boolean;
  total?: number;
  rows?: RegistryRow[];
};

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.gafaig.com"
  );
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function safe(v?: string | null): string {
  const s = String(v ?? "").trim();
  return s || "—";
}

function formatTierBand(tier?: string | null, band?: string | null): string {
  const t = safe(tier);
  const b = safe(band);
  if (t !== "—" && b !== "—") return `${t} · ${b}`;
  if (t !== "—") return t;
  if (b !== "—") return b;
  return "—";
}

function statusTone(value: string) {
  const v = value.trim().toUpperCase();
  if (v === "APPROVED") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (v === "CERTIFIED") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function trustState(decisionStatus: string) {
  return {
    label: "Verified",
    className:
      "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700 ring-1 ring-emerald-200",
    decisionClass: `inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ring-1 ${statusTone(
      decisionStatus
    )}`,
  };
}

export default async function RegistryPage() {
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/registry`, {
    next: { revalidate: 300 },
  }).catch(() => null);

  const data: RegistryResponse | null = res ? await res.json() : null;

  const allRows = data?.rows ?? [];

  const rows = allRows.filter((row) =>
    Boolean(String(row.certifiedAt ?? "").trim())
  );

  return (
    <main className="mx-auto max-w-[1440px] px-6 pb-20 pt-12 lg:px-10">
      <div className="space-y-10">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10 xl:p-12">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            REGISTRY OF RECORD
          </div>

          <h1 className="mt-4 text-[42px] font-semibold leading-[1.05] tracking-tight text-black md:text-[56px] xl:text-[64px]">
            Certified public AI governance registry
          </h1>

          <p className="mt-4 max-w-[980px] text-[15px] leading-[1.8] text-black/70">
            The GAFAIG registry is the canonical public record of certified outcomes issued through the GAFAIG verification framework. This page intentionally reserves the registry layer for records with a surfaced public certification outcome.
          </p>

          <p className="mt-3 max-w-[980px] text-[15px] leading-[1.8] text-black/60">
            Approved but uncertified records belong in Explorer. Registry is the stricter certification layer of record.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/explorer"
              className="inline-flex items-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Open Explorer
            </Link>

            <Link
              href="/verify"
              className="inline-flex items-center rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Verify a record
            </Link>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10 xl:p-12">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                CERTIFIED PUBLIC RECORDS
              </div>
              <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[40px]">
                Registry directory
              </h2>
              <p className="mt-3 max-w-[900px] text-[15px] leading-[1.8] text-black/68">
                Browse surfaced certified records by organization, jurisdiction, and registry identifier.
              </p>
            </div>

            <div className="text-sm text-black/55">
              {rows.length} visible certified records
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {rows.map((row) => {
              const registryId = safe(row.registryId);
              const entityName = safe(row.entityName);
              const country = safe(row.country);
              const decisionStatus = safe(row.decisionStatus);
              const certifiedAt = row.certifiedAt ?? null;
              const tierBand = formatTierBand(row.certifiedTier, row.certifiedBand);
              const trust = trustState(decisionStatus);

              return (
                <div
                  key={registryId}
                  className="rounded-2xl border border-black/10 bg-black/[0.02] p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={trust.className}>{trust.label}</span>

                        {decisionStatus !== "—" ? (
                          <span className={trust.decisionClass}>{decisionStatus}</span>
                        ) : null}
                      </div>

                      <div className="mt-3 text-[28px] font-semibold leading-tight text-black">
                        {entityName}
                      </div>

                      <div className="mt-1 text-[13px] text-black/60">
                        {country} · {registryId}
                      </div>
                    </div>

                    <Link
                      href={`/registry/${registryId}`}
                      className="inline-flex items-center rounded-full border border-black bg-white px-4 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
                    >
                      Open
                    </Link>
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-4">
                    <div className="rounded-xl border border-black/10 bg-white p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/50">
                        Certification
                      </div>
                      <div className="mt-1 text-sm font-medium text-black">
                        {tierBand}
                      </div>
                    </div>

                    <div className="rounded-xl border border-black/10 bg-white p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/50">
                        Certified
                      </div>
                      <div className="mt-1 text-sm font-medium text-black">
                        {formatDate(certifiedAt)}
                      </div>
                    </div>

                    <div className="rounded-xl border border-black/10 bg-white p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/50">
                        Valid From
                      </div>
                      <div className="mt-1 text-sm font-medium text-black">
                        {formatDate(row.validFrom)}
                      </div>
                    </div>

                    <div className="rounded-xl border border-black/10 bg-white p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/50">
                        Valid To
                      </div>
                      <div className="mt-1 text-sm font-medium text-black">
                        {formatDate(row.validTo)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {rows.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/15 bg-black/[0.02] p-8 text-sm text-black/60">
                No certified registry records found.
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}