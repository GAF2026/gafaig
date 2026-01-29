import Link from "next/link";
import registryData from "../data/registry.json";

type RegistryRecord = {
  registryId: string;
  organizationName: string;
  jurisdiction: string;
  certificationStatus: "Certified" | "Suspended" | "Revoked" | "Expired" | "Pending";
  certificationTier: string | null;
  certifiedStandards: string[];
  certifiedScope: string;
  effectiveDate: string | null;
  expirationDate: string | null;
  lastReviewDate: string | null;
  publicNotes: string | null;
  links: {
    organization: string | null;
    certification: string | null;
    standards: string[];
  };
};

function StatusPill({ status }: { status: RegistryRecord["certificationStatus"] }) {
  const bg =
    status === "Certified"
      ? "#dcfce7"
      : status === "Pending"
      ? "#fef9c3"
      : status === "Suspended"
      ? "#fee2e2"
      : status === "Revoked"
      ? "#f3f4f6"
      : "#e5e7eb";

  const fg =
    status === "Certified"
      ? "#166534"
      : status === "Pending"
      ? "#854d0e"
      : status === "Suspended"
      ? "#991b1b"
      : status === "Revoked"
      ? "#111827"
      : "#374151";

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "4px 10px",
        borderRadius: 999,
        background: bg,
        color: fg,
        fontSize: 12,
        fontWeight: 700,
        border: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {status}
    </span>
  );
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return d;
}

export default function RegistryPage() {
  const meta = (registryData as any).meta as {
    version: string;
    lastUpdated: string;
    disclosurePolicy: string;
    notes?: string;
  };

  const records = ((registryData as any).records || []) as RegistryRecord[];

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 12 }}>
        Public Certification Registry
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.7, color: "#374151", marginBottom: 10 }}>
        The GAFAIG Public Certification Registry provides verifiable information about certification
        status, certified scope, and applicable standards.
      </p>

      <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 22 }}>
        Disclosure policy:{" "}
        <Link href={meta.disclosurePolicy} style={{ color: "#111827" }}>
          {meta.disclosurePolicy}
        </Link>{" "}
        • Registry schema: {meta.version} • Last updated: {meta.lastUpdated}
      </p>

      <section
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 16,
          marginBottom: 22,
        }}
      >
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search organization name (MVP: demo)"
            disabled
            style={{
              flex: "1 1 320px",
              padding: "10px 12px",
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              background: "#f9fafb",
            }}
          />
          <div style={{ color: "#6b7280", fontSize: 13 }}>
            Search will activate when the registry database is live.
          </div>
        </div>
        {meta.notes ? (
          <p style={{ marginTop: 10, color: "#6b7280", fontSize: 13, lineHeight: 1.6 }}>
            {meta.notes}
          </p>
        ) : null}
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
          Registry records
        </h2>

        <div style={{ display: "grid", gap: 12 }}>
          {records.map((r) => (
            <div
              key={r.registryId}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 14,
                padding: 16,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  flexWrap: "wrap",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{r.organizationName}</div>
                  <div style={{ color: "#6b7280", fontSize: 12 }}>
                    Registry ID: {r.registryId} • Jurisdiction: {r.jurisdiction}
                  </div>
                </div>
                <StatusPill status={r.certificationStatus} />
              </div>

              <div style={{ color: "#374151", lineHeight: 1.6, marginBottom: 10 }}>
                <strong>Scope:</strong> {r.certifiedScope}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                {r.certifiedStandards.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 999,
                      border: "1px solid #e5e7eb",
                      background: "#f9fafb",
                      color: "#111827",
                      fontWeight: 600,
                    }}
                  >
                    {s}
                  </span>
                ))}
                {r.certificationTier ? (
                  <span
                    style={{
                      fontSize: 12,
                      padding: "4px 10px",
                      borderRadius: 999,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      color: "#111827",
                      fontWeight: 700,
                    }}
                  >
                    Tier: {r.certificationTier}
                  </span>
                ) : null}
              </div>

              <div style={{ display: "flex", gap: 18, flexWrap: "wrap", color: "#6b7280", fontSize: 12 }}>
                <div>
                  <strong>Effective:</strong> {fmtDate(r.effectiveDate)}
                </div>
                <div>
                  <strong>Expires:</strong> {fmtDate(r.expirationDate)}
                </div>
                <div>
                  <strong>Last review:</strong> {fmtDate(r.lastReviewDate)}
                </div>
              </div>

              {r.publicNotes ? (
                <p style={{ marginTop: 10, color: "#374151", lineHeight: 1.6 }}>
                  <strong>Public notes:</strong> {r.publicNotes}
                </p>
              ) : null}

              <div style={{ marginTop: 12, display: "flex", gap: 12, flexWrap: "wrap" }}>
                {r.links.certification ? (
                  <Link href={r.links.certification} style={{ color: "#111827" }}>
                    Certification
                  </Link>
                ) : null}
                {r.links.standards?.map((href) => (
                  <Link key={href} href={href} style={{ color: "#111827" }}>
                    {href}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
