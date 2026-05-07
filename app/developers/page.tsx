import RegistryIdTester from "./RegistryIdTester";
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

function JumpNav() {
  const links = [
    ["#api-console", "API Console"],
    ["#live-preview", "Live Preview"],
    ["#canonical-rule", "messageString Rule"],
    ["#install", "Install"],
    ["#badge", "Badge"],
    ["#widget", "Widget"],
    ["#modal", "Modal"],
    ["#external-test", "External Test"],
    ["#public-contract", "Public Contract"],
    ["#raw-api", "Raw API"],
    ["#proof-object", "Proof Object"],
    ["#failure-modes", "Failure Modes"],
    ["#integration-paths", "Integration Paths"],
  ];

  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
        Page Navigation
      </div>
      <h2 className="mt-3 text-[22px] font-semibold tracking-tight text-black">
        Jump to a developer surface
      </h2>
      <p className="mt-3 max-w-[880px] text-[15px] leading-7 text-black/70">
        This page is intentionally comprehensive. Use these shortcuts to move
        directly to the live console, install snippets, proof rules, widgets,
        API contracts, and failure-state guidance.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {links.map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="inline-flex min-h-[36px] items-center justify-center rounded-full border border-black/15 bg-white px-4 text-[13px] font-semibold text-black transition hover:bg-black hover:text-white"
          >
            {label}
          </a>
        ))}
      </div>
    </section>
  );
}

const DEMO_REGISTRY_ID = "GAFAIG-00000001";

const sdkInstallExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>`;

const sdkAndModalInstallExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>
<script src="https://www.gafaig.com/widget/gafaig-verify.v1.js"></script>`;

const dataBadgeExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>

<div data-gafaig-badge="GAFAIG-00000001"></div>`;

const dataWidgetExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>

<div data-gafaig-id="GAFAIG-00000001"></div>`;

const dataWidgetModeExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>

<div
  data-gafaig-id="GAFAIG-00000001"
  data-mode="badge"
></div>`;

const modalExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>
<script src="https://www.gafaig.com/widget/gafaig-verify.v1.js"></script>

<button data-gafaig-open-verify="GAFAIG-00000001">
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
      gafaig.openVerify("GAFAIG-00000001", {
        baseUrl: "https://www.gafaig.com"
      });
    });
</script>`;

const sdkBadgeExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>

<div id="gafaig-badge-target"></div>

<script>
  gafaig.badge("#gafaig-badge-target", {
    registryId: "GAFAIG-00000001",
    baseUrl: "https://www.gafaig.com"
  });
</script>`;

const sdkGetBadgeExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>

<script>
  gafaig
    .getBadge("GAFAIG-00000001", {
      baseUrl: "https://www.gafaig.com"
    })
    .then(console.log);
</script>`;

const versionedFilesExample = `Production-stable versioned files:

Primary SDK:
https://www.gafaig.com/sdk/gafaig.v1.js

Optional advanced UI runtimes:
https://www.gafaig.com/widget/gafaig-widget.v1.js
https://www.gafaig.com/widget/gafaig-verify.v1.js

Use the SDK as the recommended production entry point. Use the widget and modal runtime files only for direct or advanced embeds.`;

const latestAliasExample = `Latest aliases:

https://www.gafaig.com/sdk/gafaig.js
https://www.gafaig.com/widget/gafaig-widget.js
https://www.gafaig.com/widget/gafaig-verify.js

These aliases point to the latest build and may change behavior. Use for testing, internal previews, or controlled rollouts only.`;

const curlVerifyExample = `curl https://www.gafaig.com/api/verify/GAFAIG-00000001`;

const curlBadgeExample = `curl https://www.gafaig.com/api/badge/GAFAIG-00000001`;

const publicKeyExample = `curl https://www.gafaig.com/api/.well-known/gafaig-public-key`;

const jsVerifyExample = `<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>

<script>
  async function verifyGAFAIGRecord() {
    const result = await gafaig.verify("GAFAIG-00000001", {
      baseUrl: "https://www.gafaig.com"
    });

    const publicKey = await gafaig.getPublicKey({
      baseUrl: "https://www.gafaig.com"
    });

    const messageString = result.proof.messageString;
    const signature = result.proof.signature;

    console.log(result);
    console.log(publicKey);
    console.log(messageString);
    console.log(signature);
  }

  verifyGAFAIGRecord();
</script>`;

const independentVerificationRuleExample = `Verification MUST use proof.messageString exactly as returned.

Do not:
- rebuild messageString from record fields
- stringify proof.message yourself
- reorder JSON keys
- change timestamp formats
- trim or normalize the payload before verification

Use:
- proof.messageString
- proof.signature
- public key from proof.verificationKeyUrl`;

const proofShapeExample = `{
  "ok": true,
  "verified": true,
  "registryId": "GAFAIG-00000001",
  "record": {
    "registryId": "GAFAIG-00000001",
    "registrySnapshotId": "REG-SNAP-...",
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
      "registryId": "GAFAIG-00000001",
      "entityName": "OpenAI Enterprise Demo Org",
      "certificationStatus": "CERTIFIED",
      "certifiedAt": "2026-04-21T12:37:57.000Z",
      "validFrom": "2026-04-15T00:00:00.000Z",
      "validTo": "2027-04-15T10:20:24.000Z"
    },
    "messageString": "{\\"registryId\\":\\"GAFAIG-00000001\\",...}"
  }
}`;

const failureModesExample = `Failure modes external systems must handle:

1. Missing messageString
   Treat as invalid. Do not reconstruct the payload.

2. Missing signature
   Treat as invalid. No cryptographic proof is available.

3. Public key unavailable
   Treat as verification unavailable.

4. Signature mismatch
   Treat as invalid. Payload integrity failed.

5. Expired certification
   Verification may still prove authenticity, but the lifecycle state must be displayed as expired.

6. Revoked certification
   Verification may still prove authenticity, but the lifecycle state must be displayed as revoked.`;

const externalTestExample = `<!DOCTYPE html>
<html>
  <body>
    <h1>GAFAIG External Embed Test</h1>

    <div data-gafaig-badge="GAFAIG-00000001"></div>

    <button data-gafaig-open-verify="GAFAIG-00000001">
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
          title="Integrate deterministic AI governance proof"
          description="GAFAIG provides a verification-first trust surface for deterministic global AI governance infrastructure. Developers can fetch published certification records, inspect signed proof, and independently validate payload integrity using GAFAIG’s verification endpoint and public key."
          secondaryDescription="The SDK is the canonical integration surface for GAFAIG public trust signals. Badges, widgets, and verification modals are render layers over the public verification endpoint. Internal governance records remain private; external systems validate only published certification outcomes, canonical messageString, signature, and public key."
          actions={
            <>
              <PublicButtonLink href="/verify" variant="primary">
                Open Verify
              </PublicButtonLink>
              <PublicButtonLink href="/registry" variant="secondary">
                Browse Registry
              </PublicButtonLink>
              <PublicButtonLink
                href="/widget-preview/GAFAIG-00000001"
                variant="secondary"
              >
                View Widget Preview
              </PublicButtonLink>
              <PublicButtonLink href="/public-key" variant="secondary">
                Public Key
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-black/[0.02] p-8">
          <SectionHeading
            eyebrow="FAST INSTALL"
            title="Add GAFAIG to your site in under 30 seconds"
            body="Copy and paste this snippet to display a GAFAIG trust signal for a published certification record on your site."
          />

          <div className="mt-6">
            <CodeCard
              title="Paste into your HTML"
              language="HTML"
              code={`<script src="https://www.gafaig.com/sdk/gafaig.v1.js"></script>

<div data-gafaig-id="GAFAIG-00000001"></div>`}
            />
          </div>

          <div className="mt-6 flex gap-3">
            <PublicButtonLink href="/widget-preview/GAFAIG-00000001" variant="primary">
              See it live
            </PublicButtonLink>

            <PublicButtonLink href="#install" variant="secondary">
              Full integration guide
            </PublicButtonLink>
          </div>
        </section>

        <JumpNav />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="START HERE"
            title="Use versioned SDK and widget files"
            body="Production integrations should use versioned GAFAIG files. Versioned files are pinned production contracts. Latest aliases are convenience entry points that may evolve. Use v1 files for any external customer, partner, or production website."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StepCard
              number="1"
              title="Load versioned files"
              body="Use /sdk/gafaig.v1.js as the primary production integration. Use /widget/gafaig-widget.v1.js and /widget/gafaig-verify.v1.js only for direct or advanced embeds."
            />
            <StepCard
              number="2"
              title="Embed a trust surface"
              body="Add a badge, widget, or verification modal using a REGISTRY_ID issued by GAFAIG."
            />
            <StepCard
              number="3"
              title="Verify independently"
              body="Use the verification endpoint, exact messageString, signature, and public key to validate the public certification record."
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Versioned files are stable production contracts"
              body="Use versioned files for production embeds. v1 files are behavior-stable for existing integrations. Bug fixes may be applied, but external production integrations should pin to v1 until a future version is explicitly released."
            />
            <StatementCard
              title="Latest aliases can evolve"
              body="The unversioned files remain available as latest builds. They may receive newer behavior before a future pinned version is introduced. Do not rely on latest aliases for third-party production stability."
            />
          </div>

          <div className="mt-6 grid gap-6">
            <CodeCard
              title="Production-stable versioned files"
              language="TEXT"
              code={versionedFilesExample}
            />
            <CodeCard
              title="Latest aliases"
              language="TEXT"
              code={latestAliasExample}
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

        <section id="api-console" className="scroll-mt-8">
          <RegistryIdTester />
        </section>

        <section
          id="live-preview"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-black/[0.02] p-8"
        >
          <Script src="/widget/gafaig-widget.v1.js" strategy="afterInteractive" />

          <SectionHeading
            eyebrow="LIVE PREVIEW"
            title="See the versioned embed working live"
            body="This preview uses the production-stable versioned widget file. The widget renders the public verification response for the demo GAFAIG registry record and does not compute trust in the browser."
          />

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="mb-4 text-sm font-semibold text-black">
                Live widget
              </div>
              <div data-gafaig-id={DEMO_REGISTRY_ID}></div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-black/40">
                Trust interpretation
              </div>

              <h3 className="text-xl font-semibold tracking-[-0.02em] text-black">
                What this live widget proves
              </h3>

              <p className="mt-3 text-sm leading-6 text-black/65">
                The widget is a display layer only. It does not compute trust. It
                renders the public verification response returned by GAFAIG.
              </p>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                  <div className="text-sm font-semibold text-black">
                    Certified (Published)
                  </div>
                  <p className="mt-1 text-sm leading-5 text-black/60">
                    This record is published and valid in the GAFAIG registry.
                  </p>
                </div>

                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                  <div className="text-sm font-semibold text-black">
                    Signature Valid
                  </div>
                  <p className="mt-1 text-sm leading-5 text-black/60">
                    The cryptographic signature matches the published public key.
                  </p>
                </div>

                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                  <div className="text-sm font-semibold text-black">
                    Payload Verified
                  </div>
                  <p className="mt-1 text-sm leading-5 text-black/60">
                    The signed payload has not been altered before display.
                  </p>
                </div>

                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
                  <div className="text-sm font-semibold text-black">
                    messageString available
                  </div>
                  <p className="mt-1 text-sm leading-5 text-black/60">
                    External systems can independently verify the record using the
                    exact messageString returned by /api/verify.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-black/10 p-4">
                <div className="text-sm font-semibold text-black">
                  What creates trust
                </div>

                <ul className="mt-3 space-y-2 text-sm leading-5 text-black/60">
                  <li>/api/verify returns the canonical record and proof.</li>
                  <li>proof.messageString is the exact signed payload.</li>
                  <li>proof.signature is the cryptographic signature.</li>
                  <li>
                    /api/.well-known/gafaig-public-key exposes the verification
                    key.
                  </li>
                </ul>
              </div>

              <p className="text-xs text-black/50 mt-6">
                Verification MUST use the exact messageString returned by the
                API. Never reconstruct it.
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                <a
                  href={`/verify/${DEMO_REGISTRY_ID}`}
                  className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80"
                >
                  Open verify page
                </a>

                <a
                  href={`/api/verify/${DEMO_REGISTRY_ID}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-semibold text-black transition hover:border-black"
                >
                  View Proof JSON
                </a>
              </div>
            </div>
          </div>
        </section>

        <section
          id="canonical-rule"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
          <SectionHeading
            eyebrow="CANONICAL VERIFICATION RULE"
            title="Verify the exact messageString. Never reconstruct it."
            body="The signed payload is proof.messageString. It must be copied and verified exactly as returned by /api/verify. Reconstructing payloads from record fields, proof.message, UI values, or reordered JSON will invalidate verification."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Correct"
              body="Fetch /api/verify/[registryId], read proof.messageString, read proof.signature, fetch the public key, and verify the exact messageString bytes against the signature."
            />
            <StatementCard
              title="Incorrect"
              body="Do not rebuild the payload from JSON fields, change timestamp formats, stringify proof.message yourself, reorder keys, or normalize the string before verification."
            />
          </div>

          <div className="mt-8">
            <CodeCard
              title="Canonical verification rule"
              language="TEXT"
              code={independentVerificationRuleExample}
            />
          </div>
        </section>

        <section
          id="install"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
          <SectionHeading
            eyebrow="INSTALL"
            title="Install the GAFAIG SDK (recommended)"
            body="Start with the versioned SDK. This is the ONLY recommended production integration path. All widgets, badges, and modals should be used through the SDK unless you have a specific advanced requirement."
          />

          <div className="mt-8 grid gap-6">
            <CodeCard
              title="Recommended: Install SDK"
              language="HTML"
              code={sdkInstallExample}
            />
          </div>
        </section>

        <section className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="ADVANCED"
            title="Optional runtime files (advanced use only)"
            body="These files are not required for most integrations. Only use them if you are building custom UI layers outside the SDK."
          />

          <div className="mt-6">
            <StatementCard
              title="Do not use advanced runtimes by default"
              body="Direct widget and modal runtime files bypass the SDK abstraction layer. This increases integration complexity and should only be used in controlled or custom environments."
            />
          </div>

          <div className="mt-8 grid gap-6">
            <CodeCard
              title="Install SDK + verification modal"
              language="HTML"
              code={sdkAndModalInstallExample}
            />
          </div>
        </section>

        <section
          id="badge"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
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

        <section
          id="widget"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
          <SectionHeading
            eyebrow="WIDGET"
            title="Render the full trust widget"
            body="The widget is a richer trust surface. It fetches the verify endpoint, renders record status, signature state, payload integrity, and links to the registry and Proof JSON."
          />

          <div className="mt-8 grid gap-6">
            <CodeCard
              title="Render widget via SDK (recommended)"
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

        <section
          id="modal"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
          <SectionHeading
            eyebrow="MODAL"
            title="Open verification modal (SDK-controlled)"
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

        <section
          id="external-test"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
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

        <section
          id="public-contract"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
          <SectionHeading
            eyebrow="PUBLIC CONTRACT"
            title="What the public layer exposes"
            body="GAFAIG exposes only published certification outcomes, public record fields, and verification proof. Internal scoring, workflow, decision, and reviewer materials are not part of the public contract."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Public fields"
              body="Published certification record fields, lifecycle state, registry identifiers, eligibility flags, and cryptographic proof required for independent verification."
            />
            <StatementCard
              title="Private fields"
              body="Raw score, scoring breakdowns, reviewer materials, internal workflow state, raw findings, evidence, governance telemetry, and private operational records do not belong in the public trust layer."
            />
          </div>
        </section>

        <section
          id="raw-api"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
          <SectionHeading
            eyebrow="RAW API"
            title="Use the verify, badge, and public key endpoints directly"
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
              title="Fetch public verification key"
              language="cURL"
              code={publicKeyExample}
            />
            <CodeCard
              title="Read proof and public key with SDK"
              language="JavaScript"
              code={jsVerifyExample}
            />
          </div>
        </section>

        <section
          id="proof-object"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
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
            <BulletCard text="The signed payload is proof.messageString exactly as returned by the API." />
            <BulletCard text="External systems must treat messageString as the canonical input to signature verification." />
            <BulletCard text="SDK, widget, badge, and modal bindings are thin consumers of verify and badge endpoints and never compute trust." />
          </div>
        </section>

        <section
          id="failure-modes"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
          <SectionHeading
            eyebrow="FAILURE MODES"
            title="Handle invalid and unavailable verification states explicitly"
            body="A professional trust integration must fail safely. GAFAIG surfaces invalid, unavailable, expired, and revoked states so downstream systems do not mistake UI availability for trust."
          />

          <div className="mt-8">
            <CodeCard
              title="Failure modes"
              language="TEXT"
              code={failureModesExample}
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard text="Missing messageString means verification is invalid. Do not reconstruct a payload." />
            <BulletCard text="Missing signature means no cryptographic proof is available." />
            <BulletCard text="Public key failure means verification is unavailable until the key can be fetched." />
            <BulletCard text="Expired or revoked published records must be displayed according to the public verification response even if the signature proves authenticity." />
          </div>
        </section>

        <section
          id="integration-paths"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
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
              body="A richer public trust panel with record status, signature state, payload integrity, and verification links."
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
              href="/widget-preview/GAFAIG-00000001"
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
            body="GAFAIG enables organizations to prove certified AI governance without exposing internal systems. This makes trust portable while preserving confidentiality."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard text="Internal governance review stays in the private verification engine." />
            <BulletCard text="The public layer exposes only published certification outcomes and proof needed to verify them." />
            <BulletCard text="Trust can be validated outside GAFAIG using the signed payload and public key." />
            <BulletCard text="The same public trust signal can appear on registry pages, APIs, badges, widgets, SDK integrations, and external websites." />
          </div>
        </section>
      </div>
    </main>
  );
}