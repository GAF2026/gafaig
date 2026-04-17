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
          title="Proof that human oversight in AI systems is real, functioning, and independently verifiable."
          description="GAFAIG is the Global Authority for AI Governance. It verifies whether meaningful human oversight exists across an organization’s AI operations and publishes public certification records that can be independently verified."
          secondaryDescription="GAFAIG combines a private verification engine with a public trust layer. Certified outcomes are published as signed records that can be independently verified and used across external platforms."
          actions={
            <>
              <PublicButtonLink href="/demo" variant="primary">
                Start Demo
              </PublicButtonLink>

              <PublicButtonLink href="/apply" variant="secondary">
                Get Certified
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                View Public Records
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
            policy statement or a private internal claim. Organizations need a
            credible way to show that meaningful human oversight actually
            exists. GAFAIG provides that proof layer.
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
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            SEE HOW IT WORKS
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Follow a real GAFAIG record from certification to proof
          </h2>

          <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
            The GAFAIG demo walks through the exact steps used to verify AI
            governance. Start with a certified record, open the verification
            surface, inspect the signed payload, and see how the trust signal
            works outside the platform.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/demo" variant="primary">
              Start Demo
            </PublicButtonLink>

            <PublicButtonLink href="/registry" variant="secondary">
              View Registry
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            PROOF PREVIEW
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            The four steps that turn governance into public proof
          </h2>

          <p className="mt-5 max-w-[980px] text-[16px] leading-[1.85] text-black/75">
            GAFAIG’s trust model is simple to follow. A public record appears in
            the registry, the record is verified through signed proof, the raw
            verification payload is available for inspection, and the trust
            signal can travel outside the platform through a live widget.
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
              body="The same record is checked through the public verification surface."
            />
            <StepCard
              number="3"
              title="Signed JSON"
              body="The machine-readable payload exposes the proof directly."
            />
            <StepCard
              number="4"
              title="External Widget"
              body="The trust signal appears outside GAFAIG on third-party sites."
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/demo" variant="primary">
              Walk Through the Demo
            </PublicButtonLink>
            <PublicButtonLink href="/widget-preview/GAFAIG-00000001" variant="secondary">
              View Widget Preview
            </PublicButtonLink>
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