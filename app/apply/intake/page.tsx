import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ApplyIntakePage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="ENTERPRISE GOVERNANCE INTAKE"
          title="Begin structured GAFAIG enterprise intake"
          description="This intake pathway organizes the information GAFAIG needs to evaluate AI governance readiness, human oversight controls, governance evidence, and certification review posture."
          secondaryDescription="Submitting intake materials does not create a public registry listing. Certification is evaluated privately. Publication is explicit and optional after certification approval."
          actions={
            <>
              <PublicButtonLink href="/apply" variant="secondary">
                Back to Apply
              </PublicButtonLink>
              <PublicButtonLink href="/apply/review" variant="primary">
                Continue to Review
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionEyebrow>Intake pathway</SectionEyebrow>
          <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
            Deterministic intake stages
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            <StageCard number="1" title="Organization Identity" />
            <StageCard number="2" title="AI Governance Scope" />
            <StageCard number="3" title="Governance Controls" />
            <StageCard number="4" title="Evidence Readiness" />
            <StageCard number="5" title="Review Checkpoint" />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <IntakeCard
            label="Stage 1"
            title="Organization Identity"
            body="Provide the organization name, jurisdiction, governance lead, operating context, and AI deployment footprint so GAFAIG can establish the private intake profile."
          />

          <IntakeCard
            label="Stage 2"
            title="AI Governance Scope"
            body="Declare AI systems, deployment types, intended uses, risk domains, operating scale, and oversight posture connected to the organization’s governance environment."
          />

          <IntakeCard
            label="Stage 3"
            title="Governance Controls"
            body="Describe human oversight, escalation pathways, audit controls, review processes, accountability structures, and governance staffing."
          />

          <IntakeCard
            label="Stage 4"
            title="Evidence Readiness"
            body="Identify governance policies, audit materials, operational documents, attestations, and evidence artifacts that may support private certification review."
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionEyebrow>Review checkpoint</SectionEyebrow>
          <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
            Intake remains private until certification and publication
          </h2>

          <p className="mt-4 max-w-[900px] text-[15px] leading-7 text-black/75">
            GAFAIG intake is designed to structure private governance review.
            Public governance trust surfaces are created only after certification
            approval and explicit publication election.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/apply" variant="secondary">
              Back to Apply
            </PublicButtonLink>
            <PublicButtonLink href="/apply/review" variant="primary">
              Continue to Review
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

function StageCard({ number, title }: { number: string; title: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45">
        {number}
      </div>
      <div className="mt-3 text-[16px] font-semibold tracking-tight text-black">
        {title}
      </div>
    </div>
  );
}

function IntakeCard({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-8">
      <SectionEyebrow>{label}</SectionEyebrow>
      <h2 className="mt-4 text-[24px] font-semibold tracking-tight text-black">
        {title}
      </h2>
      <p className="mt-4 text-[15px] leading-7 text-black/75">{body}</p>
    </div>
  );
}