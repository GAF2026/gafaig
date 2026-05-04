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
          description="GAFAIG is the first system that makes AI governance verifiable. Organizations don’t just claim oversight—they publish signed certification records that anyone can independently verify using cryptographic proof."
          secondaryDescription="Every certified record includes a signed payload that can be independently verified using GAFAIG’s public key."
          actions={
            <>
              <PublicButtonLink href="/certification" variant="primary">
                Certify Your AI System
              </PublicButtonLink>

              <PublicButtonLink href="/verify" variant="secondary">
                Verify a Public Record
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                Explore Certified Systems
              </PublicButtonLink>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-2">
          <AudienceCard
            eyebrow="FOR ORGANIZATIONS"
            title="Prove your AI governance"
            body="Turn internal oversight into a verifiable public record. GAFAIG helps organizations publish signed certification outcomes that customers, partners, and regulators can independently validate."
            points={[
              "Turn oversight into a public trust record",
              "Publish signed certification outcomes",
              "Give stakeholders proof—not claims",
            ]}
            href="/certification"
            cta="Start Free Certification"
            primary
          />

          <AudienceCard
            eyebrow="FOR THE PUBLIC"
            title="Verify which AI you can trust"
            body="Use GAFAIG to check real certification records, validate signed governance proof, and understand whether a public AI governance record is active, expired, or revoked."
            points={[
              "Check real certification records",
              "Validate signed governance proof",
              "View active, expired, and revoked states",
            ]}
            href="/registry"
            cta="Explore Registry"
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            HOW GAFAIG WORKS
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            GAFAIG converts AI governance from a claim into a verifiable public record
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
            Private verification produces a certified outcome. Certified
            outcomes become signed public records. Public records can be
            independently verified through the registry, API, SDK, widget, and
            public key.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
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
              body="When a record is certified, GAFAIG publishes a public trust record that contains no internal governance data. The exposed signal is a certified outcome that can be independently verified through a signed payload."
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
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHY GAFAIG EXISTS
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            AI governance must be independently verifiable
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
            FEATURED GAFAIG VERIFIED RECORD
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            A public record that can be inspected, verified, and validated
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
            Each public GAFAIG record includes a registry identifier, a public
            verification surface, and signed proof. The registry is the public
            trust layer. The verify endpoint is the proof layer.
          </p>

          <div className="mt-7 max-w-xl">
            {featuredRegistryId ? (
              <VerifiedRecordCard
                registryId={featuredRegistryId}
                status="Certified"
                integrity="Payload Integrity: Verified"
                href={`/registry/${featuredRegistryId}`}
              />
            ) : (
              <div className="rounded-2xl border border-dashed border-black/10 bg-black/[0.02] p-5">
                <div className="text-[18px] font-semibold tracking-tight text-black">
                  No certified record available
                </div>
                <p className="mt-3 text-[14px] leading-7 text-black/70">
                  GAFAIG will display the latest certified public record here once one is available.
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
              Verify Featured Record
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            SEE HOW IT WORKS
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
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

            <PublicButtonLink
              href={
                featuredRegistryId
                  ? `/verify/${featuredRegistryId}`
                  : "/verify"
              }
              variant="secondary"
            >
              Verify Featured Record
            </PublicButtonLink>

            <PublicButtonLink href="/registry" variant="secondary">
              Explore Registry
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            PROOF PREVIEW
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            This is not a claim. This is a verifiable system.
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
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            VERIFICATION LOOP
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Trust is not asserted. It is independently verified.
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
            Every GAFAIG trust signal resolves to a public verification endpoint,
            a signed payload, and a public key. External systems can independently
            validate certification without accessing private governance data or
            internal workflows.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StatementCard
              title="Fetch record"
              body="Fetch the certified record and signed proof from /api/verify."
            />
            <StatementCard
              title="Validate signature"
              body="Use the exact messageString and signature returned by the verification endpoint."
            />
            <StatementCard
              title="Verify with public key"
              body="Validate the signature using GAFAIG’s public key endpoint."
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink
              href={
                featuredRegistryId
                  ? `/verify/${featuredRegistryId}`
                  : "/verify"
              }
              variant="primary"
            >
              Verify Featured Record
            </PublicButtonLink>

            <PublicButtonLink href="/public-key" variant="secondary">
              View Public Key
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                LIVE TRUST SIGNALS
              </div>

              <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
                Current public GAFAIG footprint
              </h2>

              <p className="mt-4 max-w-[760px] text-[14px] text-black/70">
                Live metrics derived from GAFAIG&apos;s public registry. All
                values reflect verifiable published records.
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
        Public GAFAIG record with signed proof and independent verification.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <PublicButtonLink href={href} variant="secondary" size="sm">
          Open Record
        </PublicButtonLink>

        <PublicButtonLink href={`/verify/${registryId}`} variant="ghost" size="sm">
          Verify a Record →
        </PublicButtonLink>

        <PublicButtonLink
          href={`/api/verify/${registryId}`}
          variant="ghost"
          size="sm"
        >
          Verifiable via API →
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