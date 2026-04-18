import Link from "next/link";
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
          title="See how AI governance becomes verifiable"
          description="GAFAIG turns AI governance from a private claim into a public, independently verifiable trust record. This demo walks through the exact sequence from certification record to signed proof to portable trust signal."
          secondaryDescription="This page shows how a real GAFAIG record can be reviewed, verified, and trusted outside an organization’s platform."
          actions={
            <>
              <PublicButtonLink
                href={`/registry/${DEMO_REGISTRY_ID}`}
                variant="primary"
              >
                Start Demo
              </PublicButtonLink>

              <PublicButtonLink href="/registry" variant="secondary">
                Browse Public Records
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
              body="A public certification record, signed proof, and verification surface that can be independently reviewed."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            THE DEMO WALKTHROUGH
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Follow one record from public listing to signed proof
          </h2>

          <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
            This walkthrough uses a live GAFAIG record to show how trust moves
            through the public surface. Each step reflects a real part of the
            platform that is already built and publicly accessible.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <StepCard
              number="1"
              title="Open the registry record"
              body="Start with the public certification record that represents the organization’s trust outcome."
            />
            <StepCard
              number="2"
              title="Open the verify page"
              body="See the same record through the verification surface, including signature status and public-key references."
            />
            <StepCard
              number="3"
              title="Inspect the raw JSON"
              body="View the machine-readable verification payload returned directly from the public API."
            />
            <StepCard
              number="4"
              title="See the external widget"
              body="Confirm that the trust signal can travel outside GAFAIG through a portable, embeddable widget."
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <DemoCard
            eyebrow="STEP 1"
            title="Open the certified public record"
            body="This is the public registry record. It shows the certification outcome, trust status, and record metadata. This is where a person first encounters the GAFAIG trust record."
            href={`/registry/${DEMO_REGISTRY_ID}`}
            cta="Open Registry Record"
          />

          <DemoCard
            eyebrow="STEP 2"
            title="Verify the trust record"
            body="The verify page shows the same record through the public verification surface. This is where signed proof, validation status, and public-key trust begin to matter."
            href={`/verify/${DEMO_REGISTRY_ID}`}
            cta="Open Verify Page"
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <DemoCard
            eyebrow="STEP 3"
            title="View the machine-readable proof"
            body="The verification endpoint returns structured JSON that can be consumed by external systems. This is what makes the trust record portable, inspectable, and automation-ready."
            href={`/api/verify/${DEMO_REGISTRY_ID}`}
            cta="Open Verify JSON"
          />

          <DemoCard
            eyebrow="STEP 4"
            title="See the external trust widget"
            body="The widget preview shows how GAFAIG trust can appear outside the platform. This is the strongest expression of GAFAIG as infrastructure, not just a website."
            href={`/widget-preview/${DEMO_REGISTRY_ID}`}
            cta="Open Widget Preview"
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT EACH STEP PROVES
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            GAFAIG is more than a registry page
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <BulletCard text="The registry page proves that a public certification record exists." />
            <BulletCard text="The verify page proves that the record is backed by signed proof." />
            <BulletCard text="The verify JSON proves that the trust record is machine-readable and portable." />
            <BulletCard text="The widget proves that trust can travel outside the GAFAIG website." />
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[18px] font-semibold tracking-tight text-black">
              The key distinction
            </div>
            <p className="mt-3 text-[15px] leading-[1.85] text-black/75">
              GAFAIG does not ask people to trust a claim. It provides a public
              record, a verification surface, and signed proof so the result can
              be checked independently.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT TO LOOK FOR
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            The trust signals that matter
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="Certification status"
              body="Check whether the record is presented as a finalized public trust outcome."
            />
            <FeatureCard
              title="Signature validation"
              body="Confirm that the signed payload validates against the published verification key."
            />
            <FeatureCard
              title="Portable trust surface"
              body="Confirm that the same trust result appears in the registry, verification endpoint, and widget."
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
            <Link
              href="/apply"
              className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Begin GAFAIG verification intake
            </Link>

            <PublicButtonLink
              href="/framework"
              variant="secondary"
              className="border-white text-white hover:bg-white/10"
            >
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
            can be reviewed, verified, and used across external environments.
          </p>

          <p className="mt-4 max-w-[980px] text-[15px] leading-[1.85] text-black/75">
            The demo is intentionally simple: open the record, verify the proof,
            inspect the payload, and see how the trust signal works outside the
            platform. That sequence is the product.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink
              href={`/registry/${DEMO_REGISTRY_ID}`}
              variant="primary"
            >
              Restart Demo
            </PublicButtonLink>

            <PublicButtonLink href="/framework" variant="secondary">
              Read the Framework
            </PublicButtonLink>

            <PublicButtonLink href="/mission" variant="secondary">
              Read the Mission
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