"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function isActive(pathname: string, href: string) {
  if (href === "/admin/applications") {
    return pathname === "/admin/applications" || pathname.startsWith("/admin/applications/");
  }
  if (href === "/admin/participants") {
    return pathname === "/admin/participants" || pathname.startsWith("/admin/participants/");
  }
  return pathname === href;
}

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/applications", label: "Submissions" },
    { href: "/admin/participants", label: "Participants" },
  ];

  return (
    <div
      style={{
        borderBottom: "1px solid #e5e5e5",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontWeight: 900, fontSize: 16 }}>GAFAIG Admin</div>

      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        {links.map((l) => {
          const active = isActive(pathname, l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid #ccc",
                textDecoration: "none",
                fontWeight: 800,
                background: active ? "#eee" : "white",
              }}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}