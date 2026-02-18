// app/admin/layout.tsx
import type { ReactNode } from "react";
import SiteFooter from "../_components/SiteFooter";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px 40px" }}>
        <SiteFooter />
      </div>
    </>
  );
}