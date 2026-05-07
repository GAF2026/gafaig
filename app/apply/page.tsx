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
          description="GAFAIG certification is for organizations that want deterministic, independently verifiable AI governance outcomes. Verification is performed inside a controlled private review environment. Certification is evaluated privately. After certification is achieved, the organization may elect publication as a signed public certification record."
          secondaryDescription="The public registry is not the application system. Intake, evidence review, findings, deterministic scoring, governance review, and certification decisions occur inside the private GAFAIG verification engine. Only explicitly published certification outcomes become public trust records."
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
                body="Apply if AI systems influence products, services, infrastructure, internal workflows, governance operations, or material decisions."
              />
              <AudienceCard
                title="Teams responsible for oversight, compliance, or risk"
                body="Apply if your organization needs a structured verification process for responsible AI governance, oversight controls, human review, and operational accountability."
              />
              <AudienceCard
                title="Companies preparing for external scrutiny"
                body="Apply if customers, regulators, partners, investors, or the public may need independently verifiable proof that AI governance outcomes have been certified and published."
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
                title="Private certification outcome"
                body="A formal GAFAIG certification outcome supported by structured review, findings, evidence, deterministic scoring, and Snowflake-originated governance execution."
              />
              <ChecklistCard
                title="Optional public certification record"
                body="A canonical public certification record may be published only after certification is achieved and the organization explicitly elects publication."
              />
              <ChecklistCard
                title="Independent verification endpoint"
                body="A signed public proof surface that can be validated outside GAFAIG using the exact proof.messageString, signature, and public key."
              />
              <ChecklistCard
                title="Portable trust surfaces"
                body="Widget, badge, SDK, and API trust surfaces allow a published certification outcome to travel across the web."
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
            application initiates a structured private verification workflow that
            can lead to a certification outcome and, if publication is elected,
            a signed public certification record.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <PathCard
              number="1"
              title="Application received"
              body="Your submission is recorded and routed into the GAFAIG intake workflow."
            />
            <PathCard
              number="2"
              title="Private verification process"
              body="GAFAIG evaluates governance, evidence, controls, and human oversight structures in a private review environment."
            />
            <PathCard
              number="3"
              title="Optional public trust record"
              body="Certified outcomes may be published as independently verifiable public certification records only if publication is elected."
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
            Certification is private. Publication is explicit. A public registry
            listing occurs only after certification is achieved and the
            organization elects publication.
          </p>

          <p className="mt-4 max-w-[900px] text-[15px] leading-7 text-black/68">
            You do not need complete documentation to begin. GAFAIG intake is
            designed to structure the verification process from your current
            governance state.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 text-[12px] text-black/60">
            <span>• Structured verification process</span>
            <span>• Private governance evaluation</span>
            <span>• Optional public proof after certification</span>
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
              This submission initiates a GAFAIG verification workflow. No
              certification is granted without full evaluation. Nothing is
              published publicly by submitting this form.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="rounded-2xl border border-black/10 bg-white p-6">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                What happens after you submit
              </div>

              <div className="mt-4 grid gap-3 text-[14px] text-black/75">
                <div>• A GAFAIG intake record is created</div>
                <div>• Your submission is reviewed in a private verification environment</div>
                <div>• You are contacted to continue the structured verification process</div>
                <div>• Certification is only granted after full evaluation</div>
                <div>• Public publication occurs only if the organization elects publication</div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                Important
              </div>

              <p className="mt-3 text-[14px] leading-7 text-black/70">
                Submitting this form does not publish anything publicly.
                Certification is evaluated privately. Public registry listing
                occurs only if the organization chooses to publish the certified
                record.
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
                body="Governance documents, operational controls, accountability structures, and oversight mechanisms."
              />
              <ChecklistCard
                title="Evidence and findings"
                body="Artifacts that support oversight claims and findings that can be evaluated through deterministic governance workflows."
              />
              <ChecklistCard
                title="Certification decision readiness"
                body="Sufficient inputs to support deterministic scoring, review, and a formal private certification outcome."
              />
            </div>
          </div>

          <div className="rounded-3xl border border-black/10 bg-white p-8">
            <SectionEyebrow>Public vs private</SectionEyebrow>
            <h2 className="mt-4 max-w-[760px] text-[26px] font-semibold tracking-tight text-black">
              What stays private and what can become public
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
                  "Canonical public certification record",
                  "Signed verification proof",
                  "Public verification endpoint",
                  "Badge, widget, SDK, and portable trust signals",
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
            Certification can become a public proof layer
          </h2>

          <p className="mt-4 max-w-[860px] text-[15px] leading-7 text-black/75">
            Organizations that complete the GAFAIG verification process receive
            more than an internal review outcome. If publication is elected, the
            certified outcome becomes a public certification record, signed
            verification proof, portable trust surface, and canonical registry
            presence that external parties can independently validate.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <InfoCard
              label="Public record"
              value="Optional"
              body="Canonical published certification record if publication is elected."
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
            Published outcomes are externally verifiable
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              label="Registry"
              value="Public record"
              body="A canonical public certification record may be published to GAFAIG."
            />
            <InfoCard
              label="Verification"
              value="Signed proof"
              body="Third parties can independently validate published certification."
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
            GAFAIG’s live demo and public trust surfaces show the type of
            outcome the certification process can produce after publication.
            Start there, then review the framework and trust interfaces before
            entering the verification workflow.
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
              body="Review the deterministic model behind evidence, scoring, certification, and publication."
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

function AudienceCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-6">
      <div className="text-[20px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-7 text-black/70">{body}</p>
    </div>
  );
}

function ChecklistCard({ title, body }: { title: string; body: string }) {
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