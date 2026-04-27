import PublicButtonLink from "../_components/PublicButtonLink";
import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-dynamic";

export default function CertificationPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="CERTIFICATION"
          title="Become independently verifiable"
          description="GAFAIG certification verifies whether AI governance processes and meaningful human oversight are implemented, operational, and producing real oversight outcomes."
          secondaryDescription="Certification is evidence-based, scope-defined, and published as a public trust record only when the verified outcome meets GAFAIG requirements. Private evidence, reviewer materials, and internal workflows remain protected."
          actions={
            <>
              <PublicButtonLink href="/certification/apply" variant="primary">
                Apply for Certification
              </PublicButtonLink>
              <PublicButtonLink href="/demo" variant="secondary">
                View Demo
              </PublicButtonLink>
              <PublicButtonLink href="/framework" variant="secondary">
                Review Framework
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="WHAT CERTIFICATION MEANS"
            title="GAFAIG verifies governance execution, not governance claims"
            body="Frameworks describe how AI governance should operate. GAFAIG verifies whether those governance processes are actually implemented, operational, and producing real oversight outcomes in practice."
          />

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Before certification"
              body="An organization may have policies, internal controls, responsible AI statements, or governance documentation, but external stakeholders cannot independently verify whether those processes are functioning."
            />
            <StatementCard
              title="After certification"
              body="GAFAIG publishes a certified public trust record backed by signed proof, lifecycle status, verification endpoints, and portable trust surfaces."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="CERTIFICATION SCOPE"
            title="What GAFAIG evaluates"
            body="Certification focuses on the real-world operation of governance processes across the AI system lifecycle. The review is scoped, evidence-based, and tied to a specific organization, system, program, or governance boundary."
          />

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StepCard
              number="1"
              title="Govern"
              body="Accountability structures, oversight roles, escalation paths, decision authority, and governance ownership."
            />
            <StepCard
              number="2"
              title="Map"
              body="Documented AI system purpose, deployment context, affected parties, data use, and human decision points."
            />
            <StepCard
              number="3"
              title="Measure"
              body="Evidence of evaluation, monitoring, testing, risk assessment, performance review, and oversight checks."
            />
            <StepCard
              number="4"
              title="Manage"
              body="Mitigation actions, incident response, lifecycle controls, renewal readiness, and continuous governance operation."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="CERTIFICATION LIFECYCLE"
            title="From application to public proof"
            body="GAFAIG certification follows a structured lifecycle that separates private review from public trust publication."
          />

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <LifecycleCard
              title="1. Application and scope definition"
              body="The organization identifies the AI system, governance program, or certification boundary to be reviewed."
            />
            <LifecycleCard
              title="2. Evidence and process review"
              body="GAFAIG reviews governance materials, oversight processes, controls, monitoring evidence, and related operational records."
            />
            <LifecycleCard
              title="3. Certification decision"
              body="A certification outcome is determined through the GAFAIG verification process. Certification logic is not computed in the UI."
            />
            <LifecycleCard
              title="4. Public registry publication"
              body="If certified, the outcome is published as a public trust record with signed proof and verification surfaces."
            />
            <LifecycleCard
              title="5. Ongoing monitoring"
              body="Certification status may change based on renewal outcomes, new information, incidents, or governance changes."
            />
            <LifecycleCard
              title="6. Renewal or status change"
              body="Certified records may renew, expire, suspend, or revoke according to GAFAIG lifecycle and policy rules."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-black p-8 text-white">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-white/55">
            PUBLIC TRUST MODEL
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-white">
            Certification creates a public trust record, not public exposure of private evidence
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-white/72">
            GAFAIG is designed so organizations can prove certified AI governance without exposing internal systems, reviewer materials, raw evidence, scoring details, or private workflow records.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <DarkCard
              title="Private review"
              body="Evidence, findings, reviewer materials, internal workflow, and supporting governance records remain controlled inside the verification process."
            />
            <DarkCard
              title="Public proof"
              body="The public layer exposes the certification outcome, registry record, lifecycle state, signed proof, and verification surfaces."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="WHAT BECOMES PUBLIC"
            title="Certification outcomes are independently verifiable"
            body="A certified GAFAIG record can be verified through the registry, verify page, API, SDK, widget, badge, and modal surfaces."
          />

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <BulletCard text="Public registry record showing the certified outcome and lifecycle status." />
            <BulletCard text="Signed verification proof generated from the canonical public record." />
            <BulletCard text="Verification endpoint exposing proof.messageString, signature, key ID, and public key reference." />
            <BulletCard text="Portable trust surfaces that can be displayed outside GAFAIG through SDK, widget, badge, and modal integrations." />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="APPLICABLE STANDARDS"
            title="Standards guide the review; verification proves the outcome"
            body="GAFAIG certification assessments may reference published standards, disclosure thresholds, certification policies, and governance requirements."
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/standards/s-001" variant="secondary">
              GAFAIG-S-001
            </PublicButtonLink>
            <PublicButtonLink href="/standards/s-002" variant="secondary">
              GAFAIG-S-002
            </PublicButtonLink>
            <PublicButtonLink href="/policy/master-terms" variant="secondary">
              Master Terms
            </PublicButtonLink>
            <PublicButtonLink
              href="/policy/revocation-suspension"
              variant="secondary"
            >
              Revocation & Suspension
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <SectionHeading
            eyebrow="NEXT STEP"
            title="Start the GAFAIG certification process"
            body="Organizations seeking certification should begin by defining the certification scope and reviewing the applicable standards, policies, and certification pathway."
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink href="/certification/apply" variant="primary">
              Apply for Certification
            </PublicButtonLink>
            <PublicButtonLink href="/certification/renewal" variant="secondary">
              Renewal & Fast-Track
            </PublicButtonLink>
            <PublicButtonLink href="/developers" variant="secondary">
              Developer Integration
            </PublicButtonLink>
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
        {eyebrow}
      </div>
      <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
        {title}
      </h2>
      <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
        {body}
      </p>
    </div>
  );
}

function StatementCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-7 text-black/75">{body}</p>
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

function LifecycleCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-7 text-black/75">{body}</p>
    </div>
  );
}

function DarkCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-white">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-7 text-white/70">{body}</p>
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