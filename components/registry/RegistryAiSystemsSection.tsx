import AISystemCard from "@/components/registry/AISystemCard";
import type { RegistryAiSystemsApiResponse } from "@/types/registry";

type Props = {
  aiSystemsData: RegistryAiSystemsApiResponse;
};

function dataOrEmpty<T>(rows: T[] | undefined | null): T[] {
  return Array.isArray(rows) ? rows : [];
}

export default function RegistryAiSystemsSection({ aiSystemsData }: Props) {
  const aiSystems = aiSystemsData.ok ? dataOrEmpty(aiSystemsData.rows) : [];

  return (
    <section className="mt-10 border-t border-black/10 pt-8">
      <h2 className="text-[16px] font-semibold text-black">
        AI systems covered by this certification
      </h2>

      <p className="mt-3 max-w-[920px] text-[14px] leading-[1.8] text-black/75">
        These are the public AI system disclosures included within the scope
        of this certification.
      </p>

      {!aiSystemsData.ok ? (
        <div className="mt-6 rounded-2xl border border-black/10 p-5">
          <div className="font-semibold text-black">Unable to load AI systems</div>
          <p className="mt-2 text-[14px] leading-[1.7] text-black/70">
            {aiSystemsData.error}
          </p>
        </div>
      ) : aiSystems.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-black/10 p-5 text-[14px] text-black/70">
          No AI systems have been published for this certification record.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4">
          {aiSystems.map((s) => (
            <AISystemCard key={s.SYSTEM_ID} system={s} />
          ))}
        </div>
      )}
    </section>
  );
}