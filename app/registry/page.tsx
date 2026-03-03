// app/registry/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";

type RegistryRow = {
  verificationId: string;
  organizationName: string;
  status: string;
  tier: string | null;
  band: string | null;
  standardCode?: string | null;
  standardVersion?: string | null;
  scoringModelVersion?: string | null;
  verifiedAt?: string | null;
  updatedAt?: string | null;
};

type ApiResponse =
  | { ok: true; rows: RegistryRow[]; total?: number }
  | { ok: false; error: string };

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v; // fallback if already formatted
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });
}

function chipClass(kind: "neutral" | "good" | "warn") {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-[12px] font-semibold leading-none";
  if (kind === "good") return `${base} border-black/15 bg-black/[0.04] text-black`;
  if (kind === "warn") return `${base} border-black/15 bg-white text-black/80`;
  return `${base} border-black/10 bg-white text-black/70`;
}

function statusKind(status: string) {
  const s = String(status || "").toLowerCase();
  if (s.includes("approved") || s.includes("verified") || s.includes("active")) return "good";
  if (s.includes("review") || s.includes("pending") || s.includes("submitted")) return "warn";
  return "neutral";
}

async function getRegistry(): Promise<ApiResponse> {
  try {
    const res = await fetch("/api/registry", { cache: "no-store" });
    const json = (await res.json()) as ApiResponse;
    return json;
  } catch (e: any) {
    return { ok: false, error: e?.message || "Failed to load registry." };
  }
}

export default async function RegistryPage() {
  const data = await getRegistry();

  const rows = data.ok ? data.rows : [];
  const total = data.ok ? (typeof data.total === "number" ? data.total : rows.length) : 0;

  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      {/* Hero */}
      <section className="pt-2 pb-8">
        <div className="text-[13px] tracking-[0.22em] uppercase text-black/60 font-semibold">
          Registry
        </div>

        <h1 className="mt-4 text-[40px] leading-[1.15] font-semibold text-black max-w-[980px]">
          Public certification status for independent verification of human oversight for AI systems
        </h1>

        <p className="mt-5 text-[18px] leading-[1.75] text-black/80 max-w-[920px]">
          The GAFAIG Registry publishes controlled disclosures only: certification status and tiering outcomes.
          Internal evidence, findings, and any AI inventory remain private.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/framework"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black hover:bg-black/[0.04]"
          >
            Read the Framework
          </Link>

          <Link
            href="/mission"
            className="px-4 py-2 rounded-full text-sm font-semibold border border-black bg-black text-white hover:bg-black/90"
          >
            Mission & Boundaries
          </Link>
        </div>
      </section>

      {/* What is public */}
      <section className="mt-6 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">What the registry publishes</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Public fields</div>
            <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-black/80 list-disc pl-5">
              <li>Organization name</li>
              <li>Certification status</li>
              <li>Tier / band outcome</li>
              <li>Standard version</li>
              <li>Verification ID</li>
              <li>Verified / effective date (if displayed)</li>
            </ul>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Not public</div>
            <ul className="mt-3 space-y-2 text-[15px] leading-[1.7] text-black/80 list-disc pl-5">
              <li>Evidence files or internal documentation</li>
              <li>AI inventory or system-level details</li>
              <li>Internal findings, rationales, or reviewer notes</li>
              <li>Proprietary methods, datasets, or architecture</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Live registry */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <h2 className="text-[16px] font-semibold text-black">Registry records</h2>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/70 max-w-[820px]">
              Each record reflects a controlled disclosure generated from the deterministic verification engine.
            </p>
          </div>

          <div className="text-[13px] text-black/60">
            {data.ok ? (
              <span>
                Showing <span className="font-semibold text-black">{rows.length}</span> of{" "}
                <span className="font-semibold text-black">{total}</span>
              </span>
            ) : (
              <span className="font-semibold text-black/70">Registry feed unavailable</span>
            )}
          </div>
        </div>

        {!data.ok ? (
          <div className="mt-5 border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Unable to load registry</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/70">{data.error}</p>
          </div>
        ) : rows.length === 0 ? (
          <div className="mt-5 border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">No public registry records</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/70">
              When verifications are published, records will appear here with Tier + Status and a Verification ID.
            </p>
          </div>
        ) : (
          <div className="mt-5 overflow-hidden border border-black/10 rounded-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/[0.02]">
                  <tr className="text-[12px] uppercase tracking-[0.16em] text-black/60">
                    <th className="px-4 py-3 font-semibold">Organization</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Tier</th>
                    <th className="px-4 py-3 font-semibold">Band</th>
                    <th className="px-4 py-3 font-semibold">Standard</th>
                    <th className="px-4 py-3 font-semibold">Verification ID</th>
                    <th className="px-4 py-3 font-semibold">Verified</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {rows.map((r) => (
                    <tr key={r.verificationId} className="text-[14px] text-black/85">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-black">{r.organizationName}</div>
                      </td>

                      <td className="px-4 py-3">
                        <span className={chipClass(statusKind(r.status) as any)}>{r.status}</span>
                      </td>

                      <td className="px-4 py-3">{r.tier ?? "—"}</td>
                      <td className="px-4 py-3">{r.band ?? "—"}</td>

                      <td className="px-4 py-3">
                        <div className="text-black">
                          {(r.standardCode || "—") + (r.standardVersion ? ` ${r.standardVersion}` : "")}
                        </div>
                        {r.scoringModelVersion ? (
                          <div className="mt-1 text-[12px] text-black/60">
                            Model {r.scoringModelVersion}
                          </div>
                        ) : null}
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-mono text-[12px] text-black">{r.verificationId}</span>
                      </td>

                      <td className="px-4 py-3">{formatDate(r.verifiedAt || r.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Interpretation */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">How to interpret Tier + Status</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Tier</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Tier summarizes the certification outcome produced by deterministic scoring across the assessment.
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Status</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Status indicates the certification state (for example: submitted, in review, approved, or not approved).
            </p>
          </div>

          <div className="border border-black/10 rounded-2xl p-5">
            <div className="font-semibold text-black">Privacy boundary</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/75">
              Public confirmation without exposing internal evidence, findings, or AI inventories.
            </p>
          </div>
        </div>
      </section>

      {/* Participation */}
      <section className="mt-10 pt-8 border-t border-black/10">
        <h2 className="text-[16px] font-semibold text-black">Participation</h2>
        <p className="mt-3 text-[16px] leading-[1.8] text-black/80 max-w-[920px]">
          GAFAIG publishes controlled disclosures only when a verification has reached a publishable state under
          program policy. Internal records remain private to authorized parties.
        </p>
      </section>
    </main>
  );
}