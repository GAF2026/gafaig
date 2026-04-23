import { headers } from "next/headers";
import { notFound } from "next/navigation";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RegistryApiRow = {
  registryId: string;
  applicationId?: string | null;
  caseId?: string | null;
  entityName?: string | null;
  entityType?: string | null;
  country?: string | null;
  certificationStatus?: string | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  certifiedAt?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  lifecycleStatus?: string | null;
  renewalStatus?: string | null;
  publishedAt?: string | null;
};

type RegistryApiResponse = {
  ok: boolean;
  rows: RegistryApiRow[];
};

function buildBaseUrl(): string {
  const h = headers();
  const protocol = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  return host ? `${protocol}://${host}` : "http://localhost:3000";
}

function formatLabel(value?: string | null): string {
  const normalized = String(value ?? "").trim();
  return normalized || "—";
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function statusPillClass(status?: string | null): string {
  const normalized = String(status ?? "").trim().toUpperCase();

  if (normalized === "CERTIFIED") {
    return "border-emerald-300 bg-emerald-50 text-emerald-700";
  }
  if (normalized === "PENDING") {
    return "border-amber-300 bg-amber-50 text-amber-700";
  }
  if (normalized === "REVOKED" || normalized === "EXPIRED") {
    return "border-red-300 bg-red-50 text-red-700";
  }

  return "border-black/10 bg-black/[0.02] text-black/70";
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
        {label}
      </p>
      <p className="mt-3 text-[18px] font-medium tracking-tight text-black">
        {value}
      </p>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
        {label}
      </p>
      <p className="mt-3 break-words text-[18px] font-medium tracking-tight text-black">
        {value}
      </p>
    </div>
  );
}

async function getRegistryRecord(registryId: string): Promise<RegistryApiRow | null> {
  const baseUrl = buildBaseUrl();
  const response = await fetch(
    `${baseUrl}/api/registry?registryId=${encodeURIComponent(registryId)}`,
    { cache: "no-store" }
  );

  if (!response.ok) return null;

  const data = (await response.json()) as RegistryApiResponse;
  return data.rows?.[0] ?? null;
}

export default async function RegistryRecordPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = String(params.registryId ?? "").trim();
  const record = await getRegistryRecord(registryId);

  if (!record) notFound();

  const verifyHref = `/verify/${record.registryId}`;
  const verifyJsonHref = `/api/verify/${record.registryId}`;
  const widgetHref = `/widget-preview/${record.registryId}`;
  const registryHref = `/registry/${record.registryId}`;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">

        <PublicPageHero
          eyebrow="Registry"
          title={formatLabel(record.entityName)}
          description={`${formatLabel(record.entityType)} · ${formatLabel(record.country)}`}
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div
              className={`inline-flex rounded-full border px-4 py-2 text-[14px] font-semibold ${statusPillClass(
                record.certificationStatus
              )}`}
            >
              {formatLabel(record.certificationStatus)}
            </div>

            <div className="flex flex-wrap gap-3">
              <PublicButtonLink href={verifyHref} variant="primary">
                Verify Record
              </PublicButtonLink>
              <PublicButtonLink href={verifyJsonHref} variant="secondary">
                JSON Proof
              </PublicButtonLink>
              <PublicButtonLink href={widgetHref} variant="secondary">
                Widget
              </PublicButtonLink>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetricCard label="Certified" value={formatDate(record.certifiedAt)} />
            <MetricCard label="Valid From" value={formatDate(record.validFrom)} />
            <MetricCard label="Valid To" value={formatDate(record.validTo)} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Record details
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <DetailCard label="Registry ID" value={formatLabel(record.registryId)} />
            <DetailCard label="Entity Type" value={formatLabel(record.entityType)} />
            <DetailCard label="Country" value={formatLabel(record.country)} />
            <DetailCard label="Application ID" value={formatLabel(record.applicationId)} />
            <DetailCard label="Case ID" value={formatLabel(record.caseId)} />
            <DetailCard label="Certification Status" value={formatLabel(record.certificationStatus)} />
            <DetailCard label="Lifecycle Status" value={formatLabel(record.lifecycleStatus)} />
            <DetailCard label="Renewal Status" value={formatLabel(record.renewalStatus)} />
            <DetailCard label="Published At" value={formatDate(record.publishedAt)} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Trust surface
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <DetailCard label="Verification Endpoint" value={verifyJsonHref} />
            <DetailCard label="Registry Page" value={registryHref} />
            <DetailCard label="Widget Preview" value={widgetHref} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href={verifyJsonHref} variant="secondary">
              Open verification JSON
            </PublicButtonLink>
            <PublicButtonLink href="/registry" variant="secondary">
              Back to registry
            </PublicButtonLink>
          </div>
        </section>

      </div>
    </main>
  );
}