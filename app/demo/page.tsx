import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-dynamic";

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="GUIDED DEMO"
        title="A tighter GAFAIG demo, centered on proof"
        description="This walkthrough is designed for judges, investors, and evaluators. It follows one clear sequence: private reviewer access, Snowflake-backed verification workflow, public certification registry, and global explorer surfaces."
        actions={
          <>
            <Link
              href="/admin/login"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Start 60-second demo
            </Link>

            <Link
              href="/admin/applications"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Open admin workflow
            </Link>

            <Link
              href="/registry"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Skip to public registry
            </Link>
          </>
        }
      />

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <ValueCard
          label="Demo goal"
          title="Trust infrastructure"
          body="Show how GAFAIG verifies governance for AI systems, not just publishes a public registry page."
        />
        <ValueCard
          label="Private layer"
          title="Reviewer workflow"
          body="Controlled reviewer access and verification activity remain in a private operational environment."
        />
        <ValueCard
          label="System of record"
          title="Snowflake"
          body="Snowflake backs the application intake and certification data shown across this environment."
        />
        <ValueCard
          label="Public layer"
          title="Registry + Explorer"
          body="Certification outcomes and disclosed system signals can be explored without exposing private evidence."
        />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          RECOMMENDED FLOW
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          One path, four steps
        </h2>

        <p className="mt-5 max-w-3xl text-[15px] leading-[1.8] text-black/70">
          This demo should take less than a minute. Keep the narration tight,
          let the pages speak for themselves, and move from the private layer
          to public trust in order.
        </p>

        <div className="mt-8 grid gap-4">
          <StepRow
            step="Step 1"
            title="Private reviewer environment"
            body="Show the controlled evaluator flow and that GAFAIG supports a private verification layer for reviewers rather than exposing operations publicly."
            href="/admin/login"
            cta="Open reviewer access"
          />
          <StepRow
            step="Step 2"
            title="Snowflake-backed review workflow"
            body="Continue into the reviewer workflow and show that application records and verification operations are being served through the platform’s internal environment."
            href="/admin/applications"
            cta="Open applications"
          />
          <StepRow
            step="Step 3"
            title="Public certification registry"
            body="Move to the registry to show that certification outcomes are surfaced separately from the private reviewer layer."
            href="/registry"
            cta="Open registry"
          />
          <StepRow
            step="Step 4"
            title="Global explorer and map"
            body="Open the explorer, countries, and map view to show how registry trust signals can be explored without exposing private evidence."
            href="/explorer"
            cta="Open explorer"
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          EXTENDED WALKTHROUGH
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          60-second talk track
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <TalkCard
            time="0:00–0:15"
            title="What GAFAIG is"
            body="GAFAIG provides governance infrastructure for AI systems. It combines a private verification layer with a public registry layer, so sensitive reviewer work stays confidential while certification outcomes can be disclosed publicly."
          />
          <TalkCard
            time="0:15–0:30"
            title="Reviewer environment"
            body="This admin login opens the private reviewer workflow. It is intentionally separate from the public site and uses a controlled demo access path for evaluation."
          />
          <TalkCard
            time="0:30–0:45"
            title="Snowflake-backed operations"
            body="Snowflake is the system of record for the application and verification workflow, supporting internal review operations and deterministic governance outcomes."
          />
          <TalkCard
            time="0:45–1:00"
            title="Public trust signal"
            body="The registry and explorer surface certification outcomes, disclosed systems, and country-level trust signals without revealing reviewer evidence."
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          WHAT THE EVALUATOR SHOULD NOTICE
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          Key proof points
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <BulletCard
            title="Private reviewer layer"
            items={[
              "Admin access is controlled and separate from the public site.",
              "Reviewer pages represent operational workflow, not public marketing screens.",
              "Private verification activity is not directly exposed in public registry pages.",
            ]}
          />
          <BulletCard
            title="Snowflake-backed operations"
            items={[
              "Snowflake is the system of record for application and verification data.",
              "Reviewer workflow is tightly tied to Snowflake-backed records.",
              "Deterministic review logic can be surfaced as trust infrastructure rather than ad hoc screenshots.",
            ]}
          />
          <BulletCard
            title="Public registry layer"
            items={[
              "Certification outcomes can be disclosed without exposing internal evidence.",
              "Registry records are public trust signals, not reviewer workspaces.",
              "Organizations and AI systems can be browsed in structured, queryable public disclosures.",
            ]}
          />
          <BulletCard
            title="Explorer layer"
            items={[
              "Countries, organizations, systems, and map views illustrate global trust coverage.",
              "The explorer turns registry records into a legible global graph.",
              "The map and country drill-down help the evaluator understand scale and structure quickly.",
            ]}
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
      <div className="mt-3 text-[20px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[14px] leading-[1.8] text-black/70">{body}</p>
    </div>
  );
}

function StepRow({
  step,
  title,
  body,
  href,
  cta,
}: {
  step: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-black/10 p-5 md:flex-row md:items-center md:justify-between">
      <div className="max-w-3xl">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
          {step}
        </div>
        <div className="mt-2 text-[18px] font-semibold text-black">{title}</div>
        <p className="mt-2 text-[14px] leading-[1.8] text-black/70">{body}</p>
      </div>

      <div className="shrink-0">
        <Link
          href={href}
          className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
        >
          {cta}
        </Link>
      </div>
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
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
        {time}
      </div>
      <div className="mt-2 text-[18px] font-semibold text-black">{title}</div>
      <p className="mt-3 text-[14px] leading-[1.8] text-black/70">{body}</p>
    </div>
  );
}

function BulletCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[18px] font-semibold text-black">{title}</div>
      <ul className="mt-4 space-y-3 text-[14px] leading-[1.8] text-black/70">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}