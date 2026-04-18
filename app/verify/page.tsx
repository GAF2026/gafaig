"use client";

import { useMemo, useState } from "react";
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import nacl from "tweetnacl";

const EXAMPLE_ID = "GAFAIG-4cf088b9796f492f934acf69615de934";

type VerifyApiResponse = {
  ok: boolean;
  verified?: boolean;
  registryId?: string;
  error?: string;
  proof?: {
    alg?: string;
    kid?: string;
    signedAt?: string | null;
    signature?: string;
    verificationKeyUrl?: string;
    message?: Record<string, unknown>;
    messageString?: string;
  };
  record?: {
    registryId?: string;
    entityName?: string | null;
    entityType?: string | null;
    country?: string | null;
    applicationId?: string | null;
    caseId?: string | null;
    certificationStatus?: string | null;
    certifiedScore?: number | null;
    certifiedTier?: string | null;
    certifiedBand?: string | null;
    decisionStatus?: string | null;
    certifiedAt?: string | null;
    validFrom?: string | null;
    validTo?: string | null;
  };
};

type PublicKeyResponse = {
  ok?: boolean;
  kid?: string;
  publicKeyBase64?: string;
  publicKeyPem?: string;
};

type ClientVerificationState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "success";
      endpointVerified: boolean;
      signatureVerified: boolean;
      payload: VerifyApiResponse;
      publicKeyBase64: string;
    }
  | {
      status: "error";
      message: string;
      payload?: VerifyApiResponse | null;
    };

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function toUint8ArrayFromUtf8(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

function toUint8ArrayFromBase64(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes;
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function prettyJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function getTrustState(
  certifiedAt?: string | null,
  decisionStatus?: string | null
) {
  const isCertified = Boolean(String(certifiedAt ?? "").trim());
  const decision = String(decisionStatus ?? "").trim().toUpperCase();

  if (isCertified) {
    return {
      label: "Certified",
      description: "Trusted + published",
    };
  }

  if (decision === "APPROVED") {
    return {
      label: "Approved",
      description: "Evaluated",
    };
  }

  return {
    label: "Pending",
    description: "Not finalized",
  };
}

function VerificationBadge({
  verified,
  label,
}: {
  verified: boolean;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        verified
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-red-200 bg-red-50 text-red-700"
      )}
    >
      {label}
    </span>
  );
}

function ProofCard({
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

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();

  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON response from ${url}`);
  }

  if (!res.ok) {
    const maybeError =
      typeof data === "object" && data !== null && "error" in (data as object)
        ? String((data as { error?: unknown }).error ?? "Request failed")
        : `Request failed with status ${res.status}`;
    throw new Error(maybeError);
  }

  return data;
}

export default function VerifyPage() {
  const [registryId, setRegistryId] = useState(EXAMPLE_ID);
  const [state, setState] = useState<ClientVerificationState>({
    status: "idle",
  });

  const verifyEndpointUrl = useMemo(() => {
    const id = registryId.trim();
    return id ? `/api/verify/${encodeURIComponent(id)}` : "";
  }, [registryId]);

  async function runVerification(inputId?: string) {
    const targetId = String(inputId ?? registryId).trim();

    if (!targetId) {
      setState({
        status: "error",
        message: "Enter a GAFAIG registry ID.",
      });
      return;
    }

    setRegistryId(targetId);
    setState({ status: "loading" });

    try {
      const payload = await fetchJson<VerifyApiResponse>(
        `/api/verify/${encodeURIComponent(targetId)}`
      );

      if (!payload.ok || !payload.proof) {
        throw new Error(payload.error || "Verification payload missing proof.");
      }

      const verificationKeyUrl = String(
        payload.proof.verificationKeyUrl || ""
      ).trim();
      const messageString = String(payload.proof.messageString || "");
      const signature = String(payload.proof.signature || "");

      if (!verificationKeyUrl) {
        throw new Error("Proof did not include verificationKeyUrl.");
      }

      if (!messageString) {
        throw new Error("Proof did not include messageString.");
      }

      if (!signature) {
        throw new Error("Proof did not include signature.");
      }

      const publicKeyPayload = await fetchJson<PublicKeyResponse>(
        verificationKeyUrl
      );

      const publicKeyBase64 = String(
        publicKeyPayload.publicKeyBase64 || ""
      ).trim();

      if (!publicKeyBase64) {
        throw new Error("Public key endpoint did not include publicKeyBase64.");
      }

      const publicKeyBytes = toUint8ArrayFromBase64(publicKeyBase64);
      const signatureBytes = toUint8ArrayFromBase64(signature);
      const messageBytes = toUint8ArrayFromUtf8(messageString);

      const signatureVerified = nacl.sign.detached.verify(
        messageBytes,
        signatureBytes,
        publicKeyBytes
      );

      setState({
        status: "success",
        endpointVerified: Boolean(payload.verified),
        signatureVerified,
        payload,
        publicKeyBase64,
      });
    } catch (error) {
      setState({
        status: "error",
        message:
          error instanceof Error ? error.message : "Client verification failed.",
      });
    }
  }

  const result =
    state.status === "success"
      ? state.payload
      : state.status === "error"
      ? state.payload
      : null;

  const proof = result?.proof;
  const record = result?.record;
  const trust = getTrustState(record?.certifiedAt, record?.decisionStatus);

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="Public verification"
          title="Verify a GAFAIG record"
          description="Confirm whether a GAFAIG record is valid by registry ID. Verification checks the live record, proof payload, signature, and trust state."
          secondaryDescription="Records may be Approved (evaluated) or Certified (trusted and published). Verification confirms cryptographic integrity and alignment with the public registry, without exposing private evidence."
          actions={
            <>
              <PublicButtonLink
                href={`/registry/${EXAMPLE_ID}`}
                variant="outline-dark"
              >
                View example record
              </PublicButtonLink>
              <PublicButtonLink href="/registry" variant="outline-dark">
                Open registry
              </PublicButtonLink>
              <PublicButtonLink href="/developers" variant="outline-dark">
                Developer docs
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="max-w-3xl text-[15px] leading-7 text-black/65">
            This is the independent proof layer behind the certification record.
          </div>

          <div className="mt-8 text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT THIS PAGE PROVES
          </div>

          <h2 className="mt-4 max-w-[860px] text-[32px] font-semibold leading-[1.18] tracking-tight text-black md:text-[38px]">
            Independent verification of the public trust record
          </h2>

          <p className="mt-5 max-w-[980px] text-[16px] leading-[1.85] text-black/75">
            This page proves that the certification record exists, that the
            public proof is consistent with the registry, that the disclosed
            payload is signed, and that the result can be independently
            verified outside GAFAIG.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ProofCard
              title="Record integrity"
              body="The public proof resolves against the registry record that represents the trust outcome."
            />
            <ProofCard
              title="Signed proof"
              body="The disclosed payload is cryptographically signed and surfaced with its verification key reference."
            />
            <ProofCard
              title="Independent verification"
              body="External parties can validate the record without access to private reviewer materials or internal evidence."
            />
            <ProofCard
              title="Portable trust"
              body="The same result can be verified across registry, API, and widget trust surfaces."
            />
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="max-w-[980px] space-y-3 text-[15px] leading-[1.8] text-black/65">
            <p>
              GAFAIG verification distinguishes between evaluated records and
              publicly trusted records.
            </p>

            <div className="rounded-2xl border border-black/10 bg-black/[0.03] p-5">
              <div className="grid gap-3 text-[15px] leading-[1.8] text-black/72">
                <div>
                  <span className="font-semibold text-black">Approved</span>{" "}
                  means the record has completed the GAFAIG evaluation process
                  and received a governance decision.
                </div>

                <div>
                  <span className="font-semibold text-black">Certified</span>{" "}
                  means the evaluated outcome has been finalized and published
                  as a trusted public record in the registry of record.
                </div>
              </div>
            </div>

            <p className="text-black/60">
              Verification confirms record integrity and proof validity. Trust
              state determines whether the record is publicly certified.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
            Live verification
          </div>

          <h2 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-black">
            Verify by registry ID
          </h2>

          <p className="mt-3 max-w-3xl text-[16px] leading-8 text-black/70">
            Enter a GAFAIG registry ID to retrieve the public verification record
            and signed proof payload.
          </p>

          <div className="mt-6 flex flex-col gap-3 lg:flex-row">
            <input
              value={registryId}
              onChange={(e) => setRegistryId(e.target.value)}
              placeholder="Enter registry ID"
              className="h-14 flex-1 rounded-2xl border border-black/10 bg-white px-4 text-[15px] outline-none transition focus:border-black/25"
            />

            <button
              type="button"
              onClick={() => runVerification()}
              disabled={state.status === "loading"}
              className="inline-flex h-14 items-center justify-center rounded-full bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {state.status === "loading" ? "Verifying…" : "Verify record"}
            </button>

            <button
              type="button"
              onClick={() => runVerification(EXAMPLE_ID)}
              disabled={state.status === "loading"}
              className="inline-flex h-14 items-center justify-center rounded-full border border-black/15 px-6 text-sm font-semibold transition hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Load example
            </button>
          </div>

          <div className="mt-3 text-[13px] text-black/55">
            Example ID:{" "}
            <button
              type="button"
              onClick={() => setRegistryId(EXAMPLE_ID)}
              className="font-mono underline underline-offset-2"
            >
              {EXAMPLE_ID}
            </button>
          </div>

          {state.status === "error" ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-[14px] text-red-700">
              {state.message}
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl bg-black p-8 text-white md:p-10">
          <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/55">
            How verification works
          </div>

          <h2 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
            Public trust without private evidence disclosure
          </h2>

          <p className="mt-4 max-w-3xl text-[16px] leading-8 text-white/72">
            GAFAIG verification confirms that a public registry record exists,
            that it is currently surfaced through the canonical registry views,
            and that its proof payload is signed for independent verification.
            The public layer does not disclose private reviewer materials,
            internal evidence, or assessment workflow details.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Step 1
              </div>
              <div className="mt-3 text-[20px] font-semibold">
                Resolve public record
              </div>
              <p className="mt-3 text-[14px] leading-7 text-white/68">
                The verification endpoint resolves the registry record from the
                canonical public registry view in Snowflake.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Step 2
              </div>
              <div className="mt-3 text-[20px] font-semibold">
                Construct proof message
              </div>
              <p className="mt-3 text-[14px] leading-7 text-white/68">
                GAFAIG creates a deterministic public proof payload from the
                disclosed trust record.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Step 3
              </div>
              <div className="mt-3 text-[20px] font-semibold">
                Verify signature externally
              </div>
              <p className="mt-3 text-[14px] leading-7 text-white/68">
                External parties can fetch the public key, validate the
                signature, and independently confirm the record.
              </p>
            </div>
          </div>
        </section>

        {state.status === "success" && result && proof && record ? (
          <>
            <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
              <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
                Trust state
              </div>

              <h2 className="mt-3 text-[28px] font-semibold text-black">
                {trust.label}
              </h2>

              <p className="mt-3 text-[15px] leading-[1.8] text-black/70">
                {trust.label === "Certified"
                  ? "This record is a certified public trust record in the GAFAIG registry of record."
                  : trust.label === "Approved"
                  ? "This record has been evaluated and approved, but has not been finalized as a certified public registry record."
                  : "This record is not yet finalized."}
              </p>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
                    Verification result
                  </div>
                  <h2 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-black">
                    Independent signature validation
                  </h2>
                  <p className="mt-4 max-w-3xl text-[16px] leading-8 text-black/70">
                    This result combines the server-side GAFAIG verification
                    response with independent client-side Ed25519 signature
                    validation using <span className="font-semibold">tweetnacl</span>.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <VerificationBadge
                    verified={Boolean(state.endpointVerified)}
                    label={
                      state.endpointVerified
                        ? "Endpoint verified"
                        : "Endpoint not verified"
                    }
                  />
                  <VerificationBadge
                    verified={Boolean(state.signatureVerified)}
                    label={
                      state.signatureVerified
                        ? "Signature valid"
                        : "Signature invalid"
                    }
                  />
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-3xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
                    Registry ID
                  </div>
                  <div className="mt-3 break-all text-[14px] font-medium text-black/85">
                    {record.registryId ?? "—"}
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
                    Entity
                  </div>
                  <div className="mt-3 text-[14px] font-medium text-black/85">
                    {record.entityName ?? "—"}
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
                    Decision
                  </div>
                  <div className="mt-3 text-[14px] font-medium text-black/85">
                    {record.decisionStatus ?? "—"}
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
                    Trust State
                  </div>
                  <div className="mt-3 text-[14px] font-medium text-black/85">
                    {trust.label}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
                    Verification key URL
                  </div>
                  <div className="mt-3 break-all rounded-2xl border border-black/8 bg-white px-4 py-3 text-[13px] text-black/75">
                    {proof.verificationKeyUrl ?? "—"}
                  </div>
                </div>

                <div className="rounded-3xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
                    Signed at
                  </div>
                  <div className="mt-3 rounded-2xl border border-black/8 bg-white px-4 py-3 text-[13px] text-black/75">
                    {formatDate(proof.signedAt)}
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-3xl border border-black/10 bg-[#fcfcfb] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
                  Signature
                </div>
                <div className="mt-3 break-all rounded-2xl border border-black/8 bg-white px-4 py-3 font-mono text-[12px] leading-6 text-black/75">
                  {proof.signature ?? "—"}
                </div>
              </div>

              <div className="mt-4 rounded-3xl border border-black/10 bg-[#fcfcfb] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
                  Signed message string
                </div>
                <pre className="mt-3 overflow-x-auto rounded-2xl border border-black/8 bg-white p-4 text-[12px] leading-6 text-black/75">
                  {proof.messageString ?? "—"}
                </pre>
              </div>

              <div className="mt-4 rounded-3xl border border-black/10 bg-[#fcfcfb] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
                  Signed message object
                </div>
                <pre className="mt-3 overflow-x-auto rounded-2xl border border-black/8 bg-white p-4 text-[12px] leading-6 text-black/75">
                  {prettyJson(proof.message)}
                </pre>
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
              <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
                External validation
              </div>

              <h2 className="mt-3 text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-black">
                Independent verification flow
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-3xl border border-black/10 bg-[#fcfcfb] p-6">
                  <div className="text-[18px] font-semibold text-black">
                    What was checked
                  </div>
                  <ul className="mt-4 space-y-3 text-[14px] leading-7 text-black/70">
                    <li>• Live GAFAIG verification endpoint response</li>
                    <li>• Public key fetched from published key URL</li>
                    <li>• Exact deterministic message string</li>
                    <li>• Ed25519 signature verification in browser</li>
                  </ul>
                </div>

                <div className="rounded-3xl border border-black/10 bg-[#fcfcfb] p-6">
                  <div className="text-[18px] font-semibold text-black">
                    Technical details
                  </div>
                  <ul className="mt-4 space-y-3 text-[14px] leading-7 text-black/70">
                    <li>• Algorithm: {proof.alg ?? "—"}</li>
                    <li>• Key ID: {proof.kid ?? "—"}</li>
                    <li>
                      • Public key bytes:{" "}
                      {state.publicKeyBase64.length > 0 ? "Loaded" : "Missing"}
                    </li>
                    <li>
                      • Result:{" "}
                      {state.signatureVerified
                        ? "Signature valid"
                        : "Signature invalid"}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <PublicButtonLink
                  href={verifyEndpointUrl}
                  variant="outline-dark"
                >
                  Open verify endpoint
                </PublicButtonLink>

                {proof.verificationKeyUrl ? (
                  <PublicButtonLink
                    href={proof.verificationKeyUrl}
                    variant="outline-dark"
                  >
                    Open public key
                  </PublicButtonLink>
                ) : null}

                {record.registryId ? (
                  <PublicButtonLink
                    href={`/registry/${encodeURIComponent(record.registryId)}`}
                    variant="outline-dark"
                  >
                    Open registry record
                  </PublicButtonLink>
                ) : null}
              </div>
            </section>
          </>
        ) : null}
      </div>
    </main>
  );
}