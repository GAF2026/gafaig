import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";
import PublicButtonLink from "../_components/PublicButtonLink";

export const dynamic = "force-dynamic";

const DEMO_CASE_ID = "CASE-0001";
const DEMO_REGISTRY_ID = "GAFAIG-4ce7c7a28d1b4894a5d2c23050875e29";

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="DEMO"
        title="See how GAFAIG works in practice"
        description="GAFAIG turns private governance review into public certification that others can verify."
        secondaryDescription="This demo follows a real case from internal review through certification, publication, and public verification."
        actions={
          <>
            <PublicButtonLink href="/admin/login" variant="primary">
              Start the demo
            </PublicButtonLink>

            <PublicButtonLink
              href={`/admin/verification/${DEMO_CASE_ID}/findings`}
              variant="secondary"
            >
              Open CASE-0001
            </PublicButtonLink>

            <PublicButtonLink href={`/registry/${DEMO_REGISTRY_ID}`} variant="secondary">
              View live certification
            </PublicButtonLink>
          </>
        }
      />

      {/* LIVE SYSTEM BANNER */}
      <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] px-5 py-4 text-[14px] font-medium text-black/75">
        This is a live system — not a simulation.
      </div>

      {/* VALUE GRID */}
      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <ValueCard
          label="What GAFAIG proves"
          title="Governance can be verified"
          body="GAFAIG shows whether human oversight is actually functioning across AI systems."
        />
        <ValueCard
          label="How it works"
          title="Private review first"
          body="Assessment happens in a controlled workflow before anything becomes public."
        />
        <ValueCard
          label="Why it matters"
          title="Public trust record"
          body="Certification becomes a durable record that others can inspect and verify."
        />
        <ValueCard
          label="What you will see"
          title="Case to certification"
          body="This walkthrough follows one case through the full GAFAIG pipeline."
        />
      </section>

      {/* DEMO NARRATIVE */}
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          DEMO NARRATIVE
        </div>

        <h2 className="mt-4 text-[32px] font-semibold tracking-tight text-black md:text-[38px]">
          The story this demo tells
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <NarrativeCard
            title="1. Private review"
            body="Governance evaluation begins inside a controlled reviewer workflow."
          />
          <NarrativeCard
            title="2. Deterministic certification"
            body="Evidence, findings, and scoring produce a structured outcome."
          />
          <NarrativeCard
            title="3. Public verification"
            body="The certification is published as a verifiable public record."
          />
        </div>
      </section>

      {/* GUIDED FLOW */}
      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          GUIDED FLOW
        </div>

        <h2 className="mt-4 text-[32px] font-semibold tracking-tight text-black md:text-[38px]">
          Walk through CASE-0001
        </h2>

        <div className="mt-8 grid gap-4">
          <GuidedStep
            step="1"
            title="Open findings"
            body="Start in the reviewer workflow."
            href={`/admin/verification/${DEMO_CASE_ID}/findings`}
          />
          <GuidedStep
            step="2"
            title="Inspect evidence"
            body="View supporting governance materials."
            href={`/admin/verification/${DEMO_CASE_ID}/evidence`}
          />
          <GuidedStep
            step="3"
            title="View score"
            body="See the certification outcome."
            href={`/admin/verification/${DEMO_CASE_ID}/score`}
          />
          <GuidedStep
            step="4"
            title="Registry record"
            body="Open the public certification."
            href={`/registry/${DEMO_REGISTRY_ID}`}
          />
          <GuidedStep
            step="5"
            title="Verification"
            body="Validate the certification."
            href={`/verify/${DEMO_REGISTRY_ID}`}
          />
        </div>
      </section>

      {/* WHAT IT MEANS */}
      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[28px] font-semibold text-black">
            What a GAFAIG certification means
          </h2>

          <div className="mt-6 grid gap-4">
            <InsightCard
              label="Verified governance"
              body="Controls were evaluated through a structured review process."
            />
            <InsightCard
              label="Private → public"
              body="Assessment stays private, outcomes become public certification."
            />
            <InsightCard
              label="Independent verification"
              body="Each certification includes a verifiable payload."
            />
            <InsightCard
              label="Trust infrastructure"
              body="GAFAIG creates persistent, verifiable governance records."
            />
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[28px] font-semibold text-black">
            Demo identifiers
          </h2>

          <div className="mt-6 grid gap-3">
            <Info label="Case ID" value={DEMO_CASE_ID} />
            <Info label="Registry ID" value={DEMO_REGISTRY_ID} />
            <Info label="Outcome" value="Certified · Band A · Score 100" />
          </div>
        </div>
      </section>
    </main>
  );
}

/* COMPONENTS */

function ValueCard({ label, title, body }: any) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-xs uppercase text-black/50">{label}</div>
      <div className="mt-2 font-semibold">{title}</div>
      <p className="mt-2 text-sm text-black/70">{body}</p>
    </div>
  );
}

function NarrativeCard({ title, body }: any) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="font-semibold">{title}</div>
      <p className="mt-2 text-sm text-black/70">{body}</p>
    </div>
  );
}

function GuidedStep({ step, title, body, href }: any) {
  return (
    <div className="rounded-2xl border border-black/10 p-5 flex justify-between items-center">
      <div>
        <div className="text-xs text-black/50">Step {step}</div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-black/70">{body}</div>
      </div>
      <Link href={href} className="text-sm font-semibold underline">
        Open
      </Link>
    </div>
  );
}

function InsightCard({ label, body }: any) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-xs uppercase text-black/50">{label}</div>
      <p className="mt-2 text-sm text-black/70">{body}</p>
    </div>
  );
}

function Info({ label, value }: any) {
  return (
    <div className="border p-3 rounded-xl">
      <div className="text-xs text-black/50">{label}</div>
      <div className="mt-1">{value}</div>
    </div>
  );
}