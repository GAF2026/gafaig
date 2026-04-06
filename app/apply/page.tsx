import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ApplyPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <div className="space-y-12">
        <PublicPageHero
          eyebrow="Apply"
          title="Apply for independent verification of human oversight in AI"
          description="GAFAIG certification is for organizations that want credible, third-party proof that meaningful human oversight exists across their AI operations. Certification is performed inside a controlled private verification environment and published as a verifiable public trust record."
          secondaryDescription="The public registry is not the application system. Intake, evidence review, findings, deterministic scoring, and certification decisions all occur inside the private verification engine. Only certification outcomes and public trust surfaces are published."
          actions={
            <>
              <PublicButtonLink href="/demo" variant="primary">
                Start with the Demo
              </PublicButtonLink>
              <PublicButtonLink href="/framework" variant="secondary">
                Review the Framework
              </PublicButtonLink>
              <PublicButtonLink href="/developers" variant="secondary">
                Explore Integrations
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-[32px] border border-black/10 bg-black p-8 text-white">
          <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/55">
            What you receive
          </div>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Certification becomes a public proof layer
          </h2>

          <p className="mt-4 max-w-[860px] text-[16px] leading-[1.85] text-white/78">
            Organizations that complete the GAFAIG process receive more than an
            internal review outcome. They receive a public certification record,
            signed verification proof, portable trust surfaces, and a canonical
            registry presence that external parties can independently validate.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <DarkMetricCard
              label="Public record"
              value="Registry entry"
              body="Canonical published certification record."
            />
            <DarkMetricCard
              label="Signed proof"
              value="Ed25519"
              body="Independent cryptographic verification."
            />
            <DarkMetricCard
              label="Trust surfaces"
              value="Badge · Widget"
              body="Portable certification display across the web."
            />
            <DarkMetricCard
              label="API verification"
              value="/api/verify"
              body="Programmatic validation of certification state."
            />
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-black/10 bg-white p-10">
            <SectionEyebrow>Who should apply</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
              Organizations seeking provable governance
            </h2>

            <div className="mt-8 grid gap-4">
              <AudienceCard
                title="AI companies"
                body="Organizations building or deploying AI products that want to show that human oversight is operational, not merely stated."
              />
              <AudienceCard
                title="Enterprises using AI internally"
                body="Teams introducing AI into real workflows and seeking an independently verifiable governance signal for customers, partners, or leadership."
              />
              <AudienceCard
                title="Platforms serving regulated or high-trust markets"
                body="Organizations that need a public proof layer for oversight, certification status, and trust distribution."
              />
            </div>
          </div>

          <div className="rounded-[32px] border border-black/10 bg-white p-10">
            <SectionEyebrow>Application readiness</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
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
        </section>

        <section className="rounded-[32px] border border-black/10 bg-white p-10">
          <SectionEyebrow>How the application process works</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
            From intake to verifiable publication
          </h2>

          <p className="mt-4 max-w-[920px] text-[16px] leading-[1.9] text-black/70">
            GAFAIG operates through a controlled verification workflow. Public
            publication happens only after the private review process produces a
            formal certification outcome.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            <PathCard
              number="1"
              title="Intake"
              body="Organization enters the verification process."
            />
            <PathCard
              number="2"
              title="Evidence review"
              body="Governance materials and oversight artifacts are assessed."
            />
            <PathCard
              number="3"
              title="Findings + scoring"
              body="Inputs are translated into deterministic scoring outputs."
            />
            <PathCard
              number="4"
              title="Decision"
              body="GAFAIG records the formal certification decision."
            />
            <PathCard
              number="5"
              title="Publication"
              body="A public trust record is issued with proof, badge, and verification interfaces."
            />
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[32px] border border-black/10 bg-white p-10">
            <SectionEyebrow>Public vs private</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
              What remains private
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
            </div>
          </div>

          <div className="rounded-[32px] border border-black/10 bg-white p-10">
            <SectionEyebrow>Public trust layer</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
              What becomes public
            </h2>

            <div className="mt-8 grid gap-4">
              <BoundaryCard
                title="Published trust surfaces"
                points={[
                  "Canonical registry record",
                  "Signed verification proof",
                  "Public verification endpoint",
                  "Badge, widget, and portable trust signals",
                ]}
              />
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-black/10 bg-white p-10">
          <SectionEyebrow>What happens after certification</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
            Your outcome is externally verifiable
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard
              label="Registry"
              value="Public record"
              body="A canonical trust record is published to GAFAIG."
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

        <section className="rounded-[32px] border border-black/10 bg-white p-10">
          <SectionEyebrow>How to begin</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-black">
            Start with the current GAFAIG experience
          </h2>

          <p className="mt-4 max-w-[860px] text-[16px] leading-[1.85] text-black/70">
            GAFAIG’s live demo and public trust surfaces show the exact kind of
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

        <section className="rounded-[32px] bg-black p-10 text-white">
          <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/55">
            Next step
          </div>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Begin the GAFAIG certification journey
          </h2>

          <p className="mt-4 max-w-[760px] text-[16px] leading-[1.85] text-white/80">
            Start by reviewing the mission, framework, and live trust surfaces.
            Then move into the demonstration pathway that shows how GAFAIG
            certification is experienced publicly.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/demo" variant="secondary" className="border-white text-white hover:bg-white/10">
              Start with the Demo
            </PublicButtonLink>

            <PublicButtonLink href="/framework" variant="secondary" className="border-white text-white hover:bg-white/10">
              Review Framework
            </PublicButtonLink>

            <PublicButtonLink href="/mission" variant="secondary" className="border-white text-white hover:bg-white/10">
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

function DarkMetricCard({
  label,
  value,
  body,
}: {
  label: string;
  value: string;
  body: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/50">
        {label}
      </div>
      <div className="mt-3 break-words text-[20px] font-semibold tracking-tight text-white">
        {value}
      </div>
      <p className="mt-3 text-sm leading-7 text-white/70">{body}</p>
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
    <div className="rounded-[24px] border border-black/10 bg-black/[0.02] p-6">
      <div className="text-[20px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/70">{body}</p>
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
    <div className="rounded-[24px] border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-2 text-[15px] leading-[1.75] text-black/70">{body}</p>
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
    <div className="rounded-[24px] border border-black/10 bg-black/[0.02] p-5">
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
    <div className="rounded-[24px] border border-black/10 bg-white p-6">
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