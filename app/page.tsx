import { headers } from "next/headers";
import PublicPageHero from "./_components/PublicPageHero";
import PublicButtonLink from "./_components/PublicButtonLink";

export const dynamic = "force-dynamic";

type PublicMetricsResponse =
  | {
      ok: true;
      metrics: {
        certifiedOrganizations: number;
        disclosedAiSystems: number;
        countriesRepresented: number;
      };
    }
  | {
      ok: false;
      error: string;
    };

async function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";

  if (host) return `${proto}://${host}`;
  return "http://localhost:3000";
}

async function getPublicMetrics(): Promise<PublicMetricsResponse | null> {
  try {
    const base = await getBaseUrl();

    const res = await fetch(`${base}/api/public/metrics`, {
      cache: "no-store",
    });

    const json = (await res.json()) as PublicMetricsResponse;

    if (res.ok && json.ok) return json;

    const reg = await fetch(`${base}/api/registry`, {
      cache: "no-store",
    });

    const regJson = (await reg.json()) as {
      rows?: Array<{
        country?: string | null;
      }>;
    };

    if (Array.isArray(regJson.rows)) {
      const rows = regJson.rows;

      return {
        ok: true,
        metrics: {
          certifiedOrganizations: rows.length,
          disclosedAiSystems: rows.length,
          countriesRepresented: new Set(
            rows.map((r) => r.country).filter(Boolean)
          ).size,
        },
      };
    }

    return null;
  } catch {
    return null;
  }
}

function fmt(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return value.toLocaleString();
}

export default async function HomePage() {
  const metricsResp = await getPublicMetrics();
  const metrics = metricsResp && metricsResp.ok ? metricsResp.metrics : null;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="GLOBAL AUTHORITY FOR AI GOVERNANCE"
          title="Proof of human oversight in AI systems."
          description="GAFAIG is the Global Authority for AI Governance. It verifies whether meaningful human oversight exists across an organization’s AI operations and publishes public certification records that can be independently verified."
          secondaryDescription="The private verification engine reviews evidence, findings, and governance controls in a controlled environment. The public layer then publishes certification outcomes through signed proof, badges, APIs, and portable trust surfaces so third parties can confirm oversight without exposing sensitive internal materials."
          actions={
            <>
              <PublicButtonLink href="/apply" variant="primary">
                Get Certified
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                View Public Records
              </PublicButtonLink>

              <PublicButtonLink href="/mission" variant="secondary">
                Start with the Mission
              </PublicButtonLink>

              <PublicButtonLink href="/framework" variant="secondary">
                See How It Works
              </PublicButtonLink>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-3">
          <PillarCard
            eyebrow="Pillar 1"
            title="Private Verification Engine"
            body="Organizations move through a structured review process where evidence, findings, governance controls, and human oversight materials are assessed in a controlled environment."
            points={[
              "Private review workflow",
              "Structured evidence and findings process",
              "Deterministic certification path",
            ]}
            href="/framework"
            cta="See the process"
          />

          <PillarCard
            eyebrow="Pillar 2"
            title="Public Certification Record"
            body="When a record is certified, GAFAIG publishes a public trust record that can be reviewed and independently verified without exposing sensitive internal materials."
            points={[
              "Public certification outcome",
              "Signed proof and verification layer",
              "Registry, badge, widget, and API trust signals",
            ]}
            href="/registry"
            cta="View public records"
          />

          <PillarCard
            eyebrow="Pillar 3"
            title="Global Trust Surface"
            body="GAFAIG makes AI governance visible through public registry pages, verification endpoints, and portable trust surfaces that can travel across the web."
            points={[
              "Organizations and AI systems",
              "Country-level public visibility",
              "Portable external trust verification",
            ]}
            href="/explorer"
            cta="Open explorer"
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHY GAFAIG EXISTS
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Human oversight should be visible, reviewable, and provable
          </h2>

          <p className="mt-5 max-w-[980px] text-[16px] leading-[1.9] text-black/75">
            As AI systems move into real-world use, governance cannot remain a
            policy statement, a marketing promise, or a private internal claim.
            Organizations need a credible way to show that meaningful human
            oversight actually exists. GAFAIG provides that proof layer.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Private review, public trust"
              body="Evidence, findings, and internal review materials are assessed in a controlled verification environment. The public only sees the trust outcome, not the private record set behind it."
            />
            <StatementCard
              title="Certification backed by proof"
              body="Certified records are published as independently verifiable public trust records supported by signed proof, verification endpoints, and portable trust surfaces."
            />
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[18px] font-semibold tracking-tight text-black">
              What GAFAIG is
            </div>
            <ul className="mt-3 space-y-2 text-[15px] text-black/75">
              <li>• A verification authority for human oversight in AI</li>
              <li>• A deterministic certification system</li>
              <li>• A public registry of independently verifiable trust records</li>
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            HOW THE PLATFORM WORKS
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            From evidence review to public proof
          </h2>

          <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
            GAFAIG operates as a two-layer platform. A private verification
            engine evaluates evidence of human oversight and governance controls.
            Certified outcomes are then published to a public trust layer where
            anyone can verify them independently.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            <PathCard
              number="1"
              title="Application"
              body="An organization enters the GAFAIG review process."
            />
            <PathCard
              number="2"
              title="Evidence Review"
              body="Oversight records, governance materials, and supporting evidence are assessed."
            />
            <PathCard
              number="3"
              title="Findings & Scoring"
              body="Structured review outputs feed a deterministic certification path."
            />
            <PathCard
              number="4"
              title="Certification Decision"
              body="GAFAIG determines whether the oversight standard has been met."
            />
            <PathCard
              number="5"
              title="Public Trust Record"
              body="Certified outcomes are published as signed, independently verifiable records."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT THE PUBLIC CAN VERIFY
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Trust signals that extend beyond the GAFAIG website
          </h2>

          <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
            GAFAIG is not just a registry page. It is a public trust
            infrastructure layer. Certified records can be verified through the
            registry, the verify page, signed payloads, badges, widgets, and
            public APIs.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Registry and verify pages"
              body="Every certified record is visible through a public registry record and a verification page with signed proof and public-key trust surfaces."
            />
            <StatementCard
              title="Badges, widgets, and APIs"
              body="Organizations can surface live GAFAIG trust signals on external websites and third-party systems without exposing private assessment materials."
            />
            <StatementCard
              title="Signed public certification proofs"
              body="Certified outcomes are published with cryptographic signing so trust can be independently validated instead of simply asserted."
            />
            <StatementCard
              title="Portable trust across the web"
              body="GAFAIG allows verification to travel outside the platform through embeddable trust surfaces and machine-readable public endpoints."
            />
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[18px] font-semibold tracking-tight text-black">
              What this enables
            </div>
            <ul className="mt-3 space-y-2 text-[15px] text-black/75">
              <li>• Independent third-party verification</li>
              <li>• Public proof of meaningful human oversight</li>
              <li>• Trust signals that can be embedded outside GAFAIG</li>
              <li>• Governance visibility without exposing private evidence</li>
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                LIVE TRUST SIGNALS
              </div>

              <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Current public GAFAIG footprint
              </h2>

              <p className="mt-4 max-w-[760px] text-[15px] leading-[1.85] text-black/72">
                These counters are derived from GAFAIG&apos;s live public
                registry and explorer surfaces.
              </p>
            </div>

            <div className="text-[13px] text-black/50">Public metrics</div>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <MetricCard
              label="Certified organizations"
              value={fmt(metrics?.certifiedOrganizations)}
            />
            <MetricCard
              label="Disclosed AI systems"
              value={fmt(metrics?.disclosedAiSystems)}
            />
            <MetricCard
              label="Countries represented"
              value={fmt(metrics?.countriesRepresented)}
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-4">
          <FeatureCard
            title="Mission"
            body="Learn why GAFAIG exists and why proof of human oversight matters."
            href="/mission"
            cta="Read Mission"
          />
          <FeatureCard
            title="Framework"
            body="See how evidence review, findings, certification, and public proof work together."
            href="/framework"
            cta="Read Framework"
          />
          <FeatureCard
            title="Registry"
            body="Browse public certification records and verify outcomes through structured trust signals."
            href="/registry"
            cta="Open Registry"
          />
          <FeatureCard
            title="Explorer"
            body="Explore organizations, AI systems, countries, and the broader public governance footprint."
            href="/explorer"
            cta="Open Explorer"
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            START HERE
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Choose where you want to begin
          </h2>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/apply" variant="primary">
              Apply
            </PublicButtonLink>
            <PublicButtonLink href="/mission" variant="secondary">
              Mission
            </PublicButtonLink>
            <PublicButtonLink href="/framework" variant="secondary">
              Framework
            </PublicButtonLink>
            <PublicButtonLink href="/registry" variant="secondary">
              Registry
            </PublicButtonLink>
            <PublicButtonLink href="/explorer" variant="secondary">
              Explorer
            </PublicButtonLink>
            <PublicButtonLink href="/developers" variant="secondary">
              Developers
            </PublicButtonLink>
            <PublicButtonLink href="/demo" variant="secondary">
              Demo
            </PublicButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 text-[36px] font-semibold leading-none tracking-tight text-black">
        {value}
      </div>
    </div>
  );
}

function PillarCard({
  eyebrow,
  title,
  body,
  points,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
        {eyebrow}
      </div>

      <h2 className="mt-3 text-[24px] font-semibold leading-[1.25] tracking-tight text-black">
        {title}
      </h2>

      <p className="mt-4 text-[15px] leading-[1.8] text-black/72">{body}</p>

      <ul className="mt-5 space-y-3 text-[14px] leading-[1.7] text-black/72">
        {points.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <PublicButtonLink href={href} variant="ghost" size="sm">
          {cta} →
        </PublicButtonLink>
      </div>
    </div>
  );
}

function StatementCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}

function PathCard({
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

function FeatureCard({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[20px] font-semibold text-black">{title}</div>
      <p className="mt-3 text-[14px] leading-[1.8] text-black/72">{body}</p>
      <div className="mt-5">
        <PublicButtonLink href={href} variant="ghost" size="sm">
          {cta} →
        </PublicButtonLink>
      </div>
    </div>
  );
}