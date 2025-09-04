"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

const links = [
  { href: "/part_1", label: "Part 1" },
  { href: "/part_2", label: "Part 2" },
  { href: "/part_3", label: "Part 3" },
  { href: "/part_4", label: "Part 4" },
  { href: "/part_5", label: "Part 5" },
  { href: "/part_6", label: "Part 6" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();

  const goHome = useCallback(() => router.push("/"), [router]); // programmatic nav example

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid #eee",
        background: "rgba(255,255,255,0.8)",
      }}
    >
      <div style={{ display: "flex", gap: 12, alignItems: "center", padding: 12 }}>
        <button onClick={goHome} style={{ fontWeight: 700 }}>Home</button>
        <nav style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {links.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: "6px 10px",
                  borderRadius: 8,
                  textDecoration: "none",
                  color: active ? "#1d4ed8" : "#374151",
                  background: active ? "#e0e7ff" : "transparent",
                  border: active ? "1px solid #93c5fd" : "1px solid transparent",
                }}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
