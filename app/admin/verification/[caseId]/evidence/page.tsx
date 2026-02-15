import AdminShell from "../../../_components/AdminShell";
import EvidencePageClient from "./EvidencePageClient";

export default function EvidencePage({ params }: { params: { caseId: string } }) {
  const caseId = params.caseId;

  return (
    <AdminShell title={`Admin • Verification • Evidence • ${caseId}`}>
      <EvidencePageClient caseId={caseId} />
    </AdminShell>
  );
}