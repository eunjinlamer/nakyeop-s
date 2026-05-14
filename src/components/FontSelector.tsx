"use client";

import { useEffect, useState } from "react";

const FONT_OPTIONS = [
  { id: "serif-kr", label: "명조", stack: "var(--font-serif-kr), serif" },
  { id: "sans", label: "고딕", stack: "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif" },
  { id: "myeongjo", label: "바탕", stack: "'Nanum Myeongjo', 'Batang', serif" },
  { id: "hand", label: "필사", stack: "'Nanum Pen Script', 'Gaegu', cursive" },
];

export function FontSelector() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("serif-kr");

  useEffect(() => {
    const opt = FONT_OPTIONS.find((o) => o.id === selected);
    if (opt) {
      document.documentElement.style.setProperty("--reader-font", opt.stack);
    }
  }, [selected]);

  return (
    <div className="relative flex flex-col items-center" aria-label="본문 글꼴 설정">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-sm bg-paper-deep/60 px-3 py-1 text-[11px] tracking-[0.25em] text-ink-soft shadow-sm transition hover:bg-paper-deep"
        aria-expanded={open}
      >
        <span aria-hidden>가</span>
        <span>글꼴</span>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full mt-2 w-32 rounded-sm border border-paper-deep bg-paper/95 py-1 shadow-md"
        >
          {FONT_OPTIONS.map((opt) => (
            <li key={opt.id}>
              <button
                role="option"
                aria-selected={selected === opt.id}
                onClick={() => {
                  setSelected(opt.id);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-1.5 text-left text-sm transition hover:bg-paper-deep/40 ${
                  selected === opt.id ? "text-ink" : "text-ink-soft"
                }`}
                style={{ fontFamily: opt.stack }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
