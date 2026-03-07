import AdminNav from "../../../_components/AdminNav";
import AdminPageHeader from "../../../_components/AdminPageHeader";
import EvidencePageClient from "./EvidencePageClient";

export const dynamic = "force-dynamic";

export default function EvidencePage({ params }: { params: { caseId: string } }) {
  const caseId = params.caseId;

  return (
    <div className="min-h-screen bg-white text-black">
      <AdminNav />

      <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
        <AdminPageHeader
          title={`Evidence — ${caseId}`}
          description="Add, link, and summarize evidence artifacts for this verification case."
        />

        <EvidencePageClient caseId={caseId} />
      </main>
    </div>
  );
}