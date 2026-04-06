import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const EXAMPLE_ID = "GAFAIG-28dedd000ca5410c86e3a6633cd6639a";
const BASE_URL = "https://www.gafaig.com";

export default function DevelopersPage() {
  const verifyUrl = `${BASE_URL}/api/verify/${EXAMPLE_ID}`;
  const badgeUrl = `${BASE_URL}/badge/${EXAMPLE_ID}`;
  const registryUrl = `${BASE_URL}/registry/${EXAMPLE_ID}`;
  const widgetPreviewUrl = `${BASE_URL}/widget-preview/${EXAMPLE_ID}`;
  const publicKeyUrl = `${BASE_URL}/api/.well-known/gafaig-public-key`;

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="space-y-12">
        <PublicPageHero
          eyebrow="Developers"
          title="Integrate verifiable proof of human oversight"
          description="GAFAIG provides a public verification layer for AI governance. Use the verification API, signed proof, badge, and widget to display independently verifiable certification across products, websites, and compliance workflows."
          secondaryDescription="Every GAFAIG certification is backed by deterministic evaluation and cryptographic proof. External systems can verify certification independently without trusting GAFAIG as an intermediary."
          actions={
            <>
              <PublicButtonLink href="/apply" variant="primary">
                Apply for Certification
              </PublicButtonLink>
              <PublicButtonLink href={verifyUrl} variant="secondary">
                Test verify API
              </PublicButtonLink>
              <PublicButtonLink href={registryUrl} variant="secondary">
                View trust record
              </PublicButtonLink>
              <PublicButtonLink href={widgetPreviewUrl} variant="secondary">
                Preview widget
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-[24px] border border-black/10 bg-black p-6 text-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/55">
                Start here
              </div>
              <div className="mt-2 text-[22px] font-semibold tracking-tight text-white">
                Validate a live certification in seconds
              </div>
              <p className="mt-2 max-w-[760px] text-[15px] leading-[1.8] text-white/75">
                Start with a real GAFAIG trust record to test the verification
                API, inspect the public record, and preview the embeddable
                widget before deploying into production systems.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <PublicButtonLink
                href={verifyUrl}
                variant="secondary"
                className="border-white text-white hover:bg-white/10"
              >
                Test verify API
              </PublicButtonLink>
              <PublicButtonLink
                href={registryUrl}
                variant="secondary"
                className="border-white text-white hover:bg-white/10"
              >
                View record
              </PublicButtonLink>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-black/10 bg-white p-10">
          <SectionEyebrow>Trust primitives</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
            The core verification layer
          </h2>

          <p className="mt-4 max-w-[900px] text-[16px] leading-[1.9] text-black/70">
            GAFAIG exposes a small set of stable primitives that together form a
            complete verification system. These primitives can be used
            independently or combined to build trust into any interface.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <MetricCard
              label="Verification API"
              value="/api/verify"
              body="Returns certification record and signed proof."
            />
            <MetricCard
              label="Signed proof"
              value="Ed25519"
              body="Cryptographic verification of certification state."
            />
            <MetricCard
              label="Public key"
              value="/.well-known"
              body="Used for independent validation."
            />
            <MetricCard
              label="Trust surfaces"
              value="Badge · Widget"
              body="Display certification externally."
            />
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-black/10 bg-white p-10">
            <SectionEyebrow>Integration paths</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
              Three ways to integrate GAFAIG
            </h2>

            <div className="mt-8 space-y-4">
              <PathCard
                step="01"
                title="Display certification"
                body="Embed the badge or widget to surface certification status directly in your product or website."
              />
              <PathCard
                step="02"
                title="Verify programmatically"
                body="Use the verification API to validate certification status in real time."
              />
              <PathCard
                step="03"
                title="Build on GAFAIG"
                body="Use the SDK and verification primitives to integrate governance checks into workflows."
              />
            </div>
          </div>

          <div className="rounded-[32px] border border-black/10 bg-white p-10">
            <SectionEyebrow>SDK</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
              JavaScript SDK
            </h2>

            <p className="mt-4 text-[15px] leading-[1.8] text-black/70">
              The GAFAIG browser SDK lets you initialize trust surfaces, verify
              records programmatically, and render the widget manually where you
              need it.
            </p>

            <div className="mt-6 space-y-4">
              <CodeBlock
                title="Initialize"
                code={`<script src="${BASE_URL}/widget/gafaig-widget.js"></script>
<script>
  GAFAIG.init();
</script>`}
              />

              <CodeBlock
                title="Verify"
                code={`const result = await GAFAIG.verify("${EXAMPLE_ID}");
console.log(result);`}
              />

              <CodeBlock
                title="Render widget"
                code={`GAFAIG.render("#target", "${EXAMPLE_ID}");`}
              />
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-black/10 bg-white p-10">
          <SectionEyebrow>Verification API</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
            Canonical trust endpoint
          </h2>

          <p className="mt-4 max-w-[900px] text-[16px] leading-[1.9] text-black/70">
            The verification API is the canonical interface for external trust
            validation. It returns the public certification record and the
            signed proof needed for independent verification.
          </p>

          <div className="mt-6 space-y-4">
            <CodeBlock title="Request" code={`GET ${verifyUrl}`} />

            <CodeBlock
              title="Minimal usage"
              code={`const res = await fetch("${verifyUrl}");
const data = await res.json();

if (data.verified) {
  console.log("Certified");
}`}
            />
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <Card
            title="Badge embed"
            body="Use the badge endpoint when you need a lightweight visual trust signal that resolves to the current GAFAIG certification state."
          >
            <CodeBlock
              title="HTML"
              code={`<img
  src="${badgeUrl}"
  alt="GAFAIG certification badge"
/>`}
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <PublicButtonLink href={badgeUrl} variant="primary">
                Open badge
              </PublicButtonLink>
              <PublicButtonLink href={registryUrl} variant="secondary">
                Open record
              </PublicButtonLink>
            </div>
          </Card>

          <Card
            title="Widget embed"
            body="Use the widget when you want a richer trust surface with registry ID, decision state, tier/band, and deep links back to the GAFAIG public record."
          >
            <CodeBlock
              title="HTML"
              code={`<script src="${BASE_URL}/widget/gafaig-widget.js"></script>
<div data-gafaig-id="${EXAMPLE_ID}"></div>`}
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <PublicButtonLink href={widgetPreviewUrl} variant="primary">
                Preview widget
              </PublicButtonLink>
              <PublicButtonLink href={verifyUrl} variant="secondary">
                Verify live example
              </PublicButtonLink>
            </div>
          </Card>
        </section>

        <section className="rounded-[32px] border border-black/10 bg-white p-10">
          <SectionEyebrow>Proof verification</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
            Validate certification independently
          </h2>

          <p className="mt-4 max-w-[900px] text-[16px] leading-[1.9] text-black/70">
            External systems can validate the signed proof returned by the
            verification API without relying on hidden assumptions. Fetch the
            public key, reconstruct the signed message, and verify the
            signature using Ed25519-compatible tooling.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <InfoCard
                label="Algorithm"
                value="Ed25519"
                body="Returned in the proof payload."
              />
              <InfoCard
                label="Public key endpoint"
                value="/api/.well-known/gafaig-public-key"
                body="Used to validate proof.signature against proof.messageString."
              />
              <InfoCard
                label="Verification model"
                value="Independent"
                body="No hidden UI trust assumptions required."
              />
            </div>

            <div className="space-y-4">
              <CodeBlock title="Fetch public key" code={`GET ${publicKeyUrl}`} />
              <CodeBlock
                title="Verification flow"
                code={`1. Call ${verifyUrl}
2. Read proof.messageString and proof.signature
3. Fetch ${publicKeyUrl}
4. Verify signature using Ed25519
5. Compare verified payload to the public record`}
              />
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-black/10 bg-white p-10">
          <SectionEyebrow>Implementation examples</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
            Copy-paste snippets
          </h2>

          <p className="mt-4 max-w-[900px] text-[16px] leading-[1.9] text-black/70">
            Use these examples to wire GAFAIG into front-end interfaces,
            compliance systems, or internal tooling with minimal setup.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <CodeBlock
              title="JavaScript fetch"
              code={`const registryId = "${EXAMPLE_ID}";

const response = await fetch(
  "${BASE_URL}/api/verify/" + encodeURIComponent(registryId)
);

const data = await response.json();

if (data.ok && data.verified) {
  console.log("Certified:", data.record);
  console.log("Proof:", data.proof);
}`}
            />

            <CodeBlock title="cURL" code={`curl "${verifyUrl}"`} />

            <CodeBlock
              title="Badge"
              code={`<img
  src="${badgeUrl}"
  alt="GAFAIG certification badge"
/>`}
            />

            <CodeBlock
              title="Widget"
              code={`<script src="${BASE_URL}/widget/gafaig-widget.js"></script>
<div data-gafaig-id="${EXAMPLE_ID}"></div>`}
            />
          </div>
        </section>

        <section className="rounded-[32px] border border-black/10 bg-white p-10">
          <SectionEyebrow>Operational boundaries</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
            What the public layer does and does not do
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <BoundaryCard
              title="Public layer"
              points={[
                "Exposes registry records",
                "Returns signed verification payloads",
                "Provides badge and widget trust surfaces",
                "Supports independent proof validation",
              ]}
            />
            <BoundaryCard
              title="Private verification engine"
              points={[
                "Handles structured intake and review",
                "Stores findings and evidence",
                "Runs deterministic scoring",
                "Creates certification decisions before publication",
              ]}
            />
          </div>
        </section>

        <section className="rounded-[32px] bg-black p-10 text-white">
          <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/50">
            Start integrating
          </div>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Start integrating GAFAIG
          </h2>

          <p className="mt-4 max-w-[720px] text-[16px] leading-[1.8] text-white/80">
            Use a live trust record to validate your integration end-to-end
            before deploying across production systems.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink
              href={verifyUrl}
              variant="secondary"
              className="border-white text-white hover:bg-white/10"
            >
              Test verify API
            </PublicButtonLink>

            <PublicButtonLink
              href={registryUrl}
              variant="secondary"
              className="border-white text-white hover:bg-white/10"
            >
              Open trust record
            </PublicButtonLink>

            <PublicButtonLink
              href={widgetPreviewUrl}
              variant="secondary"
              className="border-white text-white hover:bg-white/10"
            >
              Preview widget
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-[32px] border border-black/10 bg-white p-10">
          <SectionEyebrow>Certification</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
            Ready to certify your AI systems?
          </h2>

          <p className="mt-4 max-w-[760px] text-[16px] leading-[1.9] text-black/70">
            GAFAIG is not only a public verification API. It is a full
            certification system for proving meaningful human oversight in AI
            systems. Apply to enter the verification workflow and publish a
            publicly verifiable trust record.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/apply" variant="primary">
              Apply for Certification
            </PublicButtonLink>
            <PublicButtonLink href={verifyUrl} variant="secondary">
              Test verify API
            </PublicButtonLink>
            <PublicButtonLink href={registryUrl} variant="secondary">
              View trust record
            </PublicButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
      {children}
    </div>
  );
}

function MetricCard({
  label,
  value,
  body,
}: {
  label: string;
  value: string;
  body: string;
}) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-white p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
        {label}
      </div>
      <div className="mt-3 break-words text-[20px] font-semibold tracking-tight text-black">
        {value}
      </div>
      <p className="mt-3 text-sm leading-7 text-black/68">{body}</p>
    </div>
  );
}

function PathCard({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-black/[0.02] p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
        Step {step}
      </div>
      <div className="mt-3 text-[20px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-sm leading-7 text-black/68">{body}</p>
    </div>
  );
}

function Card({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
      <h3 className="text-[28px] font-semibold tracking-tight text-black">
        {title}
      </h3>
      <p className="mt-4 text-[16px] leading-[1.9] text-black/72">{body}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  body,
}: {
  label: string;
  value: string;
  body: string;
}) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
        {label}
      </div>
      <div className="mt-3 break-words text-base font-semibold text-black">
        {value}
      </div>
      <p className="mt-2 text-sm leading-7 text-black/68">{body}</p>
    </div>
  );
}

function BoundaryCard({
  title,
  points,
}: {
  title: string;
  points: string[];
}) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-black/[0.02] p-6">
      <div className="text-[20px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-black/70">
        {points.map((point) => (
          <li key={point} className="flex gap-3">
            <span className="mt-[8px] h-2 w-2 rounded-full bg-black/60" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CodeBlock({
  title,
  code,
}: {
  title?: string;
  code: string;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-black/10 bg-black shadow-sm">
      {title ? (
        <div className="border-b border-white/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
          {title}
        </div>
      ) : null}
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-white/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}