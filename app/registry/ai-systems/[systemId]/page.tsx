import Link from "next/link";
import { notFound } from "next/navigation";
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import { getRegistryAiSystemBySystemId } from "@/lib/queries/registry-ai-systems";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toneForRisk(value: string | null | undefined) {
  const v = String(value || "").trim().toLowerCase();

  if (v === "high") return "bg-red-50 text-red-700 ring-red-200";
  if (v === "medium") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (v === "low") return "bg-emerald-50 text-emerald-700 ring-emerald-200";

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function toneForCertification(value: string | null | undefined) {
  const v = String(value || "").trim().toLowerCase();

  if (v === "certified") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function formatBoolean(value: boolean | null | undefined) {
  if (value === true) return "Required";
  if (value === false) return "Not required";
  return "—";
}

export default async function RegistryAiSystemDetailPage({
  params,
}: {
  params: { systemId: string };
}) {
  const system = await getRegistryAiSystemBySystemId(params.systemId);

  if (!system) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="AI SYSTEM RECORD"
          title={system.systemName || "Unnamed system"}
          description="This page is the public system-level disclosure surface for an AI system linked to a canonical GAFAIG registry record."
          secondaryDescription="System-level disclosure remains distinct from the canonical certification record. The linked registry record is the source of truth for public certification status, while this page provides richer public context about the disclosed system."
          actions={
            <>
              {system.registryId ? (
                <PublicButtonLink
                  href={`/registry/${system.registryId}`}
                  variant="primary"
                >
                  View Registry Record
                </PublicButtonLink>
              ) : null}

              <PublicButtonLink
                href="/registry/ai-systems"
                variant="secondary"
              >
                Back to AI Systems Registry
              </PublicButtonLink>

              <PublicButtonLink href="/explorer/systems" variant="secondary">
                Systems Explorer
              </PublicButtonLink>
            </>
          }
        />

        <section className="grid gap-4 md:grid-cols-4">
          <MetricCard label="System ID" value={system.systemId || "—"} breakAll />
          <MetricCard label="Developer" value={system.developerOrganization || system.entityName || "—"} />
          <MetricCard label="Deployment" value={system.deploymentStatus || "—"} />
          <MetricCard label="Country" value={system.country || "Not disclosed"} />
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
                SYSTEM OVERVIEW
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <h2 className="text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
                  {system.systemName || "Unnamed system"}
                </h2>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${toneForRisk(
                    system.riskTier
                  )}`}
                >
                  {system.riskTier ? `${system.riskTier} Risk` : "Risk Undisclosed"}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${toneForCertification(
                    system.certificationStatus
                  )}`}
                >
                  {system.certificationStatus || "Certification Pending"}
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-black/68">
                <div>
                  <span className="font-medium text-black/50">Type:</span>{" "}
                  {system.systemType || "—"}
                </div>
                <div>
                  <span className="font-medium text-black/50">Entity:</span>{" "}
                  {system.entityName || "—"}
                </div>
                <div>
                  <span className="font-medium text-black/50">Registry ID:</span>{" "}
                  {system.registryId ? (
                    <Link
                      href={`/registry/${system.registryId}`}
                      className="underline underline-offset-4"
                    >
                      {system.registryId}
                    </Link>
                  ) : (
                    "—"
                  )}
                </div>
                <div>
                  <span className="font-medium text-black/50">Case ID:</span>{" "}
                  {system.caseId || "—"}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              {system.registryId ? (
                <PublicButtonLink
                  href={`/registry/${system.registryId}`}
                  variant="primary"
                  size="sm"
                >
                  View Registry
                </PublicButtonLink>
              ) : null}

              <PublicButtonLink
                href="/registry/ai-systems"
                variant="secondary"
                size="sm"
              >
                Open Systems Registry
              </PublicButtonLink>
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Info label="Deployment Status" value={system.deploymentStatus || "—"} />
            <Info label="Oversight Level" value={system.oversightLevel || "—"} />
            <Info label="Human Review" value={formatBoolean(system.humanReviewRequired)} />
            <Info label="Audit Frequency" value={system.auditFrequency || "—"} />
            <Info label="Training Data" value={system.trainingDataCategory || "—"} />
            <Info label="Oversight Model" value={system.oversightModel || "—"} />
            <Info label="Evaluation Protocol" value={system.evaluationProtocol || "—"} />
            <Info
              label="Certified Tier / Band"
              value={
                system.certifiedTier || system.certifiedBand
                  ? `${system.certifiedTier || "—"} / ${system.certifiedBand || "—"}`
                  : "—"
              }
            />
            <Info label="Decision Status" value={system.decisionStatus || "—"} />
            <Info label="Certification Status" value={system.certificationStatus || "—"} />
            <Info label="Valid From" value={formatDate(system.validFrom)} />
            <Info label="Valid To" value={formatDate(system.validTo)} />
            <Info label="Approved At" value={formatDate(system.approvedAt)} />
            <Info label="Published At" value={formatDate(system.publishedAt)} />
            <Info label="Registry Status" value={system.registryStatus || "—"} />
            <Info label="Renewal Status" value={system.renewalStatus || "—"} />
          </div>

          <div className="mt-6 rounded-2xl bg-black/[0.03] p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
              Intended Use
            </div>
            <div className="mt-2 text-[15px] leading-7 text-black/78">
              {system.intendedUse || "No intended use available."}
            </div>
          </div>

          <div className="mt-4 rounded-2xl bg-black/[0.03] p-5">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
              Public Summary
            </div>
            <div className="mt-2 text-[15px] leading-7 text-black/78">
              {system.publicSummary || "No public summary available."}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            RELATED TRUST SURFACES
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Registry linkage and public trust context
          </h2>

          <p className="mt-3 max-w-[860px] text-[15px] leading-[1.8] text-black/68">
            This system record is linked to a canonical GAFAIG registry record.
            Public certification claims should always be validated against the
            registry record itself.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <TrustCard
              title="Canonical Registry Record"
              body="The linked registry record is the public certification source of truth for this disclosed AI system."
              actionLabel={system.registryId ? "Open Registry Record" : undefined}
              actionHref={system.registryId ? `/registry/${system.registryId}` : undefined}
            />

            <TrustCard
              title="Systems Registry Surface"
              body="The AI Systems Registry provides system-level public disclosure across all published GAFAIG-linked systems."
              actionLabel="Open AI Systems Registry"
              actionHref="/registry/ai-systems"
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
  breakAll = false,
}: {
  label: string;
  value: string;
  breakAll?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div
        className={`mt-3 text-[20px] font-semibold leading-tight tracking-tight text-black ${
          breakAll ? "break-all" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-black/5 px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[14px] text-black/85 break-words">{value}</div>
    </div>
  );
}

function TrustCard({
  title,
  body,
  actionLabel,
  actionHref,
}: {
  title: string;
  body: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <h3 className="text-[22px] font-semibold tracking-tight text-black">
        {title}
      </h3>

      <p className="mt-3 text-[15px] leading-7 text-black/72">{body}</p>

      {actionLabel && actionHref ? (
        <div className="mt-5">
          <PublicButtonLink href={actionHref} variant="secondary" size="sm">
            {actionLabel}
          </PublicButtonLink>
        </div>
      ) : null}
    </div>
  );
}