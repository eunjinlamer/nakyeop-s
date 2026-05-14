"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MENU } from "@/data/menu";

/* per-leaf autumn palette + position on the branch.
 * x/y are coordinates inside the SVG viewBox; sway is the resting tilt of the leaf. */
const LEAVES = [
  { fill: "#d9a04f", deep: "#7a4f1e", text: "#2b1e12", x: 92,  y: 60,  sway: -10 },
  { fill: "#a86b3a", deep: "#4a2c10", text: "#f4ecd8", x: 120, y: 120, sway: 8 },
  { fill: "#b04a1e", deep: "#5a1a04", text: "#f4ecd8", x: 80,  y: 188, sway: -12 },
  { fill: "#c79a52", deep: "#5e3a18", text: "#2b1e12", x: 128, y: 254, sway: 6 },
  { fill: "#8b5a2b", deep: "#3a1f08", text: "#f4ecd8", x: 90,  y: 322, sway: -8 },
  { fill: "#6b3818", deep: "#2e1a08", text: "#e9dec3", x: 124, y: 388, sway: 11 },
] as const;

export function TreeMenu() {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  // wind sway is now hover-only via CSS — no JS proximity tracking,
  // so only the leaf the cursor is actually on reacts.

  return (
    <nav
      aria-label="페이지 메뉴"
      className="fixed left-2 top-4 z-30 select-none"
    >
      {/* fold/unfold tab — small bookmark-like handle */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="ml-2 mb-1 flex items-center gap-2 rounded-sm bg-paper-deep/70 px-3 py-1 text-xs tracking-[0.25em] text-ink-soft shadow-sm transition hover:bg-paper-deep"
        aria-expanded={open}
      >
        <span>{open ? "접기" : "펼치기"}</span>
        <span aria-hidden>{open ? "▴" : "▾"}</span>
      </button>

      <div
        className={`origin-top-left transition-all duration-500 ${
          open
            ? "opacity-100 scale-100"
            : "pointer-events-none -translate-y-4 scale-90 opacity-0"
        }`}
      >
        <svg
          viewBox="0 0 170 460"
          className="h-[460px] w-[170px] overflow-visible"
        >
          {/* main branch — a slightly meandering line down the left side */}
          <path
            d="M 50 0
               C 58 50, 42 100, 56 150
               C 70 200, 48 250, 62 300
               C 74 350, 56 400, 64 460"
            stroke="#3f2812"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* a couple of bark texture lines */}
          <path
            d="M 52 30 q 1 20 -1 40 M 55 180 q -1 25 1 50 M 60 340 q -1 20 1 45"
            stroke="#2e1a08"
            strokeWidth="0.6"
            opacity="0.5"
            fill="none"
          />

          {/* stems connecting branch to each leaf */}
          {LEAVES.map((l, i) => {
            // approximate branch x at a given y along the curve
            const branchX = 50 + Math.sin((l.y / 460) * Math.PI * 2) * 8;
            return (
              <path
                key={`stem-${i}`}
                d={`M ${branchX} ${l.y - 4} Q ${(branchX + l.x) / 2} ${
                  l.y - 12
                } ${l.x} ${l.y - 2}`}
                stroke="#3f2812"
                strokeWidth="1.1"
                fill="none"
                opacity="0.8"
              />
            );
          })}

          {/* leaves with menu labels */}
          {MENU.map((item, i) => {
            const l = LEAVES[i];
            return (
              <Leaf
                key={item.id}
                x={l.x}
                y={l.y}
                sway={l.sway}
                fill={l.fill}
                deep={l.deep}
                text={l.text}
                label={item.label}
                onClick={() => router.push(item.href)}
              />
            );
          })}
        </svg>
      </div>
    </nav>
  );
}

function Leaf({
  ref,
  index,
  x,
  y,
  sway,
  fill,
  deep,
  text,
  label,
  onClick,
}: {
  ref?: (el: SVGGElement | null) => void;
  index: number;
  x: number;
  y: number;
  sway: number;
  fill: string;
  deep: string;
  text: string;
  label: string;
  onClick: () => void;
}) {
  const gid = `tree-leaf-${label}`;
  const sid = `tree-leaf-shade-${label}`;
  // stagger so the cluster doesn't sway in lockstep when wind hits
  const windDelay = `${(index * 0.17) % 0.7}s`;

  return (
    <g
      ref={ref}
      // positioning only — rotation lives in CSS so .leaf-wind can drive it
      transform={`translate(${x} ${y})`}
      className="leaf cursor-pointer"
      role="link"
      aria-label={label}
      onClick={onClick}
      tabIndex={0}
      style={
        {
          "--rest": `${sway}deg`,
          "--wind-delay": windDelay,
        } as React.CSSProperties
      }
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <defs>
        <radialGradient id={gid} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor={fill} />
          <stop offset="60%" stopColor={fill} />
          <stop offset="100%" stopColor={deep} />
        </radialGradient>
        <radialGradient id={sid} cx="30%" cy="20%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* simplified plane-tree leaf, ~52w × 64h hanging downward */}
      <path
        d="M 0 -2
           C -4 4, -16 6, -20 14
           C -26 18, -22 26, -18 28
           C -24 30, -26 38, -20 42
           C -16 50, -8 56, -2 62
           L 0 66
           L 2 62
           C 8 56, 16 50, 20 42
           C 26 38, 24 30, 18 28
           C 22 26, 26 18, 20 14
           C 16 6, 4 4, 0 -2 Z"
        fill={`url(#${gid})`}
        stroke={deep}
        strokeWidth="0.9"
      />
      {/* highlight overlay */}
      <path
        d="M 0 -2
           C -4 4, -16 6, -20 14
           C -26 18, -22 26, -18 28
           C -24 30, -26 38, -20 42
           C -16 50, -8 56, -2 62
           L 0 66
           L 2 62
           C 8 56, 16 50, 20 42
           C 26 38, 24 30, 18 28
           C 22 26, 26 18, 20 14
           C 16 6, 4 4, 0 -2 Z"
        fill={`url(#${sid})`}
      />
      {/* central vein */}
      <path
        d="M 0 0 L 0 64"
        stroke={deep}
        strokeWidth="0.7"
        opacity="0.55"
        fill="none"
      />
      {/* side veins */}
      <path
        d="M 0 16 L -14 14 M 0 16 L 14 14 M 0 32 L -16 32 M 0 32 L 16 32 M 0 48 L -10 50 M 0 48 L 10 50"
        stroke={deep}
        strokeWidth="0.5"
        opacity="0.45"
        fill="none"
      />

      {/* menu label centered on the leaf */}
      <text
        x="0"
        y="36"
        textAnchor="middle"
        fontSize="9.5"
        fontWeight="500"
        fill={text}
        style={{
          pointerEvents: "none",
          fontFamily:
            "var(--font-serif-kr), 'Noto Serif KR', serif",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </text>
    </g>
  );
}
