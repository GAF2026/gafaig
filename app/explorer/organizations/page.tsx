import Link from "next/link";
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { getExplorerOrganizations } from "@/lib/queries/explorer";

export const revalidate = 300;

export default async function ExplorerOrganizationsPage() {
  const rows = await getExplorerOrganizations(200);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER"
          title="Organizations"
          description="Publicly visible organizations represented across the GAFAIG trust surface."
          secondaryDescription="This explorer surface includes both evaluated (Approved) organizations and publicly trusted (Certified) organizations that appear in the GAFAIG public registry system. Certified organizations represent finalized, published records in the registry of record."
          actions={
            <>
              <PublicButtonLink href="/registry" variant="primary">
                View Registry
              </PublicButtonLink>

              <PublicButtonLink href="/explorer" variant="secondary">
                Back to Explorer
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/countries" variant="secondary">
                Countries
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/systems" variant="secondary">
                Systems
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="max-w-[980px] space-y-3 text-[15px] leading-[1.8] text-black/65">
            <p>
              Explorer distinguishes between evaluated organizations and publicly trusted organizations.
            </p>

            <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
              <div className="grid gap-3 text-[15px] leading-[1.8] text-black/72">
                <div>
                  <span className="font-semibold text-black">Approved</span>{" "}
                  means an organization has completed the GAFAIG evaluation process and received a governance decision, but it may not yet have a certified public registry record.
                </div>

                <div>
                  <span className="font-semibold text-black">Certified</span>{" "}
                  means the evaluated outcome has been finalized and published as a trusted public record in the GAFAIG registry of record.
                </div>
              </div>
            </div>

            <p className="text-black/60">
              This organizations view may include both Approved and Certified organizations. The Registry of Record shows Certified records only.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                ORGANIZATION DIRECTORY
              </div>

              <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Public organizations in the trust surface
              </h2>

              <p className="mt-3 max-w-[820px] text-[15px] leading-[1.8] text-black/68">
                Browse organizations currently represented across the GAFAIG public trust surface.
              </p>
            </div>

            <div>
              <PublicButtonLink href="/registry" variant="secondary">
                Open Full Registry
              </PublicButtonLink>
            </div>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-black/10 text-left text-[12px] uppercase tracking-[0.16em] text-black/55">
                  <th className="px-0 py-3">Organization</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Registry Records</th>
                  <th className="px-4 py-3">Systems</th>
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
                      {row.systemCount}
                    </td>
                  </tr>
                ))}

                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-0 py-8 text-sm text-black/60">
                      No organizations found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 border-t border-black/10 pt-6">
            <PublicButtonLink href="/explorer" variant="secondary">
              Explorer
            </PublicButtonLink>

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
              Open Registry Records
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}