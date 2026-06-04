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

function ExplanationCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <h3 className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </h3>
      <p className="mt-3 text-[15px] leading-7 text-black/75">{body}</p>
    </div>
  );
}

async function getRegistryRecord(
  registryId: string
): Promise<RegistryApiRow | null> {
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

  const verifyHref = `/verify/${encodeURIComponent(record.registryId)}`;
  const verifyJsonHref = `/api/verify/${encodeURIComponent(record.registryId)}`;
  const widgetHref = `/widget-preview/${encodeURIComponent(record.registryId)}`;
  const badgeHref = `/badge/${encodeURIComponent(record.registryId)}`;
  const registryHref = `/registry/${encodeURIComponent(record.registryId)}`;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="PUBLIC CERTIFICATION SURFACE"
          title={`Public certification surface for ${formatLabel(
            record.entityName
          )}`}
          description="This page displays a published GAFAIG certification record. Certification is evaluated privately, publication is explicit, and only organizations that elect publication appear in the public registry."
          secondaryDescription="This certification record is a public governance trust surface only. Private evidence, findings, scoring internals, reviewer materials, governance telemetry, Application ID, and Case ID are not displayed publicly."
          actions={
            <>
              <PublicButtonLink href={verifyHref} variant="primary">
                Open Verification Surface
              </PublicButtonLink>

              <PublicButtonLink href={verifyJsonHref} variant="secondary">
                View Signed Proof JSON
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                Back to Registry
              </PublicButtonLink>
            </>
          }
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
              <PublicButtonLink href={verifyHref} variant="secondary">
                Open Verification Proof
              </PublicButtonLink>
              <PublicButtonLink href={verifyJsonHref} variant="secondary">
                View Signed Proof JSON
              </PublicButtonLink>
              <PublicButtonLink href={widgetHref} variant="secondary">
                Portable Widget Preview
              </PublicButtonLink>
              <PublicButtonLink href={badgeHref} variant="secondary">
                Open Badge
              </PublicButtonLink>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Certified"
              value={formatDate(record.certifiedAt)}
            />
            <MetricCard
              label="Valid From"
              value={formatDate(record.validFrom)}
            />
            <MetricCard label="Valid To" value={formatDate(record.validTo)} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Public certification details
          </h2>

          <p className="mt-4 max-w-[900px] text-[15px] leading-7 text-black/75">
            These fields describe the public certification record. This page does
            not expose private workflow identifiers or internal governance
            materials.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <DetailCard
              label="Registry ID"
              value={formatLabel(record.registryId)}
            />
            <DetailCard
              label="Entity"
              value={formatLabel(record.entityName)}
            />
            <DetailCard
              label="Entity Type"
              value={formatLabel(record.entityType)}
            />
            <DetailCard label="Country" value={formatLabel(record.country)} />
            <DetailCard
              label="Certification Status"
              value={formatLabel(record.certificationStatus)}
            />
            <DetailCard
              label="Certified"
              value={formatDate(record.certifiedAt)}
            />
            <DetailCard
              label="Valid From"
              value={formatDate(record.validFrom)}
            />
            <DetailCard label="Valid To" value={formatDate(record.validTo)} />
            <DetailCard
              label="Published"
              value={formatDate(record.publishedAt)}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            PUBLIC GOVERNANCE TRUST SURFACES
          </h2>

          <p className="mt-4 max-w-[900px] text-[15px] leading-7 text-black/75">
            The registry distributes the public certification record across
            connected public governance trust surfaces. The verification endpoint distributes
            the signed verification proof payload. External systems should verify
            the exact proof.messageString returned by the verification endpoint
            and must never reconstruct the canonical signed public payload from
            JSON fields.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <DetailCard label="Verification Proof Endpoint" value={verifyJsonHref} />
            <DetailCard
              label="Certification Record"
              value={registryHref}
            />
            <DetailCard label="Portable Widget Preview" value={widgetHref} />
            <DetailCard
              label="Portable Badge"
              value={badgeHref}
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href={verifyHref} variant="primary">
              Open Verification Surface
            </PublicButtonLink>
            <PublicButtonLink href={verifyJsonHref} variant="secondary">
              View Signed Proof JSON
            </PublicButtonLink>
            <PublicButtonLink href={badgeHref} variant="secondary">
              Open Badge
            </PublicButtonLink>
            <PublicButtonLink href="/registry" variant="secondary">
              Back to Registry
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            What this public certification record establishes
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ExplanationCard
              title="What this certification record establishes"
              body="This certification record establishes that GAFAIG has published a public certification outcome for the listed entity and registry identifier, and that the record can be independently verified through the public verification proof endpoint."
            />
            <ExplanationCard
              title="What remains intentionally private"
              body="Private evidence, findings, reviewer notes, internal scoring details, governance telemetry, Application ID, and Case ID remain outside the public certification record."
            />
          </div>
        </section>
      </div>
    </main>
  );
}