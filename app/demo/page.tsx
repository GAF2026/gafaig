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
        description="This walkthrough shows how GAFAIG moves from private review to public certification. You’ll see how organizations are evaluated, how decisions are made, and how results appear in the registry and explorer."
        secondaryDescription="The process begins in a controlled reviewer environment and ends with public certification outcomes. Internal materials remain private, while results are published for others to verify."
        actions={
          <>
            <PublicButtonLink href="/admin/login" variant="primary">
              Start the demo
            </PublicButtonLink>

            <PublicButtonLink href={`/admin/verification/${DEMO_CASE_ID}/findings`} variant="secondary">
              Open CASE-0001
            </PublicButtonLink>

            <PublicButtonLink href="/registry" variant="secondary">
              View the registry
            </PublicButtonLink>
          </>
        }
      />

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <ValueCard
          label="What this is"
          title="Governance verification"
          body="GAFAIG verifies whether human oversight is working across an organization’s AI systems."
        />
        <ValueCard
          label="Where it happens"
          title="Private review"
          body="All evaluation activity takes place in a controlled environment that is separate from the public site."
        />
        <ValueCard
          label="System of record"
          title="Structured data"
          body="All activity is recorded in a structured system that supports consistency and traceability."
        />
        <ValueCard
          label="What becomes public"
          title="Registry & explorer"
          body="Only certification outcomes are published, allowing others to view and verify results."
        />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          GUIDED DEMO FLOW
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Walk through CASE-0001 from review to public proof
        </h2>

        <p className="mt-5 max-w-3xl text-[15px] leading-[1.8] text-black/70">
          This guided demo follows one real GAFAIG case through the exact sequence that matters:
          reviewer workflow, evidence review, scoring, publication, registry visibility, and
          cryptographic verification.
        </p>

        <div className="mt-8 grid gap-4">
          <GuidedStep
            step="1"
            label="Open findings"
            title="Start with the case review"
            body="Begin inside the private reviewer workflow for CASE-0001. This is where findings are examined and the structured review begins."
            href={`/admin/verification/${DEMO_CASE_ID}/findings`}
            cta="Open findings"
          />

          <GuidedStep
            step="2"
            label="Inspect evidence"
            title="Review submitted governance evidence"
            body="Move into the evidence layer to see how materials are attached to the case and used in the deterministic review process."
            href={`/admin/verification/${DEMO_CASE_ID}/evidence`}
            cta="Open evidence"
          />

          <GuidedStep
            step="3"
            label="View score"
            title="See the governance score and certification outcome"
            body="Open the score surface to inspect the deterministic output for the case, including final score, tier, and band."
            href={`/admin/verification/${DEMO_CASE_ID}/score`}
            cta="Open score"
          />

          <GuidedStep
            step="4"
            label="Open registry record"
            title="See the public certification result"
            body="After publication, the case appears in the public registry as a controlled certification record without exposing private evidence."
            href={`/registry/${DEMO_REGISTRY_ID}`}
            cta="Open registry record"
          />

          <GuidedStep
            step="5"
            label="Verify proof"
            title="Inspect the signed verification payload"
            body="Open the live verification endpoint to view the signed public payload linked to the certification record."
            href={`/api/verify/${DEMO_REGISTRY_ID}`}
            cta="Open verification"
          />

          <GuidedStep
            step="6"
            label="View badge"
            title="Open the embeddable badge asset"
            body="See the certification badge generated from the same public registry record and verification chain."
            href={`/badge/${DEMO_REGISTRY_ID}`}
            cta="Open badge"
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          CASE SNAPSHOT
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          What this demo case proves
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <SnapshotCard
            title="Private review exists"
            body="The case is grounded in the reviewer workflow, not a mock public-only page."
          />
          <SnapshotCard
            title="Certification is deterministic"
            body="The score, tier, and band are generated through the structured GAFAIG process."
          />
          <SnapshotCard
            title="Public proof is verifiable"
            body="The registry record, verification endpoint, and badge all point to the same certification outcome."
          />
        </div>

        <div className="mt-8 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/50">
            Demo identifiers
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Info label="Case ID" value={DEMO_CASE_ID} />
            <Info label="Registry ID" value={DEMO_REGISTRY_ID} />
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          LIVE DEMO RECORD
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          See a real certification
        </h2>

        <p className="mt-5 max-w-3xl text-[15px] leading-[1.8] text-black/70">
          This is a real GAFAIG certification generated through the full verification process.
          You can open the public record, inspect the verification payload, and view the badge.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            href={`/registry/${DEMO_REGISTRY_ID}`}
            className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
              Registry Record
            </div>
            <div className="mt-2 text-[18px] font-semibold text-black">
              View certification
            </div>
            <p className="mt-2 text-[14px] text-black/70">
              Open the public certification record in the registry.
            </p>
          </Link>

          <Link
            href={`/api/verify/${DEMO_REGISTRY_ID}`}
            className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
              Verification Proof
            </div>
            <div className="mt-2 text-[18px] font-semibold text-black">
              View signed payload
            </div>
            <p className="mt-2 text-[14px] text-black/70">
              Inspect the cryptographic verification response.
            </p>
          </Link>

          <Link
            href={`/badge/${DEMO_REGISTRY_ID}`}
            className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.03]"
          >
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
              Certification Badge
            </div>
            <div className="mt-2 text-[18px] font-semibold text-black">
              View badge
            </div>
            <p className="mt-2 text-[14px] text-black/70">
              Open the embeddable certification badge.
            </p>
          </Link>
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          QUICK OVERVIEW
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          A one-minute walkthrough
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <TalkCard
            time="0:00–0:15"
            title="What GAFAIG does"
            body="GAFAIG provides a structured way to verify that AI systems are governed responsibly."
          />
          <TalkCard
            time="0:15–0:30"
            title="Private review"
            body="All evaluation work takes place in a controlled environment separate from the public site."
          />
          <TalkCard
            time="0:30–0:45"
            title="Structured evaluation"
            body="Evidence is reviewed, findings are recorded, and certification decisions are made in a consistent way."
          />
          <TalkCard
            time="0:45–1:00"
            title="Public results"
            body="Certification outcomes are published in the registry and explorer for others to view and verify."
          />
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
      <p className="mt-3 text-[14px] text-black/70">{body}</p>
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

function SnapshotCard({
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

function TalkCard({
  time,
  title,
  body,
}: {
  time: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[11px] uppercase text-black/45">{time}</div>
      <div className="mt-2 text-[18px] font-semibold">{title}</div>
      <p className="mt-3 text-[14px] text-black/70">{body}</p>
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