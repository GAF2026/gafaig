// app/registry/[registryId]/page.tsx
import RegistryAiSystemsSection from "@/components/registry/RegistryAiSystemsSection";
import RegistryBadgePanel from "@/components/registry/RegistryBadgePanel";
import RegistryCertificationSummary from "@/components/registry/RegistryCertificationSummary";
import RegistryHeaderPanel from "@/components/registry/RegistryHeaderPanel";
import RegistryVerificationPanel from "@/components/registry/RegistryVerificationPanel";
import { isGafaigRegistryId } from "@/lib/ids";
import {
  getRegistryAiSystems,
  getRegistryRecord,
  getVerification,
} from "@/lib/registry/api";
import { getBaseUrl } from "@/lib/registry/urls";

export const dynamic = "force-dynamic";

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default async function RegistryRecordPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = String(params.registryId || "").trim().toUpperCase();
  const isValidRegistryId = isGafaigRegistryId(registryId);

  const baseUrl = getBaseUrl();
  const absoluteRecordUrl = `${baseUrl}/registry/${encodeURIComponent(registryId)}`;
  const absoluteVerifyUrl = `${baseUrl}/api/verify/${encodeURIComponent(registryId)}`;

  const badgeSrcAbsolute = `${baseUrl}/images/gafaig-badge-verified-new.png`;
  const badgeSrcRelative = `/images/gafaig-badge-verified-new.png`;

  if (!isValidRegistryId) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
        <RegistryHeaderPanel
          registryId={registryId || "Invalid registry ID"}
          entityName={null}
          decisionStatus={null}
          showVerificationState={false}
          isVerified={false}
          absoluteVerifyUrl={absoluteVerifyUrl}
          absoluteRecordUrl={absoluteRecordUrl}
        />

        <section className="rounded-2xl border border-black/10 p-5">
          <div className="font-semibold text-black">Record not found</div>
          <p className="mt-2 text-[14px] leading-[1.7] text-black/70">
            No public registry record exists for{" "}
            <span className="font-mono">
              {registryId || "(missing registry ID)"}
            </span>
            .
          </p>
        </section>
      </main>
    );
  }

  const [data, aiSystemsData, verifyData] = await Promise.all([
    getRegistryRecord(registryId),
    getRegistryAiSystems(registryId),
    getVerification(registryId),
  ]);

  const row = data.ok && data.rows.length ? data.rows[0] : null;
  const isVerified = verifyData.ok ? !!verifyData.verified : false;

  return (
    <main className="mx-auto max-w-[1100px] px-6 pt-14 pb-16">
      <RegistryHeaderPanel
        registryId={registryId}
        entityName={row?.entityName}
        decisionStatus={row?.decisionStatus}
        showVerificationState={verifyData.ok}
        isVerified={isVerified}
        absoluteVerifyUrl={absoluteVerifyUrl}
        absoluteRecordUrl={absoluteRecordUrl}
      />

      {!data.ok ? (
        <section className="rounded-2xl border border-black/10 p-5">
          <div className="font-semibold text-black">Unable to load record</div>
          <p className="mt-2 text-[14px] leading-[1.7] text-black/70">
            {data.error}
          </p>
        </section>
      ) : !row ? (
        <section className="rounded-2xl border border-black/10 p-5">
          <div className="font-semibold text-black">Record not found</div>
          <p className="mt-2 text-[14px] leading-[1.7] text-black/70">
            No public registry record exists for{" "}
            <span className="font-mono">{registryId}</span>.
          </p>
        </section>
      ) : (
        <>
          <RegistryCertificationSummary row={row} formatDate={formatDate} />

          <RegistryVerificationPanel
            absoluteVerifyUrl={absoluteVerifyUrl}
            verifyData={verifyData}
          />

          <RegistryAiSystemsSection aiSystemsData={aiSystemsData} />

          <RegistryBadgePanel
            absoluteRecordUrl={absoluteRecordUrl}
            absoluteVerifyUrl={absoluteVerifyUrl}
            badgeSrcAbsolute={badgeSrcAbsolute}
            badgeSrcRelative={badgeSrcRelative}
          />

          <section className="mt-10 border-t border-black/10 pt-8">
            <h2 className="text-[16px] font-semibold text-black">
              Privacy boundary
            </h2>
            <p className="mt-3 max-w-[920px] text-[16px] leading-[1.8] text-black/80">
              The registry confirms certification without exposing internal
              evidence, findings, reviewer rationales, or private assessment
              materials.
            </p>
          </section>
        </>
      )}
    </main>
  );
}