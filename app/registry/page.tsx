import Link from "next/link";
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicButton from "@/app/_components/PublicButton";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type RegistryRow = {
  REGISTRY_ID: string | null;
  APPLICATION_ID: string | null;
  CASE_ID: string | null;
  ENTITY_NAME: string | null;
  COUNTRY: string | null;
};

type RegistryRecord = {
  registryId: string;
  applicationId: string | null;
  caseId: string | null;
  entityName: string | null;
  entityType: string | null;
  country: string | null;
  certifiedScore: string | null;
  certifiedTier: string | null;
  certifiedBand: string | null;
  decisionStatus: string | null;
  validFrom: string | null;
  validTo: string | null;
  certifiedAt: string | null;
};

type CountryOptionRow = {
  COUNTRY: string | null;
};

function asString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const s = String(value).trim();
  return s === "" ? null : s;
}

function normalizeRegistryRow(row: RegistryRow): RegistryRecord {
  return {
    registryId: asString(row.REGISTRY_ID) ?? "",
    applicationId: asString(row.APPLICATION_ID),
    caseId: asString(row.CASE_ID),
    entityName: asString(row.ENTITY_NAME),
    country: asString(row.COUNTRY),
    entityType: null,
    certifiedScore: null,
    certifiedTier: null,
    certifiedBand: null,
    decisionStatus: null,
    validFrom: null,
    validTo: null,
    certifiedAt: null,
  };
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function certificationTierBandLabel(
  tier: string | null,
  band: string | null
) {
  return tier && band ? `${tier} · Band ${band}` : tier || band || "—";
}

function normalizeString(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0]?.trim() || "";
  return String(value || "").trim();
}

function certificationStatus(row: RegistryRecord) {
  return row.certifiedAt ? "Certified" : "Not Certified";
}

export default async function RegistryPage({
  searchParams,
}: {
  searchParams?: {
    q?: string | string[];
    country?: string | string[];
  };
}) {
  const q = normalizeString(searchParams?.q);
  const country = normalizeString(searchParams?.country);

  const whereParts: string[] = [];
  const binds: Array<string | number | null> = [];

  if (q) {
    whereParts.push(`
      (
        UPPER(COALESCE(ENTITY_NAME, '')) LIKE UPPER(?)
        OR UPPER(COALESCE(REGISTRY_ID, '')) LIKE UPPER(?)
        OR UPPER(COALESCE(APPLICATION_ID, '')) LIKE UPPER(?)
        OR UPPER(COALESCE(CASE_ID, '')) LIKE UPPER(?)
      )
    `);
    const like = `%${q}%`;
    binds.push(like, like, like, like);
  }

  if (country) {
    whereParts.push(`UPPER(COALESCE(COUNTRY, '')) = UPPER(?)`);
    binds.push(country);
  }

  const whereClause = whereParts.length ? `WHERE ${whereParts.join(" AND ")}` : "";

  let rows: RegistryRecord[] = [];
  let countries: CountryOptionRow[] = [];
  let dataUnavailable = false;

  try {
    const [rawRows, rawCountries] = await Promise.all([
      sfQuery<RegistryRow>(
        `
        SELECT
          REGISTRY_ID,
          APPLICATION_ID,
          CASE_ID,
          ENTITY_NAME,
          COUNTRY
        FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
        ${whereClause}
        ORDER BY ENTITY_NAME ASC, REGISTRY_ID ASC
        LIMIT 100
        `,
        binds
      ),
      sfQuery<CountryOptionRow>(
        `
        SELECT DISTINCT COUNTRY
        FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
        WHERE COUNTRY IS NOT NULL
        ORDER BY COUNTRY ASC
        `
      ),
    ]);

    rows = rawRows.map(normalizeRegistryRow).filter((row) => row.registryId);
    countries = rawCountries;
  } catch (error) {
    dataUnavailable = true;
    console.error("REGISTRY PAGE ERROR:", error);
  }

  const totalRecords = rows.length;
  const certifiedRecords = rows.filter(
    (row) => certificationStatus(row).trim().toLowerCase() === "certified"
  ).length;
  const approvedRecords = rows.filter(
    (row) => String(row.decisionStatus || "").trim().toLowerCase() === "approved"
  ).length;

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="REGISTRY OF RECORD"
          title="Public AI governance certification records"
          description="The GAFAIG Registry is the canonical public record of certification outcomes issued through the GAFAIG verification framework. Each record discloses certification status, validity information, and linked trust surfaces without exposing private evidence, findings, or internal review workflow."
          secondaryDescription="This is not a simple directory. It is a public trust layer for AI governance certification. Every record is intended to function as a portable trust signal that can be inspected directly, linked to disclosed AI systems, and verified through badge, proof, and public verification surfaces."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="secondary">
                Open Explorer
              </PublicButtonLink>

              <PublicButtonLink href="/verify" variant="secondary">
                Open the Verification Guide
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="mt-0 grid gap-4 md:grid-cols-2">
            <IntroCard
              title="Canonical public record"
              body="GAFAIG publishes certification outcomes through a registry of record designed for external reliance, institutional review, and public trust."
            />
            <IntroCard
              title="Verifiable trust surface"
              body="Each record can resolve into badge, proof, and verification layers so certification status can be checked rather than merely claimed."
            />
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-4 text-[15px] leading-[1.8] text-black/72">
            Need to understand how public verification works?{" "}
            <PublicButtonLink
              href="/verify"
              variant="link"
              size="sm"
              className="h-auto px-0 py-0"
            >
              Open the verification guide
            </PublicButtonLink>
            .
          </div>

          <form className="mt-8 grid gap-4 md:grid-cols-[1.3fr_0.7fr_auto]">
            <div>
              <label
                htmlFor="q"
                className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55"
              >
                Search records
              </label>
              <input
                id="q"
                name="q"
                defaultValue={q}
                placeholder="Entity, registry ID, application ID, or case ID"
                className="w-full rounded-2xl border border-black/10 px-4 py-3 text-[15px] outline-none transition focus:border-black/30"
              />
            </div>

            <div>
              <label
                htmlFor="country"
                className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55"
              >
                Country
              </label>
              <select
                id="country"
                name="country"
                defaultValue={country}
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-[15px] outline-none transition focus:border-black/30"
              >
                <option value="">All countries</option>
                {countries.map((row) => {
                  const countryValue = asString(row.COUNTRY) ?? "";
                  return (
                    <option key={countryValue || "Unknown"} value={countryValue}>
                      {countryValue || "Unknown"}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex items-end gap-3">
              <PublicButton type="submit" variant="primary">
                Apply
              </PublicButton>

              <PublicButtonLink href="/registry" variant="secondary">
                Reset
              </PublicButtonLink>
            </div>
          </form>
        </section>

        {dataUnavailable && (
          <section className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-amber-800">
              Data temporarily unavailable
            </div>
            <p className="mt-3 max-w-[900px] text-[15px] leading-[1.8] text-amber-900/85">
              Registry data could not be loaded from the registry backend at this
              moment. The page remains available, but live listings and filters
              are temporarily unavailable. Please refresh shortly.
            </p>
          </section>
        )}

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Visible records" value={String(totalRecords)} />
          <MetricCard label="Certified" value={String(certifiedRecords)} />
          <MetricCard label="Approved decisions" value={String(approvedRecords)} />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            TRUST INFRASTRUCTURE
          </div>

          <h2 className="mt-4 max-w-[880px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Registry publication is only one layer. Each record is part of a broader trust infrastructure.
          </h2>

          <p className="mt-5 max-w-[980px] text-[16px] leading-[1.9] text-black/75">
            GAFAIG extends beyond registry disclosure into public trust
            infrastructure. Certification records can connect to signed proof
            payloads, published verification keys, public verification endpoints,
            embeddable trust badges, QR-linked verification paths, and portable
            widget surfaces that allow third parties to validate governance status
            independently.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Signed proof layer"
              body="Registry records can resolve into signed public proof so external parties can validate that the disclosed record matches what GAFAIG issued."
            />
            <StatementCard
              title="Verification endpoint"
              body="Public verification surfaces allow programmatic validation of certification status, supporting external integrations and independent checks."
            />
            <StatementCard
              title="Portable badge + widget layer"
              body="Certification trust can travel beyond the registry page through embeddable badges, QR links, verify buttons, and widgets that resolve back to the canonical public record."
            />
            <StatementCard
              title="Public trust without private exposure"
              body="The registry exposes what must be relied on publicly while preserving the confidentiality of internal evidence, findings, and controlled review workflow."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT THIS REGISTRY PROVIDES
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            A public certification surface others can rely on
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Canonical public certification records"
              body="Each entry represents a structured certification outcome issued through the GAFAIG verification framework and published as part of the public registry of record."
            />
            <StatementCard
              title="Private review remains private"
              body="Evidence, findings, and internal review workflow remain inside the controlled verification engine. Only public certification outcomes and trust signals are disclosed here."
            />
            <StatementCard
              title="Linked systems and trust surfaces"
              body="Registry records can connect to disclosed AI systems, badge endpoints, signed proof payloads, and verification surfaces so external parties can inspect governance status in context."
            />
            <StatementCard
              title="Deterministic, structured outcomes"
              body="Records reflect certification decisions produced through a deterministic framework designed to support consistency, repeatability, and institutional reliance."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            PUBLIC RECORDS
          </div>

          <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Registry directory
              </h2>
              <p className="mt-3 max-w-[820px] text-[15px] leading-[1.8] text-black/68">
                Browse certification records by organization, jurisdiction, and
                registry identifier. Open any record to inspect public
                certification details, linked AI systems, and verification
                surfaces.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 px-4 py-3 text-sm text-black/70">
              {rows.length} visible record{rows.length === 1 ? "" : "s"}
            </div>
          </div>

          {rows.length === 0 ? (
            <div className="mt-8 rounded-2xl border border-black/10 p-6 text-sm text-black/70">
              {dataUnavailable
                ? "Registry records are temporarily unavailable."
                : "No registry records matched your current filters."}
            </div>
          ) : (
            <div className="mt-8 grid gap-4">
              {rows.map((row) => {
                const cleanRegistryId = String(row.registryId || "").trim();
                return (
                  <Link
                    key={cleanRegistryId}
                    href={`/registry/${encodeURIComponent(cleanRegistryId)}`}
                    className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-5">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap gap-2">
                          <StatusPill value={certificationStatus(row)} />
                          <StatusPill value={row.decisionStatus || "—"} subtle />
                        </div>

                        <div className="mt-4 text-[24px] font-semibold tracking-tight text-black">
                          {row.entityName || cleanRegistryId}
                        </div>

                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/65">
                          <span>{row.entityType || "Organization"}</span>
                          <span>{row.country || "Unknown country"}</span>
                          <span>{cleanRegistryId}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-4">
                      <Info
                        label="Certification / Tier / Band"
                        value={certificationTierBandLabel(
                          row.certifiedTier,
                          row.certifiedBand
                        )}
                      />
                      <Info label="Certified at" value={formatDate(row.certifiedAt)} />
                      <Info label="Valid from" value={formatDate(row.validFrom)} />
                      <Info label="Valid to" value={formatDate(row.validTo)} />
                    </div>

                    <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-black/55">
                      <span>Application: {row.applicationId || "—"}</span>
                      <span>Case: {row.caseId || "—"}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            HOW TO USE THE REGISTRY
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Start with the record, then verify the trust signal
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <PathCard
              number="1"
              title="Open a registry record"
              body="Select an entity to inspect certification status, validity window, and linked public metadata."
            />
            <PathCard
              number="2"
              title="Review linked systems"
              body="See any disclosed AI systems associated with that certification record."
            />
            <PathCard
              number="3"
              title="Verify badge and proof"
              body="Use the badge, verify JSON, signed proof, and trust tools on the record page to validate the public trust signal."
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function IntroCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
        {label}
      </div>
      <div className="mt-2 text-[28px] font-semibold text-black">{value}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/5 px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[14px] text-black/85">{value}</div>
    </div>
  );
}

function StatusPill({
  value,
  subtle = false,
}: {
  value: string;
  subtle?: boolean;
}) {
  const normalized = String(value || "").trim().toLowerCase();

  const classes = subtle
    ? "border-blue-200 bg-blue-50 text-blue-700"
    : normalized === "certified"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-black/10 bg-black/[0.03] text-black/65";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${classes}`}
    >
      {value}
    </span>
  );
}

function StatementCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}

function PathCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-4">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {number}
      </div>
      <div className="mt-2 text-[16px] font-semibold text-black">{title}</div>
      <p className="mt-2 text-[14px] leading-[1.7] text-black/72">{body}</p>
    </div>
  );
}