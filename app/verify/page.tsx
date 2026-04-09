"use client";

import { useMemo, useState } from "react";
import PublicPageHero from "@/app/_components/PublicPageHero";
import PublicButtonLink from "@/app/_components/PublicButtonLink";

type VerifyApiResponse = {
  ok: boolean;
  verified: boolean;
  registryId?: string;
  error?: string;
  proof?: {
    alg?: string;
    kid?: string;
    signature?: string;
    signedAt?: string | null;
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

const EXAMPLE_ID = "GAFAIG-4cf088b9796f492f934acf69615de934";

function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function normalizeRegistryId(value: string): string {
  return String(value || "").trim();
}

function statusPillClasses(verified: boolean): string {
  return verified
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-red-200 bg-red-50 text-red-700";
}

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return "";
  }
}

export default function VerifyPage() {
  const [registryId, setRegistryId] = useState(EXAMPLE_ID);
  const [submittedId, setSubmittedId] = useState(EXAMPLE_ID);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerifyApiResponse | null>(null);
  const [error, setError] = useState<string>("");

  const verifyUrl = useMemo(() => {
    const id = normalizeRegistryId(submittedId);
    return id ? `/api/verify/${encodeURIComponent(id)}` : "";
  }, [submittedId]);

  async function runVerification(id: string) {
    const cleaned = normalizeRegistryId(id);
    if (!cleaned) {
      setError("Enter a registry ID to verify.");
      setResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setSubmittedId(cleaned);

    try {
      const response = await fetch(`/api/verify/${encodeURIComponent(cleaned)}`, {
        cache: "no-store",
      });

      const data = (await response.json()) as VerifyApiResponse;

      if (!response.ok || !data.ok) {
        setResult(data);
        setError(data.error || "Verification failed.");
        return;
      }

      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setLoading(false);
    }
  }

  const proof = result?.proof;
  const record = result?.record;
  const verified = Boolean(result?.verified);

  return (
    <main className="mx-auto max-w-[1180px] px-6 pb-16 pt-14">
      <div className="space-y-8">
        <PublicPageHero
          eyebrow="Public verification"
          title="Verify a GAFAIG record"
          description="Confirm whether a public GAFAIG certification record is valid by registry ID. Verification checks the live record, public proof payload, signature metadata, and current certification status."
          secondaryDescription="This public trust surface exposes certification outcomes without exposing private evidence, findings, reviewer notes, or controlled assessment materials."
          actions={
            <>
              <PublicButtonLink href={`/registry/${EXAMPLE_ID}`} variant="secondary">
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

        <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
          <div className="max-w-3xl">
            <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
              Live verification
            </div>
            <h2 className="mt-3 text-[32px] font-semibold tracking-tight text-black">
              Verify by registry ID
            </h2>
            <p className="mt-4 text-[16px] leading-8 text-black/70">
              Enter a GAFAIG registry ID to retrieve the public verification record and
              signed proof payload.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <input
              value={registryId}
              onChange={(e) => setRegistryId(e.target.value)}
              placeholder="Enter registry ID"
              className="min-h-[56px] flex-1 rounded-2xl border border-black/10 bg-white px-5 text-[15px] text-black outline-none transition focus:border-black/30"
            />
            <button
              type="button"
              onClick={() => runVerification(registryId)}
              disabled={loading}
              className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black bg-black px-6 text-sm font-semibold text-white transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Verifying..." : "Verify record"}
            </button>
            <button
              type="button"
              onClick={() => {
                setRegistryId(EXAMPLE_ID);
                runVerification(EXAMPLE_ID);
              }}
              disabled={loading}
              className="inline-flex min-h-[56px] items-center justify-center rounded-full border border-black/15 px-6 text-sm font-semibold text-black transition hover:bg-black/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Load example
            </button>
          </div>

          <div className="mt-4 text-[13px] text-black/55">
            Example ID:{" "}
            <button
              type="button"
              onClick={() => setRegistryId(EXAMPLE_ID)}
              className="font-mono text-black underline underline-offset-4"
            >
              {EXAMPLE_ID}
            </button>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-[14px] text-red-700">
              {error}
            </div>
          ) : null}
        </section>

        {result ? (
          <>
            <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
                    Verification result
                  </div>
                  <h2 className="mt-3 text-[32px] font-semibold tracking-tight text-black">
                    {record?.entityName || result.registryId || "Verification response"}
                  </h2>
                </div>

                <div
                  className={`inline-flex items-center rounded-full border px-4 py-2 text-[13px] font-semibold uppercase tracking-[0.18em] ${statusPillClasses(
                    verified
                  )}`}
                >
                  {verified ? "Verified" : "Not verified"}
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Registry ID
                  </div>
                  <div className="mt-3 break-all font-mono text-[14px] text-black">
                    {record?.registryId || result.registryId || "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Decision
                  </div>
                  <div className="mt-3 text-[18px] font-semibold text-black">
                    {record?.decisionStatus || "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Tier / Band
                  </div>
                  <div className="mt-3 text-[18px] font-semibold text-black">
                    {record?.certifiedTier || "—"}
                    {record?.certifiedBand ? ` · ${record.certifiedBand}` : ""}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Certified score
                  </div>
                  <div className="mt-3 text-[18px] font-semibold text-black">
                    {record?.certifiedScore ?? "—"}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-2xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Entity type
                  </div>
                  <div className="mt-3 text-[15px] text-black/80">
                    {record?.entityType || "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Country
                  </div>
                  <div className="mt-3 text-[15px] text-black/80">
                    {record?.country || "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Valid from
                  </div>
                  <div className="mt-3 text-[15px] text-black/80">
                    {formatDate(record?.validFrom)}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Valid to
                  </div>
                  <div className="mt-3 text-[15px] text-black/80">
                    {formatDate(record?.validTo)}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {record?.registryId ? (
                  <PublicButtonLink
                    href={`/registry/${record.registryId}`}
                    variant="secondary"
                  >
                    Open registry record
                  </PublicButtonLink>
                ) : null}

                {verifyUrl ? (
                  <a
                    href={verifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-black/15 px-5 py-3 text-sm font-semibold text-black transition hover:bg-black/[0.04]"
                  >
                    Open raw API response
                  </a>
                ) : null}

                {proof?.verificationKeyUrl ? (
                  <a
                    href={proof.verificationKeyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-full border border-black/15 px-5 py-3 text-sm font-semibold text-black transition hover:bg-black/[0.04]"
                  >
                    Open public key
                  </a>
                ) : null}
              </div>
            </section>

            <section className="rounded-3xl border border-black/10 bg-white p-8 md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-3xl">
                  <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-black/55">
                    Signed public proof
                  </div>
                  <h2 className="mt-3 text-[32px] font-semibold tracking-tight text-black">
                    Cryptographic verification payload
                  </h2>
                  <p className="mt-4 text-[16px] leading-8 text-black/70">
                    This section exposes the public proof object used for independent
                    verification. The signed message is derived from the live public
                    registry record and signed with the GAFAIG verification key.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {proof?.alg ? (
                    <div className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] text-violet-700">
                      {proof.alg}
                    </div>
                  ) : null}
                  <div
                    className={`rounded-full border px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.14em] ${statusPillClasses(
                      verified
                    )}`}
                  >
                    {verified ? "Verified" : "Unverified"}
                  </div>
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Key ID
                  </div>
                  <div className="mt-3 break-all font-mono text-[14px] text-black">
                    {proof?.kid || "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Signed at
                  </div>
                  <div className="mt-3 text-[15px] text-black/80">
                    {formatDate(proof?.signedAt)}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[#fcfcfb] p-5 md:col-span-2">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Verification key URL
                  </div>
                  <div className="mt-3 break-all font-mono text-[13px] text-black">
                    {proof?.verificationKeyUrl || "—"}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[#fcfcfb] p-5 md:col-span-2">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Signature
                  </div>
                  <div className="mt-3 max-h-[180px] overflow-auto break-all font-mono text-[12px] leading-6 text-black">
                    {proof?.signature || "—"}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-6 xl:grid-cols-2">
                <div className="rounded-2xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Signed message string
                  </div>
                  <pre className="mt-3 max-h-[320px] overflow-auto whitespace-pre-wrap break-all font-mono text-[12px] leading-6 text-black/85">
                    {proof?.messageString || "—"}
                  </pre>
                </div>

                <div className="rounded-2xl border border-black/10 bg-[#fcfcfb] p-5">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black/50">
                    Parsed message object
                  </div>
                  <pre className="mt-3 max-h-[320px] overflow-auto whitespace-pre-wrap break-all font-mono text-[12px] leading-6 text-black/85">
                    {safeJson(proof?.message) || "—"}
                  </pre>
                </div>
              </div>
            </section>
          </>
        ) : null}

        <section className="rounded-3xl border border-black/10 bg-black p-8 text-white md:p-10">
          <div className="max-w-3xl">
            <div className="text-[12px] font-semibold uppercase tracking-[0.22em] text-white/55">
              How verification works
            </div>
            <h2 className="mt-3 text-[32px] font-semibold tracking-tight text-white">
              Public trust without private evidence disclosure
            </h2>
            <p className="mt-4 text-[16px] leading-8 text-white/75">
              GAFAIG verification confirms that a public registry record exists,
              that it is currently surfaced through the canonical registry views, and
              that its proof payload is signed for independent verification. The
              public layer does not disclose private reviewer materials, internal
              evidence, or assessment workflow details.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Step 1
              </div>
              <div className="mt-3 text-[18px] font-semibold text-white">
                Resolve public record
              </div>
              <p className="mt-3 text-[14px] leading-7 text-white/70">
                The verification endpoint resolves the registry record from the
                canonical public registry view in Snowflake.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Step 2
              </div>
              <div className="mt-3 text-[18px] font-semibold text-white">
                Construct proof message
              </div>
              <p className="mt-3 text-[14px] leading-7 text-white/70">
                GAFAIG creates a deterministic public proof payload from the disclosed
                certification record.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                Step 3
              </div>
              <div className="mt-3 text-[18px] font-semibold text-white">
                Verify signature externally
              </div>
              <p className="mt-3 text-[14px] leading-7 text-white/70">
                External parties can fetch the public key, validate the signature, and
                independently confirm the record.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}