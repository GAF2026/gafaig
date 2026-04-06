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
      <div className="space-y-16">

        <PublicPageHero
          eyebrow="Developers"
          title="Integrate verifiable proof of human oversight"
          description="GAFAIG provides a public verification layer for AI governance. Use the verification API, signed proof, badge, and widget to display independently verifiable certification across products, websites, and compliance workflows."
          secondaryDescription="Every GAFAIG certification is backed by deterministic evaluation and cryptographic proof. External systems can verify certification independently without trusting GAFAIG as an intermediary."
          actions={
            <>
              <PublicButtonLink href={verifyUrl} variant="primary">
                Test verify API
              </PublicButtonLink>
              <PublicButtonLink href={registryUrl}>
                View trust record
              </PublicButtonLink>
              <PublicButtonLink href={widgetPreviewUrl}>
                Preview widget
              </PublicButtonLink>
            </>
          }
        />

        {/* TRUST PRIMITIVES */}

        <section className="rounded-[32px] border border-black/10 bg-white p-10">
          <SectionEyebrow>Trust primitives</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight">
            The core verification layer
          </h2>

          <p className="mt-4 max-w-[900px] text-[16px] text-black/70">
            GAFAIG exposes a small set of stable primitives that together form a complete verification system. These primitives can be used independently or combined to build trust into any interface.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <MetricCard label="Verification API" value="/api/verify" body="Returns certification record and signed proof" />
            <MetricCard label="Signed proof" value="Ed25519" body="Cryptographic verification of certification state" />
            <MetricCard label="Public key" value="/.well-known" body="Used for independent validation" />
            <MetricCard label="Trust surfaces" value="Badge · Widget" body="Display certification externally" />
          </div>
        </section>

        {/* INTEGRATION PATHS */}

        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[32px] border border-black/10 bg-white p-10">
            <SectionEyebrow>Integration paths</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold">
              Three ways to integrate GAFAIG
            </h2>

            <div className="mt-8 space-y-4">
              <PathCard step="01" title="Display certification" body="Embed the badge or widget to surface certification status directly in your product or website." />
              <PathCard step="02" title="Verify programmatically" body="Use the verification API to validate certification status in real time." />
              <PathCard step="03" title="Build on GAFAIG" body="Use the SDK and verification primitives to integrate governance checks into workflows." />
            </div>
          </div>

          <div className="rounded-[32px] border border-black/10 bg-white p-10">
            <SectionEyebrow>SDK</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold">
              JavaScript SDK
            </h2>

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
        </section>

        {/* VERIFY */}

        <section className="rounded-[32px] border border-black/10 bg-white p-10">
          <SectionEyebrow>Verification API</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold">
            Canonical trust endpoint
          </h2>

          <CodeBlock title="Request" code={`GET ${verifyUrl}`} />

          <CodeBlock
            title="Minimal usage"
            code={`const res = await fetch("${verifyUrl}");
const data = await res.json();

if (data.verified) {
  console.log("Certified");
}`}
          />
        </section>

        {/* DISPLAY */}

        <section className="grid gap-8 lg:grid-cols-2">
          <Card title="Badge embed">
            <CodeBlock code={`<img src="${badgeUrl}" />`} />
          </Card>

          <Card title="Widget embed">
            <CodeBlock
              code={`<script src="${BASE_URL}/widget/gafaig-widget.js"></script>
<div data-gafaig-id="${EXAMPLE_ID}"></div>`}
            />
          </Card>
        </section>

        {/* PROOF */}

        <section className="rounded-[32px] border border-black/10 bg-white p-10">
          <SectionEyebrow>Proof verification</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold">
            Validate certification independently
          </h2>

          <CodeBlock
            code={`1. Call ${verifyUrl}
2. Read proof.messageString + signature
3. Fetch ${publicKeyUrl}
4. Verify signature (Ed25519)`}
          />
        </section>

        {/* FINAL CTA */}

        <section className="rounded-[32px] bg-black p-10 text-white">
          <h2 className="text-3xl font-semibold">
            Start integrating GAFAIG
          </h2>

          <p className="mt-4 max-w-[700px] text-white/80">
            Use a live trust record to validate your integration end-to-end before deploying across production systems.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href={verifyUrl} variant="secondary" className="border-white text-white">
              Test verify API
            </PublicButtonLink>

            <PublicButtonLink href={registryUrl} variant="secondary" className="border-white text-white">
              Open trust record
            </PublicButtonLink>

            <PublicButtonLink href={widgetPreviewUrl} variant="secondary" className="border-white text-white">
              Preview widget
            </PublicButtonLink>
          </div>
        </section>

      </div>
    </main>
  );
}

/* COMPONENTS */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">{children}</div>;
}

function MetricCard({ label, value, body }: any) {
  return (
    <div className="rounded-[24px] border border-black/10 p-6">
      <div className="text-[11px] uppercase text-black/45">{label}</div>
      <div className="mt-2 text-lg font-semibold">{value}</div>
      <p className="mt-2 text-sm text-black/70">{body}</p>
    </div>
  );
}

function PathCard({ step, title, body }: any) {
  return (
    <div className="rounded-[24px] border border-black/10 p-6">
      <div className="text-xs uppercase text-black/50">Step {step}</div>
      <div className="mt-2 font-semibold">{title}</div>
      <p className="mt-2 text-sm text-black/70">{body}</p>
    </div>
  );
}

function Card({ title, children }: any) {
  return (
    <div className="rounded-[32px] border border-black/10 bg-white p-8">
      <h3 className="text-xl font-semibold">{title}</h3>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function CodeBlock({ title, code }: any) {
  return (
    <div className="mt-6 rounded-[20px] border border-black/10 bg-black text-white">
      {title && <div className="px-4 py-2 text-xs uppercase text-white/60">{title}</div>}
      <pre className="p-4 text-sm overflow-x-auto">{code}</pre>
    </div>
  );
}