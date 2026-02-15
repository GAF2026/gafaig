"use client";

import { useEffect, useMemo, useState } from "react";

function Pill({ children }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        border: "1px solid rgba(0,0,0,0.14)",
        borderRadius: 999,
        fontWeight: 900,
        fontSize: 12,
        color: "#111827",
        background: "#fff",
        lineHeight: 1,
        whiteSpace: "nowrap",
        gap: 8,
      }}
    >
      {children}
    </span>
  );
}

function VerifiedBadge() {
  return (
    <span className="gafaigVerifiedBadge">
      <span className="dot" aria-hidden="true" />
      <span className="txt">GAFAIG Verified</span>

      <style jsx>{`
        .gafaigVerifiedBadge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .gafaigVerifiedBadge .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #16a34a;
          display: inline-block;
          flex: 0 0 auto;
        }

        .gafaigVerifiedBadge .txt {
          font-weight: 900;
        }

        /* KEY FIX: if anything (old code, CSS, extension) injects an <img>, hide it */
        .gafaigVerifiedBadge img {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }

        /* Defensive: if any pseudo-element was used to render an icon, neutralize it */
        .gafaigVerifiedBadge::before,
        .gafaigVerifiedBadge::after {
          content: "" !important;
          background: none !important;
        }
      `}</style>
    </span>
  );
}

function Button({ children, onClick, disabled, variant }) {
  const primary = variant === "primary";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        height: 44,
        padding: "0 14px",
        borderRadius: 12,
        border: primary ? "1px solid #000" : "1px solid rgba(0,0,0,0.18)",
        background: primary ? "#000" : "#fff",
        color: primary ? "#fff" : "#111827",
        cursor: disabled ? "not-allowed" : "pointer",
        fontWeight: 900,
        fontSize: 14,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function MiniButton({ children, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        height: 30,
        padding: "0 10px",
        borderRadius: 10,
        border: "1px solid rgba(0,0,0,0.16)",
        background: "#fff",
        fontWeight: 900,
        fontSize: 12,
        cursor: "pointer",
        color: "#111827",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </button>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        height: 44,
        padding: "0 12px",
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.18)",
        background: "#fff",
        fontWeight: 800,
        fontSize: 14,
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function Input({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        height: 44,
        padding: "0 12px",
        borderRadius: 12,
        border: "1px solid rgba(0,0,0,0.18)",
        background: "#fff",
        fontWeight: 800,
        fontSize: 14,
      }}
    />
  );
}

function Card({ children }) {
  return (
    <div
      style={{
        border: "1px solid rgba(0,0,0,0.12)",
        borderRadius: 18,
        padding: 18,
        background: "#fff",
      }}
    >
      {children}
    </div>
  );
}

export default function ParticipantsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [participantType, setParticipantType] = useState("all");
  const [verification, setVerification] = useState("verified");
  const [country, setCountry] = useState("all");

  const [applied, setApplied] = useState({
    search: "",
    participantType: "all",
    verification: "verified",
    country: "all",
  });

  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [copiedSlug, setCopiedSlug] = useState(null);

  async function load(nextApplied) {
    const f = nextApplied ?? applied;
    setLoading(true);
    setError("");

    try {
      const qs = new URLSearchParams();
      qs.set("page", "1");
      qs.set("pageSize", "50");

      if (f.search?.trim()) qs.set("search", f.search.trim());
      if (f.participantType && f.participantType !== "all") qs.set("participantType", f.participantType);
      if (f.verification && f.verification !== "all") qs.set("verification", f.verification);
      if (f.country && f.country !== "all") qs.set("country", f.country);

      const res = await fetch(`/api/participants?${qs.toString()}`, { cache: "no-store" });
      const json = await res.json();

      if (!res.ok || !json.ok) throw new Error(json.error || `Failed to load participants (${res.status})`);

      setRows(Array.isArray(json.rows) ? json.rows : []);
      setTotal(typeof json.total === "number" ? json.total : (Array.isArray(json.rows) ? json.rows.length : 0));
    } catch (e) {
      setError(e?.message ?? "Failed to load participants");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const countries = useMemo(() => {
    const set = new Set();
    rows.forEach((r) => {
      if (r?.country) set.add(String(r.country));
    });
    const list = Array.from(set).sort((a, b) => a.localeCompare(b));
    return ["all", ...list];
  }, [rows]);

  const showingText = useMemo(() => `Showing ${rows.length} of ${total}`, [rows.length, total]);

  const typeOptions = [
    { value: "all", label: "All types" },
    { value: "company", label: "Company" },
    { value: "university", label: "University" },
    { value: "governing_body", label: "Governing body" },
    { value: "jurisdiction", label: "Jurisdiction" },
  ];

  const verificationOptions = [
    { value: "verified", label: "Verified" },
    { value: "all", label: "All" },
    { value: "unverified", label: "Unverified" },
  ];

  function applyNow(next) {
    const nextApplied = {
      search,
      participantType,
      verification,
      country,
      ...(next || {}),
    };
    setApplied(nextApplied);
    load(nextApplied);
  }

  function clearNow() {
    setSearch("");
    setParticipantType("all");
    setVerification("verified");
    setCountry("all");
    const nextApplied = { search: "", participantType: "all", verification: "verified", country: "all" };
    setApplied(nextApplied);
    load(nextApplied);
  }

  async function copyProfileUrl(slug) {
    try {
      const url = `${window.location.origin}/participants/${slug}`;
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      window.setTimeout(() => setCopiedSlug((s) => (s === slug ? null : s)), 1400);
    } catch {
      const url = `${window.location.origin}/participants/${slug}`;
      window.prompt("Copy this URL:", url);
    }
  }

  return (
    <main style={{ padding: "48px 24px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ fontSize: 12, fontWeight: 900, color: "#6b7280", letterSpacing: 2 }}>
        GAFAIG REGISTRY
      </div>

      <h1 style={{ margin: "10px 0 8px 0", fontSize: 44, lineHeight: 1.05, fontWeight: 900 }}>
        Participants
      </h1>

      <p style={{ margin: 0, fontSize: 18, lineHeight: 1.7, color: "#374151", maxWidth: 980 }}>
        Verified organizations, companies, and jurisdictions participating in GAFAIG with a clear designation level and
        public profile.
      </p>

      <div style={{ marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontSize: 14, color: "#6b7280" }}>Data source: Snowflake</div>

        <a
          href="/standards"
          style={{
            height: 44,
            padding: "0 14px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.18)",
            background: "#fff",
            color: "#111827",
            textDecoration: "none",
            fontWeight: 900,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            whiteSpace: "nowrap",
          }}
        >
          Standards
        </a>
      </div>

      {error ? (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #ef4444", borderRadius: 12 }}>
          <div style={{ color: "#ef4444", fontWeight: 900 }}>Error</div>
          <div style={{ marginTop: 6 }}>{error}</div>
        </div>
      ) : null}

      <div style={{ marginTop: 18 }}>
        <Card>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              gap: 16,
              alignItems: "end",
            }}
          >
            <div>
              <div style={{ fontWeight: 900, marginBottom: 8, fontSize: 14, color: "#111827" }}>Search</div>
              <Input value={search} onChange={setSearch} placeholder="Search name, country, type…" />
            </div>

            <div>
              <div style={{ fontWeight: 900, marginBottom: 8, fontSize: 14, color: "#111827" }}>Type</div>
              <Select value={participantType} onChange={setParticipantType} options={typeOptions} />
            </div>

            <div>
              <div style={{ fontWeight: 900, marginBottom: 8, fontSize: 14, color: "#111827" }}>Verification</div>
              <Select value={verification} onChange={setVerification} options={verificationOptions} />
            </div>

            <div>
              <div style={{ fontWeight: 900, marginBottom: 8, fontSize: 14, color: "#111827" }}>Country</div>
              <Select
                value={country}
                onChange={setCountry}
                options={countries.map((c) => ({ value: c, label: c === "all" ? "All countries" : c }))}
              />
            </div>
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <Button variant="primary" onClick={() => applyNow()} disabled={loading}>
              {loading ? "Loading…" : "Apply"}
            </Button>

            <Button onClick={() => clearNow()} disabled={loading} variant="ghost">
              Clear
            </Button>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "#6b7280", fontWeight: 800, fontSize: 13 }}>Quick:</span>
              <button
                onClick={() => {
                  setVerification("verified");
                  applyNow({ verification: "verified" });
                }}
                style={{
                  height: 32,
                  padding: "0 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,0.18)",
                  background: "#fff",
                  fontWeight: 900,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Verified
              </button>
              <button
                onClick={() => {
                  setVerification("all");
                  applyNow({ verification: "all" });
                }}
                style={{
                  height: 32,
                  padding: "0 10px",
                  borderRadius: 999,
                  border: "1px solid rgba(0,0,0,0.18)",
                  background: "#fff",
                  fontWeight: 900,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                Show all
              </button>
            </div>

            <div style={{ marginLeft: "auto", color: "#6b7280", fontWeight: 900, fontSize: 14 }}>{showingText}</div>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 18 }}>
        <Card>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 920 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.08)" }}>
                  <th style={{ textAlign: "left", padding: "14px 12px", fontWeight: 900, fontSize: 14, color: "#111827" }}>
                    Name
                  </th>
                  <th style={{ textAlign: "left", padding: "14px 12px", fontWeight: 900, fontSize: 14, color: "#111827" }}>
                    Type
                  </th>
                  <th style={{ textAlign: "left", padding: "14px 12px", fontWeight: 900, fontSize: 14, color: "#111827" }}>
                    Country
                  </th>
                  <th style={{ textAlign: "left", padding: "14px 12px", fontWeight: 900, fontSize: 14, color: "#111827" }}>
                    Designation
                  </th>
                  <th style={{ textAlign: "left", padding: "14px 12px", fontWeight: 900, fontSize: 14, color: "#111827" }}>
                    Status
                  </th>
                  <th style={{ textAlign: "left", padding: "14px 12px", fontWeight: 900, fontSize: 14, color: "#111827" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: 16, color: "#6b7280", fontSize: 14 }}>
                      {loading ? "Loading…" : "No participants match these filters."}
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => {
                    const slug = String(r.profileSlug || "");
                    const status = String(r.status || "");
                    const isVerified = status.toLowerCase() === "verified";

                    return (
                      <tr key={slug} style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                        <td style={{ padding: "14px 12px", fontSize: 14 }}>
                          <a
                            href={`/participants/${slug}`}
                            style={{ fontWeight: 900, color: "#111827", textDecoration: "underline" }}
                          >
                            {r.name || slug}
                          </a>
                        </td>

                        <td style={{ padding: "14px 12px", fontSize: 14, color: "#111827" }}>
                          {r.participantType || "—"}
                        </td>

                        <td style={{ padding: "14px 12px", fontSize: 14, color: "#111827" }}>
                          {r.country || "—"}
                        </td>

                        <td style={{ padding: "14px 12px", fontSize: 14, color: "#111827" }}>
                          {r.designation || "—"}
                        </td>

                        <td style={{ padding: "14px 12px" }}>
                          <Pill>{isVerified ? <VerifiedBadge /> : (status || "—")}</Pill>
                        </td>

                        <td style={{ padding: "14px 12px" }}>
                          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                            <MiniButton onClick={() => copyProfileUrl(slug)} title="Copy the public profile URL">
                              {copiedSlug === slug ? "Copied" : "Copy URL"}
                            </MiniButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </main>
  );
}