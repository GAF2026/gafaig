import Link from "next/link";

type RegistryRecord = {
  orgName: string;
  status: "Certified" | "Suspended" | "Revoked" | "Expired" | "Pending";
  scope: string;
  standards: string[];
  effectiveDate: string;
  lastUpdated: string;
};

const sampleRecords: RegistryRecord[] = [
  {
    orgName: "Example Organization (Demo)",
    status: "Pending",
    scope: "AI governance program review (demo record)",
    standards: ["GAFAIG-S-001", "GAFAIG-S-002"],
    effectiveDate: "—",
    lastUpdated: "—",
  },
];

function StatusPill({ status }: { status: RegistryRecord["status"] }) {
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

export default function RegistryPage() {
  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px" }}>
      <h1 style={{ fontSize: "2.25rem", fontWeight: 700, marginBottom: 12 }}>
        Public Certification Registry
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.7, color: "#374151", marginBottom: 22 }}>
        The GAFAIG Public Certification Registry provides verifiable information about certification
        status, certified scope, and applicable standards. Registry entries are governed by GAFAIG’s{" "}
        <Link href="/policy/registry-disclosure-thresholds">Public Registry Disclosure Thresholds</Link>.
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
      </section>

      <section style={{ marginBottom: 26 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          What you can verify here
        </h2>
        <ul style={{ lineHeight: 1.8, color: "#374151", paddingLeft: 20 }}>
          <li>Current certification status and effective dates</li>
          <li>Certified scope (what is covered—and what is not)</li>
          <li>Applicable GAFAIG standards (e.g., S-001, S-002)</li>
          <li>Status changes consistent with published policies</li>
        </ul>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10 }}>
          Registry records (MVP preview)
        </h2>

        <div style={{ display: "grid", gap: 12 }}>
          {sampleRecords.map((r) => (
            <div
              key={r.orgName}
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
                <div style={{ fontWeight: 800, fontSize: 16 }}>{r.orgName}</div>
                <StatusPill status={r.status} />
              </div>

              <div style={{ color: "#374151", lineHeight: 1.6, marginBottom: 10 }}>
                <strong>Scope:</strong> {r.scope}
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                {r.standards.map((s) => (
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
              </div>

              <div style={{ color: "#6b7280", fontSize: 12 }}>
                <span style={{ marginRight: 14 }}>
                  <strong>Effective:</strong> {r.effectiveDate}
                </span>
                <span>
                  <strong>Last updated:</strong> {r.lastUpdated}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p style={{ color: "#6b7280", fontSize: 13, marginTop: 10 }}>
          Demo entries are placeholders. Public listings will appear as certification begins.
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
          Misuse prevention
        </h2>
        <p style={{ lineHeight: 1.7, color: "#374151" }}>
          Organizations may not represent GAFAIG certification outside their approved scope.
          Misuse of certification claims or the GAFAIG compliance mark may result in status actions
          under published procedures and program terms.
        </p>
      </section>
    </main>
  );
}
