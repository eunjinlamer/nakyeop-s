"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks elapsed reading time on the current article.
 * Pauses when the tab is hidden so we don't count time the reader was away.
 *
 * STUB: persists per-article in localStorage as cumulative seconds. Will move
 * to Supabase `read_sessions` (one row per visit, with start/end timestamps)
 * once auth is wired so the author can see aggregate dwell time per article.
 */
export function ReadingTimer({ articleId }: { articleId: string }) {
  const storeKey = `read-time:${articleId}`;
  const [seconds, setSeconds] = useState(0);
  const baseRef = useRef(0); // previously-saved cumulative seconds
  const sessionStart = useRef<number>(0);
  const visible = useRef(true);

  useEffect(() => {
    sessionStart.current = Date.now();
    visible.current = !document.hidden;
    try {
      const raw = localStorage.getItem(storeKey);
      if (raw) baseRef.current = Number(raw) || 0;
    } catch {}
    setSeconds(baseRef.current);

    const onVis = () => {
      // commit elapsed before pausing
      if (visible.current && document.hidden) {
        const elapsed = Math.floor((Date.now() - sessionStart.current) / 1000);
        baseRef.current += elapsed;
        try {
          localStorage.setItem(storeKey, String(baseRef.current));
        } catch {}
      }
      // resume timer when becoming visible again
      if (!visible.current && !document.hidden) {
        sessionStart.current = Date.now();
      }
      visible.current = !document.hidden;
    };

    const tick = window.setInterval(() => {
      if (!visible.current) return;
      const live = Math.floor((Date.now() - sessionStart.current) / 1000);
      setSeconds(baseRef.current + live);
    }, 1000);

    document.addEventListener("visibilitychange", onVis);

    // commit on unmount / page leave
    const onLeave = () => {
      if (visible.current) {
        const elapsed = Math.floor((Date.now() - sessionStart.current) / 1000);
        baseRef.current += elapsed;
        try {
          localStorage.setItem(storeKey, String(baseRef.current));
        } catch {}
      }
    };
    window.addEventListener("pagehide", onLeave);

    return () => {
      window.clearInterval(tick);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", onLeave);
      onLeave();
    };
  }, [storeKey]);

  return (
    <span className="font-serif-display tracking-[0.25em]">
      머무른 시간 · {formatDuration(seconds)}
    </span>
  );
}

function formatDuration(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m === 0) return `${sec}초`;
  return `${m}분 ${sec.toString().padStart(2, "0")}초`;
}
