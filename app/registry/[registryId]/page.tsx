import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RegistryRecord = {
  registryId?: string;
  registryIdRaw?: string;
  entityName?: string | null;
  entityType?: string | null;
  country?: string | null;
  applicationId?: string | null;
  caseId?: string | null;
  certifiedScore?: number | string | null;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  certifiedAt?: string | null;
  certificationStatus?: string | null;
  decisionStatus?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
};

type RegistryApiResponse = {
  ok?: boolean;
  row?: RegistryRecord | null;
  rows?: RegistryRecord[];
};

type VerifyResponse = {
  ok?: boolean;
  registryId?: string;
  entityName?: string;
  decisionStatus?: string;
  certifiedTier?: string | null;
  certifiedBand?: string | null;
  certifiedAt?: string | null;
  validFrom?: string | null;
  validTo?: string | null;
  verificationKeyUrl?: string | null;
  signedAt?: string | null;
  signature?: string | null;
  signedMessageString?: string | null;
  signedMessageObject?: Record<string, unknown> | null;
};

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  );
}

function safe(value?: string | null): string {
  const s = String(value ?? "").trim();
  return s || "—";
}

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function formatScore(value?: number | string | null): string {
  if (value === null || value === undefined || value === "") return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);
  return n.toFixed(2);
}

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function statusTone(value: string) {
  const v = value.trim().toUpperCase();
  if (v === "CERTIFIED") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  if (v === "APPROVED") {
    return "bg-blue-50 text-blue-700 ring-blue-200";
  }
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function prettifyBand(tier?: string | null, band?: string | null): string {
  const t = safe(tier);
  const b = safe(band);
  if (t !== "—" && b !== "—") return `${t} · Band ${b}`;
  if (t !== "—") return t;
  if (b !== "—") return `Band ${b}`;
  return "—";
}

async function getRegistryRecord(registryId: string): Promise<RegistryRecord | null> {
  const baseUrl = getBaseUrl();

  try {
    const res = await fetch(
      `${baseUrl}/api/registry?registryId=${encodeURIComponent(registryId)}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const data = (await res.json()) as RegistryApiResponse;

    if (data?.row) return data.row;

    if (Array.isArray(data?.rows) && data.rows.length > 0) {
      return data.rows[0] ?? null;
    }

    return null;
  } catch {
    return null;
  }
}

async function getVerifyData(registryId: string): Promise<VerifyResponse | null> {
  const baseUrl = getBaseUrl();

  try {
    const res = await fetch(
      `${baseUrl}/api/verify/${encodeURIComponent(registryId)}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return null;

    const data = (await res.json()) as VerifyResponse;
    return data ?? null;
  } catch {
    return null;
  }
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/50">
        {label}
      </div>
      <div className="mt-3 break-words text-[16px] font-semibold leading-[1.45] text-black">
        {value}
      </div>
    </div>
  );
}

function StatementCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-[1.8] text-black/72">{body}</p>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
      <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
        {eyebrow}
      </div>
      <h2 className="mt-4 max-w-[900px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-[980px] text-[16px] leading-[1.85] text-black/72">
          {description}
        </p>
      ) : null}
      <div className="mt-7">{children}</div>
    </section>
  );
}

export default async function RegistryRecordPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryId = decodeURIComponent(params.registryId);
  const [record, verify] = await Promise.all([
    getRegistryRecord(registryId),
    getVerifyData(registryId),
  ]);

  if (!record) {
    notFound();
  }

  const entityName = safe(record.entityName);
  const decisionStatus = safe(record.decisionStatus);
  const certificationStatus = safe(record.certificationStatus);
  const certifiedAt = record.certifiedAt ?? null;
  const isCertified = Boolean(String(certifiedAt ?? "").trim());
  const isApprovedOnly =
    !isCertified && decisionStatus.toUpperCase() === "APPROVED";

  const pageEyebrow = isCertified
    ? "CANONICAL PUBLIC TRUST RECORD"
    : isApprovedOnly
    ? "APPROVED PUBLIC RECORD"
    : "PUBLIC RECORD";

  const headerDescription = isCertified
    ? "This page is the canonical public trust record for this certified entity within the GAFAIG registry of record. It presents the public certification outcome, trust status, validity window, and verification surfaces without exposing private reviewer materials or controlled internal evidence."
    : isApprovedOnly
    ? "This page is an approved public record surfaced through GAFAIG Explorer. It reflects a completed governance review and public publication state, but it does not represent a certified public outcome."
    : "This page is a public record surfaced through the GAFAIG trust surface.";

  const primaryStatusLabel = isCertified
    ? "Certified"
    : isApprovedOnly
    ? "Approved"
    : certificationStatus;

  const signedMessageObject =
    verify?.signedMessageObject && typeof verify.signedMessageObject === "object"
      ? JSON.stringify(verify.signedMessageObject, null, 2)
      : "—";

  const governanceDimensions = [
    "Transparency",
    "Accountability",
    "Safety & Risk Management",
    "Human Oversight",
    "Data Governance",
  ];

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={classNames(
                "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ring-1",
                isCertified
                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                  : "bg-blue-50 text-blue-700 ring-blue-200"
              )}
            >
              {primaryStatusLabel}
            </span>

            {decisionStatus !== "—" ? (
              <span
                className={classNames(
                  "inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ring-1",
                  statusTone(decisionStatus)
                )}
              >
                {decisionStatus}
              </span>
            ) : null}
          </div>

          <div className="mt-5 text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            {pageEyebrow}
          </div>

          <h1 className="mt-4 max-w-[980px] text-[44px] font-semibold leading-[1.05] tracking-tight text-black md:text-[56px]">
            {entityName}
          </h1>

          <p className="mt-5 max-w-[980px] text-[16px] leading-[1.9] text-black/75">
            {headerDescription}
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-5">
            <InfoCard
              label="Trust Status"
              value={
                isCertified
                  ? "Certified"
                  : isApprovedOnly
                  ? "Approved Only"
                  : certificationStatus
              }
            />
            {isCertified ? (
              <>
                <InfoCard
                  label="Certification"
                  value={prettifyBand(record.certifiedTier, record.certifiedBand)}
                />
                <InfoCard label="Certified At" value={formatDate(record.certifiedAt)} />
              </>
            ) : (
              <>
                <InfoCard label="Record Type" value="Approved Public Record" />
                <InfoCard label="Certified At" value="—" />
              </>
            )}
            <InfoCard label="Decision" value={decisionStatus} />
            <InfoCard label="Valid To" value={formatDate(record.validTo)} />
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            {isApprovedOnly ? (
              <Link
                href="/explorer"
                className="inline-flex items-center rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/90"
              >
                Back to explorer
              </Link>
            ) : null}

            <Link
              href="/registry"
              className="inline-flex items-center rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.04]"
            >
              Back to registry
            </Link>

            {isCertified ? (
              <a
                href={`/api/verify/${encodeURIComponent(registryId)}`}
                className="inline-flex items-center rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black hover:text-white"
              >
                Open verify endpoint
              </a>
            ) : null}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <StatementCard
            title={
              isCertified
                ? "Public certification outcome"
                : "Approved public record"
            }
            body={
              isCertified
                ? "This entity has a published certified outcome in the GAFAIG registry of record. The public surface includes status, certification banding, validity dates, and independently verifiable proof."
                : "This entity has a published approved public record. It may appear in GAFAIG Explorer as part of the public trust surface, but it does not claim a certified public outcome."
            }
          />
          <StatementCard
            title="Privacy boundary"
            body="GAFAIG publishes trust outcomes and public-safe metadata while keeping reviewer materials, raw evidence, internal scoring workflow details, and controlled private verification artifacts out of the public layer."
          />
        </section>

        <Section
          eyebrow="PUBLIC RECORD SUMMARY"
          title={
            isCertified
              ? "Certification and governance summary"
              : "Approval and governance summary"
          }
          description={
            isCertified
              ? "This section summarizes the public certification outcome and the non-sensitive governance context exposed through the GAFAIG trust surface."
              : "This section summarizes the public approval state and the non-sensitive governance context exposed through the GAFAIG trust surface."
          }
        >
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard label="Entity Type" value={safe(record.entityType)} />
            <InfoCard label="Country" value={safe(record.country)} />
            <InfoCard label="Registry ID" value={safe(record.registryId)} />
            <InfoCard label="Application ID" value={safe(record.applicationId)} />
            <InfoCard label="Case ID" value={safe(record.caseId)} />
            {isCertified ? (
              <InfoCard
                label="Certified Score"
                value={formatScore(record.certifiedScore)}
              />
            ) : (
              <InfoCard label="Decision Status" value={decisionStatus} />
            )}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <InfoCard label="Valid From" value={formatDate(record.validFrom)} />
            <InfoCard label="Valid To" value={formatDate(record.validTo)} />
          </div>
        </Section>

        <Section
          eyebrow="PUBLIC-SAFE TRUST EXPLANATION"
          title={
            isCertified
              ? "Reviewed across governance dimensions"
              : "Public-safe governance review scope"
          }
          description={
            isCertified
              ? "GAFAIG publishes certification outcomes and high-level governance review scope without exposing private reviewer materials, internal evidence, control-by-control scoring logic, or controlled workflow details from the private verification engine."
              : "This approved public record may disclose limited public-safe governance review scope without exposing private reviewer materials, internal evidence, control-by-control governance logic, or controlled workflow details from the private verification engine."
          }
        >
          <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/50">
              Review Scope
            </div>
            <div className="mt-3 text-[18px] font-semibold tracking-tight text-black">
              Reviewed across 5 governance dimensions
            </div>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {governanceDimensions.map((dimension) => (
              <div
                key={dimension}
                className="rounded-2xl border border-black/10 bg-white p-5"
              >
                <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/50">
                  Governance Dimension
                </div>
                <div className="mt-3 text-[16px] font-semibold leading-[1.45] text-black">
                  {dimension}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {isCertified ? (
          <Section
            eyebrow="INDEPENDENT VERIFICATION"
            title="Signed public proof"
            description="This technical section contains the public verification materials for this certified record. It supports external validation through the verification endpoint and the published public key, while keeping the human-readable trust record separate from the machine-readable proof payload."
          >
            <div className="flex flex-wrap gap-3">
              <a
                href={`/api/verify/${encodeURIComponent(registryId)}`}
                className="inline-flex items-center rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black hover:text-white"
              >
                Open verify endpoint
              </a>
              <a
                href="/api/.well-known/gafaig-public-key"
                className="inline-flex items-center rounded-full border border-black px-5 py-3 text-sm font-semibold transition hover:bg-black hover:text-white"
              >
                Open public key
              </a>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <InfoCard label="Registry ID" value={safe(record.registryId)} />
              <InfoCard label="Entity" value={entityName} />
              <InfoCard
                label="Decision"
                value={safe(verify?.decisionStatus ?? record.decisionStatus)}
              />
              <InfoCard
                label="Tier / Band"
                value={prettifyBand(
                  verify?.certifiedTier ?? record.certifiedTier,
                  verify?.certifiedBand ?? record.certifiedBand
                )}
              />
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <InfoCard
                label="Verification Key URL"
                value={safe(verify?.verificationKeyUrl)}
              />
              <InfoCard
                label="Signed At"
                value={formatDateTime(verify?.signedAt)}
              />
            </div>

            <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/50">
                Signature
              </div>
              <div className="mt-3 break-all text-[13px] leading-[1.9] text-black/72">
                {safe(verify?.signature)}
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/50">
                Signed Message String
              </div>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-[13px] leading-[1.9] text-black/72">
                {safe(verify?.signedMessageString)}
              </pre>
            </div>

            <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/50">
                Signed Message Object
              </div>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-[13px] leading-[1.9] text-black/72">
                {signedMessageObject}
              </pre>
            </div>

            <div className="mt-4 rounded-2xl border border-black/10 bg-white p-5">
              <div className="text-[18px] font-semibold tracking-tight text-black">
                External verification flow
              </div>
              <ol className="mt-4 space-y-2 pl-5 text-[15px] leading-[1.85] text-black/72">
                <li>Fetch the proof from the verification endpoint for this registry ID.</li>
                <li>Fetch the Ed25519 public key from the published key URL.</li>
                <li>Verify the signature against the exact message string shown here.</li>
                <li>Confirm the public record matches the signed proof payload.</li>
              </ol>
            </div>
          </Section>
        ) : null}
      </div>
    </main>
  );
}