"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Local calendar date as YYYY-MM-DD, so "today" follows the reader's clock. */
export function dayKey(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

/** Copy text and remember which key was copied for a short moment. */
export function useClipboard(resetMs = 1600) {
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const copy = useCallback(
    async (key: string, text: string) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand("copy");
        } catch {
          return;
        } finally {
          ta.remove();
        }
      }
      setCopied(key);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(null), resetMs);
    },
    [resetMs],
  );

  useEffect(() => () => clearTimeout(timer.current), []);
  return { copied, copy };
}

type Log = Record<string, string[]>;
const LOG_KEY = "temperance:log";

function readLog(): Log {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLog(log: Log) {
  try {
    localStorage.setItem(LOG_KEY, JSON.stringify(log));
  } catch {
    /* private mode or storage blocked: the page still works for this visit */
  }
}

/** Days in a row (ending today, or yesterday if today is still empty) with at least one mark. */
function streakOf(log: Log): number {
  const d = new Date();
  if (!log[dayKey(d)]?.length) d.setDate(d.getDate() - 1);
  let n = 0;
  while (log[dayKey(d)]?.length) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/** Which of the eight were marked today, kept per day in this browser. */
export function usePracticeLog() {
  const [log, setLog] = useState<Log>({});
  const [today, setToday] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLog(readLog());
    setToday(dayKey());
    setReady(true);

    // Roll over at midnight if the page stays open.
    const tick = setInterval(() => setToday(dayKey()), 60_000);
    const onStorage = (e: StorageEvent) => e.key === LOG_KEY && setLog(readLog());
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(tick);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const marked = new Set(log[today] ?? []);

  const toggle = useCallback(
    (id: string) => {
      setLog((prev) => {
        const cur = new Set(prev[today] ?? []);
        if (cur.has(id)) cur.delete(id);
        else cur.add(id);
        const next = { ...prev, [today]: [...cur] };
        if (!cur.size) delete next[today];
        writeLog(next);
        return next;
      });
    },
    [today],
  );

  const clearToday = useCallback(() => {
    setLog((prev) => {
      const next = { ...prev };
      delete next[today];
      writeLog(next);
      return next;
    });
  }, [today]);

  return { ready, marked, toggle, clearToday, streak: streakOf(log) };
}
