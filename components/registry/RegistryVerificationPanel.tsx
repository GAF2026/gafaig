"use client";

import { useState } from "react";
import PublicButton from "@/app/_components/PublicButton";
import PublicButtonLink from "@/app/_components/PublicButtonLink";

type VerifyApiResponse = {
  ok: boolean;
  verified: boolean;
  registryId: string;
  record?: {
    entityName?: string | null;
    entityType?: string | null;
    country?: string | null;
    decisionStatus?: string | null;
    certifiedTier?: string | null;
    certifiedBand?: string | null;
    validTo?: string | null;
  } | null;
  proof?: {
    alg?: string | null;
    kid?: string | null;
    signature?: string | null;
    signedAt?: string | null;
    verificationKeyUrl?: string | null;
    message?: Record<string, unknown> | null;
    messageString?: string | null;
  } | null;
  error?: string;
};

function CopyButton({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <PublicButton
      type="button"
      variant="secondary"
      size="sm"
      onClick={handleCopy}
    >
      {copied ? "Copied" : label}
    </PublicButton>
  );
}

export default function RegistryVerificationPanel({
  registryId,
  entityName,
  verifyData,
}: {
  registryId: string;
  entityName?: string;
  verifyData?: VerifyApiResponse | null;
}) {
  if (!verifyData || !verifyData.ok || !verifyData.proof) {
    return (
      <div className="rounded-xl border border-black/10 p-4 text-sm text-black/70">
        Verification unavailable
      </div>
    );
  }

  const { proof, record } = verifyData;
  const verificationKeyUrl = proof.verificationKeyUrl || "/api/.well-known/gafaig-public-key";
  const verifyEndpointUrl = `/api/verify/${encodeURIComponent(registryId)}`;

  return (
    <section className="mt-10 rounded-3xl border border-black/10 bg-white p-8 md:p-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            VERIFY THIS CERTIFICATION
          </div>

          <h2 className="mt-4 text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Signed public proof
          </h2>

          <p className="mt-4 max-w-[900px] text-[15px] leading-[1.8] text-black/72">
            This certification can be independently verified using the GAFAIG
            verification endpoint and the published public key. The proof below
            contains the signature, key identifier, key URL, and exact signed
            message string used for external verification.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
            {verifyData.verified ? "verified" : "unverified"}
          </span>

          {proof.alg ? (
            <span className="inline-flex rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-violet-700">
              {proof.alg}
            </span>
          ) : null}

          {proof.kid ? (
            <span className="inline-flex rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-black/70">
              {proof.kid}
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <PublicButtonLink href={verifyEndpointUrl} variant="secondary" size="sm">
          Open verify endpoint
        </PublicButtonLink>

        <PublicButtonLink href={verificationKeyUrl} variant="secondary" size="sm">
          Open public key
        </PublicButtonLink>

        {proof.messageString ? (
          <CopyButton value={proof.messageString} label="Copy message string" />
        ) : null}

        {proof.signature ? (
          <CopyButton value={proof.signature} label="Copy signature" />
        ) : null}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric label="Registry ID" value={registryId} mono />
        <Metric label="Entity" value={entityName || record?.entityName || "—"} />
        <Metric label="Decision" value={record?.decisionStatus || "—"} />
        <Metric
          label="Tier / Band"
          value={
            record?.certifiedTier && record?.certifiedBand
              ? `${record.certifiedTier} · Band ${record.certifiedBand}`
              : record?.certifiedTier || record?.certifiedBand || "—"
          }
        />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <InfoBlock
          label="Verification key URL"
          value={verificationKeyUrl}
          mono
        />
        <InfoBlock label="Signed at" value={proof.signedAt || "—"} />
      </div>

      <div className="mt-4">
        <InfoBlock label="Signature" value={proof.signature || "—"} mono />
      </div>

      <div className="mt-4">
        <InfoBlock
          label="Signed message string"
          value={proof.messageString || "—"}
          mono
          pre
        />
      </div>

      {proof.message ? (
        <div className="mt-4">
          <InfoBlock
            label="Signed message object"
            value={JSON.stringify(proof.message, null, 2)}
            mono
            pre
          />
        </div>
      ) : null}

      <div className="mt-8 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
        <div className="text-[18px] font-semibold tracking-tight text-black">
          External verification flow
        </div>
        <ol className="mt-4 space-y-2 text-[14px] leading-[1.8] text-black/72">
          <li>1. Fetch the proof from the verification endpoint for this registry ID.</li>
          <li>2. Fetch the Ed25519 public key from the published key URL.</li>
          <li>3. Verify the signature against the exact message string shown here.</li>
          <li>4. Confirm the public record matches the signed proof payload.</li>
        </ol>
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>
      <div
        className={[
          "mt-3 text-[14px] leading-[1.65] text-black/88",
          mono ? "break-all font-mono text-[13px]" : "",
        ].join(" ")}
      >
        {value}
      </div>
    </div>
  );
}

function InfoBlock({
  label,
  value,
  mono = false,
  pre = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  pre?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-black/10 p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-black/55">
        {label}
      </div>

      {pre ? (
        <pre
          className={[
            "mt-4 overflow-x-auto rounded-xl border border-black/8 bg-black/[0.015] px-4 py-3 text-black/85",
            mono ? "whitespace-pre-wrap break-all font-mono text-[13px]" : "text-[14px]",
          ].join(" ")}
        >
          {value}
        </pre>
      ) : (
        <div
          className={[
            "mt-4 rounded-xl border border-black/8 bg-black/[0.015] px-4 py-3 text-black/85",
            mono ? "break-all font-mono text-[13px]" : "text-[14px]",
          ].join(" ")}
        >
          {value}
        </div>
      )}
    </div>
  );
}