import Link from "next/link";
import StatusChip from "@/components/ui/StatusChip";
import type { RegistryAiSystemRow } from "@/types/registry";

type Props = {
  system: RegistryAiSystemRow;
};

export default function AISystemCard({ system }: Props) {
  const organizationHref = system.ENTITY_NAME
    ? `/registry/ai-systems?org=${encodeURIComponent(system.ENTITY_NAME)}`
    : null;

  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-[20px] font-semibold leading-[1.3] text-black">
            {system.SYSTEM_NAME ?? "Unnamed AI system"}
          </h3>

          {system.ENTITY_NAME ? (
            <div className="mt-1 text-[14px] text-black/70">
              Organization:{" "}
              <Link
                href={organizationHref!}
                className="font-medium text-black underline underline-offset-2 hover:text-black/70"
              >
                {system.ENTITY_NAME}
              </Link>
            </div>
          ) : null}

          <div className="mt-3 flex flex-wrap gap-2">
            {system.SYSTEM_TYPE ? (
              <StatusChip>{system.SYSTEM_TYPE}</StatusChip>
            ) : null}

            {system.DEPLOYMENT_STATUS ? (
              <StatusChip>{system.DEPLOYMENT_STATUS}</StatusChip>
            ) : null}

            {system.OVERSIGHT_LEVEL ? (
              <StatusChip>{system.OVERSIGHT_LEVEL}</StatusChip>
            ) : null}

            {system.RISK_TIER ? (
              <StatusChip>{system.RISK_TIER}</StatusChip>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            Intended use
          </div>
          <div className="mt-2 text-[14px] text-black/85">
            {system.INTENDED_USE ?? "—"}
          </div>
        </div>

        <div>
          <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
            Public summary
          </div>
          <div className="mt-2 text-[14px] text-black/85">
            {system.PUBLIC_SUMMARY ?? "—"}
          </div>
        </div>
      </div>
    </div>
  );
}