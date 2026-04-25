import LiveEmbedPreview from "./LiveEmbedPreview";
import Script from "next/script";
import PublicButtonLink from "../_components/PublicButtonLink";
import PublicPageHero from "../_components/PublicPageHero";
import CopyCodeButton from "./CopyCodeButton";

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

        <CopyCodeButton code={code} />
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

const sdkInstallExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>`;

const sdkAndModalInstallExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>
<script src="https://www.gafaig.com/widget/gafaig-verify.v1.js"></script>`;

const dataBadgeExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>

<div data-gafaig-badge="GAFAIG-00363095"></div>`;

const dataWidgetExample = `<script src="https://www.gafaig.com/widget/gafaig-widget.v1.js"></script>

<div data-gafaig-id="GAFAIG-00363095"></div>`;

const dataWidgetModeExample = `<script src="https://www.gafaig.com/widget/gafaig-widget.v1.js"></script>

<div
  data-gafaig-id="GAFAIG-00363095"
  data-mode="badge"
></div>`;

const modalExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>
<script src="https://www.gafaig.com/widget/gafaig-verify.v1.js"></script>

<button data-gafaig-open-verify="GAFAIG-00363095">
  Verify this GAFAIG record
</button>

<script>
  gafaig.init();
</script>`;

const manualModalExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>
<script src="https://www.gafaig.com/widget/gafaig-verify.v1.js"></script>

<button id="open-gafaig-verify">
  Verify this GAFAIG record
</button>

<script>
  document
    .getElementById("open-gafaig-verify")
    .addEventListener("click", function () {
      verifyGAFAIG("GAFAIG-00363095", {
        baseUrl: "https://www.gafaig.com"
      });
    });
</script>`;

const sdkBadgeExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>

<div id="gafaig-badge-target"></div>

<script>
  gafaig.badge("#gafaig-badge-target", {
    registryId: "GAFAIG-00363095",
    baseUrl: "https://www.gafaig.com"
  });
</script>`;

const sdkGetBadgeExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>

<script>
  gafaig
    .getBadge("GAFAIG-00363095", {
      baseUrl: "https://www.gafaig.com"
    })
    .then(console.log);
</script>`;

const curlVerifyExample = `curl https://www.gafaig.com/api/verify/GAFAIG-00363095`;

const curlBadgeExample = `curl https://www.gafaig.com/api/badge/GAFAIG-00363095`;

const jsVerifyExample = `const response = await fetch(
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
    "registrySnapshotId": "REG-SNAP-...",
    "applicationId": "APP-DEMO-0001",
    "caseId": "CASE-0001",
    "recordType": "ORGANIZATION",
    "recordName": "OpenAI Enterprise Demo Org",
    "entityName": "OpenAI Enterprise Demo Org",
    "entityType": "company",
    "country": "United States",
    "certificationStatus": "CERTIFIED",
    "certifiedAt": "2026-04-21T12:37:57.000Z",
    "validFrom": "2026-04-15T00:00:00.000Z",
    "validTo": "2027-04-15T10:20:24.000Z",
    "lifecycleStatus": "active",
    "visibilityStatus": "public",
    "verificationEligible": true,
    "badgeEligible": true
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
      "certifiedAt": "2026-04-21T12:37:57.000Z",
      "validFrom": "2026-04-15T00:00:00.000Z",
      "validTo": "2027-04-15T10:20:24.000Z"
    },
    "messageString": "{\\"registryId\\":\\"GAFAIG-00363095\\",...}"
  }
}`;

const externalTestExample = `<!DOCTYPE html>
<html>
  <body>
    <h1>GAFAIG External Embed Test</h1>

    <div data-gafaig-badge="GAFAIG-00363095"></div>

    <button data-gafaig-open-verify="GAFAIG-00363095">
      Open Verification Modal
    </button>

    <script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>
    <script src="https://www.gafaig.com/widget/gafaig-verify.v1.js"></script>

    <script>
      gafaig.init({
        baseUrl: "https://www.gafaig.com"
      });
    </script>
  </body>
</html>`;

export default function DevelopersPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <Script src="/sdk/gafaig.v1.js" strategy="afterInteractive" />

      <div className="space-y-8">
        <PublicPageHero
          eyebrow="DEVELOPERS"
          title="Verify a GAFAIG record in minutes."
          description="GAFAIG provides a verification-first trust surface for AI governance. Fetch a certified public record, inspect its signed proof, and validate it independently."
          secondaryDescription="The public layer exposes certification outcomes only. Internal governance records remain private. Trust is derived from the verification endpoint, signed payload, public key, SDK, widget, badge, and modal surfaces."
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
            title="Use versioned SDK and widget files"
            body="Production integrations should use versioned GAFAIG files. Versioned files are stable and intended for third-party use. Latest files may evolve, but versioned files preserve integration stability."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StepCard
              number="1"
              title="Load versioned files"
              body="Use /sdk/gafaig.v1.js and /widget/gafaig-verify.v1.js for stable production integrations."
            />
            <StepCard
              number="2"
              title="Embed a trust surface"
              body="Add a badge, widget, or verification modal using a REGISTRY_ID issued by GAFAIG."
            />
            <StepCard
              number="3"
              title="Verify independently"
              body="Use the verification endpoint, signed payload, and public key to validate the public record."
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Versioned files"
              body="Use versioned files for production embeds. These files are designed to remain stable for existing integrations."
            />
            <StatementCard
              title="Latest files"
              body="The unversioned files remain available as latest builds, but third-party integrations should pin to versioned files."
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Trust Source"
            value="/api/verify"
            body="The verification endpoint remains the canonical public trust authority."
          />
          <MetricCard
            label="Stable SDK"
            value="/sdk/gafaig.v1.js"
            body="The versioned SDK is the recommended production integration file."
          />
          <MetricCard
            label="Signature Algorithm"
            value="Ed25519"
            body="Every public proof is signed and can be validated with the public key endpoint."
          />
        </section>
<LiveEmbedPreview />
        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="INSTALL"
            title="Load the production SDK"
            body="Start with the versioned SDK. Add the verification modal runtime only if you want inline modal verification."
          />

          <div className="mt-8 grid gap-6">
            <CodeCard
              title="Install stable SDK"
              language="HTML"
              code={sdkInstallExample}
            />
            <CodeCard
              title="Install SDK + verification modal"
              language="HTML"
              code={sdkAndModalInstallExample}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="BADGE"
            title="Render a GAFAIG badge"
            body="The badge is a lightweight trust signal that links to the verification page. It respects lifecycle and badge eligibility from the public badge API."
          />

          <div className="mt-8 grid gap-6">
            <CodeCard
              title="Auto-render a badge"
              language="HTML"
              code={dataBadgeExample}
            />
            <CodeCard
              title="Render badge manually"
              language="HTML"
              code={sdkBadgeExample}
            />
            <CodeCard
              title="Read badge JSON"
              language="HTML"
              code={sdkGetBadgeExample}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="WIDGET"
            title="Render the full trust widget"
            body="The widget is a richer trust surface. It fetches the verify endpoint, renders record status, signature state, payload integrity, and links to the registry and raw verification JSON."
          />

          <div className="mt-8 grid gap-6">
            <CodeCard
              title="Auto-render full widget"
              language="HTML"
              code={dataWidgetExample}
            />
            <CodeCard
              title="Auto-render compact widget"
              language="HTML"
              code={dataWidgetModeExample}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="MODAL"
            title="Open inline verification modal"
            body="The verification modal allows third-party sites to show GAFAIG verification details without navigating away from the page."
          />

          <div className="mt-8 grid gap-6">
            <CodeCard
              title="Auto-bind modal button"
              language="HTML"
              code={modalExample}
            />
            <CodeCard
              title="Open modal manually"
              language="HTML"
              code={manualModalExample}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="EXTERNAL TEST"
            title="Test GAFAIG on a third-party page"
            body="This minimal HTML file simulates an external website using GAFAIG’s versioned SDK and modal runtime."
          />

          <div className="mt-8">
            <CodeCard
              title="Standalone external embed test"
              language="HTML"
              code={externalTestExample}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="PUBLIC CONTRACT"
            title="What the public layer exposes"
            body="GAFAIG exposes only the certification outcome, public record fields, lifecycle and eligibility flags, and verification proof. Internal scoring, workflow, decision, and reviewer materials are not part of the public contract."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Public fields"
              body="registryId, registrySnapshotId, applicationId, caseId, recordType, recordName, entityName, entityType, country, certificationStatus, lifecycleStatus, visibilityStatus, verificationEligible, badgeEligible, validFrom, validTo, certifiedAt, publishedAt, and proof."
            />
            <StatementCard
              title="Private fields"
              body="Score, tier, band, scoring breakdowns, reviewer materials, internal workflow state, raw findings, and evidence do not belong in the public trust layer."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="RAW API"
            title="Use the verify and badge endpoints directly"
            body="For advanced integrations, call the public API endpoints directly. The SDK and widget are convenience layers on top of the same public contracts."
          />

          <div className="mt-8 grid gap-6">
            <CodeCard
              title="Fetch a verification record"
              language="cURL"
              code={curlVerifyExample}
            />
            <CodeCard
              title="Fetch badge data"
              language="cURL"
              code={curlBadgeExample}
            />
            <CodeCard
              title="Read public proof in JavaScript"
              language="JavaScript"
              code={jsVerifyExample}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="PROOF OBJECT"
            title="The signed payload you verify"
            body="The record object is for display. The proof object is the trust layer. Signature validation depends on messageString, signature, key ID, algorithm, and the public key endpoint."
          />

          <div className="mt-8">
            <CodeCard
              title="Example verify response shape"
              language="JSON"
              code={proofShapeExample}
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard text="Trust depends on the proof object, not UI rendering." />
            <BulletCard text="The signed message is intentionally minimal to reduce drift and attack surface." />
            <BulletCard text="External systems should treat messageString as the canonical input to signature verification." />
            <BulletCard text="SDK, widget, badge, and modal bindings are thin consumers of verify and badge endpoints and never compute trust." />
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
              title="Badge"
              body="A lightweight trust signal for external pages, partner sites, and product footers."
            />
            <StatementCard
              title="Widget"
              body="A richer public trust panel with record status, signature state, and verification links."
            />
            <StatementCard
              title="Modal"
              body="Inline verification without sending users away from a third-party page."
            />
            <StatementCard
              title="Verify API"
              body="Raw machine-readable record and proof data for custom integrations."
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
            <BulletCard text="The public layer exposes only certified outcomes and proof needed to verify them." />
            <BulletCard text="Trust can be validated outside GAFAIG using the signed payload and public key." />
            <BulletCard text="The same public trust signal can appear on registry pages, APIs, badges, widgets, SDK integrations, and external websites." />
          </div>
        </section>
      </div>
    </main>
  );
}