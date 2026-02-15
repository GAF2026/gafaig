import Link from "next/link";
import registry from "../data/registry.json";

type RegistryData = typeof registry;

function fmtDate(s?: string) {
  if (!s) return "—";
  try {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    return d.toLocaleDateString();
  } catch {
    return s || "—";
  }
}

export default function RegistryPage() {
  const data = registry as RegistryData;
  const meta = data.meta;

  const orgById = new Map(data.organizations.map((o) => [o.orgId, o]));
  const systemsByCert = new Map<string, any[]>();
  for (const sys of data.systems) {
    const arr = systemsByCert.get(sys.certId) || [];
    arr.push(sys);
    systemsByCert.set(sys.certId, arr);
  }

  return (
    <main>
      <h1>GAFAIG Public Certification Registry</h1>
      <p>
        This registry lists certification status for organizations that are eligible to display the GAFAIG compliance mark.
        Public disclosure is governed by the registry disclosure thresholds policy.
      </p>

      <div className="callout note" style={{ marginTop: "1.25rem" }}>
        <strong>Registry disclosure policy</strong>
        <p style={{ margin: 0, marginTop: ".5rem" }}>
          <Link href={meta.disclosurePolicy} style={{ color: "#111827" }}>
            {meta.disclosurePolicy}
          </Link>
        </p>
        <p className="meta" style={{ marginTop: ".5rem" }}>
          Schema: {meta.version} • Last updated: {meta.lastUpdated}
        </p>
      </div>

      <section style={{ marginTop: "1.75rem" }}>
        <h2>Listings</h2>

        {data.certifications.length === 0 ? (
          <p className="meta">No public listings yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
            {data.certifications.map((c) => {
              const org = orgById.get(c.orgId);
              const systems = systemsByCert.get(c.certId) || [];

              return (
                <div key={c.certId} className="callout">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                    <div>
                      <h3 style={{ margin: 0 }}>{org?.displayName || "Unknown organization"}</h3>
                      <div className="meta" style={{ marginTop: ".25rem" }}>
                        Tier: <strong>{c.tier}</strong> • Status: <strong>{c.status}</strong> • Mark eligible:{" "}
                        <strong>{String(c.markEligible)}</strong>
                      </div>
                    </div>

                    <div className="meta" style={{ textAlign: "right" }}>
                      Issued: {fmtDate(c.issuedAt)} <br />
                      Expires: {fmtDate(c.expiresAt)} <br />
                      Last reviewed: {fmtDate(c.lastReviewedAt)}
                    </div>
                  </div>

                  {org?.website ? (
                    <p className="meta" style={{ marginTop: ".75rem" }}>
                      Website:{" "}
                      <a href={org.website} target="_blank" rel="noreferrer" style={{ color: "#111827" }}>
                        {org.website}
                      </a>
                    </p>
                  ) : null}

                  <div style={{ marginTop: ".75rem" }}>
                    <strong>Scope</strong>
                    <p style={{ margin: 0, marginTop: ".35rem", lineHeight: 1.7 }}>
                      {c.scope?.summary || "—"}
                    </p>
                    <div className="meta" style={{ marginTop: ".35rem" }}>
                      Surfaces: {(c.scope?.deploymentSurfaces || []).join(", ") || "—"} • Regions:{" "}
                      {(c.scope?.regions || []).join(", ") || "—"}
                    </div>
                  </div>

                  <div style={{ marginTop: "1rem" }}>
                    <strong>Applicable standards</strong>
                    <ul style={{ margin: 0, marginTop: ".5rem" }}>
                      {(c.standards || []).map((s: any) => (
                        <li key={s.code}>
                          <Link href={s.href} style={{ color: "#111827" }}>
                            {s.code}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {systems.length ? (
                    <div style={{ marginTop: "1rem" }}>
                      <strong>Certified systems</strong>
                      <ul style={{ margin: 0, marginTop: ".5rem" }}>
                        {systems.map((sys) => (
                          <li key={sys.systemId}>
                            <span style={{ fontWeight: 800 }}>{sys.systemName}</span>{" "}
                            <span className="meta">({sys.systemType})</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <div style={{ marginTop: "1rem" }}>
                    <strong>Policies</strong>
                    <ul style={{ margin: 0, marginTop: ".5rem" }}>
                      <li>
                        <Link href={c.policyLinks.masterTerms} style={{ color: "#111827" }}>
                          Master Terms
                        </Link>
                      </li>
                      <li>
                        <Link href={c.policyLinks.enforcementBoundary} style={{ color: "#111827" }}>
                          Enforcement Boundary
                        </Link>
                      </li>
                      <li>
                        <Link href={c.policyLinks.revocationSuspension} style={{ color: "#111827" }}>
                          Revocation & Suspension
                        </Link>
                      </li>
                      <li>
                        <Link href={c.policyLinks.appeals} style={{ color: "#111827" }}>
                          Appeals
                        </Link>
                      </li>
                      <li>
                        <Link href={c.policyLinks.registryDisclosureThresholds} style={{ color: "#111827" }}>
                          Registry Disclosure Thresholds
                        </Link>
                      </li>
                    </ul>
                  </div>

                  {c.publicNotes ? (
                    <p className="meta" style={{ marginTop: "1rem" }}>
                      Notes: {c.publicNotes}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
