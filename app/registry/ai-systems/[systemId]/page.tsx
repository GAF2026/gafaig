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
  if (v === "ACTIVE") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (v === "EXPIRED") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (v === "REVOKED") return "bg-red-50 text-red-700 ring-red-200";

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
        {label}
      </div>
      <div className="mt-3 break-words text-[15px] font-semibold text-black">
        {value}
      </div>
    </div>
  );
}

function StatementCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-7 text-black/75">{body}</p>
    </div>
  );
}

async function getSystem(systemId: string): Promise<System | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/systems/${encodeURIComponent(systemId)}`, {
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

  const registryId = safe(system.REGISTRY_ID);
  const hasRegistryId = registryId !== "—";

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="PUBLIC AI GOVERNANCE RECORD"
          title={safe(system.SYSTEM_NAME)}
          description="This page surfaces the public AI governance observability record associated with a published GAFAIG certification record. It displays publication-safe governance metadata only."
          secondaryDescription="Private governance evidence, findings, scoring internals, reviewer materials, and governance telemetry are not exposed on public AI governance observability pages."
          actions={
            <>
              {hasRegistryId ? (
                <PublicButtonLink
                  href={`/registry/${encodeURIComponent(registryId)}`}
                  variant="primary"
                >
                  Open Certification Record
                </PublicButtonLink>
              ) : null}

              <PublicButtonLink href="/explorer/systems" variant="secondary">
                Back to Systems
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${pillTone(
                safe(system.DECISION_STATUS)
              )}`}
            >
              {safe(system.DECISION_STATUS)}
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${pillTone(
                safe(system.LIFECYCLE_STATUS)
              )}`}
            >
              {safe(system.LIFECYCLE_STATUS)}
            </span>
          </div>

          <p className="mt-4 text-[15px] leading-7 text-black/75">
            {safe(system.DEVELOPER_ORGANIZATION)} · {safe(system.SYSTEM_TYPE)} ·{" "}
            {safe(system.COUNTRY)}
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
            {hasRegistryId ? (
              <>
                <PublicButtonLink
                  href={`/registry/${encodeURIComponent(registryId)}`}
                  variant="primary"
                >
                  Open Certification Record
                </PublicButtonLink>

                <PublicButtonLink
                  href={`/verify/${encodeURIComponent(registryId)}`}
                  variant="secondary"
                >
                  Verify This Record
                </PublicButtonLink>
              </>
            ) : null}

            <PublicButtonLink href="/explorer/systems" variant="secondary">
              Back to Systems
            </PublicButtonLink>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Public AI governance observability record
          </h2>

          <p className="mt-4 max-w-[900px] text-[15px] leading-7 text-black/75">
            These fields describe the publication-safe AI governance
            observability record associated with a published GAFAIG
            certification record. This page does not expose private workflow
            state, scoring internals, evidence, findings, or reviewer notes.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoCard label="Registry ID" value={registryId} />
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
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-4xl space-y-4">
            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              AI governance observability
            </h2>

            <p className="text-[15px] leading-7 text-black/75">
              This page surfaces publication-safe AI governance metadata derived
              from canonical Snowflake public registry views.
            </p>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <p className="text-[13px] font-semibold uppercase tracking-[0.24em] text-black/45">
                This page does not expose
              </p>

              <ul className="mt-4 grid gap-2 text-[15px] leading-7 text-black/75 md:grid-cols-2">
                <li>findings</li>
                <li>evidence</li>
                <li>scoring internals</li>
                <li>reviewer materials</li>
                <li>governance execution telemetry</li>
                <li>private workflow state</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <h2 className="text-[26px] font-semibold tracking-tight text-black">
            Certification and verification
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="Certification record"
              body="The associated certification record is the canonical public trust record. It represents a published certification outcome selected for public visibility."
            />
            <StatementCard
              title="Verification proof"
              body="External systems should verify the associated registry ID through the GAFAIG verification endpoint and exact proof.messageString payload."
            />
          </div>

          {hasRegistryId ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <PublicButtonLink
                href={`/registry/${encodeURIComponent(registryId)}`}
                variant="primary"
              >
                Open Certification Record
              </PublicButtonLink>

              <PublicButtonLink
                href={`/verify/${encodeURIComponent(registryId)}`}
                variant="secondary"
              >
                Verify This Record
              </PublicButtonLink>

              <PublicButtonLink
                href={`/api/verify/${encodeURIComponent(registryId)}`}
                variant="secondary"
              >
                View Proof JSON
              </PublicButtonLink>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}