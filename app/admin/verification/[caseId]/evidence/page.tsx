import EvidencePageClient from "./EvidencePageClient";

export default function Page({ params }: { params: { caseId: string } }) {
  return <EvidencePageClient caseId={params.caseId} />;
}