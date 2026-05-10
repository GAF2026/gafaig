import Link from "next/link";
import { notFound } from "next/navigation";
import { getExplorerSystemByRegistryId } from "@/lib/queries/explorer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    registryId: string;
  };
};

function valueOrDash(value: string | null | undefined): string {
  const clean = String(value ?? "").trim();
  return clean.length > 0 ? clean : "—";
}

function DetailCard({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-5 py-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-400">
        {label}
      </div>
      <div className="mt-3 text-base font-semibold text-neutral-950">
        {valueOrDash(value)}
      </div>
    </div>
  );
}

export default async function AISystemDetailPage({ params }: PageProps) {
  const registryId = decodeURIComponent(params.registryId);
  const system = await getExplorerSystemByRegistryId(registryId);

  if (!system) {
    notFound();
  }

  const publicRegistryId = valueOrDash(system.REGISTRY_ID);

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
              AI Governance Intelligence Record
            </div>

            <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-tight text-neutral-950">
              {valueOrDash(system.SYSTEM_NAME)}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">
              Publication-safe AI system governance record derived from canonical
              Snowflake public registry views. This page exposes only published
              certification observability metadata.
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href={`/registry/${encodeURIComponent(publicRegistryId)}`}
              className="rounded-full border border-neutral-300 px-5 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              Open Registry Record
            </Link>

            <Link
              href={`/verify/${encodeURIComponent(publicRegistryId)}`}
              className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
            >
              Verify Record
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
            Public Governance Surface
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950">
            AI system observability details
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DetailCard label="Registry ID" value={system.REGISTRY_ID} />
          <DetailCard label="System Type" value={system.SYSTEM_TYPE} />
          <DetailCard label="Organization" value={system.DEVELOPER_ORGANIZATION} />
          <DetailCard label="Country" value={system.COUNTRY} />
          <DetailCard label="Certification Status" value={system.DECISION_STATUS} />
          <DetailCard label="Lifecycle Status" value={system.LIFECYCLE_STATUS} />
          <DetailCard label="Renewal Status" value={system.RENEWAL_STATUS} />
          <DetailCard label="Deployment Status" value={system.DEPLOYMENT_STATUS} />
          <DetailCard label="Oversight Level" value={system.OVERSIGHT_LEVEL} />
          <DetailCard label="Certified At" value={system.CERTIFIED_AT} />
        </div>
      </section>

      <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
          Intended Use
        </div>

        <p className="mt-4 max-w-4xl text-sm leading-7 text-neutral-700">
          {valueOrDash(system.INTENDED_USE)}
        </p>
      </section>

      <section className="mt-6 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-[0.35em] text-neutral-400">
          Publication-Safe Boundary
        </div>

        <h2 className="mt-3 text-xl font-semibold tracking-tight text-neutral-950">
          This page exposes public AI system observability only
        </h2>

        <p className="mt-3 max-w-4xl text-sm leading-7 text-neutral-600">
          This public page is projection-only, publication-controlled,
          append-safe, and verification-safe. It must never expose private
          findings, private evidence, internal scoring, internal governance
          telemetry, AI recommendation internals, or non-public certification
          states.
        </p>
      </section>
    </main>
  );
}