// BEGIN UPDATE: app/participants/[slug]/page.tsx
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type ParticipantRow = {
  participantId: string;
  slug: string;
  name: string;
  type?: string | null;
  country?: string | null;
  website?: string | null;
  designation?: string | null;
  status?: string | null;
  standardCode?: string | null;
  standardVersion?: string | null;
  description?: string | null;
};

type ApiGet =
  | { ok: true; row: ParticipantRow | null }
  | { ok: false; error: string };

function Chip({ label }: { label: string }) {
  return (
    <>
      <span className="chip">{label}</span>
      <style jsx>{`
        .chip {
          display: inline-flex;
          align-items: center;
          height: 34px;
          padding: 0 12px;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          font-weight: 800;
          background: #fff;
          white-space: nowrap;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}

function VerifiedBadge() {
  return (
    <>
      <div className="badge" aria-label="GAFAIG Verified">
        <span className="dot" />
        <span className="text">GAFAIG Verified</span>
      </div>

      <style jsx>{`
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 14px;
          border-radius: 999px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: #fff;
          font-weight: 900;
          font-size: 16px;
          line-height: 1;
          width: fit-content;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: #16a34a;
          display: inline-block;
          flex: 0 0 auto;
        }
        .text {
          white-space: nowrap;
        }
      `}</style>
    </>
  );
}

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <>
      <div className="k">{k}</div>
      <div className="v">{v}</div>

      <style jsx>{`
        .k {
          color: #374151;
          font-weight: 900;
          font-size: 14px;
        }
        .v {
          color: #111827;
          font-size: 14px;
        }
      `}</style>
    </>
  );
}

function normalizeStatus(status?: string | null) {
  const s = String(status || "").trim().toLowerCase();
  if (!s) return "verified";
  return s;
}

export default function ParticipantProfilePage({ params }: { params: { slug: string } }) {
  const slug = params?.slug || "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [row, setRow] = useState<ParticipantRow | null>(null);

  const backHref = useMemo(() => "/participants", []);

  async function load() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/participants/${encodeURIComponent(slug)}`, { cache: "no-store" });
      const data = (await res.json()) as ApiGet;

      if (!res.ok || !data.ok) throw new Error((data as any)?.error || `Failed to load (${res.status})`);

      setRow(data.row);
    } catch (e: any) {
      setRow(null);
      setError(e?.message || "Failed to load participant.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  if (loading && !row) {
    return (
      <main className="wrap">
        <div className="loading">Loading…</div>
        <style jsx>{`
          .wrap {
            max-width: 1100px;
            margin: 0 auto;
            padding: 36px 24px;
          }
          .loading {
            font-size: 16px;
            font-weight: 800;
            color: #111827;
          }
        `}</style>
      </main>
    );
  }

  if (!row) {
    return (
      <main className="wrap">
        <h1 className="nfTitle">Participant not found</h1>
        <p className="nfBody">We couldn’t find a public registry profile for {slug}.</p>
        <Link className="link" href="/participants">
          ← Back to participants
        </Link>

        <style jsx>{`
          .wrap {
            max-width: 1100px;
            margin: 0 auto;
            padding: 36px 24px;
          }
          .nfTitle {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 900;
          }
          .nfBody {
            margin: 0 0 14px 0;
            color: #374151;
            font-size: 16px;
          }
          .link {
            font-weight: 900;
          }
        `}</style>
      </main>
    );
  }

  const status = normalizeStatus(row.status);
  const designation = row.designation || "Governance Partner";
  const ptype = row.type || "company";
  const standard =
    row.standardCode && row.standardVersion ? `${row.standardCode} ${row.standardVersion}` : "—";
  const country = row.country || "United States";
  const website = row.website || "—";
  const description = row.description || "Local business supporting transparent AI governance.";

  const showVerified = status === "verified" || status === "approved";

  return (
    <main className="wrap">
      <header className="top">
        <div className="left">
          <div className="eyebrow">GAFAIG REGISTRY PROFILE</div>

          <h1 className="title">{row.name}</h1>

          <div className="chips">
            <Chip label={`Status: ${showVerified ? "Verified" : status}`} />
            <Chip label={`Designation: ${designation}`} />
            <Chip label={`Type: ${ptype}`} />
          </div>

          <p className="lead">{description}</p>
        </div>

        <div className="right">
          <Link className="btn" href={backHref}>
            ← Back
          </Link>
          {showVerified ? <VerifiedBadge /> : null}
        </div>
      </header>

      {error ? <div className="error">Error: {error}</div> : null}

      <div className="grid">
        <section className="card">
          <h2 className="h2">Registry details</h2>

          <div className="kv">
            <KV k="Country" v={country} />
            <KV k="Profile slug" v={<span className="mono">{row.slug || "—"}</span>} />
            <KV
              k="Participant ID"
              v={<span className="mono break">{row.participantId || "—"}</span>}
            />
            <KV
              k="Website"
              v={
                website === "—" ? (
                  "—"
                ) : (
                  <a className="link" href={website} target="_blank" rel="noreferrer">
                    {website}
                  </a>
                )
              }
            />
          </div>
        </section>

        <section className="card">
          <h2 className="h2">Verification snapshot</h2>

          <p className="body">
            This profile is sourced from GAFAIG’s Snowflake-backed registry. Verification status reflects the
            most recent recorded decision in GAFAIG’s verification workflow.
          </p>

          <div className="kv">
            <KV k="Status" v={showVerified ? "Verified" : status} />
            <KV k="Designation" v={designation} />
            <KV k="Standard" v={standard} />
          </div>
        </section>
      </div>

      <div className="footer">Data source: Snowflake</div>

      <style jsx>{`
        .wrap {
          max-width: 1100px;
          margin: 0 auto;
          padding: 36px 24px;
        }

        .top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          flex-wrap: wrap;
          gap: 20px;
        }

        .eyebrow {
          letter-spacing: 0.22em;
          font-size: 12px;
          color: #374151;
          font-weight: 900;
        }

        .title {
          margin: 10px 0 0 0;
          font-size: 44px; /* polished: smaller than the “giant” version */
          line-height: 1.05;
          font-weight: 900;
        }

        .chips {
          margin-top: 12px;
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .lead {
          margin-top: 10px;
          font-size: 16px;
          color: #111827;
        }

        .right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }

        .btn {
          height: 40px;
          padding: 0 14px;
          border-radius: 12px;
          border: 1px solid rgba(0, 0, 0, 0.18);
          background: #fff;
          font-weight: 900;
          text-decoration: none;
          color: #111827;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .error {
          margin-top: 14px;
          color: #b91c1c;
          font-weight: 900;
        }

        .grid {
          margin-top: 26px;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .card {
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 16px;
          padding: 16px;
          background: #fff;
        }

        .h2 {
          margin: 0;
          font-size: 22px;
          font-weight: 900;
        }

        .body {
          margin: 10px 0 0 0;
          font-size: 15px;
          color: #374151;
          line-height: 1.55;
        }

        .kv {
          margin-top: 14px;
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 10px 14px;
          align-items: baseline;
        }

        .mono {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New",
            monospace;
        }

        .break {
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .link {
          color: #111827;
          font-weight: 900;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .footer {
          margin-top: 22px;
          font-size: 14px;
          color: #6b7280;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
          .right {
            width: 100%;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }
      `}</style>
    </main>
  );
}
// END UPDATE: app/participants/[slug]/page.tsx