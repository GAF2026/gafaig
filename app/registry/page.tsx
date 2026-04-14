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

function trustState(isCertified: boolean, decisionStatus: string) {
  if (isCertified) {
    return {
      label: "Verified",
      className:
        "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-700 ring-1 ring-emerald-200",
    };
  }
  if (decisionStatus.toUpperCase() === "APPROVED") {
    return {
      label: "Approved",
      className:
        "inline-flex rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-700 ring-1 ring-blue-200",
    };
  }
  return {
    label: "Pending",
    className:
      "inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600 ring-1 ring-slate-200",
  };
}

export default async function RegistryPage() {
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/registry`, {
    next: { revalidate: 300 },
  }).catch(() => null);

  const data: RegistryResponse | null = res ? await res.json() : null;

  const rows = data?.rows ?? [];

  return (
    <main className="mx-auto max-w-[1440px] px-6 pb-20 pt-12 lg:px-10">
      <div className="space-y-10">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10 xl:p-12">
          <h1 className="text-[42px] font-semibold">
            Certified public AI governance registry
          </h1>

          <p className="mt-4 max-w-[900px] text-[15px] leading-[1.8] text-black/70">
            The GAFAIG registry is the canonical public record of certified outcomes issued through the GAFAIG verification framework. This page lists publicly surfaced records from the registry layer.
          </p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10 xl:p-12">
          <h2 className="text-[28px] font-semibold">Registry directory</h2>

          <div className="mt-6 space-y-4">
            {rows.map((row) => {
              const registryId = safe(row.registryId);
              const entityName = safe(row.entityName);
              const country = safe(row.country);
              const decisionStatus = safe(row.decisionStatus);
              const certifiedAt = row.certifiedAt ?? null;
              const isCertified = Boolean(String(certifiedAt ?? "").trim());

              const tierBand = formatTierBand(
                row.certifiedTier,
                row.certifiedBand
              );

              const trust = trustState(isCertified, decisionStatus);

              return (
                <div
                  key={registryId}
                  className="rounded-2xl border border-black/10 bg-black/[0.02] p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={trust.className}>{trust.label}</span>

                        {decisionStatus !== "—" && (
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ring-1 ${statusTone(
                              decisionStatus
                            )}`}
                          >
                            {decisionStatus}
                          </span>
                        )}
                      </div>

                      <div className="mt-2 text-[20px] font-semibold">
                        {entityName}
                      </div>

                      <div className="text-[13px] text-black/60">
                        {country} · {registryId}
                      </div>
                    </div>

                    <Link
                      href={`/registry/${registryId}`}
                      className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white"
                    >
                      Open
                    </Link>
                  </div>

                  <div className="mt-6 grid gap-3 md:grid-cols-4">
                    <div className="rounded-xl border p-4">
                      <div className="text-[11px] uppercase text-black/50">
                        Tier / Band
                      </div>
                      <div className="mt-1 text-sm">
                        {isCertified ? tierBand : "—"}
                      </div>
                    </div>

                    <div className="rounded-xl border p-4">
                      <div className="text-[11px] uppercase text-black/50">
                        Certified At
                      </div>
                      <div className="mt-1 text-sm">
                        {isCertified ? formatDate(certifiedAt) : "—"}
                      </div>
                    </div>

                    <div className="rounded-xl border p-4">
                      <div className="text-[11px] uppercase text-black/50">
                        Valid From
                      </div>
                      <div className="mt-1 text-sm">
                        {formatDate(row.validFrom)}
                      </div>
                    </div>

                    <div className="rounded-xl border p-4">
                      <div className="text-[11px] uppercase text-black/50">
                        Valid To
                      </div>
                      <div className="mt-1 text-sm">
                        {formatDate(row.validTo)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}