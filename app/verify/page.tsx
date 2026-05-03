"use client";

import { useMemo, useState } from "react";
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";
import nacl from "tweetnacl";

const EXAMPLE_ID = "GAFAIG-00000001";

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

function formatDateShort(value?: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function prettyJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function truncateMiddle(value: string, start = 20, end = 14) {
  if (!value) return "—";
  if (value.length <= start + end + 3) return value;
  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

function getTrustState(
  certificationStatus?: string | null,
  certifiedAt?: string | null
) {
  const certification = String(certificationStatus ?? "").trim().toUpperCase();
  const hasCertifiedAt = Boolean(String(certifiedAt ?? "").trim());

  if (certification === "CERTIFIED" || hasCertifiedAt) {
    return {
      label: "Certified",
      description: "Publicly trusted + published",
    };
  }

  return {
    label: "Not publicly certified",
    description: "No public certification record resolved",
  };
}

function getProofStateLabel(
  endpointVerified: boolean,
  signatureVerified: boolean
) {
  if (endpointVerified && signatureVerified) {
    return {
      title: "Proof valid",
      body: "The public trust record resolved successfully and the exact messageString validates against the published GAFAIG public key.",
      tone: "success" as const,
    };
  }

  if (!endpointVerified && signatureVerified) {
    return {
      title: "Signature valid, endpoint not verified",
      body: "The signature validates, but the endpoint response did not confirm verified status.",
      tone: "warning" as const,
    };
  }

  if (endpointVerified && !signatureVerified) {
    return {
      title: "Endpoint verified, payload integrity invalid",
      body: "The public trust record resolved, but the signature did not validate against the exact messageString and published key.",
      tone: "danger" as const,
    };
  }

  return {
    title: "Proof not verified",
    body: "Neither the endpoint response nor the client-side signature validation confirmed the record.",
    tone: "danger" as const,
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

function ProofCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[18px] font-semibold tracking-tight text-black">
        {title}
      </div>
      <p className="mt-3 text-[15px] leading-7 text-black/75">{body}</p>
    </div>
  );
}

function ProofMetricCard({
  label,
  value,
  body,
}: {
  label: string;
  value: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
        {label}
      </div>
      <div className="mt-3 text-[18px] font-semibold tracking-tight text-black">
        {value}
      </div>
      <p className="mt-2 text-[14px] leading-7 text-black/70">{body}</p>
    </div>
  );
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
        {label}
      </div>
      <div className="mt-3 break-all text-[14px] font-medium text-black/85">
        {value}
      </div>
    </div>
  );
}

function ProofStateBanner({
  title,
  body,
  tone,
}: {
  title: string;
  body: string;
  tone: "success" | "warning" | "danger";
}) {
  const toneClasses =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50"
        : "border-red-200 bg-red-50";

  const titleClasses =
    tone === "success"
      ? "text-emerald-800"
      : tone === "warning"
        ? "text-amber-800"
        : "text-red-800";

  const bodyClasses =
    tone === "success"
      ? "text-emerald-700"
      : tone === "warning"
        ? "text-amber-700"
        : "text-red-700";

  return (
    <div className={cn("rounded-2xl border p-5", toneClasses)}>
      <div
        className={cn(
          "text-[18px] font-semibold tracking-tight",
          titleClasses
        )}
      >
        {title}
      </div>
      <p className={cn("mt-2 text-[14px] leading-7", bodyClasses)}>{body}</p>
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
  const [copiedMessageString, setCopiedMessageString] = useState(false);

  const verifyEndpointUrl = useMemo(() => {
    const id = registryId.trim();
    return id ? `/api/verify/${encodeURIComponent(id)}` : "";
  }, [registryId]);

  async function copyMessageString(value: string) {
    if (!value) return;

    await navigator.clipboard.writeText(value);
    setCopiedMessageString(true);

    window.setTimeout(() => {
      setCopiedMessageString(false);
    }, 1800);
  }

  async function runVerification(inputId?: string) {
    const targetId = String(inputId ?? registryId).trim();

    if (!targetId) {
      setState({
        status: "error",
        message: `Enter a valid GAFAIG registry ID (e.g. ${EXAMPLE_ID}).`,
      });
      return;
    }

    setRegistryId(targetId);
    setCopiedMessageString(false);
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
  const trust = getTrustState(record?.certificationStatus, record?.certifiedAt);
  const proofState =
    state.status === "success"
      ? getProofStateLabel(state.endpointVerified, state.signatureVerified)
      : null;

  return (
    <main className="mx-auto max-w-[1180px] px-6 py-10">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="Public verification"
          title="Verify AI governance through signed proof"
          description="Confirm whether a GAFAIG public trust record is valid by registry ID. Verification checks the live record, signed proof, signature, and public trust state."
          secondaryDescription="Verification is deterministic and reproducible. Anyone can validate the same result independently using the exact messageString, signature, and GAFAIG public key."
          actions={
            <>
              <PublicButtonLink
                href={`/registry/${EXAMPLE_ID}`}
                variant="secondary"
              >
                View example record
              </PublicButtonLink>
              <PublicButtonLink href="/registry" variant="secondary">
                Open registry
              </PublicButtonLink>
              <PublicButtonLink href="/developers" variant="secondary">
                Developer docs
              </PublicButtonLink>
            </>
          }
        />

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-3xl text-[15px] leading-7 text-black/75">
            This is the independent proof layer behind the certified public trust record.
          </div>

          <div className="mt-8 text-[13px] font-semibold uppercase tracking-[0.22em] text-black/60">
            WHAT THIS PAGE PROVES
          </div>

          <h2 className="mt-4 max-w-[860px] text-[26px] font-semibold tracking-tight text-black">
            Independent verification of the public trust record
          </h2>

          <p className="mt-5 max-w-[980px] text-[15px] leading-7 text-black/75">
            This page proves that the public trust record is valid, that the
            disclosed signed proof is consistent with the registry, and that the
            result can be independently verified outside GAFAIG.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ProofCard
              title="Record integrity"
              body="The signed proof resolves against the public trust record that represents the certified outcome."
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

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="max-w-[980px] space-y-3 text-[15px] leading-7 text-black/75">
            <p>
              GAFAIG verification focuses on the public certification stage rather
              than internal workflow stages.
            </p>

            <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
              <div className="grid gap-3 text-[15px] leading-7 text-black/75">
                <div>
                  <span className="font-semibold text-black">Verification</span>{" "}
                  confirms that the public record, signed proof, and published
                  verification key are consistent with one another.
                </div>

                <div>
                  <span className="font-semibold text-black">Certified</span>{" "}
                  means the evaluated outcome has been finalized and published
                  as an independently verifiable public trust record in the
                  Registry of Record.
                </div>
              </div>
            </div>

            <p className="text-black/70">
              This page does not expose private evidence, scoring, or internal
              assessment workflow details. It confirms the public certification
              outcome and the integrity of the disclosed proof materials.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-black/10 bg-white p-8">
          <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
            Live verification
          </div>

          <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
            Verify by registry ID
          </h2>

          <p className="mt-3 max-w-3xl text-[15px] leading-7 text-black/75">
            Enter a GAFAIG registry ID to retrieve the public trust record and
            signed proof payload.
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

        <section className="rounded-3xl border border-black/10 bg-black p-8 text-white">
          <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/55">
            How verification works
          </div>

          <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-white">
            Public trust without private evidence disclosure
          </h2>

          <p className="mt-4 max-w-3xl text-[15px] leading-7 text-white/72">
            GAFAIG verification confirms that a public trust record exists, that
            it is currently surfaced through the canonical registry views, and
            that its signed proof is valid for independent verification. The
            public layer does not disclose private reviewer materials, internal
            evidence, or assessment workflow details.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Step 1
              </div>
              <div className="mt-3 text-[20px] font-semibold text-white">
                Resolve public trust record
              </div>
              <p className="mt-3 text-[14px] leading-7 text-white/68">
                The verification endpoint resolves the public trust record from
                the canonical public registry view in Snowflake.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Step 2
              </div>
              <div className="mt-3 text-[20px] font-semibold text-white">
                Return signed proof
              </div>
              <p className="mt-3 text-[14px] leading-7 text-white/68">
                GAFAIG returns a deterministic signed proof payload generated
                during certification.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
                Step 3
              </div>
              <div className="mt-3 text-[20px] font-semibold text-white">
                Verify signature externally
              </div>
              <p className="mt-3 text-[14px] leading-7 text-white/68">
                External parties use the exact messageString, signature, and
                public key to independently confirm the record.
              </p>
            </div>
          </div>
        </section>

        {state.status === "success" && result && proof && record && proofState ? (
          <>
            <section className="rounded-3xl border border-black/10 bg-white p-8">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
                    Proof integrity
                  </div>

                  <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                    Cryptographic trust dashboard
                  </h2>

                  <p className="mt-4 text-[15px] leading-7 text-black/75">
                    This panel combines the server-side GAFAIG verification
                    response with independent client-side Ed25519 signature
                    validation. It is the clearest public proof surface for the
                    record currently under review.
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
                        ? "Payload Integrity: Verified"
                        : "Payload Integrity: Invalid"
                    }
                  />
                </div>
              </div>

              <div className="mt-8">
                <ProofStateBanner
                  title={proofState.title}
                  body={proofState.body}
                  tone={proofState.tone}
                />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <ProofMetricCard
                  label="Trust state"
                  value={trust.label}
                  body={
                    trust.label === "Certified"
                      ? "Published and trusted in the Registry of Record."
                      : "No certified public trust record was resolved."
                  }
                />
                <ProofMetricCard
                  label="Entity"
                  value={record.entityName ?? "—"}
                  body="The organization associated with the public trust record."
                />
                <ProofMetricCard
                  label="Signed at"
                  value={formatDateShort(proof.signedAt)}
                  body="Timestamp attached to the current signed proof payload."
                />
                <ProofMetricCard
                  label="Key ID"
                  value={proof.kid ?? "—"}
                  body="Published key identifier used to validate the signed proof."
                />
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-8">
              <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
                Verification summary
              </div>

              <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                Human-readable proof status
              </h2>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DetailCard
                  label="Registry ID"
                  value={record.registryId ?? "—"}
                />
                <DetailCard
                  label="Certification status"
                  value={record.certificationStatus ?? trust.label}
                />
                <DetailCard label="Country" value={record.country ?? "—"} />
                <DetailCard
                  label="Entity type"
                  value={record.entityType ?? "—"}
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <DetailCard
                  label="Certified at"
                  value={formatDate(record.certifiedAt)}
                />
                <DetailCard
                  label="Valid from"
                  value={formatDate(record.validFrom)}
                />
                <DetailCard
                  label="Valid to"
                  value={formatDate(record.validTo)}
                />
                <DetailCard label="Algorithm" value={proof.alg ?? "—"} />
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-8">
              <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
                Proof materials
              </div>

              <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                The exact signed proof being verified
              </h2>

              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-black/75">
                These are the exact public materials used to validate the trust
                result. External parties can inspect them directly, validate the
                messageString, and confirm that the signature matches the
                published key.
              </p>

              <p className="mt-4 text-[14px] font-semibold leading-7 text-black">
                Verification MUST use the exact messageString returned by the
                API. Do NOT reconstruct payloads from JSON fields. Any
                reconstruction invalidates the signature.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <DetailCard
                  label="Verification key URL"
                  value={proof.verificationKeyUrl ?? "—"}
                />
                <DetailCard
                  label="Public key"
                  value={truncateMiddle(state.publicKeyBase64, 28, 18)}
                />
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <DetailCard
                  label="Signature"
                  value={truncateMiddle(proof.signature ?? "", 28, 18)}
                />
                <DetailCard
                  label="Message string"
                  value={truncateMiddle(proof.messageString ?? "", 28, 18)}
                />
              </div>

              <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
                    Full signed messageString
                  </div>

                  <button
                    type="button"
                    onClick={() => copyMessageString(proof.messageString ?? "")}
                    className="rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-semibold text-black transition hover:bg-black/[0.04]"
                  >
                    {copiedMessageString ? "Copied" : "Copy messageString"}
                  </button>
                </div>

                <pre className="mt-3 overflow-x-auto rounded-2xl border border-black/10 bg-white p-4 text-[12px] leading-6 text-black/75">
                  {proof.messageString ?? "—"}
                </pre>
              </div>

              <div className="mt-4 rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/45">
                  Full signed message object
                </div>
                <pre className="mt-3 overflow-x-auto rounded-2xl border border-black/10 bg-white p-4 text-[12px] leading-6 text-black/75">
                  {prettyJson(proof.message)}
                </pre>
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-8">
              <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
                External validation
              </div>

              <h2 className="mt-3 text-[26px] font-semibold tracking-tight text-black">
                Independent verification flow
              </h2>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
                  <div className="text-[18px] font-semibold text-black">
                    What was checked
                  </div>
                  <ul className="mt-4 space-y-3 text-[14px] leading-7 text-black/70">
                    <li>• Live GAFAIG verification endpoint response</li>
                    <li>• Public key fetched from published key URL</li>
                    <li>• Exact deterministic messageString</li>
                    <li>• Ed25519 signature verification in browser</li>
                  </ul>
                </div>

                <div className="rounded-2xl border border-black/10 bg-black/[0.02] p-5">
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
                        ? "Payload Integrity: Verified"
                        : "Payload Integrity: Invalid"}
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <PublicButtonLink href={verifyEndpointUrl} variant="secondary">
                  Open raw verification JSON
                </PublicButtonLink>

                {proof.verificationKeyUrl ? (
                  <PublicButtonLink
                    href={proof.verificationKeyUrl}
                    variant="secondary"
                  >
                    Open public key
                  </PublicButtonLink>
                ) : null}

                {record.registryId ? (
                  <PublicButtonLink
                    href={`/registry/${encodeURIComponent(record.registryId)}`}
                    variant="secondary"
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