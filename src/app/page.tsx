import { TreeMenu } from "@/components/TreeMenu";
import { LanguageLeaf } from "@/components/LanguageLeaf";
import { FontSelector } from "@/components/FontSelector";
import { BookSpread } from "@/components/BookSpread";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col">
      {/* top-right cluster: language leaf + font selector */}
      <div className="fixed right-8 top-6 z-30 flex flex-col items-end gap-3">
        <LanguageLeaf />
        <FontSelector />
      </div>

      {/* top-left tree menu (branch with hanging leaves) */}
      <TreeMenu />

      {/* headline (centered, above the book) */}
      <header className="pt-14 pb-16 text-center">
        <h1 className="font-serif-kr text-5xl font-light tracking-[0.15em] text-ink md:text-6xl">
          낙엽이 피기 전에
        </h1>
        <p className="mt-3 font-serif-display text-sm tracking-[0.4em] text-leaf-deep">
          BEFORE THE LEAVES BLOOM
        </p>
      </header>

      {/* book spread */}
      <section className="flex flex-1 items-start justify-center px-6 pb-20">
        <BookSpread />
      </section>
    </main>
  );
}
