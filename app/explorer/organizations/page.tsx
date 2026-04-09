import Link from "next/link";
import { getExplorerOrganizations } from "@/lib/queries/explorer";

function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function ExplorerOrganizationsPage() {
  const rows = await getExplorerOrganizations(200);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <section className="rounded-[32px] border border-black/10 bg-white p-8">
        <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
          Explorer
        </div>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-black">
          Organizations
        </h1>
        <p className="mt-4 max-w-3xl text-[16px] leading-8 text-black/70">
          Publicly visible organizations represented in the GAFAIG registry of
          record.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/explorer"
            className="rounded-full border border-black/15 px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
          >
            Back to explorer
          </Link>
          <Link
            href="/registry"
            className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
          >
            View registry
          </Link>
        </div>
      </section>

      <section className="mt-8 rounded-[32px] border border-black/10 bg-white p-8">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="border-b border-black/10 text-left text-[12px] uppercase tracking-[0.16em] text-black/55">
                <th className="px-0 py-3">Organization</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Country</th>
                <th className="px-4 py-3">Records</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last certified</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={`${row.entityName}-${row.country ?? "none"}`}
                  className="border-b border-black/5"
                >
                  <td className="px-0 py-4 font-semibold text-black">
                    {row.entityName}
                  </td>
                  <td className="px-4 py-4 text-sm text-black/75">
                    {row.entityType ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-sm text-black/75">
                    {row.country ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-sm text-black/75">
                    {row.registryCount}
                  </td>
                  <td className="px-4 py-4 text-sm text-black/75">
                    {row.decisionStatus ?? "—"}
                  </td>
                  <td className="px-4 py-4 text-sm text-black/75">
                    {formatDate(row.lastCertifiedAt)}
                  </td>
                </tr>
              ))}

              {rows.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-0 py-8 text-sm text-black/60"
                  >
                    No organizations found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}