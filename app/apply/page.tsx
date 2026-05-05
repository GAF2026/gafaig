import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import ApplyForm from "./ApplyForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ApplyPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="APPLY"
          title="Start the process that turns AI governance into verifiable proof"
          description="GAFAIG certification is for organizations that want credible, third-party proof that meaningful human oversight is actually functioning across their AI operations. Verification is performed inside a controlled private review environment and, if certified, published as an independently verifiable public trust record."
          secondaryDescription="The public registry is not the application system. Intake, evidence review, findings, deterministic scoring, and certification decisions occur inside the private GAFAIG verification engine. Only public certification outcomes and trust surfaces are published."
          actions={
            <>
              <PublicButtonLink href="/demo" variant="primary">
                Start with the Demo
              </PublicButtonLink>
              <PublicButtonLink href="/framework" variant="secondary">
                Review the Framework
              </PublicButtonLink>
              <PublicButtonLink href="/registry" variant="secondary">
                View Public Records
              </PublicButtonLink>
            </>
          }
        />

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white p-8">
            <SectionEyebrow>Who should apply</SectionEyebrow>
            <h2 className="mt-4 max-w-[760px] text-[26px] font-semibold tracking-tight text-black">
              Teams that need credible external proof
            </h2>

            <div className="mt-8 grid gap-4">
              <AudienceCard
                title="Organizations deploying AI systems in production"
                body="Apply if AI systems are influencing products, services, infrastructure, internal workflows, or operational decisions."
              />
              <AudienceCard
                title="Teams responsible for oversight, compliance, or risk"
                body="Apply if your organization needs an external verification process for responsible use, governance controls, and human review structures."
              />
              <AudienceCard
                title="Companies preparing for scrutiny"
                body="Apply if customers, regulators, partners, investors, or the public may need independently verifiable proof that human oversight in AI systems is functioning."
              />
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-8">
            <SectionEyebrow>What you receive</SectionEyebrow>
            <h2 className="mt-4 max-w-[760px] text-[26px] font-semibold tracking-tight text-black">
              A public proof layer, not just an internal review
            </h2>

            <div className="mt-8 grid gap-4">
              <ChecklistCard
                title="Verified certification outcome"
                body="A formal GAFAIG certification decision supported by structured review, findings, and deterministic scoring."
              />
              <ChecklistCard
                title="Public trust record"
                body="A canonical public trust record that can be reviewed and independently verified after certification and publication."
              />
              <ChecklistCard
                title="Independent verification endpoint"
                body="A signed public proof surface that can be validated outside the originating organization’s platform."
              />
              <ChecklistCard
                title="Portable trust surfaces"
                body="Widget, badge, and API trust surfaces that allow your certified outcome to travel across the web."
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionEyebrow>What happens next</SectionEyebrow>
          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            From application to certified public record
          </h2>

          <p className="mt-4 max-w-[920px] text-[15px] leading-7 text-black/75">
            GAFAIG does not treat this as a generic contact form. Submitting an
            application initiates a structured verification workflow that can
            lead to a published, independently verifiable public trust record.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <PathCard
              number="1"
              title="Application received"
              body="Your submission is recorded and assigned a verification case."
            />
            <PathCard
              number="2"
              title="Verification process"
              body="GAFAIG evaluates governance, evidence, and human oversight controls."
            />
            <PathCard
              number="3"
              title="Public trust record"
              body="Certified outcomes are published as independently verifiable public trust records."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionEyebrow>Submit application</SectionEyebrow>
          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Begin the process that can produce a certified public proof record
          </h2>

          <p className="mt-4 max-w-[900px] text-[15px] leading-7 text-black/75">
            Submit your organization details to begin the GAFAIG verification
            process. This creates an intake record for private review and routes
            your application into the verification workflow. Applying does not
            place your organization in the public registry.
          </p>
          <p className="mt-3 max-w-[900px] text-[15px] leading-7 text-black/70">
            This is the only entry point into the GAFAIG verification workflow that can result in a publicly verifiable certification record.
          </p>
          <p className="mt-4 max-w-[900px] text-[15px] leading-7 text-black/68">
            You do not need complete documentation to begin. GAFAIG intake is
            designed to structure the verification process from your current
            state.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-[12px] text-black/60">
            <span>• Structured verification process</span>
            <span>• Independent evaluation</span>
            <span>• Public trust record upon certification</span>
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
              Before you submit
            </div>
            <p className="mt-3 text-[14px] leading-7 text-black/72">
              Takes about 2 minutes to begin. Full verification happens after
              intake.
            </p>
            <p className="mt-2 text-[13px] leading-6 text-black/60">
              This submission initiates a GAFAIG verification case. No
              certification is granted without full evaluation.
            </p>
          </div>

          <div className="mt-8 space-y-6">

            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                What happens after you submit
              </div>

              <div className="mt-4 grid gap-3 text-[14px] text-black/75">
                <div>• A GAFAIG verification case is created</div>
                <div>• Your submission is reviewed in a private verification environment</div>
                <div>• You are contacted to continue the structured verification process</div>
                <div>• Certification is only granted after full evaluation</div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                Important
              </div>

              <p className="mt-3 text-[14px] leading-7 text-black/70">
                Submitting this form does not publish anything publicly. Certification is evaluated privately. Public registry listing occurs only if the organization chooses to publish the certified record.
              </p>
            </div>

            <div className="mt-4">
              <ApplyForm />
            </div>

          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-3xl border border-black/10 bg-white p-8">
            <SectionEyebrow>Application readiness</SectionEyebrow>
            <h2 className="mt-4 max-w-[760px] text-[26px] font-semibold tracking-tight text-black">
              What GAFAIG evaluates
            </h2>

            <div className="mt-6 space-y-4">
              <ChecklistCard
                title="Oversight model"
                body="How humans review, intervene, escalate, or control material AI outcomes."
              />
              <ChecklistCard
                title="Policies and controls"
                body="Governance documents, operational controls, and accountability structures."
              />
              <ChecklistCard
                title="Evidence and findings"
                body="Artifacts that support oversight claims and findings that can be scored deterministically."
              />
              <ChecklistCard
                title="Certification decision readiness"
                body="Sufficient inputs to support deterministic scoring and a formal certification outcome."
              />
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-8">
            <SectionEyebrow>Public vs private</SectionEyebrow>
            <h2 className="mt-4 max-w-[760px] text-[26px] font-semibold tracking-tight text-black">
              What stays private and what becomes public
            </h2>

            <div className="mt-8 grid gap-4">
              <BoundaryCard
                title="Private verification engine"
                points={[
                  "Structured intake and case creation",
                  "Evidence and finding review",
                  "Reviewer workflow and internal assessment materials",
                  "Deterministic scoring inputs before publication",
                ]}
              />

              <BoundaryCard
                title="Published trust surfaces"
                points={[
                  "Canonical public trust record",
                  "Signed verification proof",
                  "Public verification endpoint",
                  "Badge, widget, and portable trust signals",
                ]}
              />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
            What you receive
          </div>

          <h2 className="mt-3 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Certification becomes a public proof layer
          </h2>

          <p className="mt-4 max-w-[860px] text-[15px] leading-7 text-black/75">
            Organizations that complete the GAFAIG verification process receive
            more than an internal review outcome. They receive a public
            certification record, signed verification proof, portable trust
            surfaces, and a canonical registry presence that external parties
            can independently validate.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <InfoCard
              label="Public record"
              value="Registry entry"
              body="Canonical published certification record."
            />
            <InfoCard
              label="Signed proof"
              value="Ed25519"
              body="Independent cryptographic verification."
            />
            <InfoCard
              label="Trust surfaces"
              value="Badge · Widget"
              body="Portable certification display across the web."
            />
            <InfoCard
              label="API verification"
              value="/api/verify"
              body="Programmatic validation of certification state."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionEyebrow>What happens after certification</SectionEyebrow>
          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Your outcome is externally verifiable
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              label="Registry"
              value="Public record"
              body="A canonical public trust record is published to GAFAIG."
            />
            <InfoCard
              label="Verification"
              value="Signed proof"
              body="Third parties can independently validate certification."
            />
            <InfoCard
              label="Distribution"
              value="Badge + widget"
              body="Certification can be surfaced across websites and products."
            />
            <InfoCard
              label="Developers"
              value="API + SDK"
              body="Teams can verify certification programmatically."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionEyebrow>How to begin</SectionEyebrow>
          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Start with the current GAFAIG experience
          </h2>

          <p className="mt-4 max-w-[860px] text-[15px] leading-7 text-black/70">
            GAFAIG’s live demo and public trust surfaces prove the exact kind of
            outcome the certification process produces. Start there, then review
            the framework and trust interfaces before entering the verification
            workflow.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="Demo"
              body="Walk through the current live GAFAIG trust experience."
              href="/demo"
              cta="Open Demo"
            />
            <FeatureCard
              title="Framework"
              body="Review the deterministic model behind evidence, scoring, and certification."
              href="/framework"
              cta="Read Framework"
            />
            <FeatureCard
              title="Developers"
              body="See the verification API, signed proof model, badge, widget, and SDK."
              href="/developers"
              cta="Open Developers"
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
            Next step
          </div>

          <h2 className="mt-3 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Begin the GAFAIG certification journey
          </h2>

          <p className="mt-4 max-w-[760px] text-[15px] leading-7 text-black/75">
            Start by reviewing the mission, framework, and live trust surfaces.
            Then enter the private verification intake process to begin formal
            GAFAIG review.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/demo" variant="secondary">
              Start with the Demo
            </PublicButtonLink>

            <PublicButtonLink href="/framework" variant="secondary">
              Review Framework
            </PublicButtonLink>

            <PublicButtonLink href="/mission" variant="secondary">
              Read Mission
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

function AudienceCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6">
      <div className="text-[20px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-7 text-black/70">{body}</p>
    </div>
  );
}

function ChecklistCard({
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
      <p className="mt-2 text-[15px] leading-7 text-black/70">{body}</p>
    </div>
  );
}

function PathCard({
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
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
        {number}
      </div>
      <div className="mt-3 text-[18px] font-semibold tracking-tight text-black">
        {title}
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
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6">
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
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
        {label}
      </div>
      <div className="mt-3 text-[18px] font-semibold tracking-tight text-black">
        {value}
      </div>
      <p className="mt-2 text-sm leading-7 text-black/68">{body}</p>
    </div>
  );
}

function FeatureCard({
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
      <p className="mt-3 text-[15px] leading-7 text-black/70">{body}</p>
      <div className="mt-5">
        <PublicButtonLink href={href} variant="ghost" size="sm">
          {cta} →
        </PublicButtonLink>
      </div>
    </div>
  );
}