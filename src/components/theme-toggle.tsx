"use client";

import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";
const storageKey = "seg-theme";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);
  const explicit = useRef(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const apply = (next: Theme) => {
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    const sync = () => {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(storageKey);
      } catch {
        /* Storage can be unavailable in private browsers. */
      }
      explicit.current = saved === "light" || saved === "dark";
      apply(
        saved === "light" || saved === "dark"
          ? saved
          : media.matches
            ? "dark"
            : "light",
      );
    };
    const onSystem = () => {
      if (!explicit.current) apply(media.matches ? "dark" : "light");
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) sync();
    };
    sync();
    media.addEventListener("change", onSystem);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onSystem);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  const label =
    theme === null
      ? "Changer le thème"
      : theme === "dark"
        ? "Activer le thème clair"
        : "Activer le thème sombre";
  return (
    <button
      type="button"
      className="theme-toggle"
      disabled={theme === null}
      aria-label={label}
      title={label}
      aria-pressed={theme === "dark"}
      onClick={() => {
        const next = theme === "dark" ? "light" : "dark";
        explicit.current = true;
        document.documentElement.dataset.theme = next;
        setTheme(next);
        try {
          localStorage.setItem(storageKey, next);
        } catch {
          /* The current session still works without persistent storage. */
        }
      }}
    >
      {theme === "dark" ? (
        <Sun size={19} aria-hidden="true" />
      ) : (
        <Moon size={19} aria-hidden="true" />
      )}
    </button>
  );
}
