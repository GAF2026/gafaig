import Link from "next/link";

export const dynamic = "force-dynamic";

const DEMO_STEPS = [
  {
    step: "01",
    title: "Private reviewer environment",
    body: "Enter the controlled evaluator flow and show that GAFAIG supports a private verification layer for reviewers rather than exposing internal evidence publicly.",
    href: "/admin/login",
    cta: "Open reviewer access",
  },
  {
    step: "02",
    title: "Snowflake-backed review workflow",
    body: "Continue into the reviewer workflow and show that application records and verification operations are being served through the Snowflake-backed environment.",
    href: "/admin/applications",
    cta: "Open applications",
  },
  {
    step: "03",
    title: "Public certification registry",
    body: "Return to the public layer and show that certification outcomes are surfaced separately from private reviewer materials.",
    href: "/registry",
    cta: "Open registry",
  },
  {
    step: "04",
    title: "Global explorer and map",
    body: "Show the country, organization, system, and map views to demonstrate how public trust signals can be explored without exposing private evidence.",
    href: "/explorer",
    cta: "Open explorer",
  },
];

const TALK_TRACK = [
  {
    time: "0:00–0:15",
    title: "What GAFAIG is",
    body: "GAFAIG is governance assurance infrastructure for AI. It separates a private verification workflow from a public registry layer, so sensitive reviewer materials remain controlled while certification outcomes can be disclosed publicly.",
  },
  {
    time: "0:15–0:30",
    title: "Reviewer environment",
    body: "This controlled reviewer environment demonstrates that application and verification activity live in a private operational layer rather than on the public site.",
  },
  {
    time: "0:30–0:45",
    title: "Snowflake-backed operations",
    body: "Snowflake is the system of record for the application and verification workflow, supporting structured review operations and deterministic governance outcomes.",
  },
  {
    time: "0:45–1:00",
    title: "Public trust signal",
    body: "The public registry and explorer surface certification outcomes, disclosed systems, and country-level trust signals without revealing internal reviewer evidence.",
  },
];

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="max-w-4xl">
            <div className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Guided demo
            </div>

            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              A tighter GAFAIG demo, centered on proof
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-neutral-700">
              This walkthrough is designed for judges, investors, and evaluators.
              It follows one clear sequence: private reviewer access, Snowflake-backed
              verification workflow, public certification registry, and global
              explorer surfaces.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/admin/login"
                className="inline-flex items-center rounded-full bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/90"
              >
                Start 60-second demo
              </Link>

              <Link
                href="#extended-walkthrough"
                className="inline-flex items-center rounded-full border border-black px-5 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
              >
                Open extended walkthrough
              </Link>

              <Link
                href="/registry"
                className="inline-flex items-center rounded-full border border-black/15 px-5 py-3 text-sm font-medium transition hover:bg-black/[0.03]"
              >
                Skip to public registry
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <MetricCard
            label="Demo goal"
            value="Trust infrastructure"
            body="Show that GAFAIG is not just a website, but a private verification layer plus a public registry layer."
          />
          <MetricCard
            label="Private layer"
            value="Reviewer workflow"
            body="Applications and verification activity remain controlled inside the evaluator environment."
          />
          <MetricCard
            label="System of record"
            value="Snowflake"
            body="Snowflake backs the operational workflow and certification data surfaced in the demo."
          />
          <MetricCard
            label="Public layer"
            value="Registry + Explorer"
            body="Certification outcomes and disclosed system signals can be explored without exposing private evidence."
          />
        </section>

        <section className="mt-10 rounded-3xl border border-black/10 p-6 md:p-8">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Recommended flow
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              One path, four steps
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-700">
              The demo should feel like a guided sequence, not a menu of unrelated
              pages. Use the steps below in order.
            </p>
          </div>

          <div className="mt-8 grid gap-4">
            {DEMO_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-black/10 p-5 md:p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="max-w-3xl">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                      Step {item.step}
                    </div>
                    <h3 className="mt-2 text-xl font-semibold text-black">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-neutral-700">
                      {item.body}
                    </p>
                  </div>

                  <div className="pt-1">
                    <Link
                      href={item.href}
                      className="inline-flex items-center rounded-full border border-black px-4 py-2 text-sm font-medium transition hover:bg-black hover:text-white"
                    >
                      {item.cta}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          id="extended-walkthrough"
          className="mt-10 rounded-3xl border border-black/10 p-6 md:p-8"
        >
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              Extended walkthrough
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              60-second talk track
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-700">
              Use this if you are narrating the demo live.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {TALK_TRACK.map((item) => (
              <div
                key={item.time}
                className="rounded-2xl border border-black/10 p-5"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  {item.time}
                </div>
                <h3 className="mt-2 text-lg font-semibold text-black">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-neutral-700">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-black/10 p-6 md:p-8">
          <div className="max-w-3xl">
            <div className="text-sm uppercase tracking-[0.2em] text-neutral-500">
              What the evaluator should notice
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Key proof points
            </h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <BulletCard
              title="Private reviewer layer"
              items={[
                "Admin access is controlled and separate from the public site.",
                "Reviewer pages represent operational workflow, not public marketing surfaces.",
                "Private verification activity is not directly exposed in public registry views.",
              ]}
            />
            <BulletCard
              title="Snowflake-backed operations"
              items={[
                "Snowflake is the system of record for application and verification data.",
                "Operational workflow and registry disclosures remain structurally linked.",
                "Deterministic review logic can be surfaced as trust infrastructure rather than ad hoc screenshots.",
              ]}
            />
            <BulletCard
              title="Public registry layer"
              items={[
                "Certification outcomes can be disclosed without exposing internal evidence.",
                "Registry records are public trust signals, not reviewer workpapers.",
                "Organizations and AI systems can be browsed as structured, queryable public disclosures.",
              ]}
            />
            <BulletCard
              title="Explorer layer"
              items={[
                "Countries, organizations, systems, and map views summarize public trust coverage.",
                "The explorer turns registry records into a legible global signal.",
                "The map and country drill-downs help the evaluator understand scale and structure quickly.",
              ]}
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  label,
  value,
  body,
}: {
  label: string;
  value: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
        {label}
      </div>
      <div className="mt-2 text-[24px] font-semibold text-black">{value}</div>
      <p className="mt-3 text-sm leading-7 text-neutral-700">{body}</p>
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
      <h3 className="text-lg font-semibold text-black">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-7 text-neutral-700">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-[10px] h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}