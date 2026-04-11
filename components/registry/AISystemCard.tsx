import Link from "next/link";
import type { RegistryAiSystemRow } from "@/types/registry";

type Props = {
  system: RegistryAiSystemRow;
};

function yesNo(value: boolean | null | undefined): string {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "—";
}

export default function AISystemCard({ system }: Props) {
  const organizationHref = system.entityName
    ? `/registry/ai-systems?org=${encodeURIComponent(system.entityName)}`
    : null;

  const registryHref = system.registryId
    ? `/registry/${system.registryId}`
    : null;

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[22px] font-semibold tracking-tight text-black">
              {system.systemName || "Unnamed system"}
            </h3>

            {system.systemType ? (
              <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-xs font-medium text-black/70 ring-1 ring-black/10">
                {system.systemType}
              </span>
            ) : null}

            {system.riskTier ? (
              <span className="rounded-full bg-black/[0.04] px-2.5 py-1 text-xs font-medium text-black/70 ring-1 ring-black/10">
                {system.riskTier} risk
              </span>
            ) : null}
          </div>

          <div className="mt-2 text-sm text-black/55">
            {system.systemId || "No system ID"}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Field
              label="Organization"
              value={
                organizationHref ? (
                  <Link
                    href={organizationHref}
                    className="underline underline-offset-4"
                  >
                    {system.entityName}
                  </Link>
                ) : (
                  system.entityName || "—"
                )
              }
            />

            <Field label="Registry ID" value={system.registryId || "—"} />

            <Field
              label="Registry Record"
              value={
                registryHref ? (
                  <Link
                    href={registryHref}
                    className="underline underline-offset-4"
                  >
                    Open record
                  </Link>
                ) : (
                  "—"
                )
              }
            />

            <Field label="Deployment Status" value={system.deploymentStatus || "—"} />
            <Field label="Oversight Level" value={system.oversightLevel || "—"} />
            <Field label="Human Review Required" value={yesNo(system.humanReviewRequired)} />
            <Field label="Training Data Category" value={system.trainingDataCategory || "—"} />
            <Field label="Oversight Model" value={system.oversightModel || "—"} />
            <Field label="Audit Frequency" value={system.auditFrequency || "—"} />
            <Field label="Decision Status" value={system.decisionStatus || "—"} />
            <Field label="Certified Tier" value={system.certifiedTier || "—"} />
            <Field label="Certified Band" value={system.certifiedBand || "—"} />
          </div>

          <div className="mt-4 rounded-xl bg-black/[0.03] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
              Intended Use
            </div>
            <div className="mt-2 text-sm leading-6 text-black/75">
              {system.intendedUse || "No intended use available."}
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-black/[0.03] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
              Public Summary
            </div>
            <div className="mt-2 text-sm leading-6 text-black/75">
              {system.publicSummary || "No public summary available."}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black/5 px-3 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div className="mt-2 text-[14px] text-black/85 break-words">{value}</div>
    </div>
  );
}