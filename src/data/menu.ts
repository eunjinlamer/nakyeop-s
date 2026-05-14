export type MenuItem = {
  id: string;
  label: string;
  href: string;
};

export const MENU: MenuItem[] = [
  { id: "home",    label: "홈",          href: "/" },
  { id: "musings", label: "단상",        href: "/musings" },
  { id: "daily",   label: "일간 작품",    href: "/daily" },
  { id: "weekly",  label: "주간 일기",    href: "/weekly" },
  { id: "readers", label: "독자 페이지",  href: "/readers" },
  { id: "store",   label: "낙엽서점",    href: "/store" },
];
