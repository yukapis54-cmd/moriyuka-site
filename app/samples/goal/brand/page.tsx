import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Quote } from "lucide-react";
import { Shippori_Mincho } from "next/font/google";

const displayJP = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-komugi-display",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "KOMUGI BAKERY | 世界観を伝えたいHPサンプル",
  description:
    "架空のパン屋 KOMUGI BAKERY を題材に、写真と余白でブランドの世界観を伝えるホームページ目的別サンプルです。",
};

const works = [
  { name: "朝の山型食パン", image: "/images/about.jpg" },
  { name: "季節果実のブリオッシュ", image: "/images/namako.jpg" },
  { name: "日曜日のカンパーニュ", image: "/images/island.jpg" },
];

export default function GoalBrandSamplePage() {
  return (
    <main className={`min-h-screen bg-komugi-cream text-komugi-ink ${displayJP.variable}`}>
      <section className="mx-auto max-w-content px-5 pb-16 pt-5 md:px-8 md:pb-24">
        <nav className="flex items-center justify-between border-b border-komugi-rust/20 pb-4 text-sm">
          <Link href="/samples" className="font-bold text-komugi-rust">
            Sample LP
          </Link>
          <span className="text-xs font-bold tracking-[0.2em] text-komugi-rust/70">GOAL: BRAND</span>
        </nav>

        <div className="pt-10 md:pt-16">
          <p className="mb-5 text-xs font-bold tracking-[0.24em] text-komugi-rust">KOMUGI BAKERY</p>
          <h1 className="max-w-4xl font-[family-name:var(--font-komugi-display)] text-5xl font-bold leading-[1.08] md:text-8xl">
            朝の光を、
            <br />
            パンに残す。
          </h1>
        </div>

        <div className="relative mt-10 aspect-[4/5] overflow-hidden md:mt-14 md:aspect-[16/8]">
          <Image src="/images/hero.jpg" alt="KOMUGI BAKERY のパンと朝の食卓" fill priority className="object-cover" sizes="100vw" />
        </div>
      </section>

      <section className="px-5 py-10 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-content gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <p className="font-[family-name:var(--font-komugi-display)] text-3xl font-bold leading-relaxed md:text-5xl">
            派手なパンより、
            <br />
            毎朝の食卓に戻ってくるパンを。
          </p>
          <p className="max-w-xl text-base leading-9 text-komugi-ink/68">
            KOMUGI BAKERY は、小麦の香り、焼き色、手に持ったときの重さを大切にする小さなベーカリーです。
            言葉は少なく、手の跡が残る写真で、店の考え方を伝えます。
          </p>
        </div>
      </section>

      <section className="px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-content gap-5 md:grid-cols-3">
          {works.map((work) => (
            <article key={work.name}>
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image src={work.image} alt={`${work.name}の作品写真`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <h2 className="mt-5 font-[family-name:var(--font-komugi-display)] text-2xl font-bold">{work.name}</h2>
              <p className="mt-2 text-xs font-bold tracking-[0.18em] text-komugi-rust">WORK</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-komugi-ink px-5 py-16 text-komugi-cream md:px-8 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Quote className="mx-auto text-komugi-rust" size={30} />
          <p className="mt-8 font-[family-name:var(--font-komugi-display)] text-3xl font-bold leading-relaxed md:text-5xl">
            焼き上がりの音を聞いて、今日の表情を決めています。
          </p>
          <p className="mt-7 text-sm leading-8 text-komugi-cream/68">KOMUGI BAKERY 店主</p>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-content gap-8 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <div className="relative aspect-[5/3] overflow-hidden">
            <Image src="/images/island.jpg" alt="KOMUGI BAKERY の制作風景" fill className="object-cover" sizes="(max-width: 768px) 100vw, 58vw" />
          </div>
          <p className="text-base leading-9 text-komugi-ink/68">
            粉を量る、発酵を待つ、窯の前で少しだけ立ち止まる。制作風景を広く見せることで、商品説明では届きにくい温度を伝えます。
          </p>
        </div>
      </section>
    </main>
  );
}
