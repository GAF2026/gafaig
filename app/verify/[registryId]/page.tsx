export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { notFound } from "next/navigation";
import { createPublicKey, verify as cryptoVerify } from "crypto";

type VerifyApiResponse = {
  ok?: boolean;
  verified?: boolean;
  registryId?: string;
  record?: {
    registryId?: string;
    entityName?: string;
    entityType?: string;
    country?: string;
    applicationId?: string;
    caseId?: string;
    decisionStatus?: string;
    certifiedScore?: number | string;
    certifiedTier?: string;
    certifiedBand?: string;
    certifiedAt?: string;
    validFrom?: string;
    validTo?: string;
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

function safe(v?: string | number | null) {
  const text = String(v ?? "").trim();
  return text || "—";
}

function formatDate(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleDateString("en-US");
}

function formatDateTime(v?: string | null) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString("en-US");
}

function pillTone(value: string) {
  const v = value.toUpperCase();

  if (v === "CERTIFIED") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (v === "APPROVED") return "bg-blue-50 text-blue-700 ring-blue-200";

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function validationTone(status: SignatureValidationResult["status"]) {
  if (status === "valid") return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  if (status === "invalid") return "bg-red-50 text-red-700 ring-red-200";
  return "bg-slate-100 text-slate-600 ring-slate-200";
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-neutral-50 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-black/50">
        {label}
      </div>
      <div className="mt-2 break-words text-[15px] font-semibold text-black">
        {value}
      </div>
    </div>
  );
}

function ActionButton({
  label,
  copyValue,
}: {
  label: string;
  copyValue: string;
}) {
  return (
    <button
      type="button"
      data-copy-text={copyValue}
      className="gafaig-copy-button inline-flex min-h-[42px] items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
    >
      {label}
    </button>
  );
}

async function getVerify(registryId: string): Promise<VerifyApiResponse | null> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/verify/${registryId}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

async function getVerificationKey(url: string | null | undefined): Promise<KeyFetchResult> {
  const keyUrl = String(url ?? "").trim();
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
  const data = await getVerify(params.registryId);

  if (!data) return notFound();

  const record = data.record ?? {};
  const proof = data.proof ?? {};

  const entityName = safe(record.entityName);
  const decisionStatus = safe(record.decisionStatus);
  const certification =
    [safe(record.certifiedTier), safe(record.certifiedBand)]
      .filter((v) => v !== "—")
      .join(" ")
      .trim() || "—";
  const certifiedAt = formatDate(record.certifiedAt);
  const validFrom = formatDate(record.validFrom);
  const validTo = formatDate(record.validTo);

  const registryId = safe(data.registryId || record.registryId || params.registryId);
  const signedAt = formatDateTime(proof.signedAt || data.signedAt);
  const verificationKeyUrl = safe(proof.verificationKeyUrl || data.verificationKeyUrl);
  const signature = safe(proof.signature || data.signature);
  const signedPayload =
    safe(proof.messageString || data.signedMessageString) !== "—"
      ? safe(proof.messageString || data.signedMessageString)
      : proof.message
        ? JSON.stringify(proof.message, null, 2)
        : "—";

  const rawVerifyJson = JSON.stringify(data, null, 2);

  const keyData = await getVerificationKey(
    proof.verificationKeyUrl || data.verificationKeyUrl || null
  );

  const validation = validateSignature(
    proof.messageString || data.signedMessageString || null,
    proof.signature || data.signature || null,
    keyData.pem
  );

  const algorithm = safe(keyData.algorithm || proof.alg || null);
  const keyId = safe(keyData.keyId || proof.kid || null);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="flex gap-2">
            <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Verified
            </span>

            <span
              className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ring-1 ${pillTone(
                decisionStatus
              )}`}
            >
              {decisionStatus}
            </span>
          </div>

          <h1 className="mt-4 text-[42px] font-semibold tracking-tight text-black">
            {entityName}
          </h1>

          <div className="mt-4 max-w-4xl text-base leading-7 text-black/70">
            This page verifies the public GAFAIG trust record for this registry
            entry. It shows the public certification window and the signing
            surface used for trust verification.
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-4">
            <InfoCard label="Certification" value={certification} />
            <InfoCard label="Certified" value={certifiedAt} />
            <InfoCard label="Valid From" value={validFrom} />
            <InfoCard label="Valid To" value={validTo} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/registry/${params.registryId}`}
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
            >
              View Registry Record
            </Link>

            <Link
              href="/explorer"
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
            >
              Back to Explorer
            </Link>

            <a
              href={`/api/verify/${params.registryId}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[42px] items-center justify-center rounded-full border border-black/20 bg-white px-5 text-sm font-semibold text-black transition hover:bg-black hover:text-white"
            >
              View Raw Verification JSON
            </a>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Signature validation
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-black">
              Cryptographic validation status
            </h2>
            <p className="max-w-3xl text-base leading-7 text-black/70">
              GAFAIG validates the returned signed payload against the published
              verification key for this record.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-neutral-50 p-5">
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
              <span className="text-sm text-black/70">{validation.detail}</span>
            </div>

            <p className="mt-4 text-sm text-black/60">
              This record can be independently verified using the public key,
              signature, and signed payload surfaced below.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <ActionButton label="Copy Signature" copyValue={signature} />
              <ActionButton label="Copy Signed Payload" copyValue={signedPayload} />
              <ActionButton label="Copy Public Key URL" copyValue={verificationKeyUrl} />
              <ActionButton label="Copy Raw Verification JSON" copyValue={rawVerifyJson} />
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Trust verification
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-black">
              Verification details
            </h2>
            <p className="max-w-3xl text-base leading-7 text-black/70">
              These fields identify the public record, signing time, key
              reference, algorithm, and signature surface used to verify the
              trust payload.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <InfoCard label="Registry ID" value={registryId} />
            <InfoCard label="Signed At" value={signedAt} />
            <InfoCard label="Verification Key" value={verificationKeyUrl} />
            <InfoCard label="Signature" value={signature} />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <InfoCard label="Algorithm" value={algorithm} />
            <InfoCard label="Key ID" value={keyId} />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="space-y-4">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-black/40">
              Signed payload
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-black">
              Public signed message
            </h2>
            <p className="max-w-3xl text-base leading-7 text-black/70">
              This is the public payload returned by the verification surface.
              It is intended for trust inspection and signature validation.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-black/10 bg-neutral-50 p-4 text-sm text-black/75">
            <pre className="overflow-x-auto whitespace-pre-wrap break-words">
              {signedPayload}
            </pre>
          </div>
        </section>

        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                const buttons = Array.from(document.querySelectorAll('.gafaig-copy-button'));
                const copyText = async (text) => {
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
                };

                buttons.forEach((button) => {
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