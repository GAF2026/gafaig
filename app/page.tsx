import Link from "next/link";
import PublicPageHero from "./_components/PublicPageHero";

export const dynamic = "force-static";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <PublicPageHero
        eyebrow="GLOBAL AUTHORITY FOR AI GOVERNANCE"
        title="Verification infrastructure for AI governance at global scale"
        description="GAFAIG operates as a governance verification engine and public trust registry for AI systems. It separates private review operations from public certification outcomes, so governance can be verified, structured, and transparently surfaced."
        secondaryDescription="The platform is designed as global trust infrastructure: a private verification layer for evaluators, a public certification registry for transparency, and an explorer layer for countries, organizations, AI systems, and global governance visibility."
        actions={
          <>
            <Link
              href="/demo"
              className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
            >
              Start the Demo
            </Link>

            <Link
              href="/registry"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              View the Registry
            </Link>

            <Link
              href="/explorer"
              className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Open the Explorer
            </Link>
          </>
        }
      />

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <PillarCard
          eyebrow="Pillar 1"
          title="Private Verification Engine"
          body="A controlled reviewer environment where organizations are assessed through evidence, findings, scoring, and certification workflow."
          points={[
            "Reviewer-only operational layer",
            "Snowflake-backed workflow",
            "Deterministic governance outcomes",
          ]}
          href="/admin/login"
          cta="Open reviewer layer"
        />

        <PillarCard
          eyebrow="Pillar 2"
          title="Public Registry"
          body="A public trust surface where certification outcomes can be disclosed without exposing private reviewer materials or internal evidence."
          points={[
            "Certified organizations",
            "Structured certification records",
            "Public trust signaling",
          ]}
          href="/registry"
          cta="View public registry"
        />

        <PillarCard
          eyebrow="Pillar 3"
          title="Global Explorer"
          body="A discovery layer for organizations, AI systems, countries, and geographic governance coverage across the GAFAIG network."
          points={[
            "Organizations and systems",
            "Countries and map view",
            "Global infrastructure visibility",
          ]}
          href="/explorer"
          cta="Open global explorer"
        />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          HOW THE SYSTEM WORKS
        </div>

        <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          From private verification to public trust
        </h2>

        <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
          GAFAIG is structured as infrastructure, not just a website. It begins
          in a private verification workflow, moves through deterministic
          certification logic, and ends in public registry and explorer surfaces
          that communicate trust without revealing confidential materials.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-5">
          <PathCard
            number="1"
            title="Applications"
            body="Organizations enter a controlled review workflow."
          />
          <PathCard
            number="2"
            title="Evidence"
            body="Governance artifacts and oversight records are assessed."
          />
          <PathCard
            number="3"
            title="Scoring"
            body="Structured scoring produces reproducible outcomes."
          />
          <PathCard
            number="4"
            title="Certification"
            body="Formal decisions confirm governance status."
          />
          <PathCard
            number="5"
            title="Registry & Explorer"
            body="Public trust signals become visible at global scale."
          />
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        <FeatureCard
          title="Mission"
          body="The public rationale for why independent AI governance verification is necessary."
          href="/mission"
          cta="Read Mission"
        />
        <FeatureCard
          title="Framework"
          body="The verification model for evidence, findings, deterministic scoring, and certification outcomes."
          href="/framework"
          cta="Read Framework"
        />
        <FeatureCard
          title="Explorer Map"
          body="A geographic view of where certified organizations and disclosed AI systems appear across countries."
          href="/explorer/map"
          cta="Open Map"
        />
      </section>

      <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
        <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
          WHY GAFAIG EXISTS
        </div>

        <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
          AI governance needs infrastructure, not just policy language
        </h2>

        <p className="mt-5 max-w-[960px] text-[16px] leading-[1.85] text-black/75">
          As AI systems move into operational environments, governance cannot
          remain abstract. Institutions need a way to verify oversight,
          structure evidence, produce auditable decisions, and publish trust
          signals that others can rely on. GAFAIG exists to provide that
          missing infrastructure layer.
        </p>
      </section>
    </main>
  );
}

function PillarCard({
  eyebrow,
  title,
  body,
  points,
  href,
  cta,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/45">
        {eyebrow}
      </div>

      <h2 className="mt-3 text-[24px] font-semibold leading-[1.25] tracking-tight text-black">
        {title}
      </h2>

      <p className="mt-4 text-[15px] leading-[1.8] text-black/72">{body}</p>

      <ul className="mt-5 space-y-3 text-[14px] leading-[1.7] text-black/72">
        {points.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-black" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Link
          href={href}
          className="font-semibold underline underline-offset-4 transition hover:text-black/65"
        >
          {cta} →
        </Link>
      </div>
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
    <div className="rounded-2xl border border-black/10 p-4">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {number}
      </div>
      <div className="mt-2 text-[16px] font-semibold text-black">{title}</div>
      <p className="mt-2 text-[14px] leading-[1.7] text-black/72">{body}</p>
    </div>
  );
}

function FeatureCard({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[20px] font-semibold text-black">{title}</div>
      <p className="mt-3 text-[14px] leading-[1.8] text-black/72">{body}</p>
      <div className="mt-5">
        <Link
          href={href}
          className="font-semibold underline underline-offset-4 transition hover:text-black/65"
        >
          {cta} →
        </Link>
      </div>
    </div>
  );
}