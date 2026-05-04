import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";
import {
  getRegistryFilterOptions,
  getRegistryRecords,
  searchRegistryRecords,
} from "@/lib/queries/registry";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = {
  q?: string;
  country?: string;
  organization?: string;
};

type RegistryPageRow = {
  registryId: string;
  applicationId?: string | null;
  caseId?: string | null;
  entityName?: string | null;
  entityType?: string | null;
  country?: string | null;
  certificationStatus?: string | null;
  certifiedAt?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  lifecycleStatus?: string | null;
  renewalStatus?: string | null;
  publishedAt?: string | null;
};

type FilterOptions = {
  countries: string[];
  organizations: string[];
};

function clean(value: string | null | undefined): string {
  return String(value ?? "").trim();
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return String(value);
  return parsed.toLocaleDateString("en-US");
}

function formatLabel(value: string | null | undefined): string {
  const cleaned = clean(value);
  return cleaned || "—";
}

function normalizeRow(row: Partial<RegistryPageRow> | null | undefined): RegistryPageRow | null {
  const registryId = clean(row?.registryId);

  if (!registryId) {
    return null;
  }

  return {
    registryId,
    applicationId: row?.applicationId ?? null,
    caseId: row?.caseId ?? null,
    entityName: row?.entityName ?? null,
    entityType: row?.entityType ?? null,
    country: row?.country ?? null,
    certificationStatus: row?.certificationStatus ?? null,
    certifiedAt: row?.certifiedAt ?? null,
    validFrom: row?.validFrom ?? null,
    validTo: row?.validTo ?? null,
    lifecycleStatus: row?.lifecycleStatus ?? null,
    renewalStatus: row?.renewalStatus ?? null,
    publishedAt: row?.publishedAt ?? null,
  };
}

/**
 * 🔒 HARD LOCK — no fallback logic
 */
function getStatusLabel(row: RegistryPageRow): string {
  const status = clean(row.lifecycleStatus).toLowerCase();

  if (status === "active") return "Certified";
  if (status === "expired") return "Expired";
  if (status === "revoked") return "Revoked";

  return formatLabel(row.certificationStatus);
}

function FilterChip({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <span className="inline-flex items-center justify-center rounded-full border border-black/10 bg-black/[0.02] px-3 py-1 text-sm font-medium text-black/70">
      <span className="mr-2 text-black/40">{label}</span>
      <span className="text-black">{value}</span>
    </span>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
      <div className="text-lg font-semibold text-black">No registry records found</div>
      <p className="mt-2 text-sm leading-6 text-black/60">
        Try changing or clearing your filters to see more certified public records.
      </p>
      <div className="mt-6">
        <PublicButtonLink href="/registry" variant="secondary">
          Clear all filters
        </PublicButtonLink>
      </div>
    </div>
  );
}

function RegistryUnavailableState() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="PUBLIC CERTIFICATION REGISTRY"
          title="Browse the GAFAIG public registry"
          description="The public registry is temporarily unavailable."
          secondaryDescription="The registry surface is read-only and depends on the canonical Snowflake public view. Please try again shortly."
          actions={
            <>
              <PublicButtonLink href="/verify" variant="primary">
                Verify a Record
              </PublicButtonLink>
              <PublicButtonLink href="/explorer" variant="secondary">
                Open Explorer
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="rounded-3xl border border-dashed border-black/10 bg-black/[0.02] px-6 py-14 text-center">
            <div className="text-lg font-semibold text-black">Registry unavailable</div>
            <p className="mt-2 text-sm leading-6 text-black/60">
              GAFAIG could not load the public registry records from the canonical public view.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function RegistryCard({ row }: { row: RegistryPageRow }) {
  return (
    <article className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
              {getStatusLabel(row)}
            </div>

            <div>
              <h2 className="text-[26px] font-semibold tracking-tight text-black">
                {formatLabel(row.entityName)}
              </h2>
              <p className="mt-2 text-[14px] text-black/70">
                {row.entityType ? row.entityType : ""}
                {row.entityType && row.country ? " · " : ""}
                {row.country ? row.country : ""}
              </p>
            </div>
          </div>

          <div className="min-w-[220px] rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Registry ID
            </div>
            <div className="mt-3 break-all text-[15px] leading-7 text-black">
              {row.registryId}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Certified
            </div>
            <div className="mt-3 text-[15px] leading-7 text-black">
              {formatDate(row.certifiedAt)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Valid From
            </div>
            <div className="mt-3 text-[15px] leading-7 text-black">
              {formatDate(row.validFrom)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Valid To
            </div>
            <div className="mt-3 text-[15px] leading-7 text-black">
              {formatDate(row.validTo)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Published
            </div>
            <div className="mt-3 text-[15px] leading-7 text-black">
              {formatDate(row.publishedAt)}
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Country
            </div>
            <div className="mt-3 text-[15px] leading-7 text-black">
              {row.country ?? "—"}
            </div>
          </div>

          
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <PublicButtonLink
            href={`/verify/${encodeURIComponent(row.registryId)}`}
            variant="primary"
          >
            Verify This Record
          </PublicButtonLink>

          <PublicButtonLink
            href={`/registry/${encodeURIComponent(row.registryId)}`}
            variant="secondary"
          >
            Open Certification Record
          </PublicButtonLink>

          <PublicButtonLink
            href={`/api/verify/${encodeURIComponent(row.registryId)}`}
            variant="secondary"
          >
            View Proof JSON
          </PublicButtonLink>
        </div>
      </div>
    </article>
  );
}

export default async function RegistryPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const q = clean(searchParams?.q);
  const country = clean(searchParams?.country);
  const organization = clean(searchParams?.organization);

  const hasServerFilters = q.length > 0 || country.length > 0;
  const hasAnyFilters = hasServerFilters || organization.length > 0;

  let baseRowsUnknown: unknown = [];
  let rawOptionsUnknown: unknown = {};

  try {
    [baseRowsUnknown, rawOptionsUnknown] = await Promise.all([
      hasServerFilters
        ? searchRegistryRecords({
            q,
            country,
            registryId: "",
            limit: 100,
          })
        : getRegistryRecords(100),
      getRegistryFilterOptions(),
    ]);
  } catch (error) {
    console.error("Registry page failed to load:", error);
    return <RegistryUnavailableState />;
  }

  const baseRows = Array.isArray(baseRowsUnknown)
    ? baseRowsUnknown
        .map((row) => normalizeRow(row as Partial<RegistryPageRow>))
        .filter((row): row is RegistryPageRow => row !== null)
    : [];

  const rawOptions = rawOptionsUnknown as {
    countries?: string[];
    organizations?: string[];
  };

  const filteredRows = baseRows.filter((row) => {
    const matchesOrganization =
      !organization ||
      clean(row.entityName).toLowerCase() === organization.toLowerCase();

    return matchesOrganization;
  });

  const rows = filteredRows.slice(0, 100);

  const options: FilterOptions = {
    countries: Array.isArray(rawOptions?.countries) ? rawOptions.countries : [],
    organizations: Array.isArray(rawOptions?.organizations)
      ? rawOptions.organizations
      : [],
  };

  const activeFilters = [
    q ? { label: "Search", value: q } : null,
    country ? { label: "Country", value: country } : null,
    organization ? { label: "Organization", value: organization } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="PUBLIC CERTIFICATION REGISTRY"
          title="Browse the GAFAIG public registry"
          description="Browse publicly certified AI systems and their verification records. Every record is independently verifiable using GAFAIG’s cryptographic proof system."
          secondaryDescription="Each record links to a full certification page and a publicly verifiable proof record."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="primary">
                Open Explorer
              </PublicButtonLink>
              <PublicButtonLink href="/verify" variant="secondary">
                Verify a Record
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              How to read the registry
            </div>
            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              The registry is the public index of certified records
            </h2>
            <p className="text-[15px] leading-7 text-black/75">
              Each entry represents a published GAFAIG certification record that can be independently verified.
            </p>

            {hasAnyFilters && activeFilters.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {activeFilters.map((filter) => (
                  <FilterChip
                    key={`${filter.label}-${filter.value}`}
                    label={filter.label}
                    value={filter.value}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          {rows.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6">
              {rows.map((row) => (
                <RegistryCard key={row.registryId} row={row} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}