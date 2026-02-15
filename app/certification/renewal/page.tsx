"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type RenewalResult =
  | {
      ok: true;
      received: true;
      requestId: string;
      message: string;
      nextSteps?: string[];
      references?: Array<{ label: string; href: string }>;
    }
  | {
      ok: false;
      received: false;
      error?: string;
      errors?: string[];
      status?: number;
      raw?: any;
    };

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

export default function RenewalPage() {
  const [requestedAction, setRequestedAction] = useState<"renewal" | "fast-track">(
    "renewal"
  );

  const [organizationName, setOrganizationName] = useState("");
  const [website, setWebsite] = useState("");
  const [primaryContactName, setPrimaryContactName] = useState("");
  const [primaryContactEmail, setPrimaryContactEmail] = useState("");

  const [registryId, setRegistryId] = useState("");
  const [currentStatus, setCurrentStatus] = useState<
    "active" | "pending" | "suspended" | "revoked" | "expired"
  >("active");

  const [incidentDisclosure, setIncidentDisclosure] = useState<
    "none" | "yes" | "unknown"
  >("unknown");

  const [changesSummary, setChangesSummary] = useState("");

  const [ackTruthfulness, setAckTruthfulness] = useState(false);
  const [ackMarkRules, setAckMarkRules] = useState(false);
  const [ackNotifyMaterialChanges, setAckNotifyMaterialChanges] = useState(false);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RenewalResult | null>(null);

  const validation = useMemo(() => {
    const orgOk = organizationName.trim().length > 1;
    const emailOk = isEmail(primaryContactEmail);
    const summaryOk = changesSummary.trim().length > 10;
    const acksOk = ackTruthfulness && ackMarkRules && ackNotifyMaterialChanges;

    return {
      orgOk,
      emailOk,
      summaryOk,
      acksOk,
      canSubmit: orgOk && emailOk && summaryOk && acksOk
    };
  }, [
    organizationName,
    primaryContactEmail,
    changesSummary,
    ackTruthfulness,
    ackMarkRules,
    ackNotifyMaterialChanges
  ]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);

    if (!validation.canSubmit) {
      setResult({
        ok: false,
        received: false,
        error: "Form is not ready yet — please complete the required fields below."
      });
      return;
    }

    setLoading(true);

    const payload = {
      organizationName,
      website,
      primaryContactName,
      primaryContactEmail,
      registryId,
      currentStatus,
      requestedAction,
      changesSummary,
      incidentDisclosure,
      acknowledgments: {
        truthfulness: ackTruthfulness,
        markRules: ackMarkRules,
        notifyMaterialChanges: ackNotifyMaterialChanges
      }
    };

    try {
      const res = await fetch("/api/renewal", {
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

      setResult(json as RenewalResult);
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
      <h1>Renewal & Low-Risk Fast-Track Intake</h1>

      <p>
        Use this intake for annual renewal or a low-risk fast-track request. Submission
        does not change certification status until GAFAIG issues an updated registry entry.
      </p>

      <div className="callout legal">
        <strong>Reminder</strong>
        <p style={{ margin: 0, marginTop: ".5rem" }}>
          GAFAIG is not a regulator. Certification is not a warranty or legal compliance.
          Mark use is not permitted unless status is Active. See{" "}
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

      {/* Always-visible readiness box */}
      <div className="callout note" style={{ marginTop: "1.25rem" }}>
        <strong>Submit readiness</strong>
        <ul style={{ margin: 0, marginTop: ".6rem" }}>
          <li>Organization name: {validation.orgOk ? "✅" : "❌"}</li>
          <li>Valid email: {validation.emailOk ? "✅" : "❌"}</li>
          <li>Change summary (10+ chars): {validation.summaryOk ? "✅" : "❌"}</li>
          <li>Acknowledgments (3/3): {validation.acksOk ? "✅" : "❌"}</li>
        </ul>
        <div style={{ marginTop: ".6rem" }}>
          <strong>canSubmit:</strong> {String(validation.canSubmit)}
        </div>
      </div>

      <form
        onSubmit={onSubmit}
        style={{ marginTop: "1.75rem", display: "grid", gap: "1rem", maxWidth: 900 }}
      >
        <h2>Request type</h2>

        <label>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Select request</div>
          <select
            value={requestedAction}
            onChange={(e) => setRequestedAction(e.target.value as any)}
            style={{
              width: "100%",
              padding: "0.85rem 0.9rem",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              background: "white"
            }}
          >
            <option value="renewal">Renewal</option>
            <option value="fast-track">Low-Risk Fast-Track</option>
          </select>
        </label>

        <h2>Applicant details</h2>

        <label>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Organization name</div>
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
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Website (optional)</div>
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
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
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
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Primary contact email</div>
            <input
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

        <h2>Registry context</h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <label>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Registry ID (optional)</div>
            <input
              value={registryId}
              onChange={(e) => setRegistryId(e.target.value)}
              placeholder="e.g., gafaig-reg-000001"
              style={{
                width: "100%",
                padding: "0.85rem 0.9rem",
                border: "1px solid #e5e7eb",
                borderRadius: 10
              }}
            />
          </label>

          <label>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>
              Current status (best knowledge)
            </div>
            <select
              value={currentStatus}
              onChange={(e) => setCurrentStatus(e.target.value as any)}
              style={{
                width: "100%",
                padding: "0.85rem 0.9rem",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                background: "white"
              }}
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="revoked">Revoked</option>
              <option value="expired">Expired</option>
            </select>
          </label>
        </div>

        <h2>Change & incident posture</h2>

        <label>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            Incident disclosure since last review
          </div>
          <select
            value={incidentDisclosure}
            onChange={(e) => setIncidentDisclosure(e.target.value as any)}
            style={{
              width: "100%",
              padding: "0.85rem 0.9rem",
              border: "1px solid #e5e7eb",
              borderRadius: 10,
              background: "white"
            }}
          >
            <option value="unknown">Unknown / Not sure yet</option>
            <option value="none">No incidents to disclose</option>
            <option value="yes">Yes — incidents occurred / disclosed</option>
          </select>
        </label>

        <label>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Summary of changes (required)</div>
          <textarea
            value={changesSummary}
            onChange={(e) => setChangesSummary(e.target.value)}
            placeholder="Describe changes since last certification..."
            rows={6}
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
                checked={ackMarkRules}
                onChange={(e) => setAckMarkRules(e.target.checked)}
              />
              <span>I understand mark use is restricted and depends on Active status.</span>
            </label>

            <label style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
              <input
                type="checkbox"
                checked={ackNotifyMaterialChanges}
                onChange={(e) => setAckNotifyMaterialChanges(e.target.checked)}
              />
              <span>I agree to notify GAFAIG of material changes.</span>
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
            fontWeight: 800,
            cursor: loading ? "wait" : "pointer",
            opacity: !validation.canSubmit || loading ? 0.6 : 1,
            width: "fit-content"
          }}
        >
          {loading ? "Submitting…" : validation.canSubmit ? "Submit request" : "Complete required fields"}
        </button>
      </form>

      {result ? (
        <section style={{ marginTop: "2rem", maxWidth: 900 }}>
          {"ok" in result && result.ok ? (
            <div className="callout note">
              <strong>Request received</strong>
              <p style={{ margin: 0, marginTop: ".5rem" }}>{result.message}</p>
              <p style={{ margin: 0, marginTop: ".5rem" }}>
                <strong>Request ID:</strong> {result.requestId}
              </p>
            </div>
          ) : (
            <div className="callout warning">
              <strong>Submission error</strong>
              {result.errors?.length ? (
                <ul style={{ margin: 0, marginTop: ".5rem" }}>
                  {result.errors.map((e, idx) => (
                    <li key={idx}>{e}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ margin: 0, marginTop: ".5rem" }}>
                  {result.error || "Unable to submit. Please try again."}{" "}
                  {typeof result.status === "number" ? `(HTTP ${result.status})` : ""}
                </p>
              )}
              {result.raw ? (
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
        Questions? Use{" "}
        <Link href="/ask" style={{ color: "#111827" }}>
          Ask GAFAIG
        </Link>
        .
      </p>
    </main>
  );
}
