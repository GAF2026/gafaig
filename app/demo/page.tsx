import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";

export const dynamic = "force-dynamic";

const DEMO_REGISTRY_ID = "GAFAIG-00000001";

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="DEMO"
          title="See how AI governance becomes independently verifiable"
          description="GAFAIG turns AI governance from a private claim into a public, independently verifiable trust record. This demo follows the exact sequence from certified record to signed proof to portable trust surface."
          secondaryDescription="This page uses one real GAFAIG record to show how certification is published, verified, and surfaced outside an organization’s platform."
          actions={
            <>
              <PublicButtonLink
                href={`/registry/${DEMO_REGISTRY_ID}`}
                variant="primary"
              >
                Start Demo
              </PublicButtonLink>

              <PublicButtonLink href="/verify" variant="secondary">
                Verify a Record
              </PublicButtonLink>

              <PublicButtonLink href="/developers" variant="secondary">
                Open Developers
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHY THIS MATTERS
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Most AI governance is still a claim
          </h2>

          <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
            Organizations can say they have human oversight, internal controls,
            and responsible AI policies. But for customers, regulators, and the
            public, there is usually no consistent way to verify whether that
            oversight is real, functioning, or effective.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="What usually exists"
              body="A policy statement, internal documentation, or self-declared claim that oversight is in place."
            />
            <StatementCard
              title="What GAFAIG adds"
              body="An independently verifiable public trust record backed by signed proof, a verification surface, and portable trust signals."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            THE DEMO WALKTHROUGH
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Follow one record from certification to proof
          </h2>

          <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
            This walkthrough uses a live GAFAIG record to show how trust moves
            through the public surface. Each step reflects a real part of the
            platform that is already built and publicly accessible.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <StepCard
              number="1"
              title="Resolve registry record"
              body="Locate the certified record in the public registry."
            />
            <StepCard
              number="2"
              title="Fetch verification proof"
              body="Retrieve the signed verification payload from the API."
            />
            <StepCard
              number="3"
              title="Validate signature"
              body="Confirm the record using the public verification key."
            />
            <StepCard
              number="4"
              title="Render trust surface"
              body="Display the verified result through a widget or UI."
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <DemoCard
            eyebrow="STEP 1"
            title="Resolve the certified registry record"
            body="Start with the public trust record. This is the published certification outcome that external parties can review by registry ID."
            href={`/registry/${DEMO_REGISTRY_ID}`}
            cta="Open Registry Record"
          />

          <DemoCard
            eyebrow="STEP 2"
            title="Fetch the verification proof"
            body="Open the verify page to inspect the proof layer behind the certification record, including trust state, key references, and signature validation."
            href={`/verify/${DEMO_REGISTRY_ID}`}
            cta="Open Verify Page"
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <DemoCard
            eyebrow="STEP 3"
            title="Inspect the signed payload"
            body="The verification endpoint exposes the machine-readable proof directly. This is what allows external systems to validate the record instead of relying on a visual page alone."
            href={`/api/verify/${DEMO_REGISTRY_ID}`}
            cta="Open Verify JSON"
          />

          <DemoCard
            eyebrow="STEP 4"
            title="Render the external trust surface"
            body="The widget preview shows how the same verified trust result can appear outside GAFAIG through a portable, embeddable interface."
            href={`/widget-preview/${DEMO_REGISTRY_ID}`}
            cta="Open Widget Preview"
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT EACH STEP PROVES
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            GAFAIG is a trust system, not just a registry page
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <BulletCard text="The registry record proves that a public certification outcome exists." />
            <BulletCard text="The verify page proves that the public trust record is backed by signed proof." />
            <BulletCard text="The signed JSON proves that the trust result is machine-readable and portable." />
            <BulletCard text="The widget proves that the same verified result can travel outside GAFAIG." />
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[18px] font-semibold tracking-tight text-black">
              The key distinction
            </div>
            <p className="mt-3 text-[15px] leading-[1.85] text-black/75">
              GAFAIG does not ask the public to trust an internal claim. It
              publishes an independently verifiable public trust record backed by
              signed proof and external validation surfaces.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT TO LOOK FOR
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            The signals that confirm public proof
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="Public trust record"
              body="Confirm that the record is published in the registry and tied to a real registry ID."
            />
            <FeatureCard
              title="Signed verification proof"
              body="Confirm that the verification surface exposes a signed payload and public key reference."
            />
            <FeatureCard
              title="Portable trust outcome"
              body="Confirm that the same result appears in the registry, API, verify page, and widget."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-black p-8 text-white">
          <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/55">
            NEXT STEP
          </div>

          <h2 className="mt-3 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-white md:text-[38px]">
            Ready to create a verified record?
          </h2>

          <p className="mt-4 max-w-[860px] text-[16px] leading-[1.85] text-white/80">
            You’ve seen how a GAFAIG record appears in the registry, how it is
            verified through signed proof, how it can be inspected through the
            public API, and how it can appear outside the platform through a
            widget. This is the outcome of the GAFAIG verification process.
          </p>

          <p className="mt-4 max-w-[860px] text-[15px] leading-[1.85] text-white/75">
            If your organization operates AI systems and needs independently
            verifiable proof that human oversight is functioning, you can begin
            the GAFAIG verification intake process now.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/apply" variant="light">
              Begin GAFAIG verification intake
            </PublicButtonLink>

            <PublicButtonLink href="/framework" variant="outline-light">
              Review Framework
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-black/[0.03] p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            THE RESULT
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            From governance claims to public proof
          </h2>

          <p className="mt-5 max-w-[980px] text-[16px] leading-[1.9] text-black/80">
            This is the core idea behind GAFAIG. Instead of asking the public to
            trust internal claims about oversight, GAFAIG publishes a record that
            can be reviewed, verified, validated, and used across external
            environments.
          </p>

          <p className="mt-4 max-w-[980px] text-[15px] leading-[1.85] text-black/75">
            The demo is intentionally simple: resolve the registry record, fetch
            the proof, validate the signature, and render the verified trust
            surface. That sequence is the product.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink
              href={`/registry/${DEMO_REGISTRY_ID}`}
              variant="primary"
            >
              Restart Demo
            </PublicButtonLink>

            <PublicButtonLink href="/verify" variant="secondary">
              Open Verify
            </PublicButtonLink>

            <PublicButtonLink href="/developers" variant="secondary">
              Open Developers
            </PublicButtonLink>
          </div>
        </section>
      </div>
    </main>
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
    <div className="rounded-2xl border border-black/10 p-4">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {number}
      </div>
      <div className="mt-2 text-[16px] font-semibold text-black">{title}</div>
      <p className="mt-2 text-[14px] leading-[1.7] text-black/72">{body}</p>
    </div>
  );
}

function DemoCard({
  eyebrow,
  title,
  body,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
        {eyebrow}
      </div>

      <h2 className="mt-3 text-[24px] font-semibold leading-[1.25] tracking-tight text-black">
        {title}
      </h2>

      <p className="mt-4 text-[15px] leading-[1.8] text-black/72">{body}</p>

      <div className="mt-6">
        <PublicButtonLink href={href} variant="ghost" size="sm">
          {cta} →
        </PublicButtonLink>
      </div>
    </div>
  );
}

function BulletCard({ text }: { text: string }) {
  return (
    <div className="flex gap-3 rounded-2xl border border-black/10 bg-white p-4">
      <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
      <span className="text-[14px] leading-6 text-black/75">{text}</span>
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
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}

function FeatureCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[20px] font-semibold text-black">{title}</div>
      <p className="mt-3 text-[14px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}