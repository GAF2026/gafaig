import Link from "next/link";
import { notFound } from "next/navigation";
import { getRegistryByRegistryId } from "@/lib/queries/registry";

type PageProps = {
  params: { registryId: string };
};

function fmtDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function fmtNumber(value: number | null) {
  if (value === null || value === undefined) return "—";
  return String(Number(value));
}

function valueOrDash(value: string | null) {
  return value && value.trim() ? value : "—";
}

export default async function RegistryRecordPage({ params }: PageProps) {
  const registryId = decodeURIComponent(params.registryId || "").trim();
  if (!registryId) notFound();

  const record = await getRegistryByRegistryId(registryId);
  if (!record) notFound();

  const isCertified =
    record.certifiedScore !== null &&
    record.certifiedTier !== null &&
    record.certifiedBand !== null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8">
        <Link
          href="/registry"
          className="text-sm text-slate-500 hover:text-slate-800"
        >
          ← Back to Registry
        </Link>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-slate-200 px-4 py-1 text-sm text-slate-700">
            {valueOrDash(record.certificationStatus)}
          </span>

          {isCertified ? (
            <span className="rounded-full border border-slate-200 px-4 py-1 text-sm text-slate-700">
              {valueOrDash(record.certifiedBand)}
            </span>
          ) : null}

          <span className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-sm text-emerald-700">
            {valueOrDash(record.decisionStatus)}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900">
              Registry Certification Record
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
              Official GAFAIG public certification record. This page exposes the
              public governance signal and linked certification metadata without
              revealing private evidence or reviewer materials.
            </p>

            <div className="mt-6 inline-flex rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              Public registry disclosure
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {isCertified ? (
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Score
                </div>
                <div className="mt-2 text-5xl font-semibold text-slate-900">
                  {fmtNumber(record.certifiedScore)}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl bg-slate-50 p-5">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Status
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-900">
                  {valueOrDash(record.certificationStatus)}
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Certified
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">
                {fmtDate(record.certifiedAt)}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Valid From
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">
                {fmtDate(record.validFrom)}
              </div>
            </div>

            <div className="rounded-2xl bg-slate-50 p-5">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Valid To
              </div>
              <div className="mt-2 text-2xl font-semibold text-slate-900">
                {fmtDate(record.validTo)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="rounded-3xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Record Identity
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Registry ID
                </div>
                <div className="mt-2 break-all text-xl font-medium text-slate-900">
                  {record.registryId}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Case ID
                </div>
                <div className="mt-2 text-xl font-medium text-slate-900">
                  {valueOrDash(record.caseId)}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Snapshot ID
                </div>
                <div className="mt-2 break-all text-xl font-medium text-slate-900">
                  {valueOrDash((record as any).registrySnapshotId ?? record.snapshotId ?? null)}
                </div>
              </div>
            </div>

            <div className="mt-5">
              <Link
                href={`/registry/ai-systems?registryId=${encodeURIComponent(record.registryId)}`}
                className="inline-flex rounded-2xl border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Browse AI Systems
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Certification Status
            </h2>
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Decision Status</dt>
                <dd className="font-medium text-slate-900">
                  {valueOrDash(record.decisionStatus)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Tier</dt>
                <dd className="font-medium text-slate-900">
                  {isCertified ? valueOrDash(record.certifiedTier) : "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Band</dt>
                <dd className="font-medium text-slate-900">
                  {isCertified ? valueOrDash(record.certifiedBand) : "—"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-slate-500">Last Activity</dt>
                <dd className="font-medium text-slate-900">
                  {fmtDate(record.lastActivityAt)}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Linked Entity
            </h2>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Name
                </div>
                <div className="mt-2 text-xl font-medium text-slate-900">
                  {valueOrDash(record.entityName)}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Type
                  </div>
                  <div className="mt-2 text-xl font-medium text-slate-900">
                    {valueOrDash(record.entityType)}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Country
                  </div>
                  <div className="mt-2 text-xl font-medium text-slate-900">
                    {valueOrDash(record.country)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 p-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Registry Metadata
            </h2>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Application ID
                </div>
                <div className="mt-2 text-xl font-medium text-slate-900">
                  {valueOrDash(record.applicationId)}
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Certified At
                </div>
                <div className="mt-2 text-xl font-medium text-slate-900">
                  {fmtDate(record.certifiedAt)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <h2 className="text-lg font-semibold text-slate-800">
            Registry Notice
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-600">
            This record reflects public certification output derived from the
            GAFAIG deterministic governance workflow. Private evidence, findings,
            reviewer rationale, and internal assessment materials are not
            disclosed on this public page.
          </p>
        </div>
      </section>
    </main>
  );
}