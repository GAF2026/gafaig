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
        description="GAFAIG turns private governance review into public certification that others can verify. This demo follows one case from internal review to public proof."
        secondaryDescription="The process begins inside a controlled reviewer workflow, moves through structured findings, evidence, and scoring, and ends with a public registry record, verification payload, and badge."
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

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <ValueCard
          label="What GAFAIG proves"
          title="Governance can be verified"
          body="GAFAIG shows whether human oversight is actually functioning across an organization’s AI systems."
        />
        <ValueCard
          label="How it works"
          title="Private review first"
          body="Assessment work happens in a controlled workflow before anything becomes visible to the public."
        />
        <ValueCard
          label="Why it matters"
          title="Public trust record"
          body="Certification outcomes are published as durable records that others can inspect and verify."
        />
        <ValueCard
          label="What you will see"
          title="Case to certification"
          body="This walkthrough follows one case through findings, evidence, score, publication, registry, verification, and badge."
        />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          DEMO NARRATIVE
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          The story this demo tells
        </h2>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <NarrativeCard
            title="1. Review happens privately"
            body="A case begins in a reviewer workflow where governance materials are assessed in a structured environment."
          />
          <NarrativeCard
            title="2. Certification is generated"
            body="The case moves through evidence, findings, and deterministic scoring to produce a certification outcome."
          />
          <NarrativeCard
            title="3. Proof becomes public"
            body="The outcome is published as a registry record with a live verification payload and badge."
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          GUIDED CASE FLOW
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Walk through CASE-0001 from review to public proof
        </h2>

        <p className="mt-5 max-w-3xl text-[15px] leading-[1.8] text-black/70">
          This is the canonical GAFAIG demo path. Each step shows a different layer
          of the system and why that layer matters.
        </p>

        <div className="mt-8 grid gap-4">
          <GuidedStep
            step="1"
            label="Private workflow"
            title="Open the case review"
            body="Start inside the reviewer environment for CASE-0001. This is where the governance review begins."
            href={`/admin/verification/${DEMO_CASE_ID}/findings`}
            cta="Open findings"
          />

          <GuidedStep
            step="2"
            label="Evidence layer"
            title="Inspect submitted governance materials"
            body="Move into the evidence surface to see how structured materials support case evaluation."
            href={`/admin/verification/${DEMO_CASE_ID}/evidence`}
            cta="Open evidence"
          />

          <GuidedStep
            step="3"
            label="Deterministic outcome"
            title="View score, tier, and band"
            body="Open the score surface to inspect the case result generated through the GAFAIG scoring process."
            href={`/admin/verification/${DEMO_CASE_ID}/score`}
            cta="Open score"
          />

          <GuidedStep
            step="4"
            label="Public certification"
            title="Open the registry record"
            body="See the public certification record created from the reviewed case without exposing private evidence."
            href={`/registry/${DEMO_REGISTRY_ID}`}
            cta="Open registry record"
          />

          <GuidedStep
            step="5"
            label="Verification"
            title="Inspect the trust layer"
            body="Open the public verification experience to confirm the certification through the signed payload."
            href={`/verify/${DEMO_REGISTRY_ID}`}
            cta="Open verification"
          />

          <GuidedStep
            step="6"
            label="Badge"
            title="View the embeddable certification badge"
            body="See the public badge generated from the same certification output and trust chain."
            href={`/badge/${DEMO_REGISTRY_ID}`}
            cta="Open badge"
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          LIVE DEMO RECORD
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          The record behind the story
        </h2>

        <p className="mt-5 max-w-3xl text-[15px] leading-[1.8] text-black/70">
          This demo is anchored to a live GAFAIG certification. You can open the
          public record, verification experience, raw API proof, and badge directly.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <ActionCard
            eyebrow="Registry record"
            title="Open certification"
            body="View the live public certification record."
            href={`/registry/${DEMO_REGISTRY_ID}`}
          />
          <ActionCard
            eyebrow="Verification UX"
            title="Open verify page"
            body="View the human-readable trust layer."
            href={`/verify/${DEMO_REGISTRY_ID}`}
          />
          <ActionCard
            eyebrow="Verification API"
            title="Open signed payload"
            body="Inspect the raw verification response."
            href={`/api/verify/${DEMO_REGISTRY_ID}`}
          />
          <ActionCard
            eyebrow="Badge"
            title="Open badge"
            body="See the embeddable certification badge."
            href={`/badge/${DEMO_REGISTRY_ID}`}
          />
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            CASE SNAPSHOT
          </div>

          <h2 className="mt-4 text-[28px] font-semibold tracking-tight text-black md:text-[34px]">
            Demo identifiers
          </h2>

          <div className="mt-6 grid gap-3">
            <Info label="Case ID" value={DEMO_CASE_ID} />
            <Info label="Registry ID" value={DEMO_REGISTRY_ID} />
            <Info
              label="Primary public outcome"
              value="Certified · Band A · Score 100/100"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            PRESENTER NOTES
          </div>

          <h2 className="mt-4 text-[28px] font-semibold tracking-tight text-black md:text-[34px]">
            How to tell the story live
          </h2>

          <div className="mt-6 grid gap-4">
            <PresenterNote
              label="Opening"
              body="Start with the problem: organizations can claim AI governance, but others need a way to verify it."
            />
            <PresenterNote
              label="Middle"
              body="Show that GAFAIG does not begin on the public site. It begins inside a structured private review workflow."
            />
            <PresenterNote
              label="Proof"
              body="Then show that the result becomes a public certification record with a live verification experience and badge."
            />
            <PresenterNote
              label="Close"
              body="End on the idea that GAFAIG creates trust infrastructure: not just dashboards, but verifiable public certification."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

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
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
        {label}
      </div>
      <div className="mt-3 text-[20px] font-semibold text-black">{title}</div>
      <p className="mt-3 text-[14px] leading-[1.75] text-black/70">{body}</p>
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
      <div className="text-[18px] font-semibold text-black">{title}</div>
      <p className="mt-3 text-[14px] leading-[1.75] text-black/70">{body}</p>
    </div>
  );
}

function GuidedStep({
  step,
  label,
  title,
  body,
  href,
  cta,
}: {
  step: string;
  label: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full border border-black/10 bg-black/[0.03] px-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/70">
              {step}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
              {label}
            </span>
          </div>

          <div className="mt-3 text-[20px] font-semibold text-black">{title}</div>
          <p className="mt-2 max-w-[680px] text-[14px] leading-[1.75] text-black/70">
            {body}
          </p>
        </div>

        <div className="shrink-0">
          <PublicButtonLink href={href} variant="secondary" size="sm">
            {cta}
          </PublicButtonLink>
        </div>
      </div>
    </div>
  );
}

function ActionCard({
  eyebrow,
  title,
  body,
  href,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
        {eyebrow}
      </div>
      <div className="mt-2 text-[18px] font-semibold text-black">{title}</div>
      <p className="mt-2 text-[14px] leading-[1.75] text-black/70">{body}</p>
    </Link>
  );
}

function PresenterNote({
  label,
  body,
}: {
  label: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
        {label}
      </div>
      <p className="mt-3 text-[14px] leading-[1.75] text-black/70">{body}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[14px] text-black/85">{value}</div>
    </div>
  );
}