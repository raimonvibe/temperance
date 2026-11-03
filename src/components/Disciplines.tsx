"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { Check, Circle, CircleCheck, Copy, Flame, Link2, Search, X } from "lucide-react";
import { disciplines, type Discipline } from "@/data/content";
import { useClipboard, usePracticeLog } from "@/lib/hooks";

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Lower-case, and treat curly quotes and dashes like their plain forms. */
const fold = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’‘]/g, "'")
    .replace(/[–—]/g, "-");

function haystack(d: Discipline) {
  return fold([d.numeral, d.title, ...d.notes, ...d.verses.flatMap((v) => [v.ref, v.text])].join(" "));
}

function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (!terms.length) return <>{text}</>;
  // Match on the folded text, then slice the original so curly quotes stay intact.
  const re = new RegExp(`(${terms.map(escapeRe).join("|")})`, "gi");
  const folded = fold(text);
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of folded.matchAll(re)) {
    const start = m.index ?? 0;
    if (start > last) out.push(<Fragment key={last}>{text.slice(last, start)}</Fragment>);
    out.push(<mark key={`m${start}`}>{text.slice(start, start + m[0].length)}</mark>);
    last = start + m[0].length;
  }
  if (last < text.length) out.push(<Fragment key={last}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}

export function Disciplines() {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(disciplines[0].id);
  const searchRef = useRef<HTMLInputElement>(null);
  const { copied, copy } = useClipboard();
  const { ready, marked, toggle, clearToday, streak } = usePracticeLog();

  const terms = useMemo(
    () =>
      fold(query)
        .split(/\s+/)
        .filter((t) => t.length > 0),
    [query],
  );
  const index = useMemo(() => disciplines.map((d) => ({ d, text: haystack(d) })), []);
  const visible = useMemo(
    () => index.filter(({ text }) => terms.every((t) => text.includes(t))).map(({ d }) => d),
    [index, terms],
  );
  const visibleIds = new Set(visible.map((d) => d.id));

  // "/" jumps to search from anywhere on the page.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.key !== "/" || el.closest("input, textarea, [contenteditable='true']")) return;
      e.preventDefault();
      searchRef.current?.focus();
      searchRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Light up the contents entry for the section being read.
  useEffect(() => {
    const els = visible.map((d) => document.getElementById(d.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [visible]);

  const done = marked.size;
  const total = disciplines.length;

  return (
    <section className="disciplines" aria-label="The eight">
      <div className="container layout">
        <aside className="contents" id="contents" aria-labelledby="contents-title">
          <div className="contents-inner">
            <h2 id="contents-title" className="label">
              Contents
            </h2>
            <ol className="toc">
              {disciplines.map((d) => {
                const Icon = d.icon;
                const isOn = marked.has(d.id);
                return (
                  <li
                    key={d.id}
                    className={[
                      active === d.id ? "is-active" : "",
                      visibleIds.has(d.id) ? "" : "is-dim",
                      isOn ? "is-done" : "",
                    ].join(" ")}
                  >
                    <a href={`#${d.id}`} aria-current={active === d.id ? "true" : undefined}>
                      <span className="toc-num">{d.numeral}</span>
                      <Icon size={16} strokeWidth={1.6} aria-hidden />
                      <span className="toc-title">{d.title}</span>
                      {isOn && <Check className="toc-check" size={14} aria-label="marked today" />}
                    </a>
                  </li>
                );
              })}
            </ol>

            <div className="tally" aria-live="polite">
              <div className="tally-row">
                <span className="label">Today</span>
                <span className="tally-count">
                  {ready ? done : 0} / {total}
                </span>
              </div>
              <div className="tally-bar" aria-hidden>
                <span style={{ width: `${((ready ? done : 0) / total) * 100}%` }} />
              </div>
              {ready && streak > 0 && (
                <p className="streak">
                  <Flame size={15} strokeWidth={1.7} aria-hidden />
                  {streak} {streak === 1 ? "day" : "days"} in a row
                </p>
              )}
              {ready && done > 0 && (
                <button type="button" className="link-btn" onClick={clearToday}>
                  Clear today
                </button>
              )}
            </div>
          </div>
        </aside>

        <div className="chapters">
          <div className="search">
            <Search className="search-icon" size={18} strokeWidth={1.7} aria-hidden />
            <input
              ref={searchRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setQuery("")}
              placeholder="Search notes and verses"
              aria-label="Search notes and verses"
              autoComplete="off"
              spellCheck={false}
            />
            {query ? (
              <button type="button" className="search-clear" onClick={() => setQuery("")} aria-label="Clear search">
                <X size={16} aria-hidden />
              </button>
            ) : (
              <kbd className="search-kbd" aria-hidden>
                /
              </kbd>
            )}
          </div>
          {terms.length > 0 && (
            <p className="search-count" aria-live="polite">
              {visible.length} of {total}
            </p>
          )}

          {visible.length === 0 && (
            <div className="empty">
              <p>Nothing found for “{query}”.</p>
              <button type="button" className="btn btn-quiet" onClick={() => setQuery("")}>
                <X size={16} aria-hidden /> Clear search
              </button>
            </div>
          )}

          {visible.map((d) => {
            const Icon = d.icon;
            const isOn = marked.has(d.id);
            return (
              <article key={d.id} id={d.id} className="chapter" aria-labelledby={`${d.id}-title`}>
                <header className="chapter-head">
                  <span className="chapter-num" aria-hidden>
                    {d.numeral}
                  </span>
                  <span className="chapter-icon" aria-hidden>
                    <Icon size={26} strokeWidth={1.4} />
                  </span>
                  <h2 id={`${d.id}-title`}>
                    <Highlight text={d.title} terms={terms} />
                  </h2>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => copy(`link-${d.id}`, `${location.origin}${location.pathname}#${d.id}`)}
                    aria-label={`Copy link to ${d.title}`}
                    title="Copy link"
                  >
                    {copied === `link-${d.id}` ? <Check size={16} aria-hidden /> : <Link2 size={16} aria-hidden />}
                  </button>
                </header>

                <div className="notes">
                  <h3 className="label">{d.notes.length > 1 ? "Notes" : "Note"}</h3>
                  {d.notes.map((n) => (
                    <p key={n} className="note">
                      <Highlight text={n} terms={terms} />
                    </p>
                  ))}
                </div>

                <div className="verses">
                  <h3 className="label">{d.verses.length > 1 ? "Bible verses" : "Bible verse"}</h3>
                  <ul>
                    {d.verses.map((v) => {
                      const key = `${d.id}-${v.ref}`;
                      return (
                        <li key={v.ref} className="verse">
                          <blockquote>
                            <p>
                              “<Highlight text={v.text} terms={terms} />”
                            </p>
                            <footer>
                              <cite>
                                <Highlight text={v.ref} terms={terms} />
                              </cite>
                              <button
                                type="button"
                                className="icon-btn"
                                onClick={() => copy(key, `“${v.text}” — ${v.ref}`)}
                                aria-label={`Copy ${v.ref}`}
                                title="Copy"
                              >
                                {copied === key ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
                              </button>
                            </footer>
                          </blockquote>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <button
                  type="button"
                  className={`practice${isOn ? " is-on" : ""}`}
                  aria-pressed={isOn}
                  onClick={() => toggle(d.id)}
                  disabled={!ready}
                >
                  {isOn ? <CircleCheck size={18} aria-hidden /> : <Circle size={18} aria-hidden />}
                  {isOn ? "Done today" : "Mark as done today"}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
