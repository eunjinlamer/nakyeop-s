"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AUTHOR, LATEST_ARTICLE } from "@/data/dummy";

export function BookSpread() {
  const router = useRouter();

  const goToArticle = () => {
    router.push(`/read/${LATEST_ARTICLE.id}`);
  };

  return (
    <div className="relative mx-auto w-full max-w-[1100px]">
      {/* page-turn arrows (left + right) */}
      <PageArrow side="left" />
      <PageArrow side="right" />

      {/* book — clicking anywhere on the book area navigates to the latest article */}
      <div
        role="link"
        tabIndex={0}
        onClick={goToArticle}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && goToArticle()}
        className="group relative grid cursor-pointer grid-cols-2 overflow-hidden rounded-[3px] shadow-[0_30px_60px_-25px_rgba(43,30,18,0.55),0_8px_20px_-10px_rgba(43,30,18,0.4)]"
        aria-label={`${LATEST_ARTICLE.title} — 본문으로 이동`}
        style={{ minHeight: 560 }}
      >
        {/* left page — book cover wraps from the left edge; intro sits only on the wrapped cover */}
        <Page side="left">
          <AuthorCoverWrap />
        </Page>

        {/* center binding (gutter shadow) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-1/2 z-10 w-[40px] -translate-x-1/2"
          style={{
            background:
              "linear-gradient(to right, transparent 0%, rgba(43,30,18,0.18) 35%, rgba(43,30,18,0.32) 50%, rgba(43,30,18,0.18) 65%, transparent 100%)",
          }}
        />

        {/* right page (latest article) */}
        <Page side="right">
          <div className="flex h-full flex-col gap-5 px-10 py-12">
            <header className="flex items-baseline justify-between border-b border-leaf-deep/20 pb-3">
              <span className="font-serif-display text-xs tracking-[0.3em] text-leaf-deep">
                LATEST · {LATEST_ARTICLE.category}
              </span>
              <span className="text-xs text-ink-soft">{LATEST_ARTICLE.date}</span>
            </header>

            <h1 className="font-serif-kr text-3xl font-medium leading-snug text-ink">
              {LATEST_ARTICLE.title}
            </h1>

            <article className="body-text flex-1 space-y-4 text-[16px] leading-[2] text-ink">
              {LATEST_ARTICLE.excerpt.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </article>

            <footer className="mt-auto flex items-center justify-end gap-2 text-xs text-leaf-deep transition group-hover:translate-x-1">
              <span className="font-serif-display tracking-[0.25em]">
                CONTINUE READING
              </span>
              <span aria-hidden>›</span>
            </footer>
          </div>
        </Page>
      </div>

      {/* book base shadow — the closed-pages look under the spine */}
      <div
        aria-hidden
        className="mx-auto mt-[-6px] h-3 w-[96%] rounded-b-[6px] bg-gradient-to-b from-binding/70 to-binding/10 blur-[1px]"
      />
    </div>
  );
}

function Page({
  side,
  children,
}: {
  side: "left" | "right";
  children: React.ReactNode;
}) {
  // page paper with subtle edge shading toward the spine
  const gradient =
    side === "left"
      ? "linear-gradient(to right, #f7f0dc 0%, #efe5cb 92%, #d9c79f 100%)"
      : "linear-gradient(to left, #f7f0dc 0%, #efe5cb 92%, #d9c79f 100%)";

  return (
    // h-full so the grid cell's stretched height resolves cleanly down to
    // any percentage-height children (the cover wrap needs h-full to work).
    <div className="relative h-full" style={{ background: gradient }}>
      {/* horizontal text rules — very faint, like ruled paper */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 inset-y-12 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, #2b1e12 31px, #2b1e12 32px)",
        }}
      />
      {children}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * AuthorCoverWrap — left page content
 * The book cover wraps from the left edge of the page and folds back
 * partway across; only this wrapped portion carries text/photo.
 *   name (top) → square photo (middle) → bio text (bottom)
 * ────────────────────────────────────────────────────────────────────── */
function AuthorCoverWrap() {
  return (
    <div className="relative h-full w-full">
      {/* the wrapped cover — flush against the left edge, ends ~62% across */}
      <div
        className="absolute inset-y-0 left-0 flex w-[64%] flex-col items-center justify-center gap-4 px-7 py-10"
        style={{
          background:
            "linear-gradient(120deg, #c79a52 0%, #8b5a2b 55%, #5e3a18 100%)",
          boxShadow:
            "12px 0 28px -10px rgba(43,30,18,0.55), inset 0 0 0 1px rgba(244,236,216,0.06)",
        }}
      >
        {/* spine ridge — sits hard against the left edge of the page */}
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[7px]"
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.18) 60%, transparent 100%)",
          }}
        />
        {/* fold crease near the far edge — implies the cover folds back here */}
        <span
          aria-hidden
          className="absolute inset-y-3 right-3 w-[1px]"
          style={{ background: "rgba(0,0,0,0.22)" }}
        />
        {/* curl shadow — the cover edge casts onto the page beyond it */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -right-1 w-3"
          style={{
            background:
              "linear-gradient(to right, rgba(43,30,18,0.35), transparent)",
          }}
        />
        {/* embossed inner border */}
        <span
          aria-hidden
          className="absolute inset-3 rounded-[2px] border border-[rgba(244,236,216,0.16)]"
        />

        {/* name — top */}
        <h2 className="font-serif-display text-2xl tracking-[0.3em] text-paper">
          {AUTHOR.name}
        </h2>

        {/* tagline */}
        <p className="-mt-1 font-serif-display text-[11px] italic tracking-[0.25em] text-paper/75">
          — {AUTHOR.tagline} —
        </p>

        {/* square photo */}
        <div className="relative h-28 w-28 overflow-hidden border-[3px] border-paper/80 bg-paper-deep shadow-inner">
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center font-serif-display text-3xl text-leaf-deep"
          >
            著
          </div>
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, transparent 60%, rgba(0,0,0,0.2) 100%)",
            }}
          />
        </div>

        {/* bio text — bottom, on the cover only */}
        <div className="body-text space-y-1 text-center text-[12.5px] leading-relaxed text-paper/95">
          {AUTHOR.bio.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      </div>
      {/* the right ~36% of the left page stays as bare paper underneath */}
    </div>
  );
}

function PageArrow({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <Link
      href={isLeft ? "/musings" : "/read/" + LATEST_ARTICLE.id}
      aria-label={isLeft ? "이전 페이지" : "다음 페이지"}
      onClick={(e) => e.stopPropagation()}
      className={`absolute top-1/2 z-20 -translate-y-1/2 ${
        isLeft ? "-left-12" : "-right-12"
      } group flex h-12 w-12 items-center justify-center rounded-full border border-leaf-deep/30 bg-paper/80 text-leaf-deep shadow-md backdrop-blur-sm transition hover:bg-paper hover:text-ink`}
    >
      <span className="font-serif-display text-2xl leading-none">
        {isLeft ? "‹" : "›"}
      </span>
    </Link>
  );
}
