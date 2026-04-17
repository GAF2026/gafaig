import Link from "next/link";
import { notFound } from "next/navigation";
import PublicButtonLink from "@/app/_components/PublicButtonLink";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RegistryRecord = {
  registryId?: string;
  entityName?: string;
  entityType?: string;
  country?: string;
  applicationId?: string;
  caseId?: string;
  certificationStatus?: string;
  certifiedTier?: string;
  certifiedBand?: string;
  decisionStatus?: string;
  certifiedAt?: string;
  validFrom?: string;
  validTo?: string;
};

async function getRecord(registryId: string): Promise<RegistryRecord | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/registry?registryId=${registryId}`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const json = await res.json();
  if (!json?.rows?.length) return null;

  return json.rows[0];
}

function safe(v?: string | null) {
  return (v || "").trim() || "—";
}

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-US");
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
        {label}
      </div>
      <div className="mt-2 text-[15px] font-semibold text-black">
        {value}
      </div>
    </div>
  );
}

function StepCard({
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

export default async function RegistryDetailPage({
  params,
}: {
  params: { registryId: string };
}) {
  const record = await getRecord(params.registryId);

  if (!record) return notFound();

  const registryId = safe(record.registryId);

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Certified
            </span>

            <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
              {safe(record.decisionStatus)}
            </span>
          </div>

          <h1 className="mt-4 text-[42px] font-semibold tracking-tight text-black">
            {safe(record.entityName)}
          </h1>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <InfoCard
              label="Certification"
              value={`${safe(record.certifiedTier)} ${safe(record.certifiedBand)}`}
            />
            <InfoCard label="Certified" value={formatDate(record.certifiedAt)} />
            <InfoCard label="Valid From" value={formatDate(record.validFrom)} />
            <InfoCard label="Valid To" value={formatDate(record.validTo)} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink
              href={`/verify/${registryId}`}
              variant="primary"
            >
              Verify this Record
            </PublicButtonLink>

            <PublicButtonLink
              href={`/api/verify/${registryId}`}
              variant="secondary"
            >
              View JSON Proof
            </PublicButtonLink>

            <PublicButtonLink
              href={`/widget-preview/${registryId}`}
              variant="secondary"
            >
              View Widget
            </PublicButtonLink>

            <PublicButtonLink href="/demo" variant="secondary">
              See Full Demo
            </PublicButtonLink>
          </div>
        </section>

        {/* TRUST FLOW */}
        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            TRUST FLOW
          </div>

          <h2 className="mt-4 text-[32px] font-semibold tracking-tight">
            From record to independent proof
          </h2>

          <p className="mt-5 max-w-[900px] text-[15px] leading-[1.8] text-black/75">
            This record is part of a complete trust flow. It appears in the registry,
            can be verified through signed proof, exposes a machine-readable payload,
            and can be displayed outside GAFAIG through a portable trust widget.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <StepCard
              number="1"
              title="Registry Record"
              body="A certified public record shows the trust outcome."
            />
            <StepCard
              number="2"
              title="Verify Page"
              body="The record is validated through GAFAIG’s verification layer."
            />
            <StepCard
              number="3"
              title="Signed JSON"
              body="The proof is available as machine-readable signed data."
            />
            <StepCard
              number="4"
              title="External Widget"
              body="The trust signal can appear outside GAFAIG."
            />
          </div>
        </section>

        {/* RECORD DETAILS */}
        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[22px] font-semibold">Record details</h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <InfoCard label="Registry ID" value={registryId} />
            <InfoCard label="Entity Type" value={safe(record.entityType)} />
            <InfoCard label="Country" value={safe(record.country)} />
            <InfoCard label="Application ID" value={safe(record.applicationId)} />
            <InfoCard label="Case ID" value={safe(record.caseId)} />
            <InfoCard label="Status" value={safe(record.certificationStatus)} />
          </div>
        </section>

        {/* USE THIS RECORD */}
        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            USE THIS RECORD
          </div>

          <h2 className="mt-4 text-[32px] font-semibold tracking-tight">
            This trust record can be used outside GAFAIG
          </h2>

          <p className="mt-5 max-w-[900px] text-[15px] leading-[1.8] text-black/75">
            This record is not limited to this page. It can be verified through the
            public API, embedded on external websites, and used as a portable trust
            signal across platforms.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink
              href={`/widget-preview/${registryId}`}
              variant="primary"
            >
              Embed This Record
            </PublicButtonLink>

            <PublicButtonLink
              href={`/verify/${registryId}`}
              variant="secondary"
            >
              Open Verification
            </PublicButtonLink>
          </div>
        </section>

      </div>
    </main>
  );
}