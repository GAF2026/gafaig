import Link from "next/link";
import { getRegistryRecords } from "@/lib/queries/registry";
import PublicPageSection from "@/app/_components/PublicPageSection";

export const dynamic = "force-dynamic";

function fmtDate(value: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function valueOrDash(value?: string | number | null): string | number {
  if (value === null || value === undefined || value === "") return "—";
  return value;
}

function badgeClass(text?: string | null) {
  const v = String(text || "").toLowerCase();

  if (v.includes("certified")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (v.includes("not certified")) {
    return "border-slate-200 bg-slate-50 text-slate-700";
  }
  if (v.includes("published") || v.includes("approved")) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  if (v.includes("pending")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

export default async function RegistryPage() {
  const rows = await getRegistryRecords(100);

  const total = rows.length;
  const certified = rows.filter(
    (r) => r.certificationStatus === "Certified"
  ).length;
  const notCertified = total - certified;

  return (
    <main className="mx-auto max-w-[1280px] px-6 pb-20 pt-14 md:px-8">
      <div className="space-y-8">

        {/* HERO SECTION */}
        <PublicPageSection
          eyebrow="Public registry"
          title="GAFAIG Registry"
          description="Canonical public certification records derived from the GAFAIG verification workflow. This surface exposes governance outcomes without revealing private evidence."
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard label="Total Records" value={total} />
            <StatCard label="Certified" value={certified} />
            <StatCard label="Not Certified" value={notCertified} />
          </div>
        </PublicPageSection>

        {/* TABLE SECTION */}
        <PublicPageSection>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-black">
                Registry Records
              </h2>
              <p className="text-sm text-black/60">
                {rows.length} public record{rows.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="text-xs text-black/50">
              Source: V_REGISTRY_PUBLIC
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="text-sm text-black/60">
              No public registry records found.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-black/10">
              <table className="min-w-full divide-y divide-black/10">
                <thead className="bg-black/[0.03]">
                  <tr className="text-left text-xs uppercase tracking-wide text-black/50">
                    <th className="px-6 py-4 font-medium">Entity</th>
                    <th className="px-6 py-4 font-medium">Registry ID</th>
                    <th className="px-6 py-4 font-medium">Case</th>
                    <th className="px-6 py-4 font-medium">Certification</th>
                    <th className="px-6 py-4 font-medium">Tier</th>
                    <th className="px-6 py-4 font-medium">Band</th>
                    <th className="px-6 py-4 font-medium">Score</th>
                    <th className="px-6 py-4 font-medium">Decision</th>
                    <th className="px-6 py-4 font-medium">Certified At</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/5 bg-white">
                  {rows.map((row) => {
                    const isCertified =
                      row.certificationStatus === "Certified";

                    return (
                      <tr
                        key={row.registryId}
                        className={isCertified ? "bg-emerald-50/30" : ""}
                      >
                        <td className="px-6 py-5">
                          <div className="font-medium text-black">
                            <Link
                              href={`/registry/${encodeURIComponent(
                                row.registryId
                              )}`}
                              className="hover:opacity-70"
                            >
                              {row.entityName ?? "Unnamed Entity"}
                            </Link>
                          </div>

                          <div className="mt-1 text-sm text-black/60">
                            {row.entityType ?? "—"}
                            {row.country ? ` • ${row.country}` : ""}
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-black/70">
                          <div className="max-w-[260px] break-all">
                            {row.registryId}
                          </div>
                        </td>

                        <td className="px-6 py-5 text-sm text-black/70">
                          {row.caseId ?? "—"}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass(
                              row.certificationStatus
                            )}`}
                          >
                            {row.certificationStatus}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs ${badgeClass(
                              row.certifiedTier
                            )}`}
                          >
                            {row.certifiedTier ?? "—"}
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs ${badgeClass(
                              row.certifiedBand
                            )}`}
                          >
                            {row.certifiedBand ?? "—"}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm font-semibold text-black">
                          {valueOrDash(row.certifiedScore)}
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex rounded-full border px-3 py-1 text-xs ${badgeClass(
                              row.decisionStatus
                            )}`}
                          >
                            {row.decisionStatus ?? "—"}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm text-black/70">
                          {fmtDate(row.certifiedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </PublicPageSection>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <div className="text-sm text-black/60">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-black">
        {value}
      </div>
    </div>
  );
}