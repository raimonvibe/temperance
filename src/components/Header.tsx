"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Cross, Moon, Sun } from "lucide-react";

function setTheme(next: "light" | "dark") {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* storage blocked: theme still applies for this visit */
  }
}

export function toggleTheme() {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
}

export function Header() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
        setShowTop(window.scrollY > 700);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // "t" flips the theme, unless the reader is typing somewhere.
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key.toLowerCase() !== "t" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (el.closest("input, textarea, [contenteditable='true']")) return;
      toggleTheme();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a href="#top" className="brand" aria-label="Temperance, back to top">
            <span className="crest" aria-hidden>
              <Cross size={18} strokeWidth={1.6} />
            </span>
            <span className="brand-name">Temperance</span>
          </a>
          <nav className="header-nav" aria-label="Sections">
            <a href="#today">Today</a>
            <a href="#contents">Contents</a>
          </nav>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Switch between light and dark mode"
            title="Light / dark (T)"
          >
            <Sun className="icon-sun" size={18} strokeWidth={1.7} aria-hidden />
            <Moon className="icon-moon" size={18} strokeWidth={1.7} aria-hidden />
          </button>
        </div>
        <div className="read-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden />
      </header>
      <button
        type="button"
        className={`to-top${showTop ? " is-visible" : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        tabIndex={showTop ? 0 : -1}
      >
        <ArrowUp size={18} strokeWidth={1.8} aria-hidden />
      </button>
    </>
  );
}
