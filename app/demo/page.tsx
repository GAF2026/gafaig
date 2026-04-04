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
        title="See how GAFAIG turns private review into public trust"
        description="This demo follows a live GAFAIG certification record from controlled governance review through public certification, registry publication, and verification."
        secondaryDescription="GAFAIG operates as trust infrastructure. Review workflow remains private, while certification outcomes become public records that can be inspected, linked to systems, and verified through badge and proof surfaces."
        actions={
          <>
            <PublicButtonLink href={`/registry/${DEMO_REGISTRY_ID}`} variant="primary">
              View live certification
            </PublicButtonLink>

            <PublicButtonLink
              href={`/admin/verification/${DEMO_CASE_ID}/findings`}
              variant="secondary"
            >
              Open CASE-0001
            </PublicButtonLink>

            <PublicButtonLink href="/registry" variant="secondary">
              Open registry
            </PublicButtonLink>
          </>
        }
      />

      <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] px-5 py-4 text-[14px] font-medium text-black/75">
        This is a live system — not a simulation.
      </div>

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <ValueCard
          label="What GAFAIG proves"
          title="Governance can be verified"
          body="GAFAIG evaluates whether human oversight is actually operating across AI systems."
        />
        <ValueCard
          label="How it works"
          title="Private review first"
          body="Assessment happens inside a controlled verification workflow before anything becomes public."
        />
        <ValueCard
          label="What becomes public"
          title="Certification as a trust signal"
          body="The outcome becomes a durable public certification record that others can inspect and verify."
        />
        <ValueCard
          label="What this demo shows"
          title="Case to registry"
          body="This walkthrough follows one case through review, certification, publication, and verification."
        />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          DEMO NARRATIVE
        </div>

        <h2 className="mt-4 text-[32px] font-semibold tracking-tight text-black md:text-[38px]">
          What this demo is designed to show
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <NarrativeCard
            title="1. Controlled review"
            body="Governance evaluation begins inside the private verification engine, where evidence and findings remain controlled."
          />
          <NarrativeCard
            title="2. Deterministic certification"
            body="Structured review produces a certification outcome through a repeatable workflow."
          />
          <NarrativeCard
            title="3. Public verification"
            body="The resulting certification is published as a public trust record with linked verification surfaces."
          />
        </div>
      </section>

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
            body="Start inside the reviewer workflow where structured findings are recorded."
            href={`/admin/verification/${DEMO_CASE_ID}/findings`}
          />
          <GuidedStep
            step="2"
            title="Inspect evidence"
            body="View the supporting governance materials used during review."
            href={`/admin/verification/${DEMO_CASE_ID}/evidence`}
          />
          <GuidedStep
            step="3"
            title="View certification outcome"
            body="See the outcome produced through the verification workflow."
            href={`/admin/verification/${DEMO_CASE_ID}/score`}
          />
          <GuidedStep
            step="4"
            title="Open registry record"
            body="See how the certification becomes a public record of trust."
            href={`/registry/${DEMO_REGISTRY_ID}`}
          />
          <GuidedStep
            step="5"
            title="Open verification proof"
            body="Validate the public certification through the live proof endpoint."
            href={`/api/verify/${DEMO_REGISTRY_ID}`}
          />
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[28px] font-semibold text-black">
            What a GAFAIG certification means
          </h2>

          <div className="mt-6 grid gap-4">
            <InsightCard
              label="Verified governance"
              body="Controls were evaluated through a structured verification process rather than self-attested informally."
            />
            <InsightCard
              label="Private review, public outcome"
              body="Assessment workflow remains private while certification becomes a public trust signal."
            />
            <InsightCard
              label="Independent verification"
              body="Each certification can be checked through a badge endpoint and a proof payload."
            />
            <InsightCard
              label="Registry infrastructure"
              body="GAFAIG creates persistent public records that can be relied on beyond the review process itself."
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
            <Info label="Outcome" value="Certified · Band A" />
            <Info label="Proof endpoint" value={`/api/verify/${DEMO_REGISTRY_ID}`} mono />
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          START HERE
        </div>

        <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Choose how you want to review the system
        </h2>

        <div className="mt-6 flex flex-wrap gap-3">
          <PublicButtonLink href={`/registry/${DEMO_REGISTRY_ID}`} variant="primary">
            View live certification
          </PublicButtonLink>
          <PublicButtonLink
            href={`/admin/verification/${DEMO_CASE_ID}/findings`}
            variant="secondary"
          >
            Open review workflow
          </PublicButtonLink>
          <PublicButtonLink href={`/api/verify/${DEMO_REGISTRY_ID}`} variant="secondary">
            Open proof JSON
          </PublicButtonLink>
        </div>
      </section>
    </main>
  );
}

/* COMPONENTS */

function ValueCard({
  label,
  title,
  body,
}: {
  label: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-xs uppercase text-black/50">{label}</div>
      <div className="mt-2 font-semibold text-black">{title}</div>
      <p className="mt-2 text-sm leading-[1.7] text-black/70">{body}</p>
    </div>
  );
}

function NarrativeCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="font-semibold text-black">{title}</div>
      <p className="mt-2 text-sm leading-[1.7] text-black/70">{body}</p>
    </div>
  );
}

function GuidedStep({
  step,
  title,
  body,
  href,
}: {
  step: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-black/10 p-5">
      <div>
        <div className="text-xs text-black/50">Step {step}</div>
        <div className="font-semibold text-black">{title}</div>
        <div className="text-sm text-black/70">{body}</div>
      </div>
      <PublicButtonLink href={href} variant="link" size="sm">
        Open
      </PublicButtonLink>
    </div>
  );
}

function InsightCard({
  label,
  body,
}: {
  label: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-xs uppercase text-black/50">{label}</div>
      <p className="mt-2 text-sm leading-[1.7] text-black/70">{body}</p>
    </div>
  );
}

function Info({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-black/10 p-3">
      <div className="text-xs text-black/50">{label}</div>
      <div className={`mt-1 ${mono ? "break-all font-mono text-[13px]" : ""}`}>
        {value}
      </div>
    </div>
  );
}