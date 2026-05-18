import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ApplyReviewPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="GOVERNANCE INTAKE REVIEW"
          title="Review the intake posture before private GAFAIG verification"
          description="This review checkpoint explains how enterprise intake moves into private governance evaluation, evidence review, deterministic scoring, and certification decisioning."
          secondaryDescription="Submitting intake does not publish anything publicly. Certification remains private unless the organization later elects publication after certification approval."
          actions={
            <>
              <PublicButtonLink href="/apply/intake" variant="secondary">
                Back to Intake
              </PublicButtonLink>
              <PublicButtonLink href="/apply/success" variant="primary">
                Submit Intake
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionEyebrow>Current stage</SectionEyebrow>
          <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
            Review checkpoint
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            <StageCard number="1" title="Organization Identity" />
            <StageCard number="2" title="AI Governance Scope" />
            <StageCard number="3" title="Governance Controls" />
            <StageCard number="4" title="Evidence Readiness" />
            <StageCard number="5" title="Review Checkpoint" active />
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <ReviewCard
            label="Private verification"
            title="GAFAIG review occurs inside the private verification engine"
            body="Intake materials are used to structure private governance review. Evidence, findings, reviewer materials, scoring inputs, and operational workflow state remain private."
          />

          <ReviewCard
            label="Deterministic review"
            title="Certification requires full evaluation"
            body="Certification is not granted by submitting intake. GAFAIG evaluates governance controls, evidence posture, oversight structures, and review readiness before a certification outcome is reached."
          />

          <ReviewCard
            label="Publication separation"
            title="Publication is optional and explicit"
            body="A public certification surface is created only after certification approval and explicit publication election. Intake submission does not create a public registry listing."
          />

          <ReviewCard
            label="Operational continuation"
            title="Review may require follow-up materials"
            body="GAFAIG may request additional governance documents, attestations, system details, evidence references, or operational context before certification review can proceed."
          />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionEyebrow>Governance attestation</SectionEyebrow>
          <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
            Intake should reflect materially accurate governance information
          </h2>

          <p className="mt-4 max-w-[900px] text-[15px] leading-7 text-black/75">
            By proceeding, the organization confirms that the intake materials
            are intended to support private GAFAIG governance review. Additional
            evidence, documents, and attestations may be requested before
            certification evaluation can be completed.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoCard
              title="No public publication"
              body="Submitting intake does not publish an organization, system, certification surface, or registry record."
            />
            <InfoCard
              title="No automatic certification"
              body="Certification requires private review, evidence evaluation, governance findings, and deterministic decisioning."
            />
            <InfoCard
              title="Publication remains separate"
              body="Public listing occurs only after certification approval and explicit publication election."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionEyebrow>Next operational steps</SectionEyebrow>
          <h2 className="mt-4 text-[26px] font-semibold tracking-tight text-black">
            Intake moves into private governance workflow continuation
          </h2>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <PathCard
              number="1"
              title="Intake received"
              body="GAFAIG records the intake posture for private review."
            />
            <PathCard
              number="2"
              title="Review scoped"
              body="Governance scope, systems, controls, and evidence readiness are evaluated."
            />
            <PathCard
              number="3"
              title="Follow-up requested"
              body="Additional documents, attestations, or evidence references may be requested."
            />
            <PathCard
              number="4"
              title="Certification pathway"
              body="A certification outcome may be reached only after private verification review."
            />
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <PublicButtonLink href="/apply/intake" variant="secondary">
              Back to Intake
            </PublicButtonLink>
            <PublicButtonLink href="/apply/success" variant="primary">
              Submit Intake
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

function StageCard({
  number,
  title,
  active = false,
}: {
  number: string;
  title: string;
  active?: boolean;
}) {
  return (
    <div
      className={
        active
          ? "rounded-2xl border border-black bg-black p-5 text-white"
          : "rounded-2xl border border-black/10 bg-black/[0.02] p-5 text-black"
      }
    >
      <div
        className={
          active
            ? "text-[11px] font-semibold uppercase tracking-[0.24em] text-white/65"
            : "text-[11px] font-semibold uppercase tracking-[0.24em] text-black/45"
        }
      >
        {number}
      </div>
      <div className="mt-3 text-[16px] font-semibold tracking-tight">
        {title}
      </div>
    </div>
  );
}

function ReviewCard({
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

function InfoCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/70">{body}</p>
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