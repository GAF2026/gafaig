import AISystemCard from "@/components/registry/AISystemCard";
import type { RegistryAiSystemRow } from "@/types/registry";

type Props = {
  aiSystems: RegistryAiSystemRow[];
};

export default function RegistryAiSystemsSection({ aiSystems }: Props) {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            AI SYSTEMS
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Linked public AI systems
          </h2>

          <p className="mt-3 max-w-[840px] text-[15px] leading-[1.8] text-black/68">
            Public AI systems associated with this registry record through the
            canonical GAFAIG systems view.
          </p>
        </div>

        <div className="text-sm text-black/55">
          {aiSystems.length} {aiSystems.length === 1 ? "system" : "systems"}
        </div>
      </div>

      {aiSystems.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 p-6 text-sm text-black/60">
          No public AI systems are currently linked to this registry record.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4">
          {aiSystems.map((s) => (
            <AISystemCard
              key={s.systemId || `${s.registryId}-${s.caseId}-${s.systemName}`}
              system={s}
            />
          ))}
        </div>
      )}
    </section>
  );
}