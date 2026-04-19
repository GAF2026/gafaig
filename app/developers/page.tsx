import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEMO_REGISTRY_ID = "GAFAIG-00000001";

export default function DevelopersPage() {
  const verifyEndpoint = `/api/verify/${DEMO_REGISTRY_ID}`;
  const publicKeyEndpoint = "/api/.well-known/gafaig-public-key";
  const widgetScript =
    '<script src="https://www.gafaig.com/widget/gafaig-widget.js"></script>';
  const widgetMarkup = `<div data-gafaig-id="${DEMO_REGISTRY_ID}"></div>`;
  const verifyHelperScript =
    '<script src="https://www.gafaig.com/widget/gafaig-verify.js"></script>';

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="DEVELOPERS"
          title="Integrate GAFAIG proof into your own systems"
          description="GAFAIG is not only a public registry. It is a proof layer that developers can verify, display, and distribute across websites, products, and internal systems."
          secondaryDescription="Use the verification endpoint, public key endpoint, signed proof payload, and widget surfaces to validate that a published GAFAIG public trust record is real, current, and independently verifiable."
          actions={
            <>
              <PublicButtonLink href="/demo" variant="dark">
                Start with the Demo
              </PublicButtonLink>
              <PublicButtonLink href="/verify" variant="outline-dark">
                Open Verify
              </PublicButtonLink>
              <PublicButtonLink href="/registry" variant="outline-dark">
                Browse Registry
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT DEVELOPERS GET
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            A portable trust infrastructure, not just a page
          </h2>

          <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
            GAFAIG lets external systems do more than link to a certification
            page. Developers can retrieve signed proof, validate public trust
            records, fetch the verification key, and surface the same trust
            outcome through a widget or a direct integration.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DeveloperCard
              title="Verify endpoint"
              body="Retrieve the public trust record together with the signed proof payload."
            />
            <DeveloperCard
              title="Public key endpoint"
              body="Fetch the published verification key used to validate signed proof."
            />
            <DeveloperCard
              title="Widget surface"
              body="Display a live GAFAIG trust result on an external website."
            />
            <DeveloperCard
              title="Proof portability"
              body="Use the same trust outcome across registry, API, verify page, and widget."
            />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-black/10 bg-white p-8">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              QUICKSTART
            </div>

            <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              The core trust flow
            </h2>

            <p className="mt-4 max-w-[860px] text-[15px] leading-[1.85] text-black/72">
              GAFAIG trust works as a sequence. Start with a published registry
              ID, retrieve signed proof, fetch the published verification key,
              and validate the result or surface it through a widget.
            </p>

            <div className="mt-8 grid gap-4 xl:grid-cols-4">
              <PipelineStep
                number="1"
                title="Resolve record"
                body="Start from a published GAFAIG registry ID."
              />
              <PipelineStep
                number="2"
                title="Fetch proof"
                body="Retrieve signed proof from the verify endpoint."
              />
              <PipelineStep
                number="3"
                title="Fetch key"
                body="Retrieve the public verification key from the published key endpoint."
              />
              <PipelineStep
                number="4"
                title="Validate"
                body="Validate the signature or surface the result through the widget."
                isLast
              />
            </div>
          </section>

          <section className="rounded-3xl border border-black/10 bg-white p-8">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              EXAMPLE RECORD
            </div>

            <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
              Demo registry ID
            </h2>

            <div className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.18em] text-black/50">
                Registry ID
              </div>
              <div className="mt-3 break-all font-mono text-[14px] text-black/80">
                {DEMO_REGISTRY_ID}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <PublicButtonLink
                href={`/registry/${DEMO_REGISTRY_ID}`}
                variant="outline-dark"
                size="sm"
              >
                Open record
              </PublicButtonLink>
              <PublicButtonLink
                href={`/verify/${DEMO_REGISTRY_ID}`}
                variant="outline-dark"
                size="sm"
              >
                Verify record
              </PublicButtonLink>
              <PublicButtonLink
                href={`/widget-preview/${DEMO_REGISTRY_ID}`}
                variant="outline-dark"
                size="sm"
              >
                Open widget
              </PublicButtonLink>
            </div>
          </section>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            ENDPOINTS
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Core public surfaces
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <EndpointCard
              title="Verify endpoint"
              path={verifyEndpoint}
              body="Returns the public trust record plus the signed proof payload for the specified registry ID."
            />
            <EndpointCard
              title="Public key endpoint"
              path={publicKeyEndpoint}
              body="Returns the published public verification key that external systems use to validate signed proof."
            />
            <EndpointCard
              title="Widget preview"
              path={`/widget-preview/${DEMO_REGISTRY_ID}`}
              body="Shows how the same trust result can appear outside GAFAIG through a portable widget."
            />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-3xl border border-black/10 bg-white p-8">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              VERIFY ENDPOINT
            </div>

            <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
              Retrieve signed proof
            </h2>

            <p className="mt-4 text-[15px] leading-[1.85] text-black/75">
              The verify endpoint is the canonical public proof surface. It
              returns the public trust record together with proof metadata such
              as algorithm, key ID, signature, signed timestamp, verification
              key URL, and the deterministic signed message.
            </p>

            <CodeBlock
              code={`GET ${verifyEndpoint}

Response fields include:
- record
- proof.alg
- proof.kid
- proof.signature
- proof.signedAt
- proof.verificationKeyUrl
- proof.message
- proof.messageString`}
            />
          </section>

          <section className="rounded-3xl border border-black/10 bg-white p-8">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              PUBLIC KEY ENDPOINT
            </div>

            <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
              Retrieve the verification key
            </h2>

            <p className="mt-4 text-[15px] leading-[1.85] text-black/75">
              External verifiers fetch the published public key and validate the
              signature against the signed message string returned by the verify
              endpoint. This is what makes GAFAIG independently verifiable
              outside the platform.
            </p>

            <CodeBlock
              code={`GET ${publicKeyEndpoint}

Response fields include:
- kid
- kty
- crv
- alg
- publicKeyPem
- publicKeyBase64`}
            />
          </section>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WIDGET INTEGRATION
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Surface trust outside GAFAIG
          </h2>

          <p className="mt-5 max-w-[980px] text-[16px] leading-[1.85] text-black/75">
            The widget is the fastest way to display a live GAFAIG trust result
            on an external website. It uses the published public trust record
            and signed proof surfaces rather than creating a new trust decision.
          </p>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            <div>
              <div className="text-sm font-semibold text-black">
                Widget script
              </div>
              <CodeBlock code={widgetScript} />
            </div>

            <div>
              <div className="text-sm font-semibold text-black">
                Widget markup
              </div>
              <CodeBlock code={widgetMarkup} />
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm font-semibold text-black">
              Optional verification helper
            </div>
            <CodeBlock code={verifyHelperScript} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-black p-8 text-white">
          <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/55">
            WHAT THIS ENABLES
          </div>

          <h2 className="mt-3 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-white md:text-[38px]">
            Build verifiable trust into your own interfaces
          </h2>

          <p className="mt-4 max-w-[860px] text-[16px] leading-[1.85] text-white/80">
            GAFAIG allows organizations, products, marketplaces, and third-party
            systems to prove that a published public trust record is real and
            current. The trust result can be verified through API calls,
            validated through signed proof, or displayed directly through a
            widget surface.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <DarkCard
              title="Platform integrations"
              body="Attach a GAFAIG trust result to product listings, enterprise profiles, or public organization pages."
            />
            <DarkCard
              title="Internal validation"
              body="Verify signed proof in your own systems when trust status affects workflows, approvals, or procurement."
            />
            <DarkCard
              title="External display"
              body="Use the widget and verification helper to surface trust without moving users off your platform."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            RELATED SURFACES
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Explore the public trust flow
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-4">
            <LinkCard
              title="Registry"
              body="See the public trust record."
              href={`/registry/${DEMO_REGISTRY_ID}`}
              cta="Open record"
            />
            <LinkCard
              title="Verify"
              body="Inspect the signed proof surface."
              href={`/verify/${DEMO_REGISTRY_ID}`}
              cta="Open verify"
            />
            <LinkCard
              title="JSON"
              body="Read the machine-usable signed proof."
              href={verifyEndpoint}
              cta="Open endpoint"
            />
            <LinkCard
              title="Widget"
              body="See portable trust in action."
              href={`/widget-preview/${DEMO_REGISTRY_ID}`}
              cta="Open widget"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function DeveloperCard({
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
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}

function PipelineStep({
  number,
  title,
  body,
  isLast = false,
}: {
  number: string;
  title: string;
  body: string;
  isLast?: boolean;
}) {
  return (
    <div className="relative">
      <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5 h-full">
        <div className="text-[28px] font-semibold leading-none tracking-tight text-black/30">
          {number}
        </div>
        <div className="mt-4 text-[18px] font-semibold tracking-tight text-black">
          {title}
        </div>
        <p className="mt-3 text-[15px] leading-[1.8] text-black/70">{body}</p>
      </div>

      {!isLast ? (
        <div className="pointer-events-none absolute -right-[10px] top-1/2 hidden -translate-y-1/2 xl:flex items-center justify-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 bg-white text-black/40">
            →
          </div>
        </div>
      ) : null}
    </div>
  );
}

function EndpointCard({
  title,
  path,
  body,
}: {
  title: string;
  path: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <div className="mt-3 break-all rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3 font-mono text-[12px] leading-6 text-black/80">
        {path}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl border border-black/10 bg-black/[0.03] p-5 text-[13px] leading-[1.8] text-black/85">
      <code>{code}</code>
    </pre>
  );
}

function DarkCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-white">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-white/72">{body}</p>
    </div>
  );
}

function LinkCard({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6">
      <div className="text-[22px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/70">{body}</p>
      <div className="mt-5">
        <PublicButtonLink href={href} variant="ghost" size="sm">
          {cta} →
        </PublicButtonLink>
      </div>
    </div>
  );
}