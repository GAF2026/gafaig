import Link from "next/link";

export const revalidate = 300;

type RegistryRow = {
  registryId?: string;
  entityName?: string | null;
  country?: string | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  decisionStatus?: string | null;
  certifiedAt?: string | null;
};

type RegistryResponse = {
  ok?: boolean;
  rows?: RegistryRow[];
};

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.gafaig.com"
  );
}

function safe(v?: string | null): string {
  const s = String(v ?? "").trim();
  return s || "—";
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

function formatTierBand(tier?: string | null, band?: string | null): string {
  const t = safe(tier);
  const b = safe(band);
  if (t !== "—" && b !== "—") return `${t} · ${b}`;
  if (t !== "—") return t;
  if (b !== "—") return b;
  return "—";
}

function trustState(isCertified: boolean, decisionStatus: string) {
  if (isCertified) {
    return {
      label: "Certified",
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

function statusTone(value: string) {
  const v = value.trim().toUpperCase();
  if (v === "APPROVED") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (v === "CERTIFIED") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

export default async function ExplorerPage() {
  const baseUrl = getBaseUrl();

  const res = await fetch(`${baseUrl}/api/registry`, {
    next: { revalidate: 300 },
  }).catch(() => null);

  const data: RegistryResponse | null = res ? await res.json() : null;
  const rows = data?.rows ?? [];

  const total = rows.length;
  const certifiedCount = rows.filter((r) =>
    Boolean(String(r.certifiedAt ?? "").trim())
  ).length;

  const approvedCount = rows.filter(
    (r) =>
      !Boolean(String(r.certifiedAt ?? "").trim()) &&
      safe(r.decisionStatus).toUpperCase() === "APPROVED"
  ).length;

  const countries = new Set(
    rows
      .map((r) => String(r.country ?? "").trim())
      .filter((v) => v.length > 0)
  ).size;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            PUBLIC TRUST SURFACE
          </div>

          <h1 className="mt-4 max-w-[980px] text-[42px] font-semibold leading-[1.05] tracking-tight text-black md:text-[56px]">
            Explore the public GAFAIG trust surface
          </h1>

          <p className="mt-5 max-w-[980px] text-[16px] leading-[1.85] text-black/75">
            Explorer shows the broader public governance footprint across organizations, countries, and publicly surfaced records in the GAFAIG network.
          </p>

          <div className="mt-4 max-w-[980px] space-y-3 text-[15px] leading-[1.8] text-black/65">
            <p>
              Explorer includes both evaluated systems and publicly trusted systems.
            </p>

            <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
              <div className="grid gap-3 text-[15px] leading-[1.8] text-black/72">
                <div>
                  <span className="font-semibold text-black">Approved</span>{" "}
                  means a system has completed the GAFAIG evaluation process and received a governance decision, but it has not been published as a certified public record.
                </div>

                <div>
                  <span className="font-semibold text-black">Certified</span>{" "}
                  means the evaluated outcome has been finalized, assigned a governance score and certification tier, and published as a verifiable public record in the registry.
                </div>
              </div>
            </div>

            <p className="text-black/60">
              Explorer shows both Approved and Certified records. The Registry of Record shows Certified records only.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/registry"
              className="inline-flex items-center rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black hover:text-white"
            >
              View Registry
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard label="Public Records" value={String(total)} />
          <StatCard label="Certified" value={String(certifiedCount)} />
          <StatCard label="Approved" value={String(approvedCount)} />
          <StatCard label="Countries" value={String(countries)} />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                LATEST PUBLIC RECORDS
              </div>

              <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Explorer directory
              </h2>

              <p className="mt-4 max-w-[900px] text-[15px] leading-[1.8] text-black/68">
                Browse the latest public records across approved and certified states.
              </p>
            </div>

            <div className="text-[13px] text-black/50">
              {rows.length} visible public records
            </div>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-black/10 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/50">
                  <th className="pb-4 pr-4">Entity</th>
                  <th className="pb-4 pr-4">Country</th>
                  <th className="pb-4 pr-4">Certification</th>
                  <th className="pb-4 pr-4">Decision</th>
                  <th className="pb-4 pr-4">Certified</th>
                  <th className="pb-4 pr-4">Trust State</th>
                  <th className="pb-4">Record</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row) => {
                  const registryId = safe(row.registryId);
                  const entityName = safe(row.entityName);
                  const country = safe(row.country);
                  const decisionStatus = safe(row.decisionStatus);
                  const isCertified = Boolean(
                    String(row.certifiedAt ?? "").trim()
                  );
                  const tierBand = formatTierBand(
                    row.certifiedTier,
                    row.certifiedBand
                  );
                  const trust = trustState(isCertified, decisionStatus);

                  return (
                    <tr key={registryId} className="border-b border-black/10 align-top">
                      <td className="py-5 pr-4">
                        <div className="text-[16px] font-semibold leading-[1.4] text-black">
                          {entityName}
                        </div>
                        <div className="mt-1 text-[12px] text-black/50">
                          {registryId}
                        </div>
                      </td>

                      <td className="py-5 pr-4 text-[15px] text-black/75">
                        {country}
                      </td>

                      <td className="py-5 pr-4 text-[15px] text-black/75">
                        {isCertified ? tierBand : "—"}
                      </td>

                      <td className="py-5 pr-4">
                        {decisionStatus !== "—" ? (
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ring-1 ${statusTone(
                              decisionStatus
                            )}`}
                          >
                            {decisionStatus}
                          </span>
                        ) : (
                          <span className="text-[15px] text-black/45">—</span>
                        )}
                      </td>

                      <td className="py-5 pr-4 text-[15px] text-black/75">
                        {isCertified ? formatDate(row.certifiedAt) : "—"}
                      </td>

                      <td className="py-5 pr-4">
                        <span className={trust.className}>{trust.label}</span>
                      </td>

                      <td className="py-5">
                        <Link
                          href={`/registry/${registryId}`}
                          className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-semibold transition hover:bg-black hover:text-white"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 text-[36px] font-semibold leading-none tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}