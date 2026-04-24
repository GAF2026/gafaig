// app/_components/SiteFooter.tsx
import * as React from "react";

export default function SiteFooter() {
  return (
    <div
      style={{
        borderTop: "1px solid rgba(0,0,0,0.1)",
        marginTop: "2.25rem",
        paddingTop: "1.5rem",
        fontSize: 12,
        opacity: 0.7,
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        flexWrap: "wrap",
      }}
    >
      <span>Release: dev</span>
      <span>
        Governance verification engine executed on Snowflake (deterministic
        scoring, registry snapshots, and public verification views)
      </span>
    </div>
  );
}