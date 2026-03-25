import Link from "next/link";
import { getRegistryRecords } from "@/lib/queries/registry";

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
    <main className="mx-auto max-w-7xl px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
          Public registry
        </div>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
          GAFAIG Registry
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Canonical public certification records derived from the GAFAIG
          verification workflow. This surface exposes governance outcomes
          without revealing private evidence.
        </p>
      </div>

      {/* Top summary */}
      <section className="mb-8 grid grid-cols-3 gap-4">
        <StatCard label="Total Records" value={total} />
        <StatCard label="Certified" value={certified} />
        <StatCard label="Not Certified" value={notCertified} />
      </section>

      {/* Table */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Registry Records
              </h2>
              <p className="text-sm text-slate-500">
                {rows.length} public record{rows.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="text-xs text-slate-500">
              Source: V_REGISTRY_PUBLIC
            </div>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="px-6 py-12 text-sm text-slate-500">
            No public registry records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-4 font-medium">Entity</th>
                  <th className="px-6 py-4 font-medium">Registry ID</th>
                  <th className="px-6 py-4 font-medium">Case</th>

                  {/* NEW */}
                  <th className="px-6 py-4 font-medium">Certification</th>

                  <th className="px-6 py-4 font-medium">Tier</th>
                  <th className="px-6 py-4 font-medium">Band</th>
                  <th className="px-6 py-4 font-medium">Score</th>
                  <th className="px-6 py-4 font-medium">Decision</th>
                  <th className="px-6 py-4 font-medium">Certified At</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {rows.map((row) => {
                  const isCertified =
                    row.certificationStatus === "Certified";

                  return (
                    <tr
                      key={row.registryId}
                      className={`align-top ${
                        isCertified ? "bg-emerald-50/30" : ""
                      }`}
                    >
                      <td className="px-6 py-5">
                        <div className="font-medium text-slate-900">
                          <Link
                            href={`/registry/${encodeURIComponent(
                              row.registryId
                            )}`}
                            className="hover:text-slate-700"
                          >
                            {row.entityName ?? "Unnamed Entity"}
                          </Link>
                        </div>

                        <div className="mt-1 text-sm text-slate-500">
                          {row.entityType ?? "—"}
                          {row.country ? ` • ${row.country}` : ""}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-700">
                        <div className="max-w-[260px] break-all">
                          {row.registryId}
                        </div>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-700">
                        {row.caseId ?? "—"}
                      </td>

                      {/* NEW: Certification Status */}
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
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(
                            row.certifiedTier
                          )}`}
                        >
                          {row.certifiedTier ?? "—"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(
                            row.certifiedBand
                          )}`}
                        >
                          {row.certifiedBand ?? "—"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm font-semibold text-slate-900">
                        {valueOrDash(row.certifiedScore)}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${badgeClass(
                            row.decisionStatus
                          )}`}
                        >
                          {row.decisionStatus ?? "—"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-slate-700">
                        {fmtDate(row.certifiedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="text-sm text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-semibold text-slate-900">
        {value}
      </div>
    </div>
  );
}