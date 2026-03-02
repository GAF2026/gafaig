"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminNav from "../../_components/AdminNav";

type Row = {
  requestId: string;
  submissionType: string;
  orgName: string;
  contactEmail: string;
  status: string;
  requestedTier?: string | null;
  renewalPeriod?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

const STATUSES = ["received", "in_review", "approved", "rejected"] as const;

export default function AdminApplicationDetailPage() {
  const params = useParams();
  const id = String((params as any)?.id ?? "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [row, setRow] = useState<Row | null>(null);

  const [copied, setCopied] = useState(false);

  async function copyRequestId(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      try {
        const ta = document.createElement("textarea");
        ta.value = id;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      } catch {
        // ignore
      }
    }
  }

  async function load() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/applications/${encodeURIComponent(id)}`, {
        cache: "no-store",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Failed to load application (${res.status})`);
      }

      setRow(data.row as Row);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load application");
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

  async function setStatus(nextStatus: (typeof STATUSES)[number]) {
    if (!row) return;
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/admin/applications/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ requestId: row.requestId, status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || `Failed to update status (${res.status})`);
      }

      await load();
    } catch (e: any) {
      setError(e?.message ?? "Failed to update status");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div>
        <AdminNav />
        <div style={{ padding: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Application</h1>
          <p style={{ marginTop: 12 }}>Loading…</p>
        </div>
      </div>
    );
  }

  if (error && !row) {
    return (
      <div>
        <AdminNav />
        <div style={{ padding: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Application</h1>
          <p style={{ marginTop: 12, color: "crimson" }}>Failed to load application: {error}</p>
        </div>
      </div>
    );
  }

  if (!row) {
    return (
      <div>
        <AdminNav />
        <div style={{ padding: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800 }}>Application</h1>
          <p style={{ marginTop: 12 }}>Not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminNav />

      <div style={{ padding: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800 }}>Application</h1>

        {error ? (
          <div style={{ marginTop: 12, padding: 12, border: "1px solid crimson", borderRadius: 8 }}>
            <div style={{ color: "crimson", fontWeight: 700 }}>Error</div>
            <div style={{ marginTop: 6 }}>{error}</div>
          </div>
        ) : null}

        <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => copyRequestId(row.requestId)}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #ccc",
              background: "white",
              cursor: "pointer",
              fontWeight: 800,
            }}
            title="Copy Request ID"
          >
            {copied ? "Copied" : "Copy Request ID"}
          </button>

          <span style={{ color: "#555" }}>
            <b>{row.requestId}</b>
          </span>
        </div>

        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 800, marginBottom: 8 }}>Set Status</div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {STATUSES.map((s) => {
              const isCurrent = row.status === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  disabled={saving || isCurrent}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    background: isCurrent ? "#eee" : "white",
                    cursor: saving || isCurrent ? "not-allowed" : "pointer",
                    fontWeight: 700,
                  }}
                  title={isCurrent ? "Current status" : `Set status to ${s}`}
                >
                  {saving ? "Working…" : s}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 8, color: "#555" }}>
            Current: <b>{row.status}</b>
          </div>
        </div>

        <div style={{ marginTop: 16, padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", rowGap: 10, columnGap: 12 }}>
            <div style={{ fontWeight: 700 }}>Request ID</div>
            <div>{row.requestId}</div>

            <div style={{ fontWeight: 700 }}>Type</div>
            <div>{row.submissionType}</div>

            <div style={{ fontWeight: 700 }}>Status</div>
            <div>{row.status}</div>

            <div style={{ fontWeight: 700 }}>Organization</div>
            <div>{row.orgName}</div>

            <div style={{ fontWeight: 700 }}>Email</div>
            <div>{row.contactEmail}</div>

            <div style={{ fontWeight: 700 }}>Requested Tier</div>
            <div>{row.requestedTier ?? "—"}</div>

            <div style={{ fontWeight: 700 }}>Renewal Period</div>
            <div>{row.renewalPeriod ?? "—"}</div>

            <div style={{ fontWeight: 700 }}>Created</div>
            <div>{row.createdAt ?? "—"}</div>

            <div style={{ fontWeight: 700 }}>Updated</div>
            <div>{row.updatedAt ?? "—"}</div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <a href="/admin/applications" style={{ textDecoration: "underline" }}>
            ← Back to applications
          </a>
        </div>
      </div>
    </div>
  );
}