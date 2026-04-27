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
          description="GAFAIG is the Global Authority for AI Governance. It verifies that governance processes and meaningful human oversight are implemented, operational, and producing real oversight outcomes across an organization’s AI operations and publishes independently verifiable public trust records."
          secondaryDescription="GAFAIG combines a private verification engine with a public trust layer. Certified outcomes are published as independently verifiable public trust records backed by signed proof and validated through GAFAIG’s verification endpoint and public key."
          actions={
            <>
              <PublicButtonLink href="/demo" variant="primary">
                Start Demo
              </PublicButtonLink>

              <PublicButtonLink href="/verify" variant="secondary">
                Verify a Record
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                View Public Records
              </PublicButtonLink>

              <PublicButtonLink href="/apply" variant="secondary">
                Get Certified
              </PublicButtonLink>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-3">
          <PillarCard
            eyebrow="Pillar 1"
            title="Private Verification Engine"
            body="Organizations move through a structured verification process where evidence, findings, governance controls, and human oversight materials are assessed in a controlled private environment."
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
            body="When a record is certified, GAFAIG publishes a public trust record that contains no internal governance data. The only exposed signal is a certified outcome that can be independently verified through a signed payload."
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
            body="GAFAIG distributes trust through a verification-first architecture. Every public surface—registry pages, APIs, widgets, and badges—derives its trust signal exclusively from the verification endpoint."
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

          <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black max-w-[860px]">
            Human oversight should be visible, reviewable, and independently verifiable
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
            As AI systems move into real-world use, governance cannot remain a
            policy statement or internal claim. It must be externally verifiable.
            GAFAIG provides a deterministic system where human oversight in AI
            systems is reviewed privately, certified publicly, and validated
            through signed proof.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Private review, public trust"
              body="Evidence, findings, and internal review materials are assessed in a controlled verification environment. The public sees only the certified trust outcome, not the private record set behind it."
            />
            <StatementCard
              title="Certification backed by proof"
              body="Certified records are published as independently verifiable public trust records backed by signed proof, verification endpoints, and portable trust surfaces."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            SEE HOW IT WORKS
          </div>

          <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black max-w-[860px]">
            Follow a real GAFAIG record from certification to verification
          </h2>

          <p className="mt-5 max-w-[960px] text-[15px] leading-7 text-black/75">
            The GAFAIG demo walks through the exact trust flow used to make
            human oversight independently verifiable. Start with a certified
            record, open the verification surface, inspect the signed proof,
            and see how the trust signal works outside the platform.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/demo" variant="primary">
              Start Demo
            </PublicButtonLink>

            <PublicButtonLink href="/verify" variant="secondary">
              Open Verify
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

          <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black max-w-[860px]">
            The four steps that make human oversight in AI systems independently verifiable
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
            GAFAIG converts human oversight into a verifiable proof system. A
            certified record is published, a signed payload is generated, the
            payload is verified using a public key, and the result is rendered
            across external trust surfaces.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <StepCard
              number="1"
              title="Resolve certified record"
              body="Locate the certified record in the public registry."
            />
            <StepCard
              number="2"
              title="Fetch verification proof"
              body="Retrieve the signed verification payload from the verify endpoint."
            />
            <StepCard
              number="3"
              title="Validate signature"
              body="Confirm the proof using the published GAFAIG public key."
            />
            <StepCard
              number="4"
              title="Render trust surface"
              body="Display the verified result through a widget, badge, API, or UI."
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/demo" variant="primary">
              Walk Through the Demo
            </PublicButtonLink>
            <PublicButtonLink
              href="/widget-preview/GAFAIG-00363095"
              variant="secondary"
            >
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

              <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black max-w-[860px]">
                Current public GAFAIG footprint
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] text-black/70">
                These counters are derived from GAFAIG&apos;s live public
                registry and explorer surfaces.
              </p>
            </div>

            <div className="text-[14px] text-black/70">Public metrics</div>
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
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
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

      <p className="mt-4 text-[15px] leading-7 text-black/75">{body}</p>

      <ul className="mt-5 space-y-3 text-[14px] leading-7 text-black/70">
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
      <p className="mt-3 text-[15px] leading-7 text-black/75">{body}</p>
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
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {number}
      </div>
      <div className="mt-2 text-[16px] font-semibold text-black">{title}</div>
      <p className="mt-2 text-[14px] leading-7 text-black/70">{body}</p>
    </div>
  );
}