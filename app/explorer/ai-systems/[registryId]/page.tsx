import { notFound } from "next/navigation";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import { getExplorerSystemByRegistryId } from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: {
    registryId: string;
  };
};

function safe(value: string | null | undefined): string {
  return String(value ?? "").trim() || "—";
}

function hrefSafe(value: string | null | undefined): string {
  return encodeURIComponent(String(value ?? "").trim());
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
        {label}
      </p>
      <p className="mt-3 break-words text-[18px] font-semibold tracking-tight text-black">
        {value}
      </p>
    </div>
  );
}

export default async function ExplorerAiSystemDetailPage({
  params,
}: PageProps) {
  const registryId = decodeURIComponent(params.registryId);
  const system = await getExplorerSystemByRegistryId(registryId);

  if (!system) {
    return notFound();
  }

  const publicRegistryId = safe(system.REGISTRY_ID);
  const organizationName = safe(system.DEVELOPER_ORGANIZATION);
  const country = safe(system.COUNTRY);

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER / AI GOVERNANCE INTELLIGENCE"
          title={safe(system.SYSTEM_NAME)}
          description="This AI governance intelligence profile surfaces publication-safe governance observability metadata derived from GAFAIG’s canonical Snowflake public registry views."
          secondaryDescription="This page is projection-only. It does not expose findings, evidence, scoring internals, reviewer materials, governance execution telemetry, or private workflow state."
          actions={
            <>
              <PublicButtonLink href="/explorer/ai-systems" variant="primary">
                Back to AI Systems
              </PublicButtonLink>

              <PublicButtonLink
                href={`/explorer/organizations/${hrefSafe(organizationName)}`}
                variant="secondary"
              >
                View Organization
              </PublicButtonLink>

              <PublicButtonLink
                href={`/explorer/countries/${hrefSafe(country)}`}
                variant="secondary"
              >
                View Country
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Organization" value={organizationName} />
            <MetricCard label="Country" value={country} />
            <MetricCard
              label="Certification"
              value={safe(system.DECISION_STATUS)}
            />
            <MetricCard
              label="Lifecycle"
              value={safe(system.LIFECYCLE_STATUS)}
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Renewal" value={safe(system.RENEWAL_STATUS)} />
            <MetricCard
              label="Deployment"
              value={safe(system.DEPLOYMENT_STATUS)}
            />
            <MetricCard
              label="Oversight Level"
              value={safe(system.OVERSIGHT_LEVEL)}
            />
            <MetricCard
              label="Certified"
              value={formatDate(system.CERTIFIED_AT)}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Intelligence Navigation
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Connected governance trust surfaces
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              This AI governance surface is part of a broader publication-safe governance
              trust topology connecting systems, organizations, countries,
              certification surfaces, and public verification proof surfaces.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink
              href={`/registry/ai-systems/${encodeURIComponent(
                publicRegistryId
              )}`}
              variant="primary"
            >
              Open AI Governance Surface
            </PublicButtonLink>

            <PublicButtonLink
              href={`/registry/${encodeURIComponent(publicRegistryId)}`}
              variant="secondary"
            >
              Open Certification Surface
            </PublicButtonLink>

            <PublicButtonLink
              href={`/verify/${encodeURIComponent(publicRegistryId)}`}
              variant="secondary"
            >
              Open Verification Surface
            </PublicButtonLink>

            <PublicButtonLink
              href={`/explorer/organizations/${hrefSafe(organizationName)}`}
              variant="secondary"
            >
              Organization Intelligence
            </PublicButtonLink>

            <PublicButtonLink
              href={`/explorer/countries/${hrefSafe(country)}`}
              variant="secondary"
            >
              Country Intelligence
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              AI Governance Intelligence
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Publication-safe AI governance observability
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              This profile represents a public AI governance observability
              surface associated with a published GAFAIG certification record.
              It displays only public metadata projected from canonical Snowflake
              public views.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard label="Registry ID" value={publicRegistryId} />
            <MetricCard label="System Type" value={safe(system.SYSTEM_TYPE)} />
            <MetricCard label="Intended Use" value={safe(system.INTENDED_USE)} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Certification Surfaces and Verification Proof
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Public trust is anchored to the certification surface
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              The registry ID is the canonical public trust identifier. External
              systems should verify the associated registry ID through the
              GAFAIG verification endpoint and signed verification proof payload.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink
              href={`/registry/${encodeURIComponent(publicRegistryId)}`}
              variant="primary"
            >
              Open Certification Surface
            </PublicButtonLink>

            <PublicButtonLink
              href={`/verify/${encodeURIComponent(publicRegistryId)}`}
              variant="secondary"
            >
              Open Verification Surface
            </PublicButtonLink>

            <PublicButtonLink
              href={`/api/verify/${encodeURIComponent(publicRegistryId)}`}
              variant="secondary"
            >
              Open Signed Verification Proof
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              PUBLIC TRUST BOUNDARY
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              This page surfaces publication-safe AI governance telemetry only
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              AI governance intelligence is derived exclusively from canonical
              Snowflake public registry and AI governance observability views.
            </p>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <ul className="grid gap-2 text-[15px] leading-7 text-black/75 md:grid-cols-2">
                <li>findings</li>
                <li>evidence</li>
                <li>reviewer materials</li>
                <li>scoring internals</li>
                <li>recommendation systems</li>
                <li>governance execution telemetry</li>
                <li>private workflow state</li>
                <li>unpublished certification records</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}