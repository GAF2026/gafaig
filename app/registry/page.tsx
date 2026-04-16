import Link from "next/link";
import { getRegistryList } from "@/lib/queries/registry";

export const dynamic = "force-dynamic";

export default async function RegistryPage() {
  const rows = await getRegistryList();

  return (
    <main className="min-h-screen bg-[#f7f7f7] px-6 py-10">
      <div className="mx-auto w-full max-w-3xl space-y-8">

        {/* HERO */}
        <section className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="text-[11px] uppercase tracking-wide text-black/40">
            Registry of record
          </div>

          <h1 className="mt-2 text-[26px] font-semibold leading-tight text-black">
            Certified public AI governance registry
          </h1>

          {/* ✅ NEW AUTHORITY LINE */}
          <p className="mt-2 text-[14px] text-black/60">
            This registry serves as the public record of AI governance certifications issued through the GAFAIG verification engine.
          </p>

          <div className="mt-4 rounded-xl border border-black/10 bg-[#fafafa] p-4 text-[13px] text-black/70">
            <div className="font-medium text-black">Approved</div>
            A system has completed the full GAFAIG evaluation process, including findings, evidence review, and governance scoring.
            <div className="mt-3 font-medium text-black">Certified</div>
            The evaluated outcome has been finalized, assigned a governance score and certification tier, and published as a verifiable public record in the registry.
          </div>

          <div className="mt-5 flex gap-3">
            <Link
              href="/explorer"
              className="rounded-full bg-black px-4 py-2 text-[13px] font-medium text-white"
            >
              Open Explorer
            </Link>
            <Link
              href="/verify"
              className="rounded-full border border-black/20 px-4 py-2 text-[13px] font-medium text-black"
            >
              Verify a record
            </Link>
          </div>
        </section>

        {/* DIRECTORY */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-black/40">
                Certified public records
              </div>
              <h2 className="text-[20px] font-semibold text-black">
                Registry directory
              </h2>
            </div>

            <div className="text-[12px] text-black/40">
              {rows.length} certified records
            </div>
          </div>

          <div className="space-y-4">
            {rows.map((row: any) => {
              const isCertified =
                String(row.certificationStatus || "").toLowerCase() === "certified";

              return (
                <div
                  key={row.registryId}
                  className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      {/* STATUS CHIPS */}
                      <div className="flex gap-2">
                        <span className="rounded-full bg-green-100 px-2 py-[2px] text-[11px] font-medium text-green-700">
                          {isCertified ? "Certified" : "Approved"}
                        </span>
                        <span className="rounded-full bg-blue-100 px-2 py-[2px] text-[11px] font-medium text-blue-700">
                          {row.decisionStatus || "Approved"}
                        </span>
                      </div>

                      {/* ENTITY NAME */}
                      <div className="mt-2 text-[16px] font-semibold text-black">
                        {row.entityName}
                      </div>

                      {/* SUBTEXT */}
                      <div className="text-[12px] text-black/40">
                        {row.country || "—"} · {row.registryId}
                      </div>
                    </div>

                    {/* ACTION BUTTON */}
                    <Link
                      href={`/registry/${row.registryId}`}
                      className="rounded-full border border-black/20 px-3 py-1 text-[12px] font-medium text-black hover:bg-black hover:text-white"
                    >
                      Open
                    </Link>
                  </div>

                  {/* META GRID */}
                  <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div className="rounded-lg border border-black/10 p-2">
                      <div className="text-[10px] uppercase text-black/40">
                        Certification
                      </div>
                      <div className="text-[12px] font-medium text-black">
                        {row.certificationLevel || "Enterprise Baseline"}
                      </div>
                    </div>

                    <div className="rounded-lg border border-black/10 p-2">
                      <div className="text-[10px] uppercase text-black/40">
                        Certified
                      </div>
                      <div className="text-[12px] font-medium text-black">
                        {row.certifiedAt
                          ? new Date(row.certifiedAt).toLocaleDateString()
                          : "—"}
                      </div>
                    </div>

                    <div className="rounded-lg border border-black/10 p-2">
                      <div className="text-[10px] uppercase text-black/40">
                        Valid from
                      </div>
                      <div className="text-[12px] font-medium text-black">
                        {row.validFrom
                          ? new Date(row.validFrom).toLocaleDateString()
                          : "—"}
                      </div>
                    </div>

                    <div className="rounded-lg border border-black/10 p-2">
                      <div className="text-[10px] uppercase text-black/40">
                        Valid to
                      </div>
                      <div className="text-[12px] font-medium text-black">
                        {row.validTo
                          ? new Date(row.validTo).toLocaleDateString()
                          : "—"}
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