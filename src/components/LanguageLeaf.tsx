"use client";

import { useState } from "react";

const LANGUAGES = ["KO", "EN", "FR"] as const;
type Lang = (typeof LANGUAGES)[number];

export function LanguageLeaf() {
  const [lang, setLang] = useState<Lang>("KO");

  return (
    <div className="flex items-end gap-3" aria-label="언어 선택">
      {LANGUAGES.map((l) => (
        <SproutButton
          key={l}
          label={l}
          active={lang === l}
          onClick={() => setLang(l)}
        />
      ))}
    </div>
  );
}

function SproutButton({
  label,
  active,
  onClick,
}: {
  label: Lang;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-label={`${label} 언어`}
      className="group flex flex-col items-center gap-1 transition-transform duration-300 hover:-translate-y-[2px]"
    >
      <Sprout active={active} variant={label} />
      {/* label sits on the baseline — straight, never rotated */}
      <span
        className={`font-serif-display text-[11px] font-semibold leading-none tracking-[0.18em] transition-colors ${
          active ? "text-ink" : "text-ink-soft/60 group-hover:text-ink-soft"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

function Sprout({ active, variant }: { active: boolean; variant: Lang }) {
  const gid = `sprout-${variant}-${active ? "on" : "off"}`;
  const stemGid = `sprout-stem-${variant}-${active ? "on" : "off"}`;

  // active: warm tan/yellow-gold, alive
  // inactive: muted dark navy/charcoal, dormant
  const stops = active
    ? [
        { o: "0%", c: "#e8c581" },
        { o: "55%", c: "#c79a52" },
        { o: "100%", c: "#7a4a1e" },
      ]
    : [
        { o: "0%", c: "#3a3d52" },
        { o: "60%", c: "#1c1e2c" },
        { o: "100%", c: "#0a0b14" },
      ];

  const stemColor = active ? "#5e3a18" : "#0a0b14";
  const outline = active ? "#5e3a18" : "#03040a";

  return (
    <svg
      viewBox="0 0 36 44"
      className="h-11 w-9 drop-shadow-[0_2px_2px_rgba(0,0,0,0.4)]"
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="50%" y1="0%" x2="50%" y2="100%">
          {stops.map((s) => (
            <stop key={s.o} offset={s.o} stopColor={s.c} />
          ))}
        </linearGradient>
        <linearGradient id={stemGid} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={stemColor} stopOpacity="0.6" />
          <stop offset="100%" stopColor={stemColor} />
        </linearGradient>
      </defs>

      {/* stem — slight S-curve from soil up to where the cotyledons split */}
      <path
        d="M 18 42 C 18 36, 16 28, 18 20"
        stroke={`url(#${stemGid})`}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />

      {/* left cotyledon (seed leaf) */}
      <path
        d="M 18 21
           C 12 19, 5 14, 3 5
           C 10 5, 16 11, 18 21 Z"
        fill={`url(#${gid})`}
        stroke={outline}
        strokeWidth="0.7"
      />
      {/* right cotyledon */}
      <path
        d="M 18 21
           C 24 19, 31 14, 33 5
           C 26 5, 20 11, 18 21 Z"
        fill={`url(#${gid})`}
        stroke={outline}
        strokeWidth="0.7"
      />

      {/* tiny leaf veins for life */}
      <path
        d="M 6 7 Q 12 12, 17 19 M 30 7 Q 24 12, 19 19"
        stroke={outline}
        strokeWidth="0.4"
        opacity="0.55"
        fill="none"
      />

      {/* center bud — the next leaf about to unfurl */}
      <ellipse
        cx="18"
        cy="18"
        rx="1.6"
        ry="2.4"
        fill={stemColor}
      />
    </svg>
  );
}
