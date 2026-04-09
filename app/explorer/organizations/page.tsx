import Link from "next/link";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
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
    <main className="mx-auto max-w-[1280px] px-6 pb-20 pt-14 md:px-8">
      <div className="space-y-8">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            EXPLORER
          </div>

          <h1 className="mt-4 max-w-[980px] text-[32px] font-semibold leading-[1.08] tracking-tight text-black md:text-[64px]">
            Organizations
          </h1>

          <p className="mt-5 max-w-[980px] text-[16px] leading-[1.85] text-black/75 md:text-[18px]">
            Publicly visible organizations represented in the GAFAIG registry of
            record.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <PublicButtonLink href="/explorer" variant="secondary">
              Back to explorer
            </PublicButtonLink>
            <PublicButtonLink href="/registry" variant="primary">
              View registry
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
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
                    <td colSpan={6} className="px-0 py-8 text-sm text-black/60">
                      No organizations found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-black/10 pt-6">
            <PublicButtonLink href="/explorer/countries" variant="secondary">
              Countries
            </PublicButtonLink>
            <PublicButtonLink href="/explorer/systems" variant="secondary">
              Systems
            </PublicButtonLink>
            <Link
              href="/registry"
              className="inline-flex items-center justify-center rounded-full border border-black/15 px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Open registry records
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}