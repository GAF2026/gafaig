import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";
import { getLatestCertifiedRecord } from "@/lib/queries/explorer";

export const dynamic = "force-dynamic";

export default async function DemoPage() {
  const latest = await getLatestCertifiedRecord();
  const demoRegistryId = latest?.registryId ?? "";

  const registryHref = demoRegistryId ? `/registry/${demoRegistryId}` : "/registry";
  const verifyHref = demoRegistryId ? `/verify/${demoRegistryId}` : "/verify";
  const apiVerifyHref = demoRegistryId
    ? `/api/verify/${demoRegistryId}`
    : "/verify";
  const widgetPreviewHref = demoRegistryId
    ? `/widget-preview/${demoRegistryId}`
    : "/widget-preview";

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="DEMO"
          title="From AI governance claims to independently verifiable proof"
          description="GAFAIG converts AI governance from private claims into publication-controlled, independently verifiable public certification records. This demo shows the exact sequence from certification record to signed proof to portable trust surface."
          secondaryDescription="Certification is evaluated privately. Publication is explicit. Public verification uses the exact proof.messageString, signature, and GAFAIG public key."
          actions={
            <>
              <PublicButtonLink href={registryHref} variant="primary">
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

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Most AI governance claims cannot be independently verified
          </h2>

          <p className="mt-5 max-w-[960px] text-[15px] leading-7 text-black/75">
            Organizations can say they have human oversight, internal controls,
            and responsible AI policies. But for customers, regulators, partners,
            and the public, there is usually no consistent way to independently
            verify whether that governance outcome has been certified and
            published as a public trust record.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="What usually exists"
              body="A policy statement, internal documentation, or self-declared claim that governance controls are in place."
            />
            <StatementCard
              title="What GAFAIG proves"
              body="A publication-controlled public certification record backed by signed proof, a verification surface, and portable trust signals."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            THE DEMO WALKTHROUGH
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Follow one record from certification to proof
          </h2>

          <p className="mt-5 max-w-[960px] text-[15px] leading-7 text-black/75">
            This walkthrough uses a live GAFAIG record to show how trust moves
            through the public surface. Each step demonstrates a real part of the
            verification process that is already built and publicly accessible.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <StepCard
              number="1"
              title="Resolve certification record"
              body="Locate the published certification record in the public registry."
            />
            <StepCard
              number="2"
              title="Fetch signed proof"
              body="Retrieve the signed proof payload from the verification API."
            />
            <StepCard
              number="3"
              title="Validate signature"
              body="Confirm the record using the exact messageString and public key."
            />
            <StepCard
              number="4"
              title="Render trust surface"
              body="Display the verified result through a widget, badge, API, or UI."
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <DemoCard
            eyebrow="STEP 1"
            title="Resolve the public certification record"
            body="Start with the public certification record. This is the published outcome that external parties can review by registry ID."
            href={registryHref}
            cta="Open Certification Record"
          />

          <DemoCard
            eyebrow="STEP 2"
            title="Fetch the verification proof"
            body="Open the proof page to inspect the verification layer behind the certification record, including trust state, key references, and signature validation."
            href={verifyHref}
            cta="Open Proof Page"
          />
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <DemoCard
            eyebrow="STEP 3"
            title="Inspect the Proof JSON"
            body="The verification endpoint exposes machine-readable proof directly. This allows external systems to independently verify the record instead of relying on a visual page alone."
            href={apiVerifyHref}
            cta="Open Proof JSON"
          />

          <DemoCard
            eyebrow="STEP 4"
            title="Render the external trust surface"
            body="The widget preview shows how the same verified trust result can appear outside GAFAIG through a portable, embeddable interface."
            href={widgetPreviewHref}
            cta="Open Widget Preview"
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT EACH STEP PROVES
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            GAFAIG is deterministic public trust infrastructure, not just a registry page
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <BulletCard text="The certification record proves that a published public certification outcome exists." />
            <BulletCard text="The proof page proves that the public certification record is backed by signed proof." />
            <BulletCard text="The Proof JSON proves that the trust result is machine-readable and portable." />
            <BulletCard text="The widget proves that the same verified result can travel outside GAFAIG." />
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[18px] font-semibold tracking-tight text-black">
              The key distinction
            </div>
            <p className="mt-3 text-[15px] leading-7 text-black/75">
              GAFAIG does not ask the public to trust an internal claim. It
              publishes an independently verifiable public certification record
              backed by signed proof and external validation surfaces.
            </p>
            <p className="mt-3 text-[15px] leading-7 text-black/75">
              Verification must use the exact proof.messageString returned by
              the API. Reconstructing payloads from JSON fields invalidates the
              proof.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT TO LOOK FOR
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            The signals that confirm public proof
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="Public certification record"
              body="Confirm that the record is published in the registry and tied to a real registry ID."
            />
            <FeatureCard
              title="Signed verification proof"
              body="Confirm that the verification surface exposes signed proof, a signature, and a public key reference."
            />
            <FeatureCard
              title="Portable trust outcome"
              body="Confirm that the same result appears in the registry, API, proof page, widget, and external trust surfaces."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
            NEXT STEP
          </div>

          <h2 className="mt-3 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Ready to create a published certification record?
          </h2>

          <p className="mt-4 max-w-[860px] text-[15px] leading-7 text-black/75">
            You’ve seen how a GAFAIG record appears in the registry, how it is
            verified through signed proof, how it can be inspected through the
            public API, and how it can appear outside the platform through a
            widget. This is the public outcome of the GAFAIG certification and
            publication process.
          </p>

          <p className="mt-4 max-w-[860px] text-[15px] leading-7 text-black/75">
            If your organization operates AI systems and needs independently
            verifiable proof that governance has been certified and published as
            a public trust record, you can begin the GAFAIG intake process now.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/apply" variant="primary">
              Begin GAFAIG Intake
            </PublicButtonLink>

            <PublicButtonLink href="/framework" variant="secondary">
              Review Framework
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            THE RESULT
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            From governance claims to public proof
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
            GAFAIG replaces unverifiable governance claims with publicly
            verifiable proof.
          </p>

          <p className="mt-4 max-w-[980px] text-[15px] leading-7 text-black/75">
            Instead of asking the public to trust internal claims about
            governance, GAFAIG publishes a record that can be reviewed, verified,
            validated, and used across external environments.
          </p>

          <p className="mt-4 max-w-[980px] text-[15px] leading-7 text-black/75">
            The demo is intentionally simple: resolve the certification record,
            fetch the proof, validate the signature, and render the verified
            trust surface. That sequence is the product.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href={registryHref} variant="primary">
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
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {number}
      </div>
      <div className="mt-3 text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/70">{body}</p>
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

      <p className="mt-4 text-[15px] leading-7 text-black/75">{body}</p>

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
      <span className="text-[15px] leading-7 text-black/75">{text}</span>
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
      <p className="mt-3 text-[15px] leading-7 text-black/75">{body}</p>
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
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-7 text-black/75">{body}</p>
    </div>
  );
}