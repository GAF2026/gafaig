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
      rows?: Array<{ country?: string | null }>;
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
          description="GAFAIG is a verification system and public registry for AI governance."
          secondaryDescription="Each registry record can be verified through a signed proof, verification endpoint, and embeddable trust surfaces."
          actions={
            <>
              <Link href="/mission" className="rounded-full border border-black bg-black px-5 py-3 text-sm font-semibold text-white">
                Start with the Mission
              </Link>
              <Link href="/registry" className="rounded-full border border-black px-5 py-3 text-sm font-semibold">
                View the Registry
              </Link>
              <Link href="/framework" className="rounded-full border border-black px-5 py-3 text-sm font-semibold">
                See How It Works
              </Link>
            </>
          }
        />

        {/* TRUST INFRASTRUCTURE */}
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            TRUST INFRASTRUCTURE
          </div>

          <h2 className="mt-4 text-[32px] font-semibold">
            Public certification that can be independently verified
          </h2>

          <p className="mt-5 text-[16px] text-black/75">
            GAFAIG extends beyond registry publication into a full trust infrastructure layer.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <StatementCard title="Signed proofs" body="Each certification is cryptographically signed." />
            <StatementCard title="Verification API" body="Public verification endpoint available." />
            <StatementCard title="Embeddable badge" body="Portable trust across the web." />
            <StatementCard title="Live widget" body="Real-time verification UI." />
          </div>
        </section>

      </div>
    </main>
  );
}

/* COMPONENTS */

function PillarCard({ eyebrow, title, body, points, href, cta }: any) {
  return (
    <div className="rounded-3xl border p-6">
      <div>{eyebrow}</div>
      <h2 className="mt-3 text-xl font-semibold">{title}</h2>
      <p className="mt-4">{body}</p>
      <ul className="mt-4">
        {points?.map((p: string) => <li key={p}>• {p}</li>)}
      </ul>
      <Link href={href}>{cta}</Link>
    </div>
  );
}

function StatementCard({ title, body }: any) {
  return (
    <div className="rounded-2xl border p-5">
      <div className="font-semibold">{title}</div>
      <p className="mt-2">{body}</p>
    </div>
  );
}