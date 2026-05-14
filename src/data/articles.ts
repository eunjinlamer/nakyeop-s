/**
 * Article data model + dummy content for the article reader.
 *
 * NOTE: This file is the ONLY source of articles right now. When we wire
 * Supabase, replace `getArticleById` / `getAllArticles` with DB queries
 * and keep this typed shape so the UI doesn't have to change.
 */

export type Block =
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; alt?: string; caption?: string }
  | { type: "pullquote"; text: string; cite?: string };

export type ArticlePage = Block[];

export type ArticleCover = {
  // procedural cover (no image asset needed yet) — two-stop gradient + emblem char
  from: string;
  to: string;
  emblem: string; // single char overlay (사진 자리 placeholder)
};

export type Article = {
  id: string;
  slug: string;
  category: string;
  title: string;
  date: string; // ISO; format on render
  cover: ArticleCover;
  pages: ArticlePage[]; // each entry is one rendered page (manual breaks)
};

const ARTICLES: Article[] = [
  {
    id: "2026-05-14-first",
    slug: "may-shade",
    category: "단상",
    title: "오월의 그늘",
    date: "2026-05-14",
    cover: { from: "#c79a52", to: "#5e3a18", emblem: "蔭" },
    pages: [
      [
        {
          type: "paragraph",
          text: "오월의 나무 아래로 들어가면, 그늘이 종이 같다.",
        },
        {
          type: "paragraph",
          text: "잎과 잎 사이로 떨어지는 빛은 잉크가 마르기 전의 글씨 같아서, 한참을 들여다보면 어느새 내 안의 한 줄이 따라 그어진다.",
        },
        {
          type: "pullquote",
          text: "여름이 오기 전에 적어두고 싶은 것들을, 오늘은 적기로 한다.",
        },
      ],
      [
        {
          type: "paragraph",
          text: "지난 봄에 묻어둔 말들을 오늘에야 끄집어낸다. 그것들은 흙냄새를 머금고 있다.",
        },
        {
          type: "paragraph",
          text: "글이 나를 기다리고 있었다는 게 아니다. 내가 글을 묻어둔 자리를 잊지 않으려 매일 그 위를 한 번씩 밟고 다녔다는 게 맞다.",
        },
      ],
      [
        {
          type: "paragraph",
          text: "한 번 밟힌 자리는 결국 길이 된다. 길이 된 자리에서는 무엇이 자라기 힘들지만, 내가 어디로 갔는지는 또렷이 남는다.",
        },
        {
          type: "paragraph",
          text: "오월의 그늘은 그렇게 만들어진 길 위에 잠시 머무는 호흡 같다.",
        },
      ],
    ],
  },
  {
    id: "2026-05-07-second",
    slug: "between-pages",
    category: "단상",
    title: "페이지 사이",
    date: "2026-05-07",
    cover: { from: "#a86b3a", to: "#3f2812", emblem: "間" },
    pages: [
      [
        {
          type: "paragraph",
          text: "책장을 넘기는 짧은 순간에만 보이는 것이 있다. 두 페이지가 만나는 그 순간의 빛.",
        },
      ],
      [
        {
          type: "paragraph",
          text: "그 빛을 적어두려고 매일 같은 시간에 책상 앞에 앉지만, 막상 펜을 들면 빛은 이미 다른 모양으로 바뀌어 있다.",
        },
        {
          type: "pullquote",
          text: "쓴다는 것은 사라지는 것을 기록하려고 사라지는 일에 가담하는 것.",
        },
      ],
    ],
  },
  {
    id: "2026-04-30-third",
    slug: "dried-letter",
    category: "주간 일기",
    title: "마른 편지",
    date: "2026-04-30",
    cover: { from: "#7a4f1e", to: "#2e1a08", emblem: "信" },
    pages: [
      [
        {
          type: "paragraph",
          text: "오래 전에 쓰다 만 편지를 책 사이에서 발견했다. 종이는 마르고 글씨는 옅어졌지만, 한 줄 한 줄이 여전히 누군가를 향하고 있었다.",
        },
        {
          type: "paragraph",
          text: "편지를 다 쓰지 않은 채로 두는 마음에 대해 생각한다. 그건 보낼 마음이 없어서가 아니라, 보낼 자신이 없어서일 것이다.",
        },
      ],
    ],
  },
];

const BY_ID = new Map(ARTICLES.map((a) => [a.id, a]));

export function getArticleById(id: string): Article | undefined {
  return BY_ID.get(id);
}

export function getAllArticles(): Article[] {
  return ARTICLES;
}

/** Returns ids of the previous and next articles, sorted by date desc. */
export function getNeighbors(id: string): { prev?: Article; next?: Article } {
  const sorted = [...ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1));
  const idx = sorted.findIndex((a) => a.id === id);
  if (idx === -1) return {};
  return {
    next: sorted[idx - 1], // newer
    prev: sorted[idx + 1], // older
  };
}

/**
 * The article book has these "pages" beyond the body content:
 *   index 0:                       cover
 *   index 1:                       title / date / category
 *   index 2 .. 2+pages.length-1:   body pages
 *   index 2+pages.length:          end (reactions + prev/next + close)
 */
export function getTotalPages(article: Article): number {
  return article.pages.length + 3; // cover + meta + body + end
}
