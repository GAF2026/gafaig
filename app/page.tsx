import { headers } from "next/headers";
import PublicPageHero from "./_components/PublicPageHero";
import PublicButtonLink from "./_components/PublicButtonLink";
import { getLatestCertifiedRecord } from "@/lib/queries/explorer";

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
  const latest = await getLatestCertifiedRecord();
  const featuredRegistryId = latest?.registryId ?? "";

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="GLOBAL AUTHORITY FOR AI GOVERNANCE"
          title="AI governance, independently verifiable."
          description="GAFAIG is deterministic global AI governance infrastructure that enables organizations to certify AI governance outcomes privately and, after certification is achieved, elect publication of signed public certification surfaces that anyone can independently verify using cryptographic proof."
          secondaryDescription="Snowflake executes governance deterministically. The registry publishes only explicit public certification surfaces. Verification uses signed proof.messageString payloads validated through GAFAIG’s public key infrastructure."
          actions={
            <>
              <PublicButtonLink href="/certification" variant="primary">
                Certify Your AI System
              </PublicButtonLink>

              <PublicButtonLink href="/verify" variant="secondary">
                Open Verification Surface
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                Explore Certification Surfaces
              </PublicButtonLink>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-2">
          <AudienceCard
            eyebrow="FOR ORGANIZATIONS"
            title="Operate with independently verifiable AI governance"
            body="GAFAIG transforms internal governance oversight into deterministic certification infrastructure. Organizations can privately complete governance workflows and then elect publication of signed certification surfaces that customers, regulators, partners, and external systems can independently verify."
            points={[
              "Deterministic governance execution",
              "Publication-controlled certification surfaces",
              "Cryptographic proof instead of trust claims",
            ]}
            href="/certification"
            cta="Start Free Certification"
            primary
          />

          <AudienceCard
            eyebrow="FOR THE PUBLIC"
            title="Verify AI governance through signed public proof"
            body="GAFAIG allows the public to inspect certification surfaces, validate signed governance proof, and independently verify whether a published governance record is active, expired, or revoked without accessing private governance data."
            points={[
              "Inspect published certification surfaces",
              "Validate signed governance proof",
              "Verify lifecycle status independently",
            ]}
            href="/registry"
            cta="Explore Registry"
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            DETERMINISTIC GOVERNANCE INFRASTRUCTURE
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            GAFAIG transforms AI governance into independently verifiable public governance trust infrastructure
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
            GAFAIG combines governance execution, certification lifecycle management,
            governance observability, governance simulations, remediation orchestration,
            append-only publication infrastructure, and cryptographic verification into a
            unified deterministic governance architecture. Certification remains private.
            Publication is explicit. Public governance trust surfaces are independently verifiable.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <PillarCard
              eyebrow="Pillar 1"
              title="Private Governance Execution"
              body="Organizations move through structured governance workflows where evidence, findings, controls, oversight processes, remediation actions, and governance reviews are evaluated inside a deterministic private execution environment."
              points={[
                "Deterministic Snowflake execution",
                "Structured governance lifecycle",
                "Private certification workflows",
              ]}
              href="/framework"
              cta="See the framework"
            />

            <PillarCard
              eyebrow="Pillar 2"
              title="Publication-Controlled Certification"
              body="Certification and publication are separate states. After certification is achieved, organizations may elect publication of a signed public certification surface that exposes only bounded public trust information rather than private governance telemetry."
              points={[
                "Explicit publication controls",
                "Append-only public registry",
                "Signed public verification proof surfaces",
              ]}
              href="/registry"
              cta="View certification surfaces"
            />

            <PillarCard
              eyebrow="Pillar 3"
              title="Global Trust + Verification Layer"
              body="Every public governance trust signal resolves to a verification endpoint, a signed proof.messageString payload, and a public key. External systems can independently validate trust without relying on screenshots, claims, or platform-controlled assertions."
              points={[
                "Independent cryptographic verification",
                "Portable external governance trust surfaces",
                "Verification-first architecture",
              ]}
              href="/explorer"
              cta="Open explorer"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            GOVERNANCE INTELLIGENCE + OBSERVABILITY
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Governance execution, observability, simulations, and remediation operate together
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
            GAFAIG extends beyond registry publication into governance intelligence,
            governance observability, governance simulations, drift analysis,
            remediation orchestration, execution governance, and lifecycle monitoring.
            These systems remain operational and advisory only. Deterministic public governance trust
            continues to originate exclusively from Snowflake-executed certification
            and signed public proof.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="AI is advisory only"
              body="AI systems may observe, recommend, simulate, monitor, and coordinate governance workflows, but AI never certifies, publishes, mutates proof state, or overrides deterministic Snowflake trust outputs."
            />
            <StatementCard
              title="Humans approve. Snowflake decides."
              body="Human governance remains authoritative. Snowflake executes the deterministic certification and publication workflow. The registry publishes explicit public certification surfaces. Proof verifies independently."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            FEATURED PUBLIC CERTIFICATION SURFACE
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            A signed public certification surface backed by cryptographic proof
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
            Each public GAFAIG certification surface includes a registry identifier, verification
            endpoint, signed proof payload, and public-key validation path. The
            registry distributes public governance trust. The verify endpoint distributes proof.
          </p>

          <div className="mt-7 max-w-xl">
            {featuredRegistryId ? (
              <VerifiedRecordCard
                registryId={featuredRegistryId}
                status="Certified"
                integrity="Proof Integrity: Verified"
                href={`/registry/${featuredRegistryId}`}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-black/10 bg-black/[0.02] p-5">
                <div className="text-[18px] font-semibold tracking-tight text-black">
                  No certified certification surface available
                </div>
                <p className="mt-3 text-[14px] leading-7 text-black/70">
                  GAFAIG will display the latest published certification surface here once one is available.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/registry" variant="primary">
              Explore Registry
            </PublicButtonLink>

            <PublicButtonLink
              href={
                featuredRegistryId
                  ? `/verify/${featuredRegistryId}`
                  : "/verify"
              }
              variant="secondary"
            >
              Open Featured Verification Surface
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            PROOF + VERIFICATION FLOW
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Public governance trust is independently validated through signed verification proof infrastructure
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
            GAFAIG verification does not rely on screenshots, UI rendering, or
            reconstructed payloads. Verification uses the exact proof.messageString
            payload returned by the verification endpoint together with an Ed25519
            signature and GAFAIG’s public key infrastructure.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <StepCard
              number="1"
              title="Resolve certification surface"
              body="Locate a published certification surface in the public registry."
            />
            <StepCard
              number="2"
              title="Fetch signed proof"
              body="Retrieve the signed proof.messageString payload from the verify endpoint."
            />
            <StepCard
              number="3"
              title="Validate signature"
              body="Verify the Ed25519 signature using GAFAIG’s public key infrastructure."
            />
            <StepCard
              number="4"
              title="Render public governance trust surface"
              body="Display the verified public governance trust state through APIs, widgets, badges, or UI surfaces."
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/demo" variant="primary">
              Walk Through the Demo
            </PublicButtonLink>
            <PublicButtonLink
              href={
                featuredRegistryId
                  ? `/widget-preview/${featuredRegistryId}`
                  : "/widget-preview"
              }
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
                LIVE PUBLIC GOVERNANCE TRUST FOOTPRINT
              </div>

              <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
                Current published GAFAIG certification footprint
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] text-black/70">
                Live metrics derived from GAFAIG&apos;s public registry. All values
                reflect explicitly published certification surfaces.
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

function AudienceCard({
  eyebrow,
  title,
  body,
  points,
  href,
  cta,
  primary = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  href: string;
  cta: string;
  primary?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
        {eyebrow}
      </div>

      <h2 className="mt-3 text-[26px] font-semibold leading-[1.2] tracking-tight text-black">
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
        <PublicButtonLink href={href} variant={primary ? "primary" : "secondary"}>
          {cta}
        </PublicButtonLink>
      </div>
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
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

function VerifiedRecordCard({
  registryId,
  status,
  integrity,
  href,
}: {
  registryId: string;
  status: string;
  integrity: string;
  href: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="flex flex-wrap gap-2">
        <div className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
          {status}
        </div>

        <div className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-sm font-semibold text-violet-700">
          {integrity}
        </div>
      </div>

      <div className="mt-4 text-[20px] font-semibold tracking-tight text-black">
        {registryId}
      </div>

      <p className="mt-3 text-[14px] leading-7 text-black/70">
        Public GAFAIG certification surface with signed proof and independent verification.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <PublicButtonLink href={href} variant="secondary" size="sm">
          Open Certification Surface
        </PublicButtonLink>

        <PublicButtonLink href={`/verify/${registryId}`} variant="ghost" size="sm">
          Open Verification Surface →
        </PublicButtonLink>

        <PublicButtonLink
          href={`/api/verify/${registryId}`}
          variant="ghost"
          size="sm"
        >
          View Proof API →
        </PublicButtonLink>
      </div>
    </div>
  );
}

function StatementCard({ title, body }: { title: string; body: string }) {
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