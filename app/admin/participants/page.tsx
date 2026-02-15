"use client";

import { useEffect, useMemo, useState } from "react";
import AdminNav from "../_components/AdminNav";

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

type ApiResp = {
  ok: boolean;
  rows: ParticipantRow[];
  total: number;
  page: number;
  pageSize: number;
  filters: { search: string; verificationStatus: string; participantType: string };
  error?: string;
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

export default function AdminParticipantsPage() {
  const [search, setSearch] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("all");
  const [participantType, setParticipantType] = useState("all");

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState<ApiResp | null>(null);

  // Create form (MVP)
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState("company");
  const [newJurisdiction, setNewJurisdiction] = useState("");
  const [newCountry, setNewCountry] = useState("");
  const [newWebsite, setNewWebsite] = useState("");
  const [newDesignation, setNewDesignation] = useState("");
  const [newVerification, setNewVerification] = useState("unverified");

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const query = useMemo(() => {
    const qs = new URLSearchParams();
    qs.set("page", String(page));
    qs.set("pageSize", String(pageSize));
    qs.set("search", search);
    qs.set("verificationStatus", verificationStatus);
    qs.set("participantType", participantType);
    return qs.toString();
  }, [page, pageSize, search, verificationStatus, participantType]);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/participants?${query}`, { cache: "no-store" });
      const json = (await res.json()) as ApiResp;

      if (!res.ok || !json.ok) {
        throw new Error(json.error || `Failed to load participants (${res.status})`);
      }

      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load participants");
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPages]);

  async function createParticipant() {
    setCreating(true);
    setCreateError("");

    try {
      const res = await fetch("/api/admin/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          participantType: newType,
          jurisdictionLevel: newJurisdiction || null,
          name: newName,
          country: newCountry || null,
          website: newWebsite || null,
          designationLevel: newDesignation || null,
          verificationStatus: newVerification || "unverified",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json?.ok) {
        throw new Error(json?.error || `Failed to create participant (${res.status})`);
      }

      // reset minimal fields
      setNewName("");
      setNewJurisdiction("");
      setNewCountry("");
      setNewWebsite("");
      setNewDesignation("");
      setNewVerification("unverified");

      // refresh list and jump to page 1
      setPage(1);
      await load();
    } catch (e: any) {
      setCreateError(e?.message ?? "Failed to create participant");
    } finally {
      setCreating(false);
    }
  }

  const rows = data?.rows ?? [];

  return (
    <div>
      <AdminNav />

      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Participants</h1>

        {/* Create box */}
        <div style={{ marginTop: 14, border: "1px solid #ddd", borderRadius: 10, padding: 14 }}>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Create Participant (MVP)</div>

          {createError ? (
            <div style={{ marginBottom: 10, padding: 10, border: "1px solid crimson", borderRadius: 8 }}>
              <div style={{ color: "crimson", fontWeight: 800 }}>Error</div>
              <div style={{ marginTop: 6 }}>{createError}</div>
            </div>
          ) : null}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Name *</div>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., OpenAI / City of Newark"
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8 }}
              />
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Participant Type *</div>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8 }}
              >
                <option value="company">company</option>
                <option value="government">government</option>
                <option value="ngo">ngo</option>
                <option value="university">university</option>
                <option value="research">research</option>
                <option value="other">other</option>
              </select>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Jurisdiction Level (gov)</div>
              <input
                value={newJurisdiction}
                onChange={(e) => setNewJurisdiction(e.target.value)}
                placeholder="country / state / city / agency"
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8 }}
              />
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Country</div>
              <input
                value={newCountry}
                onChange={(e) => setNewCountry(e.target.value)}
                placeholder="e.g., United States"
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8 }}
              />
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Website</div>
              <input
                value={newWebsite}
                onChange={(e) => setNewWebsite(e.target.value)}
                placeholder="https://..."
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8 }}
              />
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Designation Level</div>
              <select
                value={newDesignation}
                onChange={(e) => setNewDesignation(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8 }}
              >
                {DESIGNATION_PRESETS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>Verification Status</div>
              <select
                value={newVerification}
                onChange={(e) => setNewVerification(e.target.value)}
                style={{ width: "100%", padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8 }}
              >
                <option value="unverified">unverified</option>
                <option value="pending">pending</option>
                <option value="verified">verified</option>
                <option value="suspended">suspended</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <button
              onClick={() => createParticipant()}
              disabled={creating || newName.trim().length === 0}
              style={{
                padding: "10px 14px",
                borderRadius: 10,
                border: "1px solid #ccc",
                background: creating ? "#eee" : "white",
                cursor: creating ? "not-allowed" : "pointer",
                fontWeight: 900,
              }}
            >
              {creating ? "Creating…" : "Create Participant"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search name, country, website, slug, designation…"
            style={{ padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8, minWidth: 320 }}
          />

          <select
            value={verificationStatus}
            onChange={(e) => {
              setPage(1);
              setVerificationStatus(e.target.value);
            }}
            style={{ padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8 }}
          >
            <option value="all">All verification</option>
            <option value="unverified">unverified</option>
            <option value="pending">pending</option>
            <option value="verified">verified</option>
            <option value="suspended">suspended</option>
          </select>

          <select
            value={participantType}
            onChange={(e) => {
              setPage(1);
              setParticipantType(e.target.value);
            }}
            style={{ padding: "8px 10px", border: "1px solid #ccc", borderRadius: 8 }}
          >
            <option value="all">All types</option>
            <option value="company">company</option>
            <option value="government">government</option>
            <option value="ngo">ngo</option>
            <option value="university">university</option>
            <option value="research">research</option>
            <option value="other">other</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setVerificationStatus("all");
              setParticipantType("all");
              setPage(1);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "white",
              cursor: "pointer",
              fontWeight: 800,
            }}
          >
            Clear
          </button>

          <button
            onClick={() => load()}
            disabled={loading}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: loading ? "#eee" : "white",
              cursor: loading ? "not-allowed" : "pointer",
              fontWeight: 800,
            }}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        <div style={{ marginTop: 10, color: "#555" }}>
          Showing {rows.length} of {total} — click a row to edit
        </div>

        {error ? (
          <div style={{ marginTop: 12, padding: 12, border: "1px solid crimson", borderRadius: 8 }}>
            <div style={{ color: "crimson", fontWeight: 800 }}>Error</div>
            <div style={{ marginTop: 6 }}>{error}</div>
          </div>
        ) : null}

        {/* Pager */}
        <div style={{ marginTop: 12 }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: page <= 1 ? "#eee" : "white",
                cursor: page <= 1 ? "not-allowed" : "pointer",
                fontWeight: 800,
              }}
            >
              Prev
            </button>

            <div>
              Page {page} of {totalPages}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #ccc",
                background: page >= totalPages ? "#eee" : "white",
                cursor: page >= totalPages ? "not-allowed" : "pointer",
                fontWeight: 800,
              }}
            >
              Next
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ marginTop: 12, overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                {["Name", "Type", "Verification", "Designation", "Country", "Slug", "Updated"].map((h) => (
                  <th key={h} style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: "10px 8px" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.participantId}
                  onClick={() => (window.location.href = `/admin/participants/${encodeURIComponent(r.participantId)}`)}
                  style={{ cursor: "pointer" }}
                  title="Click to edit"
                >
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "10px 8px" }}>
                    <b style={{ textDecoration: "underline" }}>{r.name ?? "—"}</b>
                  </td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "10px 8px" }}>{r.participantType ?? "—"}</td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "10px 8px" }}>
                    {r.verificationStatus ?? "—"}
                  </td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "10px 8px" }}>
                    {r.designationLevel ?? "—"}
                  </td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "10px 8px" }}>{r.country ?? "—"}</td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "10px 8px" }}>{r.profileSlug ?? "—"}</td>
                  <td style={{ borderBottom: "1px solid #f0f0f0", padding: "10px 8px" }}>
                    {r.updatedAt ? new Date(r.updatedAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}

              {!loading && rows.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "14px 8px", color: "#777" }}>
                    No participants found. Create one above to test.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}