export const AUTHOR = {
  name: "이름 미정",
  tagline: "낙엽이 피기 전에",
  bio: [
    "글을 줍는 사람.",
    "계절이 바뀔 때마다 한 권의 책이 시작되고,",
    "낙엽이 떨어지기 전에 한 줄을 남깁니다.",
  ],
  photo: "/author-placeholder.jpg",
};

export const SITE_INTRO = [
  "이곳은 종이 한 장의 무게로 읽히는 웹사이트입니다.",
  "왼쪽에는 작가의 손, 오른쪽에는 가장 최근의 글.",
  "마음이 가는 페이지의 책등을 골라 펼쳐 보세요.",
];

export type Article = {
  id: string;
  category: string;
  title: string;
  date: string;
  excerpt: string[];
};

export const LATEST_ARTICLE: Article = {
  id: "2026-05-14-first",
  category: "단상",
  title: "오월의 그늘",
  date: "2026년 5월 14일",
  excerpt: [
    "오월의 나무 아래로 들어가면, 그늘이 종이 같다.",
    "잎과 잎 사이로 떨어지는 빛은 잉크가 마르기 전의 글씨 같아서,",
    "한참을 들여다보면 어느새 내 안의 한 줄이 따라 그어진다.",
    "여름이 오기 전에 적어두고 싶은 것들을, 오늘은 적기로 한다.",
  ],
};
