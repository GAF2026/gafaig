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
          description="GAFAIG provides a public verification layer for AI governance. Use the verification API, signed proof, badge, and widget to display independently verifiable certification across the web."
          secondaryDescription="GAFAIG is not a data API — it is a trust infrastructure. Every certification can be verified independently using signed proof and a public key."
          actions={
            <>
              <PublicButtonLink href={verifyUrl} variant="primary">
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

        {/* TRUST PRIMITIVES */}

        <section className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
          <SectionEyebrow>Trust primitives</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
            Core building blocks
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <MetricCard label="Verification API" value="/api/verify" body="Fetch certification + proof" />
            <MetricCard label="Signed proof" value="Ed25519" body="Cryptographic verification" />
            <MetricCard label="Public key" value="/.well-known" body="Independent validation" />
            <MetricCard label="Trust surfaces" value="Badge · Widget" body="Display certification externally" />
          </div>
        </section>

        {/* INTEGRATION PATHS */}

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
            <SectionEyebrow>Integration paths</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
              Three ways to integrate
            </h2>

            <div className="mt-8 grid gap-4">
              <PathCard step="01" title="Display certification" body="Use badge or widget to surface trust signals." />
              <PathCard step="02" title="Verify programmatically" body="Call the API to validate certification." />
              <PathCard step="03" title="Build on GAFAIG" body="Use SDK to integrate verification into workflows." />
            </div>
          </div>

          <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
            <SectionEyebrow>SDK</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
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
              title="Verify programmatically"
              code={`const result = await GAFAIG.verify("${EXAMPLE_ID}");
console.log(result);`}
            />

            <CodeBlock
              title="Render widget manually"
              code={`GAFAIG.render("#target", "${EXAMPLE_ID}");`}
            />
          </div>
        </section>

        {/* VERIFY API */}

        <section className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
          <SectionEyebrow>Verification API</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
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
            <CodeBlock
              title="HTML"
              code={`<img src="${badgeUrl}" />`}
            />
          </Card>

          <Card title="Widget embed">
            <CodeBlock
              title="HTML"
              code={`<script src="${BASE_URL}/widget/gafaig-widget.js"></script>
<div data-gafaig-id="${EXAMPLE_ID}"></div>`}
            />
          </Card>

        </section>

        {/* PROOF */}

        <section className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
          <SectionEyebrow>Proof verification</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
            Validate independently
          </h2>

          <CodeBlock
            title="Steps"
            code={`1. Call ${verifyUrl}
2. Read proof.messageString + signature
3. Fetch ${publicKeyUrl}
4. Verify signature (Ed25519)`}
          />
        </section>

        {/* CTA */}

        <section className="rounded-[32px] border border-black/10 bg-black p-8 text-white shadow-sm">
          <h2 className="text-3xl font-semibold">
            Start with a live trust record
          </h2>

          <div className="mt-6 flex gap-3 flex-wrap">
            <PublicButtonLink href={verifyUrl} variant="secondary" className="border-white text-white">
              Test verify
            </PublicButtonLink>

            <PublicButtonLink href={registryUrl} variant="secondary" className="border-white text-white">
              Open record
            </PublicButtonLink>
          </div>
        </section>

      </div>
    </main>
  );
}

/* COMPONENTS (unchanged / reused) */

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">{children}</div>;
}

function MetricCard({ label, value, body }: any) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-white p-6">
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
    <div className="mt-6 rounded-[24px] border border-black/10 bg-black text-white">
      <div className="px-4 py-2 text-xs uppercase text-white/60">{title}</div>
      <pre className="p-4 text-sm overflow-x-auto">{code}</pre>
    </div>
  );
}