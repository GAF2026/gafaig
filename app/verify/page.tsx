import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";

export const dynamic = "force-static";

export default function VerifyExplainerPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="VERIFY"
        title="How public verification works"
        description="GAFAIG provides a public verification layer so certification records can be checked independently. This includes a verification endpoint, signed public proof, published verification key, and portable trust surfaces such as badges, QR links, verify buttons, and widgets."
        secondaryDescription="The verification layer is designed to let third parties confirm public certification status without exposing private evidence, findings, or internal reviewer workflow."
        actions={
          <>
            <PublicButtonLink href="/registry" variant="primary">
              View the Registry
            </PublicButtonLink>

            <PublicButtonLink
              href="/api/.well-known/gafaig-public-key"
              variant="secondary"
            >
              Public Key
            </PublicButtonLink>
          </>
        }
      />

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          WHAT THIS PAGE EXPLAINS
        </div>

        <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Public verification is the trust layer of the GAFAIG registry
        </h2>

        <p className="mt-5 max-w-[980px] text-[16px] leading-[1.9] text-black/75">
          GAFAIG does not ask the public to rely on certification as a simple
          claim. Public certification records are designed to be independently
          checked through a verification endpoint and signed proof layer. This
          allows visitors, developers, partners, and institutions to confirm
          that a public registry record matches what GAFAIG issued.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          <InfoCard
            title="Human-readable trust surface"
            body="Each registry record can be opened as a public page showing certification status, signed proof, badge tools, QR verification, and portable trust surfaces."
          />
          <InfoCard
            title="Machine-verifiable trust surface"
            body="Each registry record can also be checked through a public verification endpoint that returns the public certification record and signed proof payload."
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          THE VERIFICATION COMPONENTS
        </div>

        <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          What makes a GAFAIG public certification verifiable
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <InfoCard
            title="Verification endpoint"
            body="The public verification endpoint returns the public certification record and proof payload for a specific GAFAIG registry ID."
          />
          <InfoCard
            title="Signed public proof"
            body="The proof contains a structured message and digital signature so external parties can validate that the public certification record matches GAFAIG’s issued statement."
          />
          <InfoCard
            title="Published verification key"
            body="GAFAIG publishes the verification key required to validate signed proof payloads without exposing private signing material."
          />
          <InfoCard
            title="Portable trust surfaces"
            body="Badges, widgets, verify buttons, and QR-linked trust tools allow certification to travel across the web while still resolving back to the canonical registry record."
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          HOW TO VERIFY
        </div>

        <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Verification can be done in a few clear steps
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <StepCard
            number="1"
            title="Open a registry record"
            body="Start with the public registry page for a GAFAIG certification record."
          />
          <StepCard
            number="2"
            title="Fetch verify JSON"
            body="Use the public verification endpoint for that registry ID."
          />
          <StepCard
            number="3"
            title="Read the signed proof"
            body="Inspect the signed message, algorithm, key identifier, and signature."
          />
          <StepCard
            number="4"
            title="Validate against the public key"
            body="Use GAFAIG’s published verification key to validate the signed proof externally."
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXAMPLE ENDPOINTS
        </div>

        <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Public verification surfaces
        </h2>

        <div className="mt-8 grid gap-4">
          <EndpointCard
            label="Registry record"
            value="https://www.gafaig.com/registry/GAFAIG-28dedd000ca5410c86e3a6633cd6639a"
          />
          <EndpointCard
            label="Verify JSON"
            value="https://www.gafaig.com/api/verify/GAFAIG-28dedd000ca5410c86e3a6633cd6639a"
          />
          <EndpointCard
            label="Public verification key"
            value="https://www.gafaig.com/api/.well-known/gafaig-public-key"
          />
          <EndpointCard
            label="Badge"
            value="https://www.gafaig.com/badge/GAFAIG-28dedd000ca5410c86e3a6633cd6639a"
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          WHY THIS MATTERS
        </div>

        <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Trust should be checkable, not assumed
        </h2>

        <p className="mt-5 max-w-[980px] text-[16px] leading-[1.9] text-black/75">
          The purpose of GAFAIG’s public verification layer is to ensure that
          certification status can be confirmed independently. Public trust does
          not depend on access to private evidence. It depends on having a
          canonical public record, a signed proof, and a verification path that
          third parties can inspect for themselves.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <PublicButtonLink href="/registry" variant="primary">
            Browse Registry Records
          </PublicButtonLink>

          <PublicButtonLink
            href="/widget-preview/GAFAIG-28dedd000ca5410c86e3a6633cd6639a"
            variant="secondary"
          >
            View Widget Preview
          </PublicButtonLink>
        </div>
      </section>
    </main>
  );
}

function InfoCard({
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
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {number}
      </div>
      <div className="mt-2 text-[16px] font-semibold text-black">{title}</div>
      <p className="mt-2 text-[14px] leading-[1.7] text-black/72">{body}</p>
    </div>
  );
}

function EndpointCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-3 break-all text-[14px] leading-[1.8] text-black/78">
        {value}
      </div>
    </div>
  );
}