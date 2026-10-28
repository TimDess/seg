"use client";
import Link from "next/link";
import Logo from "@/components/logo";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { nav } from "@/lib/content";
export default function Header() {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const pathname = usePathname();
  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);
  return (
    <header className="site-header">
      <Link
        href="/"
        className="brand"
        aria-label="SEG — accueil"
        onClick={() => setOpen(false)}
      >
        <Logo />
        <span className="brand-description">
          SADEQ ÉLECTRICITÉ
          <br />
          GÉNÉRALE
        </span>
      </Link>
      <nav
        className={open ? "navigation open" : "navigation"}
        aria-label="Navigation principale"
        id="navigation-principale"
      >
        <div className="nav-links">
          {nav.map((n) => (
            <Link
              aria-current={pathname === n.href ? "page" : undefined}
              onClick={() => setOpen(false)}
              key={n.href}
              href={n.href}
            >
              {n.label}
            </Link>
          ))}
        </div>
        <Link
          className="nav-contact"
          href="/contact"
          onClick={() => setOpen(false)}
        >
          Parlons de votre projet <ArrowUpRight size={17} />
        </Link>
      </nav>
      <button
        disabled={!ready}
        className="menu-toggle"
        aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
        aria-expanded={open}
        aria-controls="navigation-principale"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </header>
  );
}
