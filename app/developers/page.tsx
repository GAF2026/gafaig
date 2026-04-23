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

const curlExample = `curl https://www.gafaig.com/api/verify/GAFAIG-00363095`;

const jsExample = `const response = await fetch(
  "https://www.gafaig.com/api/verify/GAFAIG-00363095",
  { cache: "no-store" }
);

const data = await response.json();

console.log(data.record);
console.log(data.proof.messageString);
console.log(data.proof.signature);`;

const widgetExample = `<script src="https://www.gafaig.com/widget/gafaig-widget.js"></script>
<div data-gafaig-id="GAFAIG-00363095"></div>`;

const modalExample = `<script src="https://www.gafaig.com/widget/gafaig-widget.js"></script>
<script src="https://www.gafaig.com/widget/gafaig-verify.js"></script>

<button onclick="verifyGAFAIG('GAFAIG-00363095', { baseUrl: 'https://www.gafaig.com' })">
  Verify this GAFAIG record
</button>`;

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
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="DEVELOPERS"
          title="Verify a GAFAIG record in minutes."
          description="GAFAIG provides a verification-first trust surface for AI governance. Fetch a certified public record, inspect its signed proof, and validate it independently."
          secondaryDescription="The public layer exposes certification outcomes only. Internal governance records remain private. Trust is derived from the verification endpoint, signed payload, and public key."
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
            title="How GAFAIG verification works"
            body="GAFAIG separates internal governance review from external trust. Developers interact only with the public trust layer: the verification endpoint, the signed proof payload, and the public key used to validate the result."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <StepCard
              number="1"
              title="Fetch a certified record"
              body="Request a registry record from the verify endpoint by REGISTRY_ID. This returns the public record and its signed proof."
            />
            <StepCard
              number="2"
              title="Inspect the signed payload"
              body="Use the proof object to read the canonical message, messageString, signature, key ID, and verification key URL."
            />
            <StepCard
              number="3"
              title="Validate independently"
              body="Verify the signature with the published Ed25519 public key. No private GAFAIG infrastructure is required."
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Trust Source"
            value="/api/verify"
            body="The verification endpoint is the only trust authority in the public GAFAIG surface."
          />
          <MetricCard
            label="Signature Algorithm"
            value="Ed25519"
            body="Every public proof is signed with Ed25519 and can be validated with standard libraries."
          />
          <MetricCard
            label="Public Key"
            value="/api/.well-known/gafaig-public-key"
            body="The key endpoint exposes the public key material needed for independent verification."
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="PUBLIC CONTRACT"
            title="What the public layer exposes"
            body="GAFAIG exposes only the certification outcome and verification proof. Internal scoring, workflow, decision, and review materials are not part of the public contract."
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
            eyebrow="COPY / PASTE"
            title="Verification examples"
            body="Start with the verify endpoint. Then add widget or modal verification if you want to surface trust directly inside a product, website, or external workflow."
          />

          <div className="mt-8 grid gap-6">
            <CodeCard title="Fetch a verification record" language="cURL" code={curlExample} />
            <CodeCard title="Read the public proof in JavaScript" language="JavaScript" code={jsExample} />
            <CodeCard title="Embed the GAFAIG widget" language="HTML" code={widgetExample} />
            <CodeCard title="Open the verification modal" language="HTML" code={modalExample} />
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
            <BulletCard text="Widgets and badges are thin consumers of the verify endpoint and should never compute trust independently." />
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
              title="Verify API"
              body="Fetch raw record + proof data for custom integrations, audit pipelines, and third-party validation."
            />
            <StatementCard
              title="Registry"
              body="Link users to the public certification record for a durable, human-readable trust reference."
            />
            <StatementCard
              title="Widget"
              body="Render a verified trust surface directly inside external sites or product experiences."
            />
            <StatementCard
              title="Modal Verification"
              body="Allow users to inspect the public proof without leaving the current page."
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
            <BulletCard text="The same public trust signal can appear on registry pages, APIs, badges, widgets, and external websites." />
          </div>
        </section>
      </div>
    </main>
  );
}