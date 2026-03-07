// app/admin/verification/[caseId]/evidence/page.tsx

import EvidencePageClient from "./EvidencePageClient";
import AdminNav from "../../../_components/AdminNav";
import AdminPageHeader from "../../../_components/AdminPageHeader";

export const dynamic = "force-dynamic";

export default function EvidencePage({ params }: { params: { caseId: string } }) {
  const caseId = params.caseId;

  return (
    <div>
      <AdminNav />

      <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
        <AdminPageHeader
          title={`Evidence — ${caseId}`}
          description="Add and manage evidence artifacts linked to this verification case."
        />

        <EvidencePageClient caseId={caseId} />
      </main>
    </div>
  );
}