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
      <div className="space-y-10">
        <PublicPageHero
          eyebrow="Developers"
          title="Integrate GAFAIG verification into products, websites, and compliance workflows"
          description="GAFAIG exposes portable trust surfaces for AI governance certification. Use the verification API, signed proof, badge, and widget to display independently verifiable certification across the web."
          secondaryDescription="The public layer is read-only trust infrastructure. Evaluation and certification occur inside the private verification engine. External systems consume certification outcomes through stable, verifiable interfaces."
          actions={
            <>
              <PublicButtonLink href={verifyUrl} variant="primary">
                View live verify JSON
              </PublicButtonLink>
              <PublicButtonLink href={registryUrl}>
                View example record
              </PublicButtonLink>
              <PublicButtonLink href={widgetPreviewUrl} variant="secondary">
                Preview widget
              </PublicButtonLink>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard
            label="Primary trust record"
            value={EXAMPLE_ID}
            body="Live certification record used throughout these examples."
          />
          <MetricCard
            label="Canonical verify endpoint"
            value="/api/verify/[registryId]"
            body="Primary external verification interface."
          />
          <MetricCard
            label="Portable trust surfaces"
            value="API · Badge · Widget"
            body="Designed for use across third-party websites and systems."
          />
          <MetricCard
            label="Verification model"
            value="Signed proof"
            body="Public key validation supports independent verification."
          />
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
            <SectionEyebrow>Start here</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
              Three integration paths
            </h2>
            <div className="mt-8 grid gap-4">
              <PathCard
                step="01"
                title="Verify certification programmatically"
                body="Call the verify API to retrieve the public record and signed proof for a registry ID."
              />
              <PathCard
                step="02"
                title="Display certification externally"
                body="Use the badge or widget to surface certification status directly on an organization’s website or product surface."
              />
              <PathCard
                step="03"
                title="Validate proof independently"
                body="Fetch the public key and verify the signed payload returned by the verification API."
              />
            </div>
          </div>

          <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
            <SectionEyebrow>Certification onboarding</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
              Apply for certification
            </h2>
            <p className="mt-5 text-[16px] leading-[1.9] text-black/72">
              GAFAIG certification is not performed through the public registry
              or widget. Evaluation occurs inside the controlled private
              verification engine using structured case intake, findings,
              evidence, scoring, and decision workflow.
            </p>

            <div className="mt-6 grid gap-3">
              <StatementCard
                title="Who should apply"
                body="Organizations seeking an independently verifiable public certification record for AI governance oversight."
              />
              <StatementCard
                title="What happens next"
                body="Structured intake → case creation → evidence review → deterministic scoring → decision → registry publication."
              />
              <StatementCard
                title="Public vs private"
                body="Private evidence and workflow remain confidential. Only certification outcomes and public trust surfaces are exposed."
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <PublicButtonLink href="/verify" variant="secondary">
                Learn how verification works
              </PublicButtonLink>
              <PublicButtonLink href="/registry" variant="secondary">
                Explore public registry
              </PublicButtonLink>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
          <SectionEyebrow>Integration reference</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
            Verify API
          </h2>
          <p className="mt-5 max-w-4xl text-[16px] leading-[1.9] text-black/72">
            Use the verification endpoint as the canonical interface for
            external trust validation. It returns the public record and signed
            proof for a GAFAIG registry ID.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-4">
              <InfoCard
                label="Method"
                value="GET"
                body="No authentication required for public verification."
              />
              <InfoCard
                label="Endpoint"
                value="/api/verify/[registryId]"
                body="Canonical external verification surface."
              />
              <InfoCard
                label="Returns"
                value="record + proof"
                body="Public certification data and signed payload."
              />
            </div>

            <div className="space-y-4">
              <CodeBlock
                title="Request"
                code={`GET ${verifyUrl}`}
              />
              <CodeBlock
                title="Response shape"
                code={`{
  "ok": true,
  "verified": true,
  "registryId": "${EXAMPLE_ID}",
  "record": {
    "registryId": "${EXAMPLE_ID}",
    "entityName": "...",
    "entityType": "...",
    "country": "...",
    "applicationId": "...",
    "caseId": "...",
    "certificationStatus": "Certified",
    "certifiedTier": "...",
    "certifiedBand": "...",
    "decisionStatus": "...",
    "certifiedAt": "...",
    "validFrom": "...",
    "validTo": "..."
  },
  "proof": {
    "alg": "Ed25519",
    "kid": "...",
    "signature": "...",
    "signedAt": "...",
    "verificationKeyUrl": "${publicKeyUrl}",
    "message": { ... },
    "messageString": "{...}"
  }
}`}
              />
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
            <SectionEyebrow>Display certification</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
              Badge embed
            </h2>
            <p className="mt-5 text-[16px] leading-[1.9] text-black/72">
              Use the badge endpoint when you need a lightweight visual trust
              signal that resolves to the current GAFAIG certification state.
            </p>

            <div className="mt-6">
              <CodeBlock
                title="HTML"
                code={`<img
  src="${badgeUrl}"
  alt="GAFAIG certification badge"
/>`}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <PublicButtonLink href={badgeUrl} variant="primary">
                Open badge
              </PublicButtonLink>
              <PublicButtonLink href={registryUrl}>
                Open registry record
              </PublicButtonLink>
            </div>
          </div>

          <div className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
            <SectionEyebrow>Display certification</SectionEyebrow>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
              Widget embed
            </h2>
            <p className="mt-5 text-[16px] leading-[1.9] text-black/72">
              Use the widget when you want a richer embedded trust surface with
              registry ID, decision state, tier/band, and deep links back to the
              GAFAIG registry.
            </p>

            <div className="mt-6">
              <CodeBlock
                title="HTML"
                code={`<script src="${BASE_URL}/widget/gafaig-widget.js"></script>
<div data-gafaig-id="${EXAMPLE_ID}"></div>`}
              />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <PublicButtonLink href={widgetPreviewUrl} variant="primary">
                Preview widget
              </PublicButtonLink>
              <PublicButtonLink href={verifyUrl}>
                Verify live example
              </PublicButtonLink>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
          <SectionEyebrow>Independent validation</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
            Public key verification
          </h2>
          <p className="mt-5 max-w-4xl text-[16px] leading-[1.9] text-black/72">
            External systems can independently validate the signed proof
            returned by the verify API. Fetch the GAFAIG public key, reconstruct
            the signed message, and verify the signature using standard
            Ed25519-compatible tooling.
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
              <CodeBlock
                title="Fetch public key"
                code={`GET ${publicKeyUrl}`}
              />
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

        <section className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
          <SectionEyebrow>Implementation examples</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
            Copy-paste snippets
          </h2>

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

            <CodeBlock
              title="cURL"
              code={`curl "${verifyUrl}"`}
            />

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

        <section className="rounded-[32px] border border-black/10 bg-white p-8 shadow-sm">
          <SectionEyebrow>Operational boundaries</SectionEyebrow>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
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

        <section className="rounded-[32px] border border-black/10 bg-black p-8 text-white shadow-sm">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-white/60">
            Next step
          </div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Start with the live trust record
          </h2>
          <p className="mt-5 max-w-3xl text-[16px] leading-[1.9] text-white/75">
            Use the primary GAFAIG trust record to validate your integration end
            to end before rolling out across production surfaces.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
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
              href={publicKeyUrl}
              variant="secondary"
              className="border-white text-white hover:bg-white/10"
            >
              Fetch public key
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
    <div className="rounded-[24px] border border-black/10 bg-white p-6 shadow-sm">
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

function StatementCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[24px] border border-black/10 bg-black/[0.02] p-5">
      <div className="text-base font-semibold text-black">{title}</div>
      <p className="mt-2 text-sm leading-7 text-black/68">{body}</p>
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
  title: string;
  code: string;
}) {
  return (
    <div className="overflow-hidden rounded-[24px] border border-black/10 bg-black shadow-sm">
      <div className="border-b border-white/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/55">
        {title}
      </div>
      <pre className="overflow-x-auto p-5 text-sm leading-7 text-white/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}