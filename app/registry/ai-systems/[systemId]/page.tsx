import Link from "next/link";
import { notFound } from "next/navigation";

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
    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
        {label}
      </div>
      <div className="mt-2 text-[15px] font-semibold text-black">
        {value}
      </div>
    </div>
  );
}

async function getSystem(systemId: string): Promise<System | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/systems/${systemId}`,
    { cache: "no-store" }
  );

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
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">

        {/* HERO */}
        <section className="rounded-3xl border border-black/10 bg-white p-8">

          <div className="flex gap-2">
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

          <h1 className="mt-4 text-[42px] font-semibold tracking-tight text-black">
            {safe(system.SYSTEM_NAME)}
          </h1>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <InfoCard label="Organization" value={safe(system.DEVELOPER_ORGANIZATION)} />
            <InfoCard label="System Type" value={safe(system.SYSTEM_TYPE)} />
            <InfoCard label="Deployment" value={safe(system.DEPLOYMENT_STATUS)} />
            <InfoCard label="Country" value={safe(system.COUNTRY)} />
          </div>

          <div className="mt-6 flex gap-3">
            <Link
              href={`/registry/${system.REGISTRY_ID}`}
              className="inline-flex rounded-full border border-black/20 px-5 py-2 text-sm font-semibold"
            >
              View Certified Record
            </Link>

            <Link
              href="/explorer/systems"
              className="inline-flex rounded-full border border-black/20 px-5 py-2 text-sm font-semibold"
            >
              Back to systems
            </Link>
          </div>
        </section>

        {/* DETAILS */}
        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[22px] font-semibold">
            System details
          </h2>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <InfoCard label="Intended Use" value={safe(system.INTENDED_USE)} />
            <InfoCard label="Oversight Level" value={safe(system.OVERSIGHT_LEVEL)} />
            <InfoCard label="Lifecycle" value={safe(system.LIFECYCLE_STATUS)} />
            <InfoCard label="Certified" value={formatDate(system.CERTIFIED_AT)} />
            <InfoCard label="Tier" value={safe(system.CERTIFIED_TIER)} />
            <InfoCard label="Band" value={safe(system.CERTIFIED_BAND)} />
          </div>
        </section>

      </div>
    </main>
  );
}