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
  const absoluteRecordUrl = `${baseUrl}/registry/${encodeURIComponent(
    registryId
  )}`;
  const absoluteVerifyUrl = `${baseUrl}/api/verify/${encodeURIComponent(
    registryId
  )}`;

  const badgeSrcAbsolute = `${baseUrl}/images/gafaig-badge-verified-new.png`;
  const badgeSrcRelative = `/images/gafaig-badge-verified-new.png`;

  if (!isValidRegistryId) {
    return (
      <main className="mx-auto max-w-[1100px] px-6 pb-20 pt-14">
        <RegistryHeaderPanel
          registryId={registryId || "Invalid registry ID"}
          entityName={null}
          decisionStatus={null}
          showVerificationState={false}
          isVerified={false}
          absoluteVerifyUrl={absoluteVerifyUrl}
          absoluteRecordUrl={absoluteRecordUrl}
        />

        <section className="rounded-2xl border border-black/10 bg-white/70 p-6">
          <div className="text-[16px] font-semibold text-black">
            Record not found
          </div>
          <p className="mt-3 max-w-[760px] text-[15px] leading-[1.75] text-black/72">
            No public GAFAIG certification record exists for{" "}
            <span className="font-mono text-black">
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
    <main className="mx-auto max-w-[1100px] px-6 pb-20 pt-14">
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
        <section className="rounded-2xl border border-black/10 bg-white/70 p-6">
          <div className="text-[16px] font-semibold text-black">
            Unable to load record
          </div>
          <p className="mt-3 max-w-[760px] text-[15px] leading-[1.75] text-black/72">
            {data.error}
          </p>
        </section>
      ) : !row ? (
        <section className="rounded-2xl border border-black/10 bg-white/70 p-6">
          <div className="text-[16px] font-semibold text-black">
            Record not found
          </div>
          <p className="mt-3 max-w-[760px] text-[15px] leading-[1.75] text-black/72">
            No public GAFAIG certification record exists for{" "}
            <span className="font-mono text-black">{registryId}</span>.
          </p>
        </section>
      ) : (
        <>
          <section className="border-t border-black/10 pt-8">
            <div className="grid gap-4 md:grid-cols-[1.35fr_.65fr]">
              <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
                <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                  Public certification record
                </div>
                <p className="mt-3 max-w-[760px] text-[15px] leading-[1.8] text-black/78">
                  This record confirms that the organization completed a GAFAIG
                  verification process for human oversight across AI
                  infrastructure. Public disclosure is limited to certification
                  outcomes and linked verification materials.
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white/70 p-5">
                <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
                  Registry function
                </div>
                <p className="mt-3 text-[15px] leading-[1.8] text-black/78">
                  The registry supports independent validation of certification
                  status without exposing internal evidence, findings, or private
                  assessment materials.
                </p>
              </div>
            </div>
          </section>

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
              This public record confirms certification outcomes without exposing
              internal evidence, findings, reviewer rationales, or private
              assessment materials.
            </p>
          </section>
        </>
      )}
    </main>
  );
}