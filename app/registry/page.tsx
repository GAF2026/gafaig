import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";
import { getRegistryAiSystems } from "@/lib/queries/registry-ai-systems";

export const dynamic = "force-dynamic";

type RegistryRow = {
  registryId: string;
  systemId: string;
  systemName: string;
  entityName: string | null;
  entityType: string | null;
  country: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;
  certifiedAt: string | null;
  validFrom: string | null;
  validTo: string | null;
  lastActivityAt: string | null;
};

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function chipClass() {
  return "inline-flex items-center rounded-full border border-black/15 bg-black/[0.04] px-2.5 py-1 text-[12px] font-semibold leading-none text-black";
}

function inputClass() {
  return "w-full rounded-xl border border-black/15 bg-white px-3 py-2 text-[14px] text-black placeholder:text-black/45 focus:outline-none focus:ring-2 focus:ring-black/10";
}

function buttonClass(variant: "primary" | "secondary" = "secondary") {
  if (variant === "primary") {
    return "inline-flex items-center justify-center rounded-xl px-4 py-2 text-[14px] font-semibold bg-black text-white hover:bg-black/90";
  }
  return "inline-flex items-center justify-center rounded-xl px-4 py-2 text-[14px] font-semibold border border-black/15 hover:bg-black/[0.04]";
}

function cellLinkClass() {
  return "block px-4 py-3 hover:bg-black/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20";
}

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string | number;
  helper?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[28px] font-semibold leading-none tracking-tight text-black">
        {value}
      </div>
      {helper ? (
        <div className="mt-2 text-[12px] leading-[1.6] text-black/60">
          {helper}
        </div>
      ) : null}
    </div>
  );
}

function GatewayCard({
  eyebrow,
  title,
  description,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {eyebrow}
      </div>
      <h3 className="mt-3 text-[22px] font-semibold leading-[1.2] tracking-tight text-black">
        {title}
      </h3>
      <p className="mt-3 text-[14px] leading-[1.8] text-black/72">
        {description}
      </p>
      <Link
        href={href}
        className="mt-5 inline-flex items-center text-[14px] font-semibold text-black underline underline-offset-4"
      >
        {cta}
      </Link>
    </div>
  );
}

function dedupeRegistryRows(rows: Awaited<ReturnType<typeof getRegistryAiSystems>>): RegistryRow[] {
  const seen = new Set<string>();
  const out: RegistryRow[] = [];

  for (const row of rows) {
    if (!row.registryId) continue;
    const key = row.registryId.trim().toUpperCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);

    out.push({
      registryId: row.registryId,
      systemId: row.systemId,
      systemName: row.systemName,
      entityName: row.entityName,
      entityType: row.entityType,
      country: row.country,
      certifiedTier: row.certifiedTier,
      certifiedBand: row.certifiedBand,
      decisionStatus: row.decisionStatus,
      certifiedAt: row.certifiedAt,
      validFrom: row.validFrom,
      validTo: row.validTo,
      lastActivityAt: row.lastActivityAt,
    });
  }

  return out;
}

function getStats(rows: RegistryRow[]) {
  const countriesRepresented = new Set(
    rows.map((r) => (r.country || "").trim()).filter(Boolean)
  ).size;

  const latestCertificationDate =
    rows
      .map((r) => r.certifiedAt)
      .filter(Boolean)
      .sort((a, b) => {
        const at = new Date(a as string).getTime();
        const bt = new Date(b as string).getTime();
        return bt - at;
      })[0] ?? null;

  return {
    certificationRecords: rows.length,
    disclosedAiSystems: rows.length,
    countriesRepresented,
    latestCertificationDate,
  };
}

export default async function RegistryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) || {};
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const country = typeof sp.country === "string" ? sp.country.trim() : "";
  const registryId = typeof sp.registryId === "string" ? sp.registryId.trim() : "";

  const allSystems = await getRegistryAiSystems();
  const allRows = dedupeRegistryRows(allSystems);

  const rows = allRows.filter((row) => {
    const matchesQ =
      !q ||
      [row.entityName, row.systemName]
        .filter(Boolean)
        .some((value) => String(value).toUpperCase().includes(q.toUpperCase()));

    const matchesCountry =
      !country ||
      (row.country || "").trim().toUpperCase() === country.trim().toUpperCase();

    const matchesRegistryId =
      !registryId ||
      (row.registryId || "").trim().toUpperCase() === registryId.trim().toUpperCase();

    return matchesQ && matchesCountry && matchesRegistryId;
  });

  const hasFilters = Boolean(q || country || registryId);
  const stats = getStats(rows.length ? rows : allRows);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="REGISTRY"
        title="Public registry for certification records and AI systems disclosed through the GAFAIG governance workflow"
        description="The GAFAIG Registry publishes controlled public certification outcomes derived from a deterministic governance workflow. Public records confirm certification status, linked AI systems, and governance signals while private evidence, findings, reviewer rationale, and internal assessment materials remain protected."
        actions={
          <>
            <Link
              href="/registry/ai-systems"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Explore Public AI Registry
            </Link>

            <Link
              href="/framework"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Read the Framework
            </Link>
          </>
        }
      />

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          LIVE REGISTRY SIGNAL
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Public records generated from deterministic certification workflow
        </h2>

        <p className="mt-5 max-w-[920px] text-[16px] leading-[1.85] text-black/80">
          This registry is the public-facing layer of the GAFAIG platform. It
          connects certification records to disclosed AI systems and allows
          external observers to inspect public governance outcomes without
          exposing internal reviewer materials.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Certification Records"
            value={stats.certificationRecords}
            helper="Published public certification outcomes"
          />
          <StatCard
            label="Disclosed AI Systems"
            value={stats.disclosedAiSystems}
            helper="System-linked public records"
          />
          <StatCard
            label="Countries Represented"
            value={stats.countriesRepresented}
            helper="Countries visible in current public records"
          />
          <StatCard
            label="Latest Certification"
            value={formatDate(stats.latestCertificationDate)}
            helper="Most recent certification date in current results"
          />
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <GatewayCard
          eyebrow="AI SYSTEMS"
          title="Browse the public AI systems registry"
          description="Explore system-level public disclosures, linked entity metadata, and certification outcomes for AI systems published through the registry."
          href="/registry/ai-systems"
          cta="Open AI Systems Registry →"
        />

        <GatewayCard
          eyebrow="CERTIFICATION RECORDS"
          title="Search published registry certification records"
          description="Search public registry records by organization, country, or registry ID and open the associated certification detail page."
          href="#search-registry"
          cta="Search certification records ↓"
        />
      </section>

      <section
        id="search-registry"
        className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10"
      >
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          SEARCH THE REGISTRY
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Search public certification records
        </h2>

        <p className="mt-5 max-w-[920px] text-[16px] leading-[1.85] text-black/80">
          Search published certification records by organization, country, or
          registry ID. Each record links to the associated public certification
          page and connects into the disclosed AI system detail surface.
        </p>

        <form className="mt-6 grid gap-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Organization or System
            </label>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search by organization or system name"
              className={inputClass()}
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Country
            </label>
            <input
              type="text"
              name="country"
              defaultValue={country}
              placeholder="Country"
              className={inputClass()}
            />
          </div>

          <div>
            <label className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Registry ID
            </label>
            <input
              type="text"
              name="registryId"
              defaultValue={registryId}
              placeholder="GAFAIG-00000003"
              className={inputClass()}
            />
          </div>

          <div className="md:col-span-4 flex flex-wrap gap-2 pt-1">
            <button type="submit" className={buttonClass("primary")}>
              Search Registry
            </button>

            <Link href="/registry" className={buttonClass("secondary")}>
              Clear Filters
            </Link>

            <Link href="/registry/ai-systems" className={buttonClass("secondary")}>
              Browse AI Systems
            </Link>
          </div>
        </form>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              PUBLISHED RECORDS
            </div>
            <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              Public certification records
            </h2>
            <p className="mt-4 text-[14px] leading-[1.8] text-black/72">
              Published records below confirm certification outcomes and provide
              entry into the official public certification artifact.
            </p>
          </div>

          <div className="text-[14px] text-black/65">
            {rows.length} record{rows.length === 1 ? "" : "s"}
            {hasFilters ? " matching current filters" : ""}
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-black/10 p-5">
            <div className="font-semibold text-black">No matching records</div>
            <p className="mt-2 text-[14px] leading-[1.7] text-black/70">
              No public certification records matched the current search.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-black/10">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-black/[0.02]">
                  <tr className="text-[12px] uppercase tracking-[0.16em] text-black/60">
                    <th className="px-4 py-3 font-semibold">Entity</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Tier</th>
                    <th className="px-4 py-3 font-semibold">Band</th>
                    <th className="px-4 py-3 font-semibold">Registry ID</th>
                    <th className="px-4 py-3 font-semibold">Certified</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-black/10">
                  {rows.map((r) => {
                    const href = `/registry/${encodeURIComponent(r.registryId)}`;

                    return (
                      <tr
                        key={r.registryId}
                        className="text-[14px] text-black/85 transition-colors hover:bg-black/[0.04]"
                      >
                        <td className="p-0 align-top">
                          <Link href={href} className={cellLinkClass()}>
                            <div className="font-semibold text-black">
                              {r.entityName ?? r.systemName}
                            </div>

                            <div className="mt-1 text-[12px] text-black/60">
                              {(r.entityType ?? "—") +
                                (r.country ? ` · ${r.country}` : "")}
                            </div>
                          </Link>
                        </td>

                        <td className="p-0 align-top">
                          <Link href={href} className={cellLinkClass()}>
                            <span className={chipClass()}>
                              {r.decisionStatus ?? "—"}
                            </span>
                          </Link>
                        </td>

                        <td className="p-0 align-top">
                          <Link href={href} className={cellLinkClass()}>
                            {r.certifiedTier ?? "—"}
                          </Link>
                        </td>

                        <td className="p-0 align-top">
                          <Link href={href} className={cellLinkClass()}>
                            {r.certifiedBand ?? "—"}
                          </Link>
                        </td>

                        <td className="p-0 align-top">
                          <Link href={href} className={cellLinkClass()}>
                            <span className="font-mono text-[12px] text-black underline">
                              {r.registryId}
                            </span>
                          </Link>
                        </td>

                        <td className="p-0 align-top">
                          <Link href={href} className={cellLinkClass()}>
                            {formatDate(r.certifiedAt)}
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            DETERMINISTIC WORKFLOW
          </div>

          <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            From governance verification to public registry disclosure
          </h2>

          <p className="mt-5 max-w-[920px] text-[16px] leading-[1.85] text-black/80">
            Registry records are generated from a structured workflow that moves
            from verification case to scoring, snapshot, certification
            publication, and public registry disclosure.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {["Case", "Evidence", "Scoring", "Snapshot", "Registry"].map(
              (step) => (
                <div
                  key={step}
                  className="rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-4 text-center text-[13px] font-semibold text-black"
                >
                  {step}
                </div>
              )
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            PRIVACY BOUNDARY
          </div>

          <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Public trust without exposing internal reviewer materials
          </h2>

          <p className="mt-5 max-w-[920px] text-[16px] leading-[1.85] text-black/80">
            The registry confirms certification outcomes and linked system
            disclosures without exposing internal evidence, findings, reviewer
            rationales, or private assessment materials.
          </p>
        </div>
      </section>
    </main>
  );
}