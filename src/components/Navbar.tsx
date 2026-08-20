"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Container from "@/components/Container";

const LINKS = [
  { href: "/projects", label: "Projects" },
  { href: "/client-work", label: "Client Work" },
  { href: "/blog", label: "Blog" },
  { href: "/videos", label: "Videos" },
  { href: "/cv", label: "CV" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-border">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="text-sm font-medium" onClick={() => setOpen(false)}>
          Daniel Sinensky
        </Link>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="text-sm text-muted sm:hidden"
          aria-expanded={open}
          aria-label="Toggle navigation menu"
        >
          Menu
        </button>

        <ul className="hidden items-center gap-8 sm:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-sm transition-colors hover:text-foreground ${
                  pathname === link.href ? "text-foreground" : "text-muted"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      {open && (
        <div className="border-t border-border sm:hidden">
          <ul className="flex flex-col gap-1 px-6 py-3">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block py-2 text-sm ${
                    pathname === link.href ? "text-foreground" : "text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
