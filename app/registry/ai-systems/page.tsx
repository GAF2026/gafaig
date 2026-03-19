import Link from "next/link";
import {
  getRegistryAiSystemsFilterOptions,
  getRegistryAiSystemsPaginated,
  getRegistryAiSystemsSummaryStats,
  type GetRegistryAiSystemsParams,
  type RegistryAiSystemsSortBy,
  type RegistryAiSystemsSortOrder,
} from "@/lib/queries/registry-ai-systems";

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

function badgeClass(text?: string | null) {
  const v = String(text || "").toLowerCase();

  if (v.includes("enterprise") || v === "a") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (v.includes("standard") || v === "b") {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  if (v.includes("baseline") || v === "c") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  return "border-slate-200 bg-slate-50 text-slate-700";
}

function parseString(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0]?.trim() || undefined;
  return value?.trim() || undefined;
}

function parsePositiveInt(
  value: string | string[] | undefined,
  fallback: number
): number {
  const raw = parseString(value);
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return Math.floor(parsed);
}

function normalizeSortBy(value: string | undefined): RegistryAiSystemsSortBy {
  if (value === "score" || value === "tier" || value === "country") return value;
  return "name";
}

function normalizeSortOrder(
  value: string | undefined
): RegistryAiSystemsSortOrder {
  return value === "desc" ? "desc" : "asc";
}

function buildQueryString(
  current: Record<string, string | undefined>,
  updates: Record<string, string | number | undefined | null>
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(current)) {
    if (value && value.trim() !== "") {
      params.set(key, value);
    }
  }

  for (const [key, value] of Object.entries(updates)) {
    if (value === undefined || value === null || String(value).trim() === "") {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  }

  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function buildPageNumbers(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 1) return [1];

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);

  for (let p = currentPage - 2; p <= currentPage + 2; p += 1) {
    if (p >= 1 && p <= totalPages) {
      pages.add(p);
    }
  }

  return Array.from(pages).sort((a, b) => a - b);
}

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegistryAiSystemsPage({
  searchParams,
}: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const search = parseString(resolvedSearchParams.search);
  const country = parseString(resolvedSearchParams.country);
  const tier = parseString(resolvedSearchParams.tier);
  const band = parseString(resolvedSearchParams.band);
  const sortBy = normalizeSortBy(parseString(resolvedSearchParams.sortBy));
  const sortOrder = normalizeSortOrder(parseString(resolvedSearchParams.sortOrder));
  const requestedPage = parsePositiveInt(resolvedSearchParams.page, 1);
  const pageSize = parsePositiveInt(resolvedSearchParams.pageSize, 12);

  const queryParams: GetRegistryAiSystemsParams = {
    search,
    country,
    tier,
    band,
    sortBy,
    sortOrder,
    page: requestedPage,
    pageSize,
  };

  const [result, filterOptions, summaryStats] = await Promise.all([
    getRegistryAiSystemsPaginated(queryParams),
    getRegistryAiSystemsFilterOptions(),
    getRegistryAiSystemsSummaryStats(),
  ]);

  const systems = result.rows;
  const total = result.total;
  const totalPages = Math.max(1, Math.ceil(total / result.pageSize));

  const currentQuery = {
    search,
    country,
    tier,
    band,
    sortBy,
    sortOrder,
    pageSize: String(pageSize),
  };

  const pageNumbers = buildPageNumbers(result.page, totalPages);
  const hasFilters = Boolean(search || country || tier || band);
  const pageWasClamped = requestedPage !== result.page;

  const start =
    systems.length === 0 ? 0 : (result.page - 1) * result.pageSize + 1;
  const end =
    systems.length === 0
      ? 0
      : (result.page - 1) * result.pageSize + systems.length;

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Global AI Systems Registry
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          Public-facing AI systems connected to published GAFAIG registry
          records. This view reflects the current certified registry surface and
          associated entity metadata.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Matching Systems
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {total}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Linked Entities
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {summaryStats.linkedEntities}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="text-xs uppercase tracking-wide text-slate-500">
            Countries
          </div>
          <div className="mt-2 text-3xl font-semibold text-slate-900">
            {summaryStats.countries}
          </div>
        </div>
      </div>

      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
        <form method="get" className="grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <label
              htmlFor="search"
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Search
            </label>
            <input
              id="search"
              name="search"
              defaultValue={search ?? ""}
              placeholder="System, entity, registry ID, or developer"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-slate-400"
            />
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="country"
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Country
            </label>
            <select
              id="country"
              name="country"
              defaultValue={country ?? ""}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              <option value="">All countries</option>
              {filterOptions.countries.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="tier"
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Tier
            </label>
            <select
              id="tier"
              name="tier"
              defaultValue={tier ?? ""}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              <option value="">All tiers</option>
              {filterOptions.tiers.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-2">
            <label
              htmlFor="band"
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Band
            </label>
            <select
              id="band"
              name="band"
              defaultValue={band ?? ""}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              <option value="">All bands</option>
              {filterOptions.bands.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="lg:col-span-1">
            <label
              htmlFor="sortBy"
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Sort
            </label>
            <select
              id="sortBy"
              name="sortBy"
              defaultValue={sortBy}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              <option value="name">Name</option>
              <option value="score">Score</option>
              <option value="tier">Tier</option>
              <option value="country">Country</option>
            </select>
          </div>

          <div className="lg:col-span-1">
            <label
              htmlFor="sortOrder"
              className="mb-2 block text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Order
            </label>
            <select
              id="sortOrder"
              name="sortOrder"
              defaultValue={sortOrder}
              className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-400"
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>

          <input type="hidden" name="page" value="1" />
          <input type="hidden" name="pageSize" value={pageSize} />

          <div className="flex items-end gap-3 lg:col-span-12">
            <button
              type="submit"
              className="inline-flex rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              Apply Filters
            </button>

            <Link
              href="/registry/ai-systems"
              className="inline-flex rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Reset
            </Link>
          </div>
        </form>
      </section>

      {pageWasClamped ? (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          The requested page was out of range. Showing the last available page instead.
        </div>
      ) : null}

      <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <div>
          Showing <span className="font-medium text-slate-900">{start}</span> to{" "}
          <span className="font-medium text-slate-900">{end}</span> of{" "}
          <span className="font-medium text-slate-900">{total}</span> systems
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {hasFilters ? (
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Filters active
            </div>
          ) : (
            <div className="text-xs uppercase tracking-wide text-slate-500">
              All systems
            </div>
          )}

          <form method="get" className="flex items-center gap-2">
            {search ? <input type="hidden" name="search" value={search} /> : null}
            {country ? (
              <input type="hidden" name="country" value={country} />
            ) : null}
            {tier ? <input type="hidden" name="tier" value={tier} /> : null}
            {band ? <input type="hidden" name="band" value={band} /> : null}
            <input type="hidden" name="sortBy" value={sortBy} />
            <input type="hidden" name="sortOrder" value={sortOrder} />
            <input type="hidden" name="page" value="1" />

            <label
              htmlFor="pageSize"
              className="text-xs uppercase tracking-wide text-slate-500"
            >
              Per page
            </label>
            <select
              id="pageSize"
              name="pageSize"
              defaultValue={String(pageSize)}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm text-slate-900"
            >
              <option value="12">12</option>
              <option value="24">24</option>
              <option value="48">48</option>
            </select>
            <button
              type="submit"
              className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 transition hover:bg-slate-50"
            >
              Update
            </button>
          </form>
        </div>
      </div>

      {systems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-600">
          No public AI systems matched the current filters.
        </div>
      ) : (
        <div className="grid gap-5">
          {systems.map((system) => (
            <article
              key={system.systemId}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-semibold text-slate-900">
                      <Link
                        href={`/registry/ai-systems/${system.systemId}`}
                        className="hover:text-slate-700"
                      >
                        {system.systemName}
                      </Link>
                    </h2>

                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass(
                        system.certifiedTier
                      )}`}
                    >
                      {system.certifiedTier ?? "Unspecified"}
                    </span>

                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass(
                        system.certifiedBand
                      )}`}
                    >
                      Band {system.certifiedBand ?? "—"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                    <span>
                      <span className="font-medium text-slate-800">Entity:</span>{" "}
                      {system.entityName ?? "—"}
                    </span>
                    <span>
                      <span className="font-medium text-slate-800">Country:</span>{" "}
                      {system.country ?? "—"}
                    </span>
                    <span>
                      <span className="font-medium text-slate-800">Type:</span>{" "}
                      {system.systemType ?? "—"}
                    </span>
                    <span>
                      <span className="font-medium text-slate-800">Risk:</span>{" "}
                      {system.riskTier ?? "—"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm lg:min-w-[280px]">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Registry ID
                    </div>
                    <div className="mt-1 font-medium text-slate-900">
                      {system.registryId ?? "—"}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Case ID
                    </div>
                    <div className="mt-1 font-medium text-slate-900">
                      {system.caseId ?? "—"}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Certified
                    </div>
                    <div className="mt-1 font-medium text-slate-900">
                      {fmtDate(system.certifiedAt)}
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <div className="text-xs uppercase tracking-wide text-slate-500">
                      Score
                    </div>
                    <div className="mt-1 font-medium text-slate-900">
                      {system.certifiedScore ?? "—"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Intended Use
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {system.intendedUse ?? "—"}
                  </p>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Oversight
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {system.oversightLevel ?? "—"}
                  </p>
                  <div className="mt-3 text-xs text-slate-500">
                    Human review required:{" "}
                    <span className="font-medium text-slate-700">
                      {system.humanReviewRequired === null
                        ? "—"
                        : system.humanReviewRequired
                        ? "Yes"
                        : "No"}
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Deployment
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {system.deploymentStatus ?? "—"}
                  </p>
                  <div className="mt-3 text-xs text-slate-500">
                    Decision status:{" "}
                    <span className="font-medium text-slate-700">
                      {system.decisionStatus ?? "—"}
                    </span>
                  </div>
                </div>
              </div>

              {system.publicSummary ? (
                <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Public Summary
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {system.publicSummary}
                  </p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <nav className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            Page <span className="font-medium text-slate-900">{result.page}</span> of{" "}
            <span className="font-medium text-slate-900">{totalPages}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href={buildQueryString(currentQuery, {
                page: Math.max(1, result.page - 1),
              })}
              aria-disabled={result.page <= 1}
              className={`rounded-xl border px-3 py-2 text-sm transition ${
                result.page <= 1
                  ? "pointer-events-none border-slate-200 text-slate-400"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Previous
            </Link>

            {pageNumbers.map((pageNumber, index) => {
              const previous = pageNumbers[index - 1];
              const showGap = previous && pageNumber - previous > 1;

              return (
                <div key={pageNumber} className="flex items-center gap-2">
                  {showGap ? (
                    <span className="px-1 text-sm text-slate-400">…</span>
                  ) : null}

                  <Link
                    href={buildQueryString(currentQuery, { page: pageNumber })}
                    className={`rounded-xl border px-3 py-2 text-sm transition ${
                      pageNumber === result.page
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-300 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </Link>
                </div>
              );
            })}

            <Link
              href={buildQueryString(currentQuery, {
                page: Math.min(totalPages, result.page + 1),
              })}
              aria-disabled={result.page >= totalPages}
              className={`rounded-xl border px-3 py-2 text-sm transition ${
                result.page >= totalPages
                  ? "pointer-events-none border-slate-200 text-slate-400"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              Next
            </Link>
          </div>
        </nav>
      ) : null}
    </main>
  );
}