import Link from "next/link";
import PublicPageHero from "../_components/PublicPageHero";

export const dynamic = "force-dynamic";

export default function DemoPage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="DEMO"
        title="GAFAIG platform walkthrough"
        description="This walkthrough follows one clear sequence: private reviewer access, Snowflake-backed verification workflow, public certification registry, and global explorer surfaces."
        secondaryDescription="GAFAIG is structured as trust infrastructure for AI governance. The platform begins in a controlled reviewer environment, moves through a deterministic verification workflow, and ends in public registry and explorer surfaces that communicate certification outcomes without exposing private evidence."
        actions={
          <>
            <Link
              href="/admin/login"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Begin walkthrough
            </Link>

            <Link
              href="/admin/applications"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Open reviewer workflow
            </Link>

            <Link
              href="/registry"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Open public registry
            </Link>
          </>
        }
      />

      <section className="mt-10 grid gap-4 md:grid-cols-4">
        <ValueCard
          label="Platform role"
          title="Trust infrastructure"
          body="GAFAIG verifies governance for AI systems through a private operational layer and a separate public trust layer."
        />
        <ValueCard
          label="Private layer"
          title="Reviewer workflow"
          body="Controlled reviewer access, evidence handling, and verification operations remain in a private environment."
        />
        <ValueCard
          label="System of record"
          title="Snowflake"
          body="Snowflake underpins application intake, verification workflow, and certification data across the platform."
        />
        <ValueCard
          label="Public layer"
          title="Registry + Explorer"
          body="Certification outcomes, disclosed systems, and global coverage can be explored without exposing internal reviewer materials."
        />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          PLATFORM FLOW
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          One path across four layers
        </h2>

        <p className="mt-5 max-w-3xl text-[15px] leading-[1.8] text-black/70">
          The walkthrough moves from private verification operations to public
          trust surfaces in order. Each page shows a different layer of the
          GAFAIG system.
        </p>

        <div className="mt-8 grid gap-4">
          <StepRow
            step="Step 1"
            title="Private reviewer environment"
            body="Open the controlled reviewer layer and show that verification operations are separated from the public trust surface."
            href="/admin/login"
            cta="Open reviewer access"
          />
          <StepRow
            step="Step 2"
            title="Snowflake-backed verification workflow"
            body="Move into the application workflow to show Snowflake-backed operational records, status management, and structured verification activity."
            href="/admin/applications"
            cta="Open applications"
          />
          <StepRow
            step="Step 3"
            title="Public certification registry"
            body="Open the registry to show how certification outcomes are surfaced publicly without revealing internal evidence or reviewer materials."
            href="/registry"
            cta="Open registry"
          />
          <StepRow
            step="Step 4"
            title="Global explorer and map"
            body="Finish in the explorer to show organizations, systems, countries, and map-based governance visibility across the GAFAIG network."
            href="/explorer"
            cta="Open explorer"
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          WALKTHROUGH NARRATIVE
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          A 60-second product story
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <TalkCard
            time="0:00–0:15"
            title="What GAFAIG is"
            body="GAFAIG provides governance infrastructure for AI systems by combining a private verification layer with a public registry and explorer layer."
          />
          <TalkCard
            time="0:15–0:30"
            title="Private reviewer environment"
            body="The reviewer layer is controlled and operational. It exists to support verification, not public marketing or public disclosure."
          />
          <TalkCard
            time="0:30–0:45"
            title="Snowflake-backed operations"
            body="Snowflake acts as the system of record for application intake, verification workflow, and structured governance outcomes."
          />
          <TalkCard
            time="0:45–1:00"
            title="Public trust surface"
            body="The registry and explorer communicate certification outcomes, disclosed systems, and country-level visibility without exposing internal reviewer evidence."
          />
        </div>
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          PLATFORM PROOF POINTS
        </div>

        <h2 className="mt-4 max-w-[760px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          What this walkthrough demonstrates
        </h2>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <BulletCard
            title="Private reviewer layer"
            items={[
              "Admin access is controlled and separate from the public site.",
              "Reviewer pages represent operational workflow rather than public-facing registry surfaces.",
              "Private verification activity is not directly exposed through public certification pages.",
            ]}
          />
          <BulletCard
            title="Snowflake-backed operations"
            items={[
              "Snowflake is the system of record for application and verification data.",
              "Reviewer workflow is tied to structured operational records.",
              "Deterministic review logic can be surfaced as infrastructure rather than screenshots or static claims.",
            ]}
          />
          <BulletCard
            title="Public registry layer"
            items={[
              "Certification outcomes can be disclosed without exposing internal evidence.",
              "Registry records function as public trust signals.",
              "Organizations and AI systems can be browsed through structured public disclosures.",
            ]}
          />
          <BulletCard
            title="Explorer layer"
            items={[
              "Countries, organizations, systems, and map views show global trust coverage.",
              "The explorer turns registry records into a legible public network.",
              "Country drill-down and map surfaces communicate structure and scale quickly.",
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