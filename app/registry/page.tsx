import Link from "next/link";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { sfQuery } from "@/lib/snowflake";

export const dynamic = "force-dynamic";

type RegistryRow = {
  REGISTRY_ID: string;
  APPLICATION_ID: string | null;
  CASE_ID: string | null;
  ENTITY_NAME: string | null;
  ENTITY_TYPE: string | null;
  COUNTRY: string | null;
  CERTIFIED_TIER: string | null;
  CERTIFIED_BAND: string | null;
  DECISION_STATUS: string | null;
  CERTIFICATION_STATUS: string | null;
  VALID_FROM: string | null;
  VALID_TO: string | null;
  CERTIFIED_AT: string | null;
};

type CountryOptionRow = {
  COUNTRY: string | null;
};

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

function tierBandLabel(tier: string | null, band: string | null) {
  if (tier && band) return `${tier} · Band ${band}`;
  if (tier) return tier;
  if (band) return `Band ${band}`;
  return "—";
}

function normalizeString(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0]?.trim() || "";
  return String(value || "").trim();
}

function certificationStatus(row: RegistryRow) {
  return row.CERTIFICATION_STATUS || (row.CERTIFIED_AT ? "Certified" : "Not Certified");
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

  const [rows, countries] = await Promise.all([
    sfQuery<RegistryRow>(
      `
      SELECT
        REGISTRY_ID,
        APPLICATION_ID,
        CASE_ID,
        ENTITY_NAME,
        ENTITY_TYPE,
        COUNTRY,
        CERTIFIED_TIER,
        CERTIFIED_BAND,
        DECISION_STATUS,
        CERTIFICATION_STATUS,
        VALID_FROM,
        VALID_TO,
        CERTIFIED_AT
      FROM GAFAIG_DB.CORE.V_REGISTRY_PUBLIC
      ${whereClause}
      ORDER BY
        CASE WHEN CERTIFIED_AT IS NOT NULL THEN 0 ELSE 1 END ASC,
        CERTIFIED_AT DESC NULLS LAST,
        ENTITY_NAME ASC
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

  const totalRecords = rows.length;
  const certifiedRecords = rows.filter(
    (row) => String(certificationStatus(row)).trim().toLowerCase() === "certified"
  ).length;
  const publishedRecords = rows.filter(
    (row) => String(row.DECISION_STATUS || "").trim().toLowerCase() === "published"
  ).length;

  return (
    <main className="mx-auto max-w-[1240px] px-6 pb-16 pt-14">
      <section className="rounded-3xl border border-black/10 bg-white px-8 py-10 md:px-10 md:py-12">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          REGISTRY OF RECORD
        </div>

        <h1 className="mt-4 max-w-[920px] text-[36px] font-semibold leading-[1.08] tracking-tight text-black md:text-[52px]">
          Public AI governance certification records
        </h1>

        <p className="mt-5 max-w-[940px] text-[17px] leading-[1.7] text-black/72">
          The GAFAIG Registry is the canonical public record of certification
          outcomes issued through the GAFAIG verification framework. Each record
          discloses certification status, validity information, and linked trust
          surfaces without exposing private evidence, findings, or internal
          review workflow.
        </p>

        <p className="mt-4 max-w-[940px] text-[15px] leading-[1.8] text-black/68">
          This is not a simple directory. It is a public trust layer for AI
          governance certification. Every record is intended to function as a
          portable trust signal that can be inspected directly, linked to
          disclosed AI systems, and verified through badge, proof, and public
          verification surfaces.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <IntroCard
            title="Canonical public record"
            body="GAFAIG publishes certification outcomes through a registry of record designed for external reliance, institutional review, and public trust."
          />
          <IntroCard
            title="Verifiable trust surface"
            body="Each record can resolve into badge, proof, and verification layers so certification status can be checked rather than merely claimed."
          />
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
              {countries.map((row) => (
                <option key={row.COUNTRY || "Unknown"} value={row.COUNTRY || ""}>
                  {row.COUNTRY}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end gap-3">
            <button
              type="submit"
              className="inline-flex h-[44px] items-center justify-center rounded-full border border-black bg-black px-5 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Apply
            </button>

            <PublicButtonLink href="/registry" variant="secondary">
              Reset
            </PublicButtonLink>
          </div>
        </form>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <MetricCard label="Visible records" value={String(totalRecords)} />
        <MetricCard label="Certified" value={String(certifiedRecords)} />
        <MetricCard label="Published" value={String(publishedRecords)} />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
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

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
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

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
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
            No registry records matched your current filters.
          </div>
        ) : (
          <div className="mt-8 grid gap-4">
            {rows.map((row) => (
              <Link
                key={row.REGISTRY_ID}
                href={`/registry/${encodeURIComponent(row.REGISTRY_ID)}`}
                className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
              >
                <div className="flex flex-wrap items-start justify-between gap-5">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2">
                      <StatusPill value={certificationStatus(row)} />
                      <StatusPill value={row.DECISION_STATUS || "—"} subtle />
                    </div>

                    <div className="mt-4 text-[24px] font-semibold tracking-tight text-black">
                      {row.ENTITY_NAME || row.REGISTRY_ID}
                    </div>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-black/65">
                      <span>{row.ENTITY_TYPE || "Organization"}</span>
                      <span>{row.COUNTRY || "Unknown country"}</span>
                      <span>{row.REGISTRY_ID}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-4">
                  <Info
                    label="Tier / Band"
                    value={tierBandLabel(row.CERTIFIED_TIER, row.CERTIFIED_BAND)}
                  />
                  <Info label="Certified at" value={formatDate(row.CERTIFIED_AT)} />
                  <Info label="Valid from" value={formatDate(row.VALID_FROM)} />
                  <Info label="Valid to" value={formatDate(row.VALID_TO)} />
                </div>

                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-black/55">
                  <span>Application: {row.APPLICATION_ID || "—"}</span>
                  <span>Case: {row.CASE_ID || "—"}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
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