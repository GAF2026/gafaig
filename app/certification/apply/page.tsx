"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ApplyOk = {
  ok: true;
  received: true;
  requestId: string;
  message: string;
  nextSteps?: string[];
  references?: Array<{ label: string; href: string }>;
};

type ApplyErr = {
  ok: false;
  received: false;
  error?: string;
  errors?: string[];
  status?: number;
  raw?: any;
};

// More forgiving email check (still blocks obvious invalids)
// - trims whitespace
// - requires one "@"
// - requires at least one "." after the "@"
// - blocks spaces
function isEmailLoose(s: string) {
  const v = (s || "").trim();
  if (!v) return false;
  if (/\s/.test(v)) return false;
  const at = v.indexOf("@");
  if (at <= 0) return false;
  const dot = v.lastIndexOf(".");
  if (dot <= at + 1) return false;
  if (dot === v.length - 1) return false;
  return true;
}

// helper to reveal hidden whitespace characters for debugging
function visibleWhitespace(s: string) {
  return (s ?? "")
    .replaceAll("\u00A0", "[NBSP]")
    .replaceAll(" ", "␠")
    .replaceAll("\t", "␉");
}

export default function ApplyPage() {
  const [organizationName, setOrganizationName] = useState("");
  const [website, setWebsite] = useState("");
  const [primaryContactName, setPrimaryContactName] = useState("");
  const [primaryContactEmail, setPrimaryContactEmail] = useState("");

  const [certTier, setCertTier] = useState<"foundation" | "advanced" | "enterprise">(
    "foundation"
  );

  const [scopeSummary, setScopeSummary] = useState("");
  const [changeSummary, setChangeSummary] = useState("");

  const [ackTruthfulness, setAckTruthfulness] = useState(false);
  const [ackMasterTerms, setAckMasterTerms] = useState(false);
  const [ackMarkRules, setAckMarkRules] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApplyOk | ApplyErr | null>(null);

  const validation = useMemo(() => {
    const orgOk = organizationName.trim().length > 1;

    const emailRaw = primaryContactEmail;
    const emailTrimmed = (primaryContactEmail || "").trim();
    const emailOk = isEmailLoose(primaryContactEmail);

    const scopeOk = scopeSummary.trim().length > 10;
    const acksOk = ackTruthfulness && ackMasterTerms && ackMarkRules;
    const canSubmit = orgOk && emailOk && scopeOk && acksOk;

    return {
      orgOk,
      emailOk,
      scopeOk,
      acksOk,
      canSubmit,
      emailRaw,
      emailTrimmed
    };
  }, [
    organizationName,
    primaryContactEmail,
    scopeSummary,
    ackTruthfulness,
    ackMasterTerms,
    ackMarkRules
  ]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    if (!validation.canSubmit) {
      setResult({
        ok: false,
        received: false,
        error: "Form is not ready yet — please complete the required fields."
      });
      return;
    }

    setLoading(true);

    const payload = {
      organizationName,
      website,
      primaryContactName,
      primaryContactEmail: validation.emailTrimmed, // always trimmed
      requestedTier: certTier,
      scopeSummary,
      changeSummary,
      acknowledgments: {
        truthfulness: ackTruthfulness,
        masterTerms: ackMasterTerms,
        markRules: ackMarkRules
      }
    };

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        json = null;
      }

      if (!res.ok) {
        setResult({
          ok: false,
          received: false,
          status: res.status,
          errors: json?.errors,
          error: json?.error || "Request failed.",
          raw: json
        });
        return;
      }

      setResult(json as ApplyOk);
    } catch (err: any) {
      setResult({
        ok: false,
        received: false,
        error: "Network error (fetch failed).",
        raw: String(err?.message || err)
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Apply for GAFAIG Certification</h1>

      <p>
        This is the initial applicant intake for GAFAIG’s certification program. Submission does not grant
        certification. Status changes occur only when GAFAIG updates the public registry.
      </p>

      <div className="callout legal">
        <strong>Important</strong>
        <p style={{ margin: 0, marginTop: ".5rem" }}>
          GAFAIG certification is a private mark-and-licensing program. It is not a regulatory approval,
          not a warranty, and not legal compliance advice. See{" "}
          <Link href="/policy/master-terms" style={{ color: "#111827" }}>
            Master Terms
          </Link>{" "}
          and{" "}
          <Link href="/policy/enforcement-boundary" style={{ color: "#111827" }}>
            Enforcement Boundary
          </Link>
          .
        </p>
      </div>

      {/* Readiness + Email Debug */}
      <div className="callout note" style={{ marginTop: "1.25rem" }}>
        <strong>Submit readiness</strong>
        <ul style={{ margin: 0, marginTop: ".6rem" }}>
          <li>Organization name: {validation.orgOk ? "✅" : "❌"}</li>
          <li>Valid email: {validation.emailOk ? "✅" : "❌"}</li>
          <li>Scope summary (10+ chars): {validation.scopeOk ? "✅" : "❌"}</li>
          <li>Acknowledgments (3/3): {validation.acksOk ? "✅" : "❌"}</li>
        </ul>
        <div style={{ marginTop: ".6rem" }}>
          <strong>canSubmit:</strong> {String(validation.canSubmit)}
        </div>

        <div style={{ marginTop: ".75rem" }}>
          <strong>Email debug</strong>
          <div className="meta" style={{ marginTop: ".35rem" }}>
            Raw: <code>{visibleWhitespace(validation.emailRaw)}</code>
          </div>
          <div className="meta" style={{ marginTop: ".35rem" }}>
            Trimmed: <code>{validation.emailTrimmed}</code>
          </div>
          {!validation.emailOk ? (
            <div className="meta" style={{ marginTop: ".35rem" }}>
              Tip: email must look like <code>name@company.com</code> (must include a dot after the @).
            </div>
          ) : null}
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        style={{ marginTop: "1.75rem", display: "grid", gap: "1rem", maxWidth: 900 }}
      >
        <h2>Applicant details</h2>

        <label>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Organization name</div>
          <input
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            placeholder="Organization name"
            style={{
              width: "100%",
              padding: "0.85rem 0.9rem",
              border: "1px solid #e5e7eb",
              borderRadius: 10
            }}
          />
        </label>

        <label>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Website (optional)</div>
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="example.com"
            style={{
              width: "100%",
              padding: "0.85rem 0.9rem",
              border: "1px solid #e5e7eb",
              borderRadius: 10
            }}
          />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <label>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>
              Primary contact name (optional)
            </div>
            <input
              value={primaryContactName}
              onChange={(e) => setPrimaryContactName(e.target.value)}
              placeholder="Full name"
              style={{
                width: "100%",
                padding: "0.85rem 0.9rem",
                border: "1px solid #e5e7eb",
                borderRadius: 10
              }}
            />
          </label>

          <label>
            <div style={{ fontWeight: 800, marginBottom: 6 }}>Primary contact email</div>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              value={primaryContactEmail}
              onChange={(e) => setPrimaryContactEmail(e.target.value)}
              placeholder="name@company.com"
              style={{
                width: "100%",
                padding: "0.85rem 0.9rem",
                border: "1px solid #e5e7eb",
                borderRadius: 10
              }}
            />
          </label>
        </div>

        <h2>Requested certification tier</h2>

        <label>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Tier</div>
          <select
            value={certTier}
            onChange={(e) => setCertTier(e.target.value as any)}
            style={{
              width: "100%",
              padding: "0.85rem 0.9rem",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              background: "white"
            }}
          >
            <option value="foundation">Foundation</option>
            <option value="advanced">Advanced</option>
            <option value="enterprise">Enterprise</option>
          </select>
          <p className="meta" style={{ marginTop: 6 }}>
            Tier definitions are published on{" "}
            <Link href="/certification" style={{ color: "#111827" }}>
              Certification
            </Link>
            .
          </p>
        </label>

        <h2>Scope & disclosures</h2>

        <label>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Scope summary (required)</div>
          <textarea
            value={scopeSummary}
            onChange={(e) => setScopeSummary(e.target.value)}
            placeholder="Describe the AI system(s) scope you want certified: purpose, users/impacted groups, deployment surfaces, key risks."
            rows={6}
            style={{
              width: "100%",
              padding: "0.85rem 0.9rem",
              border: "1px solid #e5e7eb",
              borderRadius: 10
            }}
          />
        </label>

        <label>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>
            Change summary (optional)
          </div>
          <textarea
            value={changeSummary}
            onChange={(e) => setChangeSummary(e.target.value)}
            placeholder="Optional: recent changes, known incidents, mitigations, monitoring posture."
            rows={4}
            style={{
              width: "100%",
              padding: "0.85rem 0.9rem",
              border: "1px solid #e5e7eb",
              borderRadius: 10
            }}
          />
        </label>

        <h2>Required acknowledgments</h2>

        <div className="callout legal">
          <strong>Applicant acknowledgments</strong>
          <div style={{ marginTop: ".75rem", display: "grid", gap: ".6rem" }}>
            <label style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={ackTruthfulness}
                onChange={(e) => setAckTruthfulness(e.target.checked)}
              />
              <span>I confirm the information submitted is truthful.</span>
            </label>

            <label style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={ackMasterTerms}
                onChange={(e) => setAckMasterTerms(e.target.checked)}
              />
              <span>
                I acknowledge GAFAIG Master Terms and understand certification is not regulatory approval.
              </span>
            </label>

            <label style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={ackMarkRules}
                onChange={(e) => setAckMarkRules(e.target.checked)}
              />
              <span>I acknowledge GAFAIG mark use rules and restrictions.</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={!validation.canSubmit || loading}
          style={{
            padding: "0.95rem 1rem",
            borderRadius: 10,
            border: "1px solid #111827",
            background: "#111827",
            color: "white",
            fontWeight: 900,
            cursor: loading ? "wait" : "pointer",
            opacity: !validation.canSubmit || loading ? 0.6 : 1,
            width: "fit-content"
          }}
        >
          {loading ? "Submitting…" : validation.canSubmit ? "Submit application" : "Complete required fields"}
        </button>
      </form>

      {result ? (
        <section style={{ marginTop: "2rem", maxWidth: 900 }}>
          {"ok" in result && result.ok ? (
            <div className="callout note">
              <strong>Application received</strong>
              <p style={{ margin: 0, marginTop: ".5rem" }}>{result.message}</p>
              <p style={{ margin: 0, marginTop: ".5rem" }}>
                <strong>Request ID:</strong> {result.requestId}
              </p>
            </div>
          ) : (
            <div className="callout warning">
              <strong>Submission error</strong>
              <p style={{ margin: 0, marginTop: ".5rem" }}>
                {"errors" in result && result.errors?.length
                  ? result.errors.join(" • ")
                  : result.error || "Unable to submit. Please try again."}{" "}
                {"status" in result && typeof result.status === "number"
                  ? `(HTTP ${result.status})`
                  : ""}
              </p>
              {"raw" in result && result.raw ? (
                <pre
                  style={{
                    marginTop: ".75rem",
                    padding: ".75rem",
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    overflowX: "auto",
                    background: "#fff"
                  }}
                >
                  {JSON.stringify(result.raw, null, 2)}
                </pre>
              ) : null}
            </div>
          )}
        </section>
      ) : null}

      <p className="meta" style={{ marginTop: "1.75rem" }}>
        Prefer renewal or fast-track?{" "}
        <Link href="/certification/renewal" style={{ color: "#111827" }}>
          Go to renewal intake
        </Link>
        .
      </p>
    </main>
  );
}
