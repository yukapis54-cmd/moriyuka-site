import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShoppingBag, Truck } from "lucide-react";
import { Shippori_Mincho } from "next/font/google";

const displayJP = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-komugi-display",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "KOMUGI BAKERY | 商品を売りたいHPサンプル",
  description:
    "架空のパン屋 KOMUGI BAKERY を題材に、購入導線を最優先したホームページ目的別サンプルです。",
};

const products = [
  { name: "朝焼き食パン", price: "680円", image: "/images/hero.jpg", note: "毎朝9時焼き上がり" },
  { name: "発酵バタークロワッサン", price: "360円", image: "/images/about.jpg", note: "6個セットも選べます" },
  { name: "いちじくと胡桃のカンパーニュ", price: "920円", image: "/images/namako.jpg", note: "薄切りで冷凍可" },
  { name: "季節のジャムパン", price: "420円", image: "/images/island.jpg", note: "数量限定" },
];

export default function GoalShopSamplePage() {
  return (
    <main className={`min-h-screen bg-komugi-cream pb-24 text-komugi-ink ${displayJP.variable}`}>
      <section className="mx-auto max-w-content px-5 pb-10 pt-5 md:px-8 md:pb-14">
        <nav className="flex items-center justify-between border-b border-komugi-rust/20 pb-4 text-sm">
          <Link href="/samples" className="font-bold text-komugi-rust">
            Sample LP
          </Link>
          <span className="text-xs font-bold tracking-[0.2em] text-komugi-rust/70">GOAL: SHOP</span>
        </nav>

        <div className="grid gap-7 pt-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div>
            <p className="mb-4 w-fit bg-komugi-rust px-4 py-2 text-xs font-bold tracking-[0.2em] text-komugi-cream">
              KOMUGI BAKERY
            </p>
            <h1 className="font-[family-name:var(--font-komugi-display)] text-4xl font-bold leading-tight md:text-6xl">
              今日届くパンを、
              <br />
              すぐ選べる店頭。
            </h1>
          </div>

          <aside className="border border-komugi-rust/25 bg-white/55 p-5 shadow-sm">
            <div className="flex items-center gap-3 text-komugi-rust">
              <Truck size={20} />
              <p className="text-sm font-bold">5,000円以上で送料無料</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-komugi-ink/70">
              15時までの注文は翌朝発送。冷凍便で、焼きたての香りを閉じ込めて届けます。
            </p>
            <a
              href="#products"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-komugi-rust px-5 py-4 text-sm font-bold text-komugi-cream"
            >
              商品を選ぶ
              <ArrowRight size={18} />
            </a>
          </aside>
        </div>

        <div id="products" className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <article key={product.name} className="border border-komugi-rust/20 bg-komugi-cream">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={product.image}
                  alt={`${product.name}のイメージ`}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              <div className="p-4">
                <h2 className="min-h-[3.6rem] font-[family-name:var(--font-komugi-display)] text-xl font-bold leading-snug">
                  {product.name}
                </h2>
                <p className="mt-2 text-xs leading-6 text-komugi-ink/64">{product.note}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-lg font-bold text-komugi-rust">{product.price}</p>
                  <button className="inline-flex items-center gap-2 bg-komugi-ink px-4 py-3 text-xs font-bold text-komugi-cream">
                    <ShoppingBag size={15} />
                    カートへ
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-komugi-ink px-5 py-12 text-komugi-cream md:px-8 md:py-16">
        <div className="mx-auto grid max-w-content gap-8 md:grid-cols-3">
          {["冷凍便で全国発送", "ギフト包装に対応", "最短翌朝に出荷"].map((item) => (
            <p key={item} className="flex items-center gap-3 text-sm font-bold">
              <CheckCircle2 size={18} className="text-komugi-rust" />
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-content gap-8 md:grid-cols-[0.75fr_1.25fr] md:items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-komugi-rust">SET BOX</p>
            <h2 className="mt-4 font-[family-name:var(--font-komugi-display)] text-4xl font-bold leading-tight md:text-6xl">
              はじめてなら、
              <br />
              朝食箱。
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {["食パン", "クロワッサン", "季節パン"].map((item) => (
              <div key={item} className="border-t border-komugi-rust/25 py-5">
                <p className="font-bold">{item}</p>
                <p className="mt-2 text-sm leading-7 text-komugi-ink/64">迷わず買える定番の詰め合わせに入ります。</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-komugi-rust/20 bg-komugi-cream/95 px-4 py-3 shadow-[0_-8px_24px_rgba(74,55,40,0.12)] backdrop-blur">
        <div className="mx-auto flex max-w-content items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold tracking-[0.16em] text-komugi-rust">ONLINE STORE</p>
            <p className="text-sm font-bold md:text-base">朝食箱 2,980円 / 送料無料まであと2,020円</p>
          </div>
          <a href="#products" className="shrink-0 bg-komugi-rust px-5 py-3 text-sm font-bold text-komugi-cream">
            購入へ
          </a>
        </div>
      </div>
    </main>
  );
}
