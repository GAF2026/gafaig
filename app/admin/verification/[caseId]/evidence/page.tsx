import AdminNav from "../../../_components/AdminNav";
import AdminPageHeader from "../../../_components/AdminPageHeader";
import PublicButtonLink from "../../../../_components/PublicButtonLink";
import EvidencePageClient from "./EvidencePageClient";

export const dynamic = "force-dynamic";

export default function EvidencePage({
  params,
}: {
  params: { caseId: string };
}) {
  const caseId = params.caseId;

  return (
    <div className="min-h-screen bg-white text-black">
      <AdminNav />

      <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
        <AdminPageHeader
          title={`Evidence — ${caseId}`}
          description="Add, link, and summarize evidence artifacts for this verification case."
          actions={
            <div className="flex flex-wrap gap-3">
              <PublicButtonLink
                href={`/admin/verification/${encodeURIComponent(caseId)}`}
                variant="secondary"
                size="sm"
              >
                ← Back
              </PublicButtonLink>

              <PublicButtonLink
                href={`/admin/verification/${encodeURIComponent(caseId)}/findings`}
                variant="secondary"
                size="sm"
              >
                Findings
              </PublicButtonLink>

              <PublicButtonLink
                href={`/admin/verification/${encodeURIComponent(caseId)}/score`}
                variant="secondary"
                size="sm"
              >
                Score →
              </PublicButtonLink>
            </div>
          }
        />

        <EvidencePageClient caseId={caseId} />
      </main>
    </div>
  );
}