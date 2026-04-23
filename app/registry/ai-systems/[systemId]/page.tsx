import { notFound } from "next/navigation";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import PublicPageHero from "@/app/_components/PublicPageHero";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type System = {
  SYSTEM_ID?: string;
  SYSTEM_NAME?: string;
  SYSTEM_TYPE?: string;
  INTENDED_USE?: string;
  DEPLOYMENT_STATUS?: string;
  OVERSIGHT_LEVEL?: string;
  LIFECYCLE_STATUS?: string;
  DEVELOPER_ORGANIZATION?: string;
  COUNTRY?: string;
  CERTIFIED_AT?: string;
  CERTIFIED_TIER?: string;
  CERTIFIED_BAND?: string;
  DECISION_STATUS?: string;
  REGISTRY_ID?: string;
};

function safe(v?: string | null) {
  return (v || "").trim() || "—";
}

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-US");
}

function pillTone(value: string) {
  const v = value.toUpperCase();

  if (v === "CERTIFIED") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (v === "APPROVED") return "bg-blue-50 text-blue-700 ring-blue-200";
  if (v.includes("HIGH")) return "bg-red-50 text-red-700 ring-red-200";

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
        {label}
      </div>
      <div className="mt-3 text-[15px] font-semibold text-black">{value}</div>
    </div>
  );
}

async function getSystem(systemId: string): Promise<System | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/systems/${systemId}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

export default async function SystemDetailPage({
  params,
}: {
  params: { systemId: string };
}) {
  const system = await getSystem(params.systemId);

  if (!system) return notFound();

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="AI System"
          title={safe(system.SYSTEM_NAME)}
          description="This page surfaces the public detail view for an AI system associated with a GAFAIG-certified registry record."
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Certified
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${pillTone(
                safe(system.DECISION_STATUS)
              )}`}
            >
              {safe(system.DECISION_STATUS)}
            </span>
          </div>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            {safe(system.DEVELOPER_ORGANIZATION)} · {safe(system.SYSTEM_TYPE)} · {safe(system.COUNTRY)}
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <InfoCard
              label="Organization"
              value={safe(system.DEVELOPER_ORGANIZATION)}
            />
            <InfoCard label="System Type" value={safe(system.SYSTEM_TYPE)} />
            <InfoCard
              label="Deployment"
              value={safe(system.DEPLOYMENT_STATUS)}
            />
            <InfoCard label="Country" value={safe(system.COUNTRY)} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink
              href={`/registry/${system.REGISTRY_ID}`}
              variant="primary"
            >
              View Certified Record
            </PublicButtonLink>

            <PublicButtonLink href="/explorer/systems" variant="secondary">
              Back to systems
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            System details
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoCard label="Intended Use" value={safe(system.INTENDED_USE)} />
            <InfoCard
              label="Oversight Level"
              value={safe(system.OVERSIGHT_LEVEL)}
            />
            <InfoCard
              label="Lifecycle"
              value={safe(system.LIFECYCLE_STATUS)}
            />
            <InfoCard label="Certified" value={formatDate(system.CERTIFIED_AT)} />
            <InfoCard label="Tier" value={safe(system.CERTIFIED_TIER)} />
            <InfoCard label="Band" value={safe(system.CERTIFIED_BAND)} />
          </div>
        </section>
      </div>
    </main>
  );
}