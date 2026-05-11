import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";
import { getExplorerStats } from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function numberFormat(value: number | null | undefined): string {
  return new Intl.NumberFormat("en-US").format(Number(value ?? 0));
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
        {label}
      </p>
      <p className="mt-3 text-[20px] font-semibold tracking-tight text-black">
        {value}
      </p>
    </div>
  );
}

function RelationshipCard({
  eyebrow,
  title,
  body,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <article className="rounded-3xl border border-black/10 bg-white p-6 transition hover:border-black/30">
      <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
        {eyebrow}
      </p>

      <h3 className="mt-3 text-[24px] font-semibold tracking-tight text-black">
        {title}
      </h3>

      <p className="mt-3 text-[15px] leading-7 text-black/70">{body}</p>

      <div className="mt-6">
        <PublicButtonLink href={href} variant="primary">
          {cta}
        </PublicButtonLink>
      </div>
    </article>
  );
}

export default async function ExplorerGraphPage() {
  const stats = await getExplorerStats();

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="EXPLORER / GOVERNANCE INTELLIGENCE GRAPH"
          title="Global AI governance intelligence graph"
          description="This page introduces GAFAIG’s publication-safe governance topology layer, connecting public AI systems, organizations, countries, certification records, and verification surfaces."
          secondaryDescription="The intelligence graph is deterministic and projection-based. It is derived from canonical Snowflake public views only and does not expose findings, evidence, scoring internals, reviewer materials, governance execution telemetry, or private workflow state."
          actions={
            <>
              <PublicButtonLink href="/explorer" variant="primary">
                Back to Explorer
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/ai-systems" variant="secondary">
                AI Systems
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/organizations" variant="secondary">
                Organizations
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/countries" variant="secondary">
                Countries
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="AI Systems" value={numberFormat(stats.systems)} />
            <MetricCard
              label="Organizations"
              value={numberFormat(stats.organizations)}
            />
            <MetricCard label="Countries" value={numberFormat(stats.countries)} />
            <MetricCard
              label="Public Records"
              value={numberFormat(stats.publicRecords)}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Governance Topology
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Publication-safe relationship intelligence
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              GAFAIG models public governance relationships through certified
              records only. These relationships connect AI systems to
              organizations, organizations to countries, and all published
              records back to verification.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <RelationshipCard
              eyebrow="AI Systems"
              title="AI system governance topology"
              body="Explore public AI systems connected to certified records, organizations, countries, lifecycle state, renewal posture, and verification surfaces."
              href="/explorer/ai-systems"
              cta="Explore AI Systems"
            />

            <RelationshipCard
              eyebrow="Organizations"
              title="Organization governance topology"
              body="Explore organizations represented in the public trust surface and the AI systems associated with their published certification records."
              href="/explorer/organizations"
              cta="Explore Organizations"
            />

            <RelationshipCard
              eyebrow="Countries"
              title="Country governance topology"
              body="Explore countries represented in the GAFAIG public observability layer through published certification records, organizations, and AI system disclosures."
              href="/explorer/countries"
              cta="Explore Countries"
            />

            <RelationshipCard
              eyebrow="Signals"
              title="Governance signal topology"
              body="Explore public observability signals derived from lifecycle posture, renewal posture, certification continuity, publication activity, and AI system disclosure."
              href="/explorer/governance-signals"
              cta="Explore Signals"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Intelligence Model
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Deterministic governance relationships
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              This graph layer does not infer private relationships or generate
              AI-based conclusions. It surfaces deterministic public
              relationships already present in GAFAIG’s canonical Snowflake
              public registry projections.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <MetricCard label="System → Organization" value="Public projection" />
            <MetricCard label="Organization → Country" value="Public projection" />
            <MetricCard label="Record → Verification" value="Proof anchored" />
            <MetricCard label="Lifecycle → Continuity" value="Publication-safe" />
            <MetricCard label="Renewal → Activity" value="Public telemetry" />
            <MetricCard label="Signals → Explorer" value="Deterministic" />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <p className="text-[12px] font-semibold uppercase tracking-[0.24em] text-black/40">
              Public Trust Boundary
            </p>

            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              This graph is publication-safe governance topology only
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              GAFAIG’s intelligence graph is derived exclusively from canonical
              public views. It does not expose private governance execution
              systems or unpublished certification records.
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