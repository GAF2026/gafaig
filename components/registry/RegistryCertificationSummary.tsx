import StatusChip from "@/components/ui/StatusChip";
import type { RegistryRow } from "@/types/registry";

type Props = {
  row: RegistryRow;
  formatDate: (value?: string | null) => string;
};

export default function RegistryCertificationSummary({
  row,
  formatDate,
}: Props) {
  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-12">
      <div className="rounded-2xl border border-black/10 p-5 md:col-span-8">
        <h2 className="text-[16px] font-semibold text-black">
          Certification outcome
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Status
            </div>
            <div className="mt-2">
              <StatusChip>{row.decisionStatus}</StatusChip>
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Score
            </div>
            <div className="mt-2 text-[16px] font-semibold text-black">
              {row.certifiedScore ?? "—"}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Tier
            </div>
            <div className="mt-2 text-[16px] font-semibold text-black">
              {row.certifiedTier ?? "—"}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Band
            </div>
            <div className="mt-2 text-[16px] font-semibold text-black">
              {row.certifiedBand ?? "—"}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Certified at
            </div>
            <div className="mt-2 text-[14px] text-black/85">
              {formatDate(row.certifiedAt)}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Valid from
            </div>
            <div className="mt-2 text-[14px] text-black/85">
              {formatDate(row.validFrom)}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Valid to
            </div>
            <div className="mt-2 text-[14px] text-black/85">
              {formatDate(row.validTo)}
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-black/10 pt-4 text-[13px] text-black/60">
          Application ID:{" "}
          <span className="font-mono text-black/80">{row.applicationId}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-black/10 p-5 md:col-span-4">
        <h2 className="text-[16px] font-semibold text-black">Entity</h2>

        <div className="mt-4 space-y-4">
          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Name
            </div>
            <div className="mt-2 text-[14px] font-semibold text-black">
              {row.entityName}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Type
            </div>
            <div className="mt-2 text-[14px] text-black/85">
              {row.entityType ?? "—"}
            </div>
          </div>

          <div>
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/60">
              Country
            </div>
            <div className="mt-2 text-[14px] text-black/85">
              {row.country ?? "—"}
            </div>
          </div>

          <div className="border-t border-black/10 pt-4 text-[13px] text-black/60">
            Registry ID:{" "}
            <span className="font-mono text-black/80">{row.registryId}</span>
          </div>
        </div>
      </div>
    </section>
  );
}