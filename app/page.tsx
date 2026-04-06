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
    <main className="mx-auto max-w-[1280px] px-6 pb-20 pt-14 md:px-8">
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

              <PublicButtonLink href="/developers" variant="secondary">
                Explore Integrations
              </PublicButtonLink>

              <PublicButtonLink href="/mission" variant="ghost">
                Start with the Mission
              </PublicButtonLink>

              <PublicButtonLink href="/framework" variant="ghost">
                See How It Works
              </PublicButtonLink>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-3">
          <PillarCard
            eyebrow="Pillar 1"
            title="Private Verification Engine"
            body="A controlled review environment where organizations move through application intake, evidence review, findings, deterministic scoring, and certification workflow."
            points={[
              "Reviewer-only operational layer",
              "Structured evidence and findings flow",
              "Deterministic certification process",
            ]}
            href="/admin/login"
            cta="Open reviewer layer"
          />

          <PillarCard
            eyebrow="Pillar 2"
            title="Public Trust Record"
            body="A canonical public record where certification outcomes are published without exposing private reviewer materials, internal evidence, or controlled assessment workflows."
            points={[
              "Canonical certification records",
              "Signed proof and verification layer",
              "Portable badge, widget, and API signals",
            ]}
            href="/registry"
            cta="View public records"
          />

          <PillarCard
            eyebrow="Pillar 3"
            title="Global Explorer"
            body="A discovery layer for organizations, AI systems, countries, and governance presence across the GAFAIG network."
            points={[
              "Organizations and systems",
              "Country-level visibility",
              "Global governance footprint",
            ]}
            href="/explorer"
            cta="Open explorer"
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHY GAFAIG EXISTS
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            AI governance must be provable, not just promised
          </h2>

          <p className="mt-5 max-w-[980px] text-[16px] leading-[1.9] text-black/75">
            As AI systems move into real-world deployment, governance cannot
            remain a policy statement, a marketing claim, or an internal memo.
            Organizations need a credible way to demonstrate that human
            oversight actually exists. GAFAIG provides that independent proof
            layer.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Private verification, controlled environment"
              body="Evidence, findings, and internal assessment materials are reviewed inside a controlled verification engine and are not exposed publicly."
            />
            <StatementCard
              title="Public proof as a trust signal"
              body="Certification outcomes are published as verifiable public records backed by signed proof, badges, widgets, and verification endpoints."
            />
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[18px] font-semibold tracking-tight text-black">
              What GAFAIG is
            </div>
            <ul className="mt-3 space-y-2 text-[15px] text-black/75">
              <li>• Independent verification authority</li>
              <li>• Deterministic certification engine</li>
              <li>• Public proof layer for human oversight in AI</li>
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            HOW THE SYSTEM WORKS
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            From controlled review to verifiable public proof
          </h2>

          <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
            GAFAIG operates as a two-layer system. A private verification engine
            evaluates governance evidence and produces certification outcomes.
            Those outcomes are then published to a public trust layer, where
            they can be independently verified.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            <PathCard
              number="1"
              title="Application"
              body="Organizations enter a controlled verification workflow."
            />
            <PathCard
              number="2"
              title="Evidence"
              body="Governance materials and oversight records are evaluated."
            />
            <PathCard
              number="3"
              title="Deterministic scoring"
              body="The same inputs produce the same certification outcome."
            />
            <PathCard
              number="4"
              title="Certification"
              body="Formal decisions determine certification status."
            />
            <PathCard
              number="5"
              title="Public proof"
              body="Results are published and can be verified through registry, badge, widget, and API."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            TRUST INFRASTRUCTURE
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Human oversight that can be independently verified
          </h2>

          <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
            GAFAIG extends beyond publication into a full trust infrastructure
            layer. Every certification record includes signed public proof, a
            verification endpoint, and embeddable trust surfaces that allow
            third parties to verify oversight status without touching private
            evidence.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Signed public certification proofs"
              body="Each certification is issued as a signed payload that can be independently validated using GAFAIG’s published public key."
            />
            <StatementCard
              title="Public verification endpoint"
              body="External systems can fetch and verify certification records programmatically through the GAFAIG verification API."
            />
            <StatementCard
              title="Embeddable trust badge"
              body="Organizations can display a GAFAIG certification badge that links directly to a verifiable public record."
            />
            <StatementCard
              title="Live verification widget"
              body="A portable widget allows external websites to display real-time certification status backed by GAFAIG’s trust infrastructure."
            />
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[18px] font-semibold tracking-tight text-black">
              What this enables
            </div>
            <ul className="mt-3 space-y-2 text-[15px] text-black/75">
              <li>• Independent third-party proof</li>
              <li>• Portable trust across the web</li>
              <li>• Cryptographic verification of certification</li>
              <li>• Public trust without exposing private evidence</li>
            </ul>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                LIVE TRUST SIGNALS
              </div>

              <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                Current public governance footprint
              </h2>

              <p className="mt-4 max-w-[760px] text-[15px] leading-[1.85] text-black/72">
                These counters are derived from GAFAIG&apos;s public registry
                and explorer surfaces.
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
            body="Learn why independent proof of human oversight in AI is needed and what problem GAFAIG is designed to solve."
            href="/mission"
            cta="Read Mission"
          />
          <FeatureCard
            title="Framework"
            body="See the deterministic model behind evidence review, findings, certification outcomes, and public trust."
            href="/framework"
            cta="Read Framework"
          />
          <FeatureCard
            title="Registry"
            body="Browse public certification records and verify governance outcomes through structured trust signals."
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

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
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
            <PublicButtonLink href="/developers" variant="secondary">
              Developers
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