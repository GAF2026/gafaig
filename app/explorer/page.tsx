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

  const countries = new Set(rows.map((r) => safe(r.country))).size;

  return (
    <main className="mx-auto max-w-[1440px] px-6 pb-20 pt-12 lg:px-10">
      <div className="space-y-10">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10 xl:p-12">
          <h1 className="text-[42px] font-semibold">
            Explore the public GAFAIG trust surface.
          </h1>

          <p className="mt-4 max-w-[900px] text-[15px] leading-[1.8] text-black/70">
            Discover public records across organizations, countries, and AI systems using the GAFAIG registry and explorer surfaces.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/registry"
              className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-semibold hover:bg-black hover:text-white"
            >
              View Registry
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <StatCard label="Registry Records" value={String(total)} />
          <StatCard label="Certified" value={String(certifiedCount)} />
          <StatCard label="Approved" value={String(approvedCount)} />
          <StatCard label="Countries" value={String(countries)} />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10 xl:p-12">
          <h2 className="text-[28px] font-semibold">
            Latest public records
          </h2>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-black/60">
                  <th className="pb-3">Entity</th>
                  <th className="pb-3">Country</th>
                  <th className="pb-3">Tier / Band</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Certified</th>
                  <th className="pb-3">Trust</th>
                  <th className="pb-3">Record</th>
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
                    <tr key={registryId} className="border-b">
                      <td className="py-4">
                        <div className="font-semibold">{entityName}</div>
                        <div className="text-xs text-black/50">
                          {registryId}
                        </div>
                      </td>

                      <td>{country}</td>

                      <td>{isCertified ? tierBand : "—"}</td>

                      <td>
                        {decisionStatus !== "—" && (
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ring-1 ${statusTone(
                              decisionStatus
                            )}`}
                          >
                            {decisionStatus}
                          </span>
                        )}
                      </td>

                      <td>
                        {isCertified
                          ? formatDate(row.certifiedAt)
                          : "—"}
                      </td>

                      <td>
                        <span className={trust.className}>
                          {trust.label}
                        </span>
                      </td>

                      <td>
                        <Link
                          href={`/registry/${registryId}`}
                          className="text-sm font-semibold underline"
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
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <div className="text-[12px] uppercase text-black/50">{label}</div>
      <div className="mt-2 text-[28px] font-semibold">{value}</div>
    </div>
  );
}