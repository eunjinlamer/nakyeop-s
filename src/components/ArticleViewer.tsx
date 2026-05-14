"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Article, Block } from "@/data/articles";
import { getTotalPages } from "@/data/articles";
import { BookmarkClip } from "@/components/BookmarkClip";
import { ReadingTimer } from "@/components/ReadingTimer";

type Neighbor = { id: string; title: string } | null;

type Props = {
  article: Article;
  prev: Neighbor;
  next: Neighbor;
};

type TurnDir = "next" | "prev";
type Outgoing = { page: number; dir: TurnDir } | null;

const FLIP_MS = 850; // matches the CSS animation duration

export function ArticleViewer({ article, prev, next }: Props) {
  const total = getTotalPages(article);

  // page index: 0 = cover, 1 = meta, 2..total-2 = body, total-1 = end
  const [page, setPage] = useState(0);
  // snapshot of the page being flipped away — rendered on top of the
  // destination page during the animation, then cleared.
  const [outgoing, setOutgoing] = useState<Outgoing>(null);
  const [scrollMode, setScrollMode] = useState(false);
  const turnLock = useRef(false);

  const goNext = useCallback(() => {
    if (turnLock.current) return;
    setPage((p) => {
      if (p >= total - 1) return p;
      turnLock.current = true;
      setOutgoing({ page: p, dir: "next" });
      window.setTimeout(() => {
        setOutgoing(null);
        turnLock.current = false;
      }, FLIP_MS);
      return p + 1;
    });
  }, [total]);

  const goPrev = useCallback(() => {
    if (turnLock.current) return;
    setPage((p) => {
      if (p <= 0) return p;
      turnLock.current = true;
      setOutgoing({ page: p, dir: "prev" });
      window.setTimeout(() => {
        setOutgoing(null);
        turnLock.current = false;
      }, FLIP_MS);
      return p - 1;
    });
  }, []);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (scrollMode) return;
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, scrollMode]);

  return (
    <main className="relative flex min-h-screen flex-col items-center px-6 py-10">
      {/* top bar — close book + scroll mode toggle */}
      <TopBar
        scrollMode={scrollMode}
        onToggleScroll={() => setScrollMode((v) => !v)}
      />

      {scrollMode ? (
        <ScrollMode article={article} prev={prev} next={next} />
      ) : (
        <>
          <BookFrame
            article={article}
            page={page}
            total={total}
            outgoing={outgoing}
            prev={prev}
            next={next}
            onPrev={goPrev}
            onNext={goNext}
            onJump={setPage}
          />

          <BelowBookHud
            article={article}
            page={page}
            total={total}
          />
        </>
      )}
    </main>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Top bar — close book button (home) + scroll-mode toggle
 * ────────────────────────────────────────────────────────────────────── */
function TopBar({
  scrollMode,
  onToggleScroll,
}: {
  scrollMode: boolean;
  onToggleScroll: () => void;
}) {
  return (
    <div className="fixed left-6 right-6 top-5 z-40 flex items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-2 rounded-sm bg-paper-deep/70 px-3 py-1 text-xs tracking-[0.25em] text-ink-soft shadow-sm transition hover:bg-paper-deep hover:text-ink"
        aria-label="홈으로 돌아가기"
      >
        <span aria-hidden>←</span>
        <span>책장으로</span>
      </Link>
      <button
        onClick={onToggleScroll}
        className="rounded-sm bg-paper-deep/70 px-3 py-1 text-xs tracking-[0.25em] text-ink-soft shadow-sm transition hover:bg-paper-deep hover:text-ink"
        aria-pressed={scrollMode}
      >
        {scrollMode ? "책 모드로 읽기" : "스크롤 모드로 읽기"}
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Book frame — single page centered, side arrows, page-corner curl
 * ────────────────────────────────────────────────────────────────────── */
function BookFrame({
  article,
  page,
  total,
  outgoing,
  prev,
  next,
  onPrev,
  onNext,
  onJump,
}: {
  article: Article;
  page: number;
  total: number;
  outgoing: Outgoing;
  prev: Neighbor;
  next: Neighbor;
  onPrev: () => void;
  onNext: () => void;
  onJump: (p: number) => void;
}) {
  const atFirst = page <= 0;
  const atLast = page >= total - 1;

  return (
    <div className="relative mt-16 flex w-full max-w-[1200px] items-start justify-center">
      {/* page-turn arrows */}
      <button
        onClick={onPrev}
        disabled={atFirst}
        aria-label="이전 페이지"
        className="mr-4 mt-[260px] flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-leaf-deep/30 bg-paper/80 text-leaf-deep shadow-md backdrop-blur-sm transition enabled:hover:bg-paper enabled:hover:text-ink disabled:opacity-30"
      >
        <span className="font-serif-display text-2xl leading-none">‹</span>
      </button>

      {/* the book — single page centered with margin space on both sides for memos */}
      <div className="relative w-[640px] shrink-0">
        {/* bookmark clip on the top-right of the page */}
        <BookmarkClip page={page} />

        {/* Page stack — same shape as the original (airplane-era) structure:
         * the destination page lives in normal flow with an explicit size,
         * giving the column a deterministic height that never collapses.
         * The outgoing page (during a flip) is layered absolutely on top
         * via .page-flipping-* and rotates away. */}
        <div className="relative" style={{ width: 640, height: 853 }}>
          {/* destination — key={page} forces a clean re-mount per page so
           * the cover renders just like the airplane version did. */}
          <div
            key={page}
            className="page-paper rounded-[3px] shadow-[0_30px_60px_-25px_rgba(43,30,18,0.55),0_8px_20px_-10px_rgba(43,30,18,0.4)]"
            style={{ width: 640, height: 853 }}
          >
            <PageBody
              article={article}
              page={page}
              total={total}
              prev={prev}
              next={next}
              onJump={onJump}
            />
          </div>

          {/* outgoing — absolute overlay (positioning supplied by
           * .page-flipping-* in CSS) with the hinge-rotate animation */}
          {outgoing && (
            <div
              key={`out-${outgoing.page}-${outgoing.dir}`}
              className={`page-paper flipping rounded-[3px] page-flipping-${outgoing.dir}`}
              style={{ width: 640, height: 853 }}
            >
              <PageBody
                article={article}
                page={outgoing.page}
                total={total}
                prev={prev}
                next={next}
                onJump={onJump}
              />
            </div>
          )}
        </div>

        {/* book base shadow */}
        <div
          aria-hidden
          className="mx-auto mt-[-6px] h-3 w-[96%] rounded-b-[6px] bg-gradient-to-b from-binding/70 to-binding/10 blur-[1px]"
        />
      </div>

      <button
        onClick={onNext}
        disabled={atLast}
        aria-label="다음 페이지"
        className="ml-4 mt-[260px] flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-leaf-deep/30 bg-paper/80 text-leaf-deep shadow-md backdrop-blur-sm transition enabled:hover:bg-paper enabled:hover:text-ink disabled:opacity-30"
      >
        <span className="font-serif-display text-2xl leading-none">›</span>
      </button>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Decides what content lives on the current page index.
 *   0           cover
 *   1           meta
 *   2..n-2      body (article.pages[i-2])
 *   n-1         end
 * ────────────────────────────────────────────────────────────────────── */
function PageBody({
  article,
  page,
  total,
  prev,
  next,
  onJump,
}: {
  article: Article;
  page: number;
  total: number;
  prev: Neighbor;
  next: Neighbor;
  onJump: (p: number) => void;
}) {
  if (page === 0) return <CoverPage article={article} />;
  if (page === 1) return <MetaPage article={article} />;
  if (page === total - 1)
    return <EndPage article={article} prev={prev} next={next} onRestart={() => onJump(0)} />;

  const bodyIdx = page - 2;
  const blocks = article.pages[bodyIdx];
  return <BodyPage blocks={blocks} />;
}

function CoverPage({ article }: { article: Article }) {
  return (
    // h-full / w-full instead of absolute inset-0 — all page sub-types
    // (cover / meta / body / end) now use the same positioning model so
    // their rendered size is identical to the page-paper container.
    <div
      className="relative flex h-full w-full flex-col items-center justify-center gap-6 p-10"
      style={{
        background: `linear-gradient(135deg, ${article.cover.from} 0%, ${article.cover.to} 100%)`,
      }}
    >
      <span className="font-serif-display text-[11px] tracking-[0.5em] text-paper/70">
        {article.category.toUpperCase()}
      </span>
      <div className="my-4 h-[140px] w-[140px] flex items-center justify-center rounded-sm border border-paper/30 bg-black/10 font-serif-display text-7xl text-paper/85">
        {article.cover.emblem}
      </div>
      <h1 className="text-center font-serif-kr text-3xl font-light tracking-[0.2em] text-paper md:text-4xl">
        {article.title}
      </h1>
      <span className="font-serif-display text-xs tracking-[0.35em] text-paper/60">
        {formatDate(article.date)}
      </span>
    </div>
  );
}

function MetaPage({ article }: { article: Article }) {
  return (
    <div className="relative flex h-full flex-col items-start justify-center gap-6 px-14 py-16">
      <PaperRules />
      <span className="font-serif-display text-[11px] tracking-[0.4em] text-leaf-deep">
        {article.category}
      </span>
      <h1 className="font-serif-kr text-4xl font-light leading-tight text-ink">
        {article.title}
      </h1>
      <p className="font-serif-display text-sm tracking-[0.25em] text-ink-soft">
        {formatDate(article.date)}
      </p>
      <div className="mt-6 h-[1px] w-16 bg-leaf-deep/40" />
      <p className="body-text text-sm italic leading-relaxed text-ink-soft">
        다음 장부터 본문이 시작됩니다.
      </p>
    </div>
  );
}

function BodyPage({ blocks }: { blocks: Block[] }) {
  return (
    <div className="relative flex h-full flex-col gap-5 px-14 py-16">
      <PaperRules />
      <article className="body-text flex-1 space-y-5 text-[16px] leading-[2] text-ink">
        {blocks.map((b, i) => (
          <BlockRender key={i} block={b} />
        ))}
      </article>
    </div>
  );
}

function BlockRender({ block }: { block: Block }) {
  if (block.type === "paragraph") return <p>{block.text}</p>;
  if (block.type === "image")
    return (
      <figure className="my-6">
        {/* placeholder square — actual <img> when we have asset uploads */}
        <div className="mx-auto flex aspect-[4/3] w-[80%] items-center justify-center bg-paper-deep/50 text-leaf-deep/60">
          <span className="font-serif-display text-xs tracking-[0.3em]">
            IMAGE · {block.alt ?? "사진"}
          </span>
        </div>
        {block.caption && (
          <figcaption className="mt-2 text-center text-xs italic text-ink-soft">
            {block.caption}
          </figcaption>
        )}
      </figure>
    );
  if (block.type === "pullquote")
    return (
      <blockquote className="my-8 border-l-4 border-leaf-deep/60 pl-6 italic">
        <p className="font-serif-display text-[18px] leading-relaxed text-ink">
          “{block.text}”
        </p>
        {block.cite && (
          <cite className="mt-2 block text-xs not-italic text-ink-soft">
            — {block.cite}
          </cite>
        )}
      </blockquote>
    );
  return null;
}

function EndPage({
  article,
  prev,
  next,
  onRestart,
}: {
  article: Article;
  prev: Neighbor;
  next: Neighbor;
  onRestart: () => void;
}) {
  return (
    <div className="relative flex h-full flex-col items-center gap-8 px-14 py-16">
      <PaperRules />
      <p className="font-serif-display text-xs tracking-[0.4em] text-leaf-deep">
        END · {article.title}
      </p>
      <ReactionPanel articleId={article.id} />
      <div className="mt-2 grid w-full grid-cols-2 gap-3">
        <NeighborCard side="prev" article={prev} />
        <NeighborCard side="next" article={next} />
      </div>
      <div className="mt-auto flex gap-3">
        <button
          onClick={onRestart}
          className="rounded-sm border border-leaf-deep/40 bg-paper/60 px-4 py-2 text-xs tracking-[0.25em] text-ink-soft transition hover:bg-paper hover:text-ink"
        >
          처음으로
        </button>
        <Link
          href="/"
          className="rounded-sm bg-binding px-4 py-2 text-xs tracking-[0.25em] text-paper transition hover:opacity-90"
        >
          책을 닫다
        </Link>
      </div>
    </div>
  );
}

function NeighborCard({
  side,
  article,
}: {
  side: "prev" | "next";
  article: Neighbor;
}) {
  if (!article)
    return (
      <div className="flex flex-col items-start gap-1 rounded-sm border border-dashed border-leaf-deep/20 px-4 py-3 opacity-50">
        <span className="font-serif-display text-[10px] tracking-[0.3em] text-leaf-deep">
          {side === "prev" ? "이전 글 없음" : "다음 글 없음"}
        </span>
      </div>
    );
  return (
    <Link
      href={`/read/${article.id}`}
      className="flex flex-col items-start gap-1 rounded-sm border border-leaf-deep/30 bg-paper/40 px-4 py-3 transition hover:bg-paper hover:shadow-sm"
    >
      <span className="font-serif-display text-[10px] tracking-[0.3em] text-leaf-deep">
        {side === "prev" ? "이전 글" : "다음 글"}
      </span>
      <span className="font-serif-kr text-sm text-ink">{article.title}</span>
    </Link>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Reaction panel — STUB. Persists to localStorage now; will swap to
 * Supabase `reactions` table once auth + schema are wired.
 * ────────────────────────────────────────────────────────────────────── */
const EMOJI = ["🍂", "🌱", "✍️", "💛", "🕯️"] as const;

function ReactionPanel({ articleId }: { articleId: string }) {
  const storeKey = `reaction:${articleId}`;
  const [picked, setPicked] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [savedAt, setSavedAt] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      if (raw) {
        const j = JSON.parse(raw);
        setPicked(j.emoji ?? null);
        setComment(j.comment ?? "");
        setSavedAt(j.at ?? null);
      }
    } catch {}
  }, [storeKey]);

  const save = () => {
    const entry = {
      emoji: picked,
      comment: comment.trim(),
      at: new Date().toISOString(),
    };
    try {
      localStorage.setItem(storeKey, JSON.stringify(entry));
      setSavedAt(entry.at);
    } catch {}
  };

  return (
    <div className="w-full rounded-sm border border-leaf-deep/20 bg-paper/40 p-4">
      <p className="mb-2 font-serif-display text-[10px] tracking-[0.3em] text-leaf-deep">
        오늘의 한마디
      </p>
      <div className="mb-3 flex gap-2">
        {EMOJI.map((e) => (
          <button
            key={e}
            onClick={() => setPicked(e)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-lg transition ${
              picked === e
                ? "bg-leaf-deep/15 ring-1 ring-leaf-deep"
                : "hover:bg-paper-deep/40"
            }`}
            aria-pressed={picked === e}
            aria-label={`emoji ${e}`}
          >
            {e}
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="이 글이 남긴 한마디를 적어주세요…"
        rows={2}
        className="w-full resize-none rounded-sm border border-leaf-deep/20 bg-paper/60 p-2 text-sm text-ink outline-none focus:border-leaf-deep/60"
      />
      <div className="mt-2 flex items-center justify-between">
        <span className="text-[10px] text-ink-soft">
          {savedAt ? `저장됨 · ${formatDateTime(savedAt)}` : "아직 저장 전"}
        </span>
        <button
          onClick={save}
          className="rounded-sm bg-leaf-deep px-3 py-1 text-[11px] tracking-[0.2em] text-paper transition hover:opacity-90"
        >
          남기기
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Below-book HUD: page indicator + reading time
 * ────────────────────────────────────────────────────────────────────── */
function BelowBookHud({
  article,
  page,
  total,
}: {
  article: Article;
  page: number;
  total: number;
}) {
  return (
    <div className="mt-6 flex w-full max-w-[640px] items-center justify-between text-[11px] tracking-[0.25em] text-ink-soft">
      <ReadingTimer articleId={article.id} />
      <span className="font-serif-display">
        {page + 1} / {total}
      </span>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
 * Scroll mode — shows everything in a single vertical column
 * ────────────────────────────────────────────────────────────────────── */
function ScrollMode({
  article,
  prev,
  next,
}: {
  article: Article;
  prev: Neighbor;
  next: Neighbor;
}) {
  const all = useMemo(() => article.pages.flat(), [article.pages]);
  return (
    <div className="mt-16 w-full max-w-[680px]">
      <header className="mb-10 border-b border-leaf-deep/20 pb-6 text-center">
        <p className="font-serif-display text-[11px] tracking-[0.4em] text-leaf-deep">
          {article.category}
        </p>
        <h1 className="mt-3 font-serif-kr text-3xl font-light text-ink">
          {article.title}
        </h1>
        <p className="mt-2 text-xs text-ink-soft">{formatDate(article.date)}</p>
      </header>
      <article className="body-text space-y-5 text-[16px] leading-[2] text-ink">
        {all.map((b, i) => (
          <BlockRender key={i} block={b} />
        ))}
      </article>
      <div className="mt-12 grid grid-cols-2 gap-3">
        <NeighborCard side="prev" article={prev} />
        <NeighborCard side="next" article={next} />
      </div>
    </div>
  );
}

/* ────────── small helpers ────────── */

function PaperRules() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-10 inset-y-12 opacity-[0.06]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, #2b1e12 31px, #2b1e12 32px)",
      }}
    />
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  const t = d.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${d.getMonth() + 1}/${d.getDate()} ${t}`;
}
