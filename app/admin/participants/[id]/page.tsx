"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminNav from "../../_components/AdminNav";

type ParticipantRow = {
  participantId: string;
  participantType: string | null;
  jurisdictionLevel: string | null;
  name: string | null;
  country: string | null;
  website: string | null;
  profileSlug: string | null;
  designationLevel: string | null;
  verificationStatus: string | null;
  contactEmail: string | null;
  publicSummary: string | null;
  logoUrl: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

const DESIGNATION_PRESETS = [
  { value: "", label: "— (none)" },
  { value: "observer", label: "Observer" },
  { value: "participant", label: "Participant" },
  { value: "contributor", label: "Contributor" },
  { value: "verified-participant", label: "Verified Participant" },
  { value: "certified-alignment", label: "Certified Alignment" },
  { value: "governance-partner", label: "Governance Partner" },
];

export default function AdminParticipantDetailsPage() {
  const params = useParams();
  const id = String((params as any)?.id ?? "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [row, setRow] = useState<ParticipantRow | null>(null);

  // editable fields
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");
  const [designationLevel, setDesignationLevel] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("unverified");
  const [publicSummary, setPublicSummary] = useState("");

  // save state (PATCH endpoint added next step)
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    setSaveMsg("");

    try {
      const res = await fetch(`/api/admin/participants/${encodeURIComponent(id)}`, {
        cache: "no-store",
      });
      const json = await res.json();

      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || `Failed to load participant (${res.status})`);
      }

      const r: ParticipantRow = json.row;
      setRow(r);

      setCountry(r.country ?? "");
      setWebsite(r.website ?? "");
      setDesignationLevel(r.designationLevel ?? "");
      setVerificationStatus(r.verificationStatus ?? "unverified");
      setPublicSummary(r.publicSummary ?? "");
    } catch (e: any) {
      setError(e?.message ?? "Failed to load participant");
      setRow(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function save() {
    // NOTE: PATCH route is added in the NEXT step.
    setSaving(true);
    setSaveMsg("");

    try {
      const res = await fetch(`/api/admin/participants/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: country || null,
          website: website || null,
          designationLevel: designationLevel || null,
          verificationStatus,
          publicSummary: publicSummary || null,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || `Save failed (${res.status})`);
      }

      setSaveMsg("Saved.");
      await load();
    } catch (e: any) {
      setSaveMsg(`Save failed: ${e?.message ?? "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <AdminNav />

      <div style={{ padding: 24, maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <h1 style={{ fontSize: 22, fontWeight: 900 }}>Admin — Participant</h1>
          <a href="/admin/participants" style={{ textDecoration: "underline" }}>
            ← Back to participants
          </a>
        </div>

        {loading ? <div style={{ marginTop: 12 }}>Loading…</div> : null}

        {error ? (
          <div style={{ marginTop: 12, padding: 12, border: "1px solid crimson", borderRadius: 10 }}>
            <div style={{ color: "crimson", fontWeight: 900 }}>Error</div>
            <div style={{ marginTop: 6 }}>{error}</div>
          </div>
        ) : null}

        {!loading && row ? (
          <div style={{ marginTop: 14 }}>
            <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 20, fontWeight: 900 }}>{row.name ?? "—"}</div>
              <div style={{ marginTop: 6, color: "#555" }}>
                <b>ID:</b> {row.participantId}
              </div>
              <div style={{ marginTop: 6, color: "#555" }}>
                <b>Slug:</b> {row.profileSlug ?? "—"}{" "}
                {row.profileSlug ? (
                  <>
                    •{" "}
                    <a
                      href={`/participants/${encodeURIComponent(row.profileSlug)}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "underline" }}
                    >
                      Open public profile
                    </a>
                  </>
                ) : null}
              </div>

              <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>Verification Status</div>
                  <select
                    value={verificationStatus}
                    onChange={(e) => setVerificationStatus(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: 10 }}
                  >
                    <option value="unverified">unverified</option>
                    <option value="pending">pending</option>
                    <option value="verified">verified</option>
                    <option value="suspended">suspended</option>
                  </select>
                </div>

                <div>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>Designation Level</div>
                  <select
                    value={designationLevel}
                    onChange={(e) => setDesignationLevel(e.target.value)}
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: 10 }}
                  >
                    {DESIGNATION_PRESETS.map((d) => (
                      <option key={d.value} value={d.value}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>Country</div>
                  <input
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g., United States"
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: 10 }}
                  />
                </div>

                <div>
                  <div style={{ fontWeight: 800, marginBottom: 6 }}>Website</div>
                  <input
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: 10 }}
                  />
                </div>
              </div>

              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 800, marginBottom: 6 }}>Public Summary</div>
                <textarea
                  value={publicSummary}
                  onChange={(e) => setPublicSummary(e.target.value)}
                  placeholder="Short public description shown on the profile."
                  rows={6}
                  style={{ width: "100%", padding: "10px 12px", border: "1px solid #ccc", borderRadius: 10 }}
                />
              </div>

              <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                <button
                  onClick={() => save()}
                  disabled={saving}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    background: saving ? "#eee" : "white",
                    cursor: saving ? "not-allowed" : "pointer",
                    fontWeight: 900,
                  }}
                >
                  {saving ? "Saving…" : "Save changes"}
                </button>

                <button
                  onClick={() => load()}
                  disabled={saving}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid #ccc",
                    background: saving ? "#eee" : "white",
                    cursor: saving ? "not-allowed" : "pointer",
                    fontWeight: 900,
                  }}
                >
                  Reload
                </button>

                {saveMsg ? <div style={{ color: saveMsg.startsWith("Save failed") ? "crimson" : "#2e7d32", fontWeight: 900 }}>{saveMsg}</div> : null}
              </div>

              <div style={{ marginTop: 14, color: "#666" }}>
                <div><b>Type:</b> {row.participantType ?? "—"}</div>
                <div><b>Jurisdiction:</b> {row.jurisdictionLevel ?? "—"}</div>
                <div><b>Created:</b> {row.createdAt ?? "—"}</div>
                <div><b>Updated:</b> {row.updatedAt ?? "—"}</div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}