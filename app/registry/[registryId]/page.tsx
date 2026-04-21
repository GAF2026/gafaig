import { notFound } from "next/navigation";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import {
  getRegistryRecordById,
  type RegistryRecord,
} from "@/lib/queries/registry";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(value: string | null): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatLabel(value: string | null): string {
  const normalized = String(value ?? "").trim();
  return normalized || "—";
}

function getStatusText(record: RegistryRecord): string {
  return formatLabel(record.certificationStatus);
}

function getStatusBadgeClasses(status: string | null): string {
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

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
        {label}
      </div>
      <div className="mt-3 text-[16px] font-semibold tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
        {label}
      </div>
      <div className="mt-3 text-[16px] font-semibold tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}

export default async function RegistryRecordPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = String(params.registryId ?? "").trim();

  if (!registryId) {
    notFound();
  }

  const record = await getRegistryRecordById(registryId);

  if (!record) {
    notFound();
  }

  const verifyUrl = `/api/verify/${record.registryId}`;
  const registryUrl = `/registry/${record.registryId}`;
  const widgetUrl = `/widget-preview/${record.registryId}`;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="Registry"
          title="Public certification record"
          description="This page exposes the public certification outcome for a GAFAIG-certified organization without exposing internal verification materials."
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div
            className={`inline-flex rounded-full border px-5 py-2 text-[15px] font-semibold ${getStatusBadgeClasses(
              record.certificationStatus
            )}`}
          >
            {getStatusText(record)}
          </div>

          <h1 className="mt-6 text-[32px] font-semibold tracking-tight text-black md:text-[38px]">
            {formatLabel(record.entityName)}
          </h1>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            {formatLabel(record.entityType)} · {formatLabel(record.country)}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <MetricCard label="Certified" value={formatDate(record.certifiedAt)} />
            <MetricCard label="Valid From" value={formatDate(record.validFrom)} />
            <MetricCard label="Valid To" value={formatDate(record.validTo)} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href={verifyUrl} variant="primary">
              Verify this Record
            </PublicButtonLink>
            <PublicButtonLink href={verifyUrl} variant="secondary">
              View JSON Proof
            </PublicButtonLink>
            <PublicButtonLink href={widgetUrl} variant="secondary">
              View Widget
            </PublicButtonLink>
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

            <DetailCard
              label="Application ID"
              value={formatLabel(record.applicationId)}
            />
            <DetailCard label="Case ID" value={formatLabel(record.caseId)} />
            <DetailCard
              label="Certification Status"
              value={formatLabel(record.certificationStatus)}
            />

            <DetailCard
              label="Lifecycle Status"
              value={formatLabel(record.lifecycleStatus)}
            />
            <DetailCard
              label="Renewal Status"
              value={formatLabel(record.renewalStatus)}
            />
            <DetailCard
              label="Published At"
              value={formatDate(record.publishedAt)}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Trust surface
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <DetailCard label="Verification Endpoint" value={verifyUrl} />
            <DetailCard label="Registry Page" value={registryUrl} />
            <DetailCard label="Widget Preview" value={widgetUrl} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href={verifyUrl} variant="secondary">
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