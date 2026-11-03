"use client";

import { useEffect, useState } from "react";
import { Check, Copy, RefreshCw, Sunrise } from "lucide-react";
import { allVerses } from "@/data/content";
import { useClipboard } from "@/lib/hooks";

/** Same verse all day for everyone, a new one each day: day number since epoch, local time. */
function indexForToday(): number {
  const now = new Date();
  const days = Math.floor((now.getTime() - now.getTimezoneOffset() * 60_000) / 86_400_000);
  return days % allVerses.length;
}

export function DailyVerse() {
  const [index, setIndex] = useState<number | null>(null);
  const [dateLabel, setDateLabel] = useState("");
  const { copied, copy } = useClipboard();

  useEffect(() => {
    setIndex(indexForToday());
    setDateLabel(
      new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    );
  }, []);

  const verse = allVerses[index ?? 0];

  return (
    <section className="daily" id="today" aria-labelledby="daily-title">
      <div className="container">
        <div className="daily-card">
          <header className="daily-head">
            <Sunrise size={20} strokeWidth={1.5} aria-hidden />
            <h2 id="daily-title">Verse for today</h2>
            <span className="daily-date">{dateLabel || " "}</span>
          </header>

          <div className={`daily-body${index === null ? " is-loading" : ""}`} aria-live="polite">
            <p className="daily-text">“{verse.text}”</p>
            <p className="daily-ref">
              {verse.ref}
              <span className="sep">·</span>
              <a href={`#${verse.from.id}`}>{verse.from.title}</a>
            </p>
          </div>

          <div className="daily-actions">
            <button
              type="button"
              className="btn"
              onClick={() => copy("daily", `“${verse.text}” — ${verse.ref}`)}
            >
              {copied === "daily" ? <Check size={16} aria-hidden /> : <Copy size={16} aria-hidden />}
              {copied === "daily" ? "Copied" : "Copy"}
            </button>
            <button
              type="button"
              className="btn btn-quiet"
              onClick={() => setIndex((i) => ((i ?? 0) + 1) % allVerses.length)}
            >
              <RefreshCw size={16} aria-hidden />
              Another
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
