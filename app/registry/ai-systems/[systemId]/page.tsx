import Link from "next/link";
import { notFound } from "next/navigation";
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import {
  getRegistryAiSystemBySystemId,
  getRelatedRegistryAiSystems,
} from "@/lib/queries/registry-ai-systems";

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

  const relatedSystems = await getRelatedRegistryAiSystems({
    registryId: system.registryId,
    excludeSystemId: system.systemId,
    limit: 6,
  });

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="AI SYSTEM RECORD"
          title={system.systemName || "Unnamed system"}
          description="This page is the public system-level disclosure surface for an AI system linked to a canonical GAFAIG registry record."
          secondaryDescription="System-level public disclosure provides context around a linked AI system, but public certification is determined by the official registry record. This page helps external parties understand the disclosed system’s risk posture, oversight, deployment context, and relationship to the broader GAFAIG trust infrastructure."
          actions={
            <>
              {system.registryId ? (
                <PublicButtonLink
                  href={`/registry/${system.registryId}`}
                  variant="primary"
                >
                  View Official Certification Record
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

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            CERTIFICATION SIGNAL
          </div>

          <div className="mt-4 flex flex-col gap-4 rounded-2xl border border-black/10 bg-black/[0.02] p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${toneForCertification(
                    system.certificationStatus
                  )}`}
                >
                  {system.certificationStatus || "Certification Pending"}
                </span>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${toneForRisk(
                    system.riskTier
                  )}`}
                >
                  {system.riskTier ? `${system.riskTier} Risk` : "Risk Undisclosed"}
                </span>
              </div>

              <h2 className="mt-3 text-[28px] font-semibold tracking-tight text-black md:text-[34px]">
                {system.certifiedTier || system.certifiedBand
                  ? `${system.certifiedTier || "—"} / ${system.certifiedBand || "—"}`
                  : "Public system disclosure linked to a certified registry record"}
              </h2>

              <p className="mt-2 text-[15px] leading-7 text-black/72">
                Validity window: {formatDate(system.validFrom)} → {formatDate(system.validTo)}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <MetricCard label="System ID" value={system.systemId || "—"} breakAll />
              <MetricCard
                label="Developer"
                value={system.developerOrganization || system.entityName || "—"}
              />
              <MetricCard label="Deployment" value={system.deploymentStatus || "—"} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHY THIS SYSTEM IS IN THE REGISTRY
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Public disclosure connected to a certified trust record
          </h2>

          <p className="mt-3 max-w-[900px] text-[15px] leading-[1.85] text-black/72">
            This AI system is publicly disclosed because it is linked to a GAFAIG
            verification case and contributes to a canonical registry record.
            Public system disclosure increases transparency and trust context,
            but it does not replace formal certification, which is issued at the
            registry level.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <TrustCard
              title="Canonical registry linkage"
              body="Every disclosed system on this page is tied back to an official GAFAIG registry record."
            />
            <TrustCard
              title="System-level transparency"
              body="This page surfaces public metadata, risk posture, deployment context, and oversight signals."
            />
            <TrustCard
              title="Certification remains registry-level"
              body="Public certification status should always be validated against the linked registry record."
            />
          </div>
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
              </div>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-black/68">
                <div>
                  <span className="font-medium text-black/50">Type:</span>{" "}
                  {system.systemType || "—"}
                </div>
                <div>
                  <span className="font-medium text-black/50">Entity:</span>{" "}
                  {system.entityName ? (
                    <Link
                      href={`/explorer/organizations?org=${encodeURIComponent(
                        system.entityName
                      )}`}
                      className="underline underline-offset-4"
                    >
                      {system.entityName}
                    </Link>
                  ) : (
                    "—"
                  )}
                </div>
                <div>
                  <span className="font-medium text-black/50">Country:</span>{" "}
                  {system.country ? (
                    <Link
                      href={`/explorer/countries?country=${encodeURIComponent(
                        system.country
                      )}`}
                      className="underline underline-offset-4"
                    >
                      {system.country}
                    </Link>
                  ) : (
                    "Not disclosed"
                  )}
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

          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <SectionCard title="Governance Controls">
              <Info label="Oversight Level" value={system.oversightLevel || "—"} />
              <Info label="Human Review" value={formatBoolean(system.humanReviewRequired)} />
              <Info label="Audit Frequency" value={system.auditFrequency || "—"} />
              <Info label="Evaluation Protocol" value={system.evaluationProtocol || "—"} />
            </SectionCard>

            <SectionCard title="Risk and Deployment">
              <Info label="Risk Tier" value={system.riskTier || "—"} />
              <Info label="Deployment Status" value={system.deploymentStatus || "—"} />
              <Info label="Training Data" value={system.trainingDataCategory || "—"} />
              <Info label="Oversight Model" value={system.oversightModel || "—"} />
            </SectionCard>

            <SectionCard title="Certification Lifecycle">
              <Info label="Decision Status" value={system.decisionStatus || "—"} />
              <Info label="Certification Status" value={system.certificationStatus || "—"} />
              <Info label="Valid From" value={formatDate(system.validFrom)} />
              <Info label="Valid To" value={formatDate(system.validTo)} />
              <Info label="Approved At" value={formatDate(system.approvedAt)} />
              <Info label="Published At" value={formatDate(system.publishedAt)} />
              <Info label="Registry Status" value={system.registryStatus || "—"} />
              <Info label="Renewal Status" value={system.renewalStatus || "—"} />
            </SectionCard>
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

        {relatedSystems.length > 0 ? (
          <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
            <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
              RELATED SYSTEMS
            </div>

            <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
              Other systems linked to the same certification record
            </h2>

            <p className="mt-3 max-w-[860px] text-[15px] leading-[1.8] text-black/68">
              These systems are connected to the same canonical registry record,
              allowing third parties to understand the broader trust surface
              associated with this certification.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {relatedSystems.map((item) => (
                <Link
                  key={item.systemId || `${item.registryId}-${item.caseId}-${item.systemName}`}
                  href={`/registry/ai-systems/${item.systemId}`}
                  className="rounded-2xl border border-black/10 p-5 transition hover:bg-black/[0.02]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[18px] font-semibold tracking-tight text-black">
                        {item.systemName || "Unnamed system"}
                      </div>
                      <div className="mt-1 text-sm text-black/55">
                        {item.systemId || "No system ID"}
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${toneForRisk(
                        item.riskTier
                      )}`}
                    >
                      {item.riskTier || "—"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-1 text-sm text-black/68">
                    <div>
                      <span className="font-medium text-black/50">Developer:</span>{" "}
                      {item.developerOrganization || item.entityName || "—"}
                    </div>
                    <div>
                      <span className="font-medium text-black/50">Deployment:</span>{" "}
                      {item.deploymentStatus || "—"}
                    </div>
                    <div>
                      <span className="font-medium text-black/50">Certification:</span>{" "}
                      {item.certificationStatus || "—"}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

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

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <h3 className="text-[20px] font-semibold tracking-tight text-black">
        {title}
      </h3>
      <div className="mt-4 grid gap-3">{children}</div>
    </div>
  );
}