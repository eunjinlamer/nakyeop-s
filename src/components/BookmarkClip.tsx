"use client";

import { useEffect, useState } from "react";

/**
 * Bookmark clip — a small ribbon that sticks out of the top-right of the page.
 * Clicking saves the current page index. On next visit, ArticleViewer can
 * read this and jump to the saved page (TODO: wire when auth is in).
 *
 * STUB: stores in localStorage keyed by article id. Will move to Supabase
 * `bookmarks` table once auth is wired so the position syncs across devices.
 */
export function BookmarkClip({ page }: { page: number }) {
  // Persist by URL pathname so we don't have to thread articleId through.
  const [savedPage, setSavedPage] = useState<number | null>(null);
  const [justSaved, setJustSaved] = useState(false);

  const storeKey = useStoreKey();

  useEffect(() => {
    if (!storeKey) return;
    try {
      const raw = localStorage.getItem(storeKey);
      if (raw) setSavedPage(Number(raw));
    } catch {}
  }, [storeKey]);

  const onClick = () => {
    if (!storeKey) return;
    try {
      localStorage.setItem(storeKey, String(page));
      setSavedPage(page);
      setJustSaved(true);
      window.setTimeout(() => setJustSaved(false), 1400);
    } catch {}
  };

  const active = savedPage === page;

  return (
    <button
      onClick={onClick}
      aria-label={active ? "여기에 책갈피가 있습니다" : "이 페이지를 책갈피로 표시"}
      className="group absolute -top-3 right-10 z-30 select-none"
      style={{ width: 36, height: 70 }}
    >
      <svg viewBox="0 0 36 70" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="bm-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={active ? "#c45a3a" : "#8b5a2b"} />
            <stop offset="100%" stopColor={active ? "#7a2a14" : "#4a2c10"} />
          </linearGradient>
          <filter id="bm-shadow" x="-30%" y="-10%" width="160%" height="130%">
            <feDropShadow
              dx="1"
              dy="3"
              stdDeviation="2"
              floodOpacity="0.35"
            />
          </filter>
        </defs>
        {/* ribbon body — straight top, V-cut bottom */}
        <path
          d="M 4 0
             L 32 0
             L 32 60
             L 18 50
             L 4 60 Z"
          fill="url(#bm-grad)"
          stroke={active ? "#3a1408" : "#2e1a08"}
          strokeWidth="0.8"
          filter="url(#bm-shadow)"
          className="transition-all duration-200 group-hover:translate-y-[-2px]"
        />
        {/* metallic clip ring at the top */}
        <circle cx="18" cy="6" r="2.2" fill="#e9dec3" stroke="#5e3a18" strokeWidth="0.6" />
      </svg>
      {/* tiny "saved" toast */}
      {justSaved && (
        <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-ink/90 px-2 py-0.5 text-[10px] tracking-[0.2em] text-paper">
          책갈피 저장됨
        </span>
      )}
    </button>
  );
}

function useStoreKey() {
  const [key, setKey] = useState<string | null>(null);
  useEffect(() => {
    setKey(`bookmark:${window.location.pathname}`);
  }, []);
  return key;
}
