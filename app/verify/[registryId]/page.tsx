export const dynamic = "force-dynamic";
export const revalidate = 0;

import { notFound } from "next/navigation";
import { createPublicKey, verify as cryptoVerify } from "crypto";
import PublicButtonLink from "@/app/_components/PublicButtonLink";

type VerifyApiResponse = {
  ok?: boolean;
  verified?: boolean;
  registryId?: string;
  record?: {
    registryId?: string;
    registrySnapshotId?: string | null;
    applicationId?: string | null;
    caseId?: string | null;
    recordType?: string | null;
    recordName?: string | null;
    entityName?: string | null;
    entityType?: string | null;
    country?: string | null;
    certificationStatus?: string | null;
    certifiedAt?: string | null;
    validFrom?: string | null;
    validTo?: string | null;
    publishedAt?: string | null;
    renewalStatus?: string | null;
    lifecycleStatus?: string | null;
    visibilityStatus?: string | null;
    verificationEligible?: boolean | string | null;
    badgeEligible?: boolean | string | null;
  } | null;
  proof?: {
    alg?: string;
    kid?: string;
    signature?: string;
    signedAt?: string;
    verificationKeyUrl?: string;
    message?: Record<string, unknown>;
    messageString?: string;
  } | null;
  signature?: string;
  signedAt?: string;
  verificationKeyUrl?: string;
  signedMessageString?: string;
};

type KeyFetchResult = {
  pem: string | null;
  keyId: string | null;
  algorithm: string | null;
};

type SignatureValidationResult = {
  status: "valid" | "invalid" | "unavailable";
  detail: string;
};

function getRuntimeBaseUrl() {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://www.gafaig.com"
  );
}

function resolveUrl(url: string | null | undefined, baseUrl: string): string | null {
  const raw = String(url ?? "").trim();
  if (!raw) return null;
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) return `${baseUrl.replace(/\/+$/, "")}${raw}`;
  return `${baseUrl.replace(/\/+$/, "")}/${raw}`;
}

function safe(v?: string | number | boolean | null) {
  const text = String(v ?? "").trim();
  return text || "—";
}

function formatDate(v?: string | null) {
  return v || "—";
}

function formatDateTime(v?: string | null) {
  return v || "—";
}

function pillTone(value: string) {
  const v = value.toUpperCase();

  if (v === "CERTIFIED") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (v === "ACTIVE") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (v === "VERIFIED") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (v === "EXPIRED") return "bg-amber-50 text-amber-700 ring-amber-200";
  if (v === "REVOKED") return "bg-red-50 text-red-700 ring-red-200";
  if (v === "INVALID") return "bg-red-50 text-red-700 ring-red-200";
  if (v === "UNAVAILABLE") return "bg-slate-100 text-slate-600 ring-slate-200";

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function validationTone(status: SignatureValidationResult["status"]) {
  if (status === "valid") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "invalid") return "bg-red-50 text-red-700 ring-red-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
        {label}
      </div>
      <div className="mt-3 break-words text-[15px] font-semibold text-black">
        {value}
      </div>
    </div>
  );
}

function CodePanel({
  label,
  language,
  value,
}: {
  label: string;
  language: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[13px] font-semibold text-black">{label}</div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/35">
            {language}
          </div>
        </div>

        <ActionButton label="Copy" copyValue={value} compact />
      </div>

      <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words rounded-xl border border-black/10 bg-black/[0.03] p-4 text-[12px] leading-6 text-black/75">
        {value}
      </pre>
    </div>
  );
}

function ActionButton({
  label,
  copyValue,
  compact = false,
}: {
  label: string;
  copyValue: string;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      data-copy-text={copyValue}
      className={`gafaig-copy-button inline-flex items-center justify-center rounded-full border border-black/20 bg-white font-semibold text-black transition hover:bg-black hover:text-white ${
        compact ? "min-h-[34px] px-4 text-xs" : "min-h-[42px] px-5 text-sm"
      }`}
    >
      {label}
    </button>
  );
}

function StepCard({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[12px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {number}
      </div>
      <div className="mt-3 text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[14px] leading-7 text-black/70">{body}</p>
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
      <p className="mt-3 text-[15px] leading-7 text-black/75">{body}</p>
    </div>
  );
}

function FeatureCard({
  title,
  body,
  href,
  cta,
}: {
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <div className="text-[18px] font-semibold tracking-tight text-black">{title}</div>
      <p className="mt-3 text-[15px] leading-7 text-black/75">{body}</p>
      <div className="mt-5">
        <PublicButtonLink href={href} variant="ghost" size="sm">
          {cta} →
        </PublicButtonLink>
      </div>
    </div>
  );
}

function JumpNav() {
  const links = [
    ["#signature-validation", "Signature Validation"],
    ["#record-identity", "Record Identity"],
    ["#trust-flow", "Trust Flow"],
    ["#use-proof", "Use This Proof"],
    ["#trust-verification", "Technical Summary"],
    ["#developer-proof", "Developer Proof"],
    ["#related-urls", "Related URLs"],
  ];

  return (
    <section className="rounded-3xl border border-black/10 bg-white p-6">
      <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
        Page Navigation
      </div>
      <h2 className="mt-3 text-[22px] font-semibold tracking-tight text-black">
        Jump to verification details
      </h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {links.map(([href, label]) => (
          <a
            key={href}
            href={href}
            className="inline-flex min-h-[36px] items-center justify-center rounded-full border border-black/15 bg-white px-4 text-[13px] font-semibold text-black transition hover:bg-black hover:text-white"
          >
            {label}
          </a>
        ))}
      </div>
    </section>
  );
}

async function getVerify(registryId: string): Promise<VerifyApiResponse | null> {
  const baseUrl = getRuntimeBaseUrl();

  const res = await fetch(`${baseUrl}/api/verify/${encodeURIComponent(registryId)}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

async function getVerificationKey(
  url: string | null | undefined,
  baseUrl: string
): Promise<KeyFetchResult> {
  const keyUrl = resolveUrl(url, baseUrl);

  if (!keyUrl) {
    return { pem: null, keyId: null, algorithm: null };
  }

  try {
    const res = await fetch(keyUrl, { cache: "no-store" });
    if (!res.ok) {
      return { pem: null, keyId: null, algorithm: null };
    }

    const parsed = (await res.json()) as Record<string, unknown>;

    const pem =
      String(parsed.publicKeyPem ?? parsed.publicKey ?? parsed.pem ?? "").trim() || null;

    const keyId =
      String(parsed.kid ?? parsed.keyId ?? parsed.key_id ?? "").trim() || null;

    const algorithm =
      String(parsed.alg ?? parsed.algorithm ?? parsed.crv ?? "").trim() || null;

    return { pem, keyId, algorithm };
  } catch {
    return { pem: null, keyId: null, algorithm: null };
  }
}

function decodeSignature(input: string): Buffer | null {
  const raw = String(input ?? "").trim();
  if (!raw) return null;

  try {
    return Buffer.from(raw, "base64");
  } catch {
    // continue
  }

  try {
    const normalized = raw.replace(/-/g, "+").replace(/_/g, "/");
    const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
    return Buffer.from(normalized + padding, "base64");
  } catch {
    return null;
  }
}

function validateSignature(
  messageString: string | null,
  signature: string | null,
  publicKeyPem: string | null
): SignatureValidationResult {
  const msg = String(messageString ?? "");
  const sig = String(signature ?? "").trim();
  const pem = String(publicKeyPem ?? "").trim();

  if (!msg || !sig || !pem) {
    return {
      status: "unavailable",
      detail: "Signature validation inputs are incomplete.",
    };
  }

  try {
    const keyObject = createPublicKey(pem);
    const signatureBuffer = decodeSignature(sig);

    if (!signatureBuffer) {
      return {
        status: "unavailable",
        detail: "The signature could not be decoded from base64 or base64url format.",
      };
    }

    const messageBuffer = Buffer.from(msg, "utf8");
    const isValid = cryptoVerify(null, messageBuffer, keyObject, signatureBuffer);

    return isValid
      ? {
          status: "valid",
          detail: "The signed payload validates against the published verification key.",
        }
      : {
          status: "invalid",
          detail: "The signature does not validate against the published verification key.",
        };
  } catch (error) {
    return {
      status: "unavailable",
      detail:
        error instanceof Error
          ? `Validation could not be completed: ${error.message}`
          : "The verification key or signature format could not be validated.",
    };
  }
}

export default async function VerifyPage({
  params,
}: {
  params: { registryId: string };
}) {
  const registryIdParam = decodeURIComponent(params.registryId);
  const data = await getVerify(registryIdParam);

  if (!data) return notFound();

  const record = data.record ?? {};
  const proof = data.proof ?? {};
  const baseUrl = getRuntimeBaseUrl();

  const entityName = safe(record.entityName);
  const certificationStatus = safe(record.certificationStatus);
  const recordType = safe(record.recordType);
  const recordName = safe(record.recordName);
  const lifecycleStatus = safe(record.lifecycleStatus);
  const visibilityStatus = safe(record.visibilityStatus);
  const verificationEligible = safe(record.verificationEligible);
  const badgeEligible = safe(record.badgeEligible);
  const country = safe(record.country);
  const renewalStatus = safe(record.renewalStatus);

  const certifiedAt = formatDate(record.certifiedAt);
  const validFrom = formatDate(record.validFrom);
  const validTo = formatDate(record.validTo);
  const publishedAt = formatDateTime(record.publishedAt);

  const registryId = safe(data.registryId || record.registryId || registryIdParam);
  const registrySnapshotId = safe(record.registrySnapshotId);
  const applicationId = safe(record.applicationId);
  const caseId = safe(record.caseId);
  const signedAt = formatDateTime(proof.signedAt || data.signedAt);

  const rawVerificationKeyUrl = proof.verificationKeyUrl || data.verificationKeyUrl || null;
  const resolvedVerificationKeyUrl = resolveUrl(rawVerificationKeyUrl, baseUrl);
  const verificationKeyUrl = safe(resolvedVerificationKeyUrl || rawVerificationKeyUrl);

  const rawSignature = proof.signature || data.signature || null;
  const signature = safe(rawSignature);

  const rawMessageString = proof.messageString || data.signedMessageString || null;
  const signedPayload =
    rawMessageString && String(rawMessageString).trim()
      ? String(rawMessageString)
      : "UNAVAILABLE: CANONICAL messageString missing";

  const rawVerifyJson = JSON.stringify(data, null, 2);

  const keyData = await getVerificationKey(rawVerificationKeyUrl, baseUrl);
  const publicKeyPem = keyData.pem || "—";

  const validation =
    rawMessageString && String(rawMessageString).trim()
      ? validateSignature(rawMessageString, rawSignature, keyData.pem)
      : {
          status: "invalid" as const,
          detail:
            "Canonical messageString missing. Verification cannot be performed. Reconstructed payloads are not valid for signature verification.",
        };

  const algorithm = safe(keyData.algorithm || proof.alg || null);
  const keyId = safe(keyData.keyId || proof.kid || null);

  const registryUrl = `${baseUrl}/registry/${encodeURIComponent(registryId)}`;
  const widgetUrl = `${baseUrl}/widget-preview/${encodeURIComponent(registryId)}`;
  const demoUrl = `${baseUrl}/demo`;
  const verifyJsonUrl = `${baseUrl}/api/verify/${encodeURIComponent(registryId)}`;
  const badgeJsonUrl = `${baseUrl}/api/badge/${encodeURIComponent(registryId)}`;
  const verifyCurl = `curl ${verifyJsonUrl}`;
  const badgeCurl = `curl ${badgeJsonUrl}`;

  const verificationStatusLabel =
    validation.status === "valid"
      ? "Verified"
      : validation.status === "invalid"
        ? "Invalid"
        : "Unavailable";

  const lifecycleInterpretation =
    lifecycleStatus.toLowerCase() === "expired"
      ? "The signature may still validate authenticity, but this record is expired and should not be treated as currently active."
      : lifecycleStatus.toLowerCase() === "revoked"
        ? "The signature may still validate authenticity, but this certification has been revoked and should not be treated as trusted."
        : lifecycleStatus.toLowerCase() === "active"
          ? "This record is active. Signature validation confirms authenticity, and lifecycle status confirms current public trust state."
          : "Lifecycle status controls whether a verified record should be treated as currently trusted.";

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${pillTone(
                verificationStatusLabel
              )}`}
            >
              {verificationStatusLabel}
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${pillTone(
                certificationStatus
              )}`}
            >
              {certificationStatus}
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${pillTone(
                lifecycleStatus
              )}`}
            >
              {lifecycleStatus}
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${validationTone(
                validation.status
              )}`}
            >
              {validation.status === "valid"
                ? "Signature Valid"
                : validation.status === "invalid"
                  ? "Signature Invalid"
                  : "Signature Unavailable"}
            </span>
          </div>

          <h1 className="mt-4 text-[42px] font-semibold tracking-tight text-black">
            {entityName}
          </h1>

          <div className="mt-4 max-w-4xl text-[15px] leading-7 text-black/75">
            This page is the public proof surface for a GAFAIG record. It shows
            the certification window, signature validation result, public key
            reference, signed payload, and machine-readable verification object
            needed to independently review the record outside the originating
            organization’s platform.
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <InfoCard label="Certification" value={certificationStatus} />
            <InfoCard label="Certified" value={certifiedAt} />
            <InfoCard label="Valid From" value={validFrom} />
            <InfoCard label="Valid To" value={validTo} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <InfoCard label="Record Type" value={recordType} />
            <InfoCard label="Record Name" value={recordName} />
            <InfoCard label="Visibility" value={visibilityStatus} />
            <InfoCard label="Published" value={publishedAt} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <PublicButtonLink
              href={`/registry/${encodeURIComponent(registryId)}`}
              variant="primary"
            >
              Open Registry Record
            </PublicButtonLink>

            <PublicButtonLink
              href={`/widget-preview/${encodeURIComponent(registryId)}`}
              variant="secondary"
            >
              View Widget
            </PublicButtonLink>

            <PublicButtonLink href="/demo" variant="secondary">
              See Full Demo
            </PublicButtonLink>

            <a
              href={`/api/verify/${encodeURIComponent(registryId)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
            >
              View Raw Verification JSON
            </a>
          </div>
        </section>

        <JumpNav />

        <section
          id="signature-validation"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Signature validation
            </div>
            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Cryptographic validation status
            </h2>
            <p className="max-w-3xl text-[15px] leading-7 text-black/75">
              GAFAIG validates the returned signed payload against the published
              verification key for this record. Verification MUST be performed
              against the exact messageString returned by the API. Reconstructing
              payloads from JSON fields is not permitted and will invalidate
              verification. External systems should use messageString, signature,
              and the public key to independently validate the proof.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${validationTone(
                  validation.status
                )}`}
              >
                {validation.status === "valid"
                  ? "Signature Valid"
                  : validation.status === "invalid"
                    ? "Signature Invalid"
                    : "Validation Unavailable"}
              </span>

              {validation.status === "valid" ? (
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
                  Payload Integrity: Verified
                </span>
              ) : null}

              {validation.status === "invalid" ? (
                <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-[11px] font-semibold text-red-700 ring-1 ring-red-200">
                  Payload Integrity: Invalid
                </span>
              ) : null}

              <span className="text-sm text-black/70">{validation.detail}</span>
            </div>

            <div className="mt-5 rounded-2xl border border-black/10 bg-white p-5">
              <div className="text-[13px] font-semibold uppercase tracking-[0.18em] text-black/45">
                What creates trust
              </div>
              <ul className="mt-4 space-y-2 text-[14px] leading-6 text-black/70">
                <li>/api/verify returns the canonical public record and proof.</li>
                <li>proof.messageString is the exact signed payload.</li>
                <li>proof.signature is the cryptographic signature.</li>
                <li>/api/.well-known/gafaig-public-key exposes the verification key.</li>
              </ul>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-4">
              <InfoCard label="Algorithm" value={algorithm} />
              <InfoCard label="Key ID" value={keyId} />
              <InfoCard label="Signed At" value={signedAt} />
              <InfoCard label="Public Key URL" value={verificationKeyUrl} />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <ActionButton label="Copy Signature" copyValue={signature} />
              <ActionButton label="Copy Signed Payload" copyValue={signedPayload} />
              <ActionButton label="Copy Public Key URL" copyValue={verificationKeyUrl} />
              <ActionButton label="Copy Verification curl" copyValue={verifyCurl} />
              <ActionButton label="Copy Raw Verification JSON" copyValue={rawVerifyJson} />
            </div>
          </div>
        </section>

        <section
          id="record-identity"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            RECORD IDENTITY
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Public record identity
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
            These identifiers connect the public verification response to the
            Snowflake-issued registry snapshot, application, and verification
            case. IDs are displayed exactly as returned by the public verification
            endpoint.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Registry ID" value={registryId} />
            <InfoCard label="Registry Snapshot ID" value={registrySnapshotId} />
            <InfoCard label="Application ID" value={applicationId} />
            <InfoCard label="Case ID" value={caseId} />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Entity Type" value={safe(record.entityType)} />
            <InfoCard label="Country" value={country} />
            <InfoCard label="Renewal Status" value={renewalStatus} />
            <InfoCard label="Lifecycle Status" value={lifecycleStatus} />
          </div>
        </section>

        <section
          id="trust-flow"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            TRUST FLOW
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            How this proof connects to the wider GAFAIG trust surface
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
            This page is one part of the full GAFAIG proof sequence. A record
            appears in the public registry, is verified through signed proof,
            exposes its machine-readable payload, and can then travel outside
            the platform through a portable widget, badge, or external modal.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <StepCard
              number="1"
              title="Registry Record"
              body="The public certification record establishes the trust outcome."
            />
            <StepCard
              number="2"
              title="Verify Page"
              body="This page validates the signed proof behind that record."
            />
            <StepCard
              number="3"
              title="Signed JSON"
              body="The machine-readable payload makes the trust record portable."
            />
            <StepCard
              number="4"
              title="External Widget"
              body="The same trust signal can appear outside GAFAIG."
            />
          </div>
        </section>

        <section
          id="use-proof"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            USE THIS PROOF
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            This verification can be used outside GAFAIG
          </h2>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <StatementCard
              title="For people"
              body="The registry page and this verify page provide a readable public trust surface for customers, regulators, partners, and the public."
            />
            <StatementCard
              title="For systems"
              body="The raw verification JSON, signature, messageString, and public key allow external systems to inspect and consume the same trust result without relying on GAFAIG UI."
            />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <FeatureCard
              title="Registry record"
              body="Open the public certification record that this proof supports."
              href={`/registry/${encodeURIComponent(registryId)}`}
              cta="Open record"
            />
            <FeatureCard
              title="Widget preview"
              body="See how the same trust signal appears on an external site."
              href={`/widget-preview/${encodeURIComponent(registryId)}`}
              cta="View widget"
            />
            <FeatureCard
              title="Verify JSON"
              body="Open the machine-readable proof returned by the verification endpoint."
              href={`/api/verify/${encodeURIComponent(registryId)}`}
              cta="Open JSON"
            />
            <FeatureCard
              title="Demo flow"
              body="See how this page fits into the full GAFAIG proof walkthrough."
              href="/demo"
              cta="Open demo"
            />
          </div>
        </section>

        <section
          id="trust-verification"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Trust verification
            </div>
            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Verification details
            </h2>
            <p className="max-w-3xl text-[15px] leading-7 text-black/75">
              These fields identify the public record, signing time, key
              reference, algorithm, signature surface, and eligibility flags used
              to verify and display the trust payload.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-black/10 bg-black/[0.02] p-5 text-[14px] leading-7 text-black/75">
            {lifecycleInterpretation}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Registry ID" value={registryId} />
            <InfoCard label="Signed At" value={signedAt} />
            <InfoCard label="Verification Key" value={verificationKeyUrl} />
            <InfoCard label="Signature" value={signature} />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Algorithm" value={algorithm} />
            <InfoCard label="Key ID" value={keyId} />
            <InfoCard label="Verification Eligible" value={verificationEligible} />
            <InfoCard label="Badge Eligible" value={badgeEligible} />
          </div>
        </section>

        <section
          id="developer-proof"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Developer proof object
            </div>
            <h2 className="text-[26px] font-semibold tracking-tight text-black">
              Copyable verification materials
            </h2>
            <p className="max-w-3xl text-[15px] leading-7 text-black/75">
              External systems MUST treat messageString as the canonical input
              to signature verification. The record object is for display only;
              the proof object is the trust layer. Do not reconstruct the signed
              payload from JSON fields.
            </p>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-black/45">
            Verification MUST use the exact messageString returned by the API. Never reconstruct it.
          </p>

          <div className="mt-6 grid gap-4">
            <CodePanel
              label="Signed payload"
              language="CANONICAL messageString"
              value={signedPayload}
            />
            <CodePanel label="Signature" language="Ed25519 signature" value={signature} />
            <CodePanel label="Public key" language="PEM" value={publicKeyPem} />
            <CodePanel label="Verification curl" language="cURL" value={verifyCurl} />
            <CodePanel label="Badge curl" language="cURL" value={badgeCurl} />
            <CodePanel label="Full verification response" language="JSON" value={rawVerifyJson} />
          </div>
        </section>

        <section
          id="related-urls"
          className="scroll-mt-8 rounded-3xl border border-black/10 bg-white p-8"
        >
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            RELATED URLS
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Connected trust surfaces for this record
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <InfoCard label="Registry Page" value={registryUrl} />
            <InfoCard label="Widget Preview" value={widgetUrl} />
            <InfoCard label="Verify JSON" value={verifyJsonUrl} />
            <InfoCard label="Badge JSON" value={badgeJsonUrl} />
            <InfoCard label="Public Key Endpoint" value={verificationKeyUrl} />
            <InfoCard label="Demo Page" value={demoUrl} />
          </div>
        </section>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const copyButtons = Array.from(document.querySelectorAll('.gafaig-copy-button'));

                async function copyText(text) {
                  try {
                    if (navigator.clipboard && window.isSecureContext) {
                      await navigator.clipboard.writeText(text);
                      return true;
                    }
                  } catch (_) {}

                  try {
                    const textarea = document.createElement('textarea');
                    textarea.value = text;
                    textarea.style.position = 'fixed';
                    textarea.style.left = '-9999px';
                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();
                    const ok = document.execCommand('copy');
                    document.body.removeChild(textarea);
                    return ok;
                  } catch (_) {
                    return false;
                  }
                }

                copyButtons.forEach((button) => {
                  button.addEventListener('click', async () => {
                    const original = button.textContent || 'Copy';
                    const text = button.getAttribute('data-copy-text') || '';
                    if (!text || text === '—') {
                      button.textContent = 'Nothing to Copy';
                      setTimeout(() => {
                        button.textContent = original;
                      }, 1500);
                      return;
                    }

                    const ok = await copyText(text);
                    button.textContent = ok ? 'Copied' : 'Copy Failed';
                    setTimeout(() => {
                      button.textContent = original;
                    }, 1500);
                  });
                });
              })();
            `,
          }}
        />
      </div>
    </main>
  );
}