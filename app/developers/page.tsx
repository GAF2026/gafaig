import Script from "next/script";
import PublicButtonLink from "../_components/PublicButtonLink";
import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div>
      <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
        {eyebrow}
      </div>
      <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
        {title}
      </h2>
      {body ? (
        <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
          {body}
        </p>
      ) : null}
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
    <article className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        Step {number}
      </div>
      <div className="mt-3 text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/72">{body}</p>
    </article>
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

function BulletCard({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-black/10 bg-white p-4">
      <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
      <span className="text-[15px] leading-7 text-black/75">{text}</span>
    </div>
  );
}

function CodeCard({
  title,
  language,
  code,
}: {
  title: string;
  language: string;
  code: string;
}) {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[16px] font-semibold tracking-tight text-black">
            {title}
          </div>
          <div className="mt-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-black/45">
            {language}
          </div>
        </div>
      </div>

      <pre className="mt-5 overflow-x-auto rounded-2xl border border-black/10 bg-black/[0.03] p-5 text-[13px] leading-[1.8] text-black/85">
        <code>{code}</code>
      </pre>
    </section>
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
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 text-[22px] font-semibold tracking-tight text-black">
        {value}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/72">{body}</p>
    </div>
  );
}

const sdkInstallExample = `<script src="https://www.gafaig.com/sdk/gafaig.js"></script>`;

const sdkVerifyExample = `<script src="https://www.gafaig.com/sdk/gafaig.js"></script>
<script>
  gafaig.verify("GAFAIG-00363095").then((data) => {
    console.log(data.record);
    console.log(data.proof.messageString);
    console.log(data.proof.signature);
  });
</script>`;

const sdkRenderExample = `<script src="https://www.gafaig.com/sdk/gafaig.js"></script>
<div id="gafaig-widget-target"></div>

<script>
  gafaig.render("#gafaig-widget-target", {
    registryId: "GAFAIG-00363095"
  });
</script>`;

const sdkBadgeExample = `<script src="https://www.gafaig.com/sdk/gafaig.js"></script>
<div id="gafaig-badge-target"></div>

<script>
  gafaig.badge("#gafaig-badge-target", {
    registryId: "GAFAIG-00363095"
  });
</script>`;

const sdkModalExample = `<script src="https://www.gafaig.com/sdk/gafaig.js"></script>
<button id="open-gafaig-verify">Verify this GAFAIG record</button>

<script>
  document
    .getElementById("open-gafaig-verify")
    .addEventListener("click", function () {
      gafaig.openVerify("GAFAIG-00363095");
    });
</script>`;

const sdkUrlExample = `const verifyUrl = gafaig.getVerifyUrl("GAFAIG-00363095");
const badgeUrl = gafaig.getBadgeUrl("GAFAIG-00363095");
const registryUrl = gafaig.getRegistryUrl("GAFAIG-00363095");
const verifyPageUrl = gafaig.getVerifyPageUrl("GAFAIG-00363095");
const widgetPreviewUrl = gafaig.getWidgetPreviewUrl("GAFAIG-00363095");

console.log({
  verifyUrl,
  badgeUrl,
  registryUrl,
  verifyPageUrl,
  widgetPreviewUrl
});`;

const dataWidgetExample = `<script src="https://www.gafaig.com/sdk/gafaig.js"></script>

<div data-gafaig-widget="GAFAIG-00363095"></div>`;

const dataWidgetModeExample = `<script src="https://www.gafaig.com/sdk/gafaig.js"></script>

<div
  data-gafaig-widget="GAFAIG-00363095"
  data-mode="minimal"
></div>`;

const dataBadgeExample = `<script src="https://www.gafaig.com/sdk/gafaig.js"></script>

<div data-gafaig-badge="GAFAIG-00363095"></div>`;

const dataModalExample = `<script src="https://www.gafaig.com/sdk/gafaig.js"></script>

<button data-gafaig-open-verify="GAFAIG-00363095">
  Verify this GAFAIG record
</button>`;

const curlExample = `curl https://www.gafaig.com/api/verify/GAFAIG-00363095`;

const jsExample = `const response = await fetch(
  "https://www.gafaig.com/api/verify/GAFAIG-00363095",
  { cache: "no-store" }
);

const data = await response.json();

console.log(data.record);
console.log(data.proof.messageString);
console.log(data.proof.signature);`;

const proofShapeExample = `{
  "ok": true,
  "verified": true,
  "registryId": "GAFAIG-00363095",
  "record": {
    "registryId": "GAFAIG-00363095",
    "applicationId": "APP-DEMO-0001",
    "caseId": "CASE-0001",
    "entityName": "OpenAI Enterprise Demo Org",
    "entityType": "company",
    "country": "United States",
    "certificationStatus": "CERTIFIED",
    "certifiedAt": "2026-04-21T12:37:57.000Z",
    "validFrom": "2026-04-15T00:00:00.000Z",
    "validTo": "2027-04-15T10:20:24.000Z"
  },
  "proof": {
    "alg": "Ed25519",
    "kid": "gafaig-ed25519-2026-01",
    "signature": "<base64-signature>",
    "signedAt": "<iso-timestamp>",
    "verificationKeyUrl": "https://www.gafaig.com/api/.well-known/gafaig-public-key",
    "message": {
      "registryId": "GAFAIG-00363095",
      "entityName": "OpenAI Enterprise Demo Org",
      "certificationStatus": "CERTIFIED",
      "certifiedAt": "2026-04-21T12:37:57.000Z"
    },
    "messageString": "{\\"registryId\\":\\"GAFAIG-00363095\\",...}"
  }
}`;

export default function DevelopersPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <Script src="/sdk/gafaig.js" strategy="afterInteractive" />

      <div className="space-y-8">
        <PublicPageHero
          eyebrow="DEVELOPERS"
          title="Verify a GAFAIG record in minutes."
          description="GAFAIG provides a verification-first trust surface for AI governance. Fetch a certified public record, inspect its signed proof, and validate it independently."
          secondaryDescription="The public layer exposes certification outcomes only. Internal governance records remain private. Trust is derived from the verification endpoint, signed payload, public key, and SDK."
          actions={
            <>
              <PublicButtonLink href="/verify" variant="primary">
                Open Verify
              </PublicButtonLink>
              <PublicButtonLink href="/registry" variant="secondary">
                Browse Registry
              </PublicButtonLink>
              <PublicButtonLink
                href="/widget-preview/GAFAIG-00363095"
                variant="secondary"
              >
                View Widget Preview
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="START HERE"
            title="Use the SDK (recommended)"
            body="The GAFAIG SDK is the fastest way to fetch a certified record, render a trust widget, render a badge, or open the verification modal. It wraps the public verification layer without introducing any new trust logic."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StepCard
              number="1"
              title="Load the SDK"
              body="Include the GAFAIG SDK on your page. It gives you direct access to verify(), render(), badge(), openVerify(), and auto-init data attributes."
            />
            <StepCard
              number="2"
              title="Resolve a certified record"
              body="Call the verify() function with a REGISTRY_ID to retrieve the public record and signed proof."
            />
            <StepCard
              number="3"
              title="Render trust surfaces"
              body="Use the SDK to render widgets, badges, or open the modal, or let the SDK auto-initialize them from HTML attributes."
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="What the SDK does"
              body="Provides a thin wrapper around the GAFAIG verification and badge endpoints. It fetches certified records, renders widgets and badges, and opens verification modals."
            />
            <StatementCard
              title="What the SDK does NOT do"
              body="It does not compute trust, scoring, or certification. All trust originates from the GAFAIG verification endpoint, the badge endpoint, and signed proof."
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Trust Source"
            value="/api/verify"
            body="The verification endpoint remains the only trust authority in the public GAFAIG surface."
          />
          <MetricCard
            label="SDK File"
            value="/sdk/gafaig.js"
            body="The SDK is a thin convenience layer on top of the public trust contract."
          />
          <MetricCard
            label="Signature Algorithm"
            value="Ed25519"
            body="Every public proof is signed with Ed25519 and can be validated with standard libraries."
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="SDK"
            title="Load the GAFAIG SDK"
            body="Start by loading the SDK script from the GAFAIG public surface. After that, you can verify a record, render a widget, render a badge, or open the modal without wiring the low-level scripts yourself."
          />

          <div className="mt-6">
            <div className="text-[14px] font-semibold uppercase tracking-[0.16em] text-black/55">
              Fastest integration
            </div>
            <p className="mt-2 text-[15px] text-black/75">
              Paste this and you have a live GAFAIG trust surface on your site.
            </p>
          </div>

          <div className="mt-8 grid gap-6">
            <CodeCard
              title="Install the SDK"
              language="HTML"
              code={sdkInstallExample}
            />
            <CodeCard
              title="Verify a record with the SDK"
              language="HTML"
              code={sdkVerifyExample}
            />
            <CodeCard
              title="Render a widget with the SDK"
              language="HTML"
              code={sdkRenderExample}
            />
            <CodeCard
              title="Render a badge with the SDK"
              language="HTML"
              code={sdkBadgeExample}
            />
            <CodeCard
              title="Open the verification modal with the SDK"
              language="HTML"
              code={sdkModalExample}
            />
            <CodeCard
              title="Build GAFAIG URLs programmatically"
              language="JavaScript"
              code={sdkUrlExample}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="AUTO-INIT"
            title="Let the SDK initialize trust surfaces from HTML"
            body="The SDK can auto-initialize widgets, badges, and verification buttons directly from data attributes. This is the fastest zero-JavaScript path for embedding GAFAIG trust surfaces."
          />

          <div className="mt-8 grid gap-6">
            <CodeCard
              title="Auto-render a widget"
              language="HTML"
              code={dataWidgetExample}
            />
            <CodeCard
              title="Auto-render a widget with a display mode"
              language="HTML"
              code={dataWidgetModeExample}
            />
            <CodeCard
              title="Auto-render a badge"
              language="HTML"
              code={dataBadgeExample}
            />
            <CodeCard
              title="Auto-bind a verification modal button"
              language="HTML"
              code={dataModalExample}
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard text="data-gafaig-widget renders a GAFAIG trust widget for the supplied REGISTRY_ID." />
            <BulletCard text="data-mode can be used with data-gafaig-widget to change widget presentation." />
            <BulletCard text="data-gafaig-badge renders a GAFAIG badge linked to the record’s verify surface." />
            <BulletCard text="data-gafaig-open-verify binds a click target that opens the GAFAIG verification modal." />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="PUBLIC CONTRACT"
            title="What the public layer exposes"
            body="GAFAIG exposes only the certification outcome and verification proof. Internal scoring, workflow, decision, and reviewer materials are not part of the public contract."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Public fields"
              body="registryId, entityName, entityType, country, certificationStatus, certifiedAt, validFrom, validTo, and the signed proof payload."
            />
            <StatementCard
              title="Private fields"
              body="decision status, score, tier, band, scoring breakdowns, reviewer materials, and internal workflow state never belong in the public trust layer."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="RAW API"
            title="Use the verify endpoint directly (advanced)"
            body="If you want a lower-level integration, you can call the verify endpoint without the SDK. This is the canonical public trust endpoint behind all GAFAIG trust surfaces."
          />

          <div className="mt-8 grid gap-6">
            <CodeCard
              title="Fetch a verification record"
              language="cURL"
              code={curlExample}
            />
            <CodeCard
              title="Read the public proof in JavaScript"
              language="JavaScript"
              code={jsExample}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="PROOF OBJECT"
            title="The signed payload you verify"
            body="The record object is for display. The proof object is the trust layer. Signature validation depends on messageString, signature, key ID, and the public key endpoint."
          />

          <div className="mt-8">
            <CodeCard
              title="Example verify response shape"
              language="JSON"
              code={proofShapeExample}
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard text="Trust depends on the proof object, not on UI rendering." />
            <BulletCard text="The signed message is intentionally minimal to reduce drift and attack surface." />
            <BulletCard text="External systems should treat messageString as the canonical input to signature verification." />
            <BulletCard text="The SDK, widgets, badges, and modal bindings are thin consumers of the verify and badge endpoints and never compute trust independently." />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="INTEGRATION PATHS"
            title="Choose the trust surface you need"
            body="GAFAIG supports multiple ways to distribute trust depending on your product, audience, and verification needs."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatementCard
              title="SDK"
              body="Use the GAFAIG SDK for the fastest path to verification, widget rendering, badge rendering, and modal verification."
            />
            <StatementCard
              title="Verify API"
              body="Fetch raw record and proof data for custom integrations, audit pipelines, and third-party validation."
            />
            <StatementCard
              title="Registry"
              body="Link users to the public certification record for a durable, human-readable trust reference."
            />
            <StatementCard
              title="Widget + Badge + Modal"
              body="Render verified trust surfaces directly inside external sites or product experiences."
            />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/verify" variant="primary">
              Test Verify
            </PublicButtonLink>
            <PublicButtonLink href="/registry" variant="secondary">
              Open Registry
            </PublicButtonLink>
            <PublicButtonLink
              href="/widget-preview/GAFAIG-00363095"
              variant="secondary"
            >
              Preview Widget
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="WHY THIS MATTERS"
            title="Verification without private disclosure"
            body="GAFAIG is designed so organizations can prove certified governance outcomes without exposing internal evidence, workflows, or reviewer materials. This makes trust portable while preserving confidentiality."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard text="Internal governance review stays in the private verification engine." />
            <BulletCard text="The public layer exposes only the certified outcome and proof needed to verify it." />
            <BulletCard text="Trust can be validated outside GAFAIG using the published verification key." />
            <BulletCard text="The same public trust signal can appear on registry pages, APIs, badges, widgets, SDK integrations, and external websites." />
          </div>
        </section>
      </div>
    </main>
  );
}