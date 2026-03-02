// app/admin/verification/[caseId]/evidence/page.tsx
import EvidencePageClient from "./EvidencePageClient";

export const dynamic = "force-dynamic";

export default function EvidencePage({ params }: { params: { caseId: string } }) {
  const caseId = params.caseId;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <EvidencePageClient caseId={caseId} />
    </div>
  );
}