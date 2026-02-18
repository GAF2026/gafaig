// app/demo/layout.tsx
import type { ReactNode } from "react";
import SiteFooter from "../_components/SiteFooter";

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}

      {/* Footer (matches public pages) */}
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 1.25rem 3rem" }}>
        <SiteFooter />
      </div>
    </div>
  );
}