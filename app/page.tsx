import Link from "next/link";
import { headers } from "next/headers";
import PublicPageHero from "./_components/PublicPageHero";

export const dynamic = "force-dynamic";

type PublicMetricsResponse =
  | {
      ok: true;
      metrics: {
        certifiedOrganizations: number;
        disclosedAiSystems: number;
        countriesRepresented: number;
      };
    }
  | {
      ok: false;
      error: string;
    };

async function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/+$/, "");

  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";

  if (host) return `${proto}://${host}`;
  return "http://localhost:3000";
}

async function getPublicMetrics(): Promise<PublicMetricsResponse | null> {
  try {
    const base = await getBaseUrl();

    const res = await fetch(`${base}/api/public/metrics`, {
      cache: "no-store",
    });

    const json = (await res.json()) as PublicMetricsResponse;

    if (res.ok && json.ok) return json;

    const reg = await fetch(`${base}/api/registry`, {
      cache: "no-store",
    });

    const regJson = (await reg.json()) as {
      rows?: Array<{
        country?: string | null;
      }>;
    };

    if (Array.isArray(regJson.rows)) {
      const rows = regJson.rows;

      return {
        ok: true,
        metrics: {
          certifiedOrganizations: rows.length,
          disclosedAiSystems: rows.length,
          countriesRepresented: new Set(
            rows.map((r) => r.country).filter(Boolean)
          ).size,
        },
      };
    }

    return null;
  } catch {
    return null;
  }
}

function fmt(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return "—";
  return value.toLocaleString();
}

export default async function HomePage() {
  const metricsResp = await getPublicMetrics();
  const metrics = metricsResp && metricsResp.ok ? metricsResp.metrics : null;

  return (
    <main className="mx-auto max-w-[1280px] px-6 pb-20 pt-14 md:px-8">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="GLOBAL AUTHORITY FOR AI GOVERNANCE"
          title="The global registry for AI governance certification"
          description="GAFAIG is a verification system and public registry for AI governance. It evaluates whether human oversight is operating across an organization’s AI systems and produces certification outcomes that can be independently verified."
          secondaryDescription="Reviews are conducted in a controlled verification environment, while certification results are published through a public registry. Each registry record can be verified through a signed proof and a public badge, allowing external parties to confirm governance status without exposing sensitive internal materials."
          actions={
            <>
              <Link href="/mission" className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90">
                Start with the Mission
              </Link>
              <Link href="/registry" className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]">
                View the Registry
              </Link>
              <Link href="/framework" className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]">
                See How It Works
              </Link>
              <Link href="/explorer" className="rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]">
                Explore the Data
              </Link>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-3">
          <PillarCard eyebrow="Pillar 1" title="Private Verification Engine" body="A controlled review environment where organizations move through application intake, evidence review, findings, deterministic scoring, and certification workflow." points={["Reviewer-only operational layer","Structured evidence and findings flow","Deterministic certification process"]} href="/admin/login" cta="Open reviewer layer" />
          <PillarCard eyebrow="Pillar 2" title="Public Registry" body="A registry of record where certification outcomes are published without exposing private reviewer materials, internal evidence, or controlled assessment workflows." points={["Canonical certification records","Public trust and verification layer","Portable badge and proof signals"]} href="/registry" cta="View public registry" />
          <PillarCard eyebrow="Pillar 3" title="Global Explorer" body="A discovery layer for organizations, AI systems, countries, and governance presence across the GAFAIG network." points={["Organizations and systems","Country-level visibility","Global governance footprint"]} href="/explorer" cta="Open explorer" />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">WHY GAFAIG EXISTS</div>
          <h2 className="mt-4 text-[32px] font-semibold">AI governance needs to be verifiable, not just declared</h2>
          <p className="mt-5 text-[16px] text-black/75">GAFAIG provides that infrastructure.</p>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">HOW THE SYSTEM WORKS</div>
          <h2 className="mt-4 text-[32px] font-semibold">From deterministic review to verifiable registry record</h2>
        </section>

        {/* 🔥 NEW TRUST INFRASTRUCTURE SECTION */}
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">TRUST INFRASTRUCTURE</div>
          <h2 className="mt-4 text-[32px] font-semibold">Public certification that can be independently verified</h2>
          <p className="mt-5 text-[16px] text-black/75">
            GAFAIG extends beyond registry publication into a full trust infrastructure layer. Every certification record includes a signed public proof, a verification endpoint, and embeddable trust surfaces that allow third parties to independently verify governance status.
          </p>
        </section>

      </div>
    </main>
  );
}