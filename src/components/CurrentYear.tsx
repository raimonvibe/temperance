"use client";

import { useEffect, useState } from "react";

/** The year from the reader's own clock, so the footer never goes stale after a build. */
export function CurrentYear() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  useEffect(() => setYear(new Date().getFullYear()), []);
  return <time dateTime={String(year)}>{year}</time>;
}
