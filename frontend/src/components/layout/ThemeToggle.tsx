"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const saved = window.localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;

  const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches;
  return prefersLight ? "light" : "dark";
}

function BulbIcon() {
  return (
    <svg viewBox="0 0 24 24" className="themeFabSvg" aria-hidden="true">
      <path
        fill="currentColor"
        d="M9 21a1 1 0 0 1-1-1v-1h8v1a1 1 0 0 1-1 1H9Zm3-20a7 7 0 0 1 4.2 12.6c-.6.45-1.2 1.35-1.2 2.4V17H9v-1c0-1.05-.6-1.95-1.2-2.4A7 7 0 0 1 12 1Zm0 2a5 5 0 0 0-3 9.02c.92.69 1.55 1.85 1.82 2.98h2.36c.27-1.13.9-2.29 1.82-2.98A5 5 0 0 0 12 3Z"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" className="themeFabSvg" aria-hidden="true">
      <path
        fill="currentColor"
        d="M21 14.5A7.5 7.5 0 0 1 9.5 3a.75.75 0 0 1 .95.95A6 6 0 1 0 20.05 13.55a.75.75 0 0 1 .95.95Z"
      />
    </svg>
  );
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const initial = getInitialTheme();
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
    document.documentElement.style.colorScheme = initial; // helps native inputs
  }, []);

  function toggleTheme() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    document.documentElement.style.colorScheme = next;
    window.localStorage.setItem("theme", next);
  }

  // Dark -> show bulb, Light -> show moon (as you asked)
  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button type="button" className="themeFab" onClick={toggleTheme} aria-label={label} title={label}>
      {theme === "dark" ? <BulbIcon /> : <MoonIcon />}
    </button>
  );
}
