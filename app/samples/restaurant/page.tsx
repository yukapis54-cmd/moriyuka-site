import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Menu, Phone } from "lucide-react";
import { Shippori_Mincho } from "next/font/google";

const displayJP = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-restaurant-display",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "島凪食堂 | 業種別サンプルLP",
  description:
    "島の小さな食堂・定食屋を想定した、温かみのある架空店舗ランディングページです。",
};

const menuItems = [
  { name: "島魚の煮つけ定食", price: "1,180円", note: "甘辛い煮汁と小鉢二品" },
  { name: "港のから揚げ定食", price: "980円", note: "昼の定番。ごはん大盛り可" },
  { name: "季節の海藻小鉢", price: "420円", note: "その日の仕入れで少しずつ" },
  { name: "島の晩酌セット", price: "1,480円", note: "小皿三品と温かい汁物" },
];

export default function RestaurantSamplePage() {
  return (
    <main className={`min-h-screen bg-restaurant-cream text-restaurant-ink ${displayJP.variable}`}>
      <section className="mx-auto grid min-h-[88svh] max-w-content gap-8 px-5 pb-12 pt-6 md:grid-cols-[0.95fr_1.05fr] md:px-8 md:pb-20 md:pt-10">
        <div className="flex flex-col justify-between gap-12">
          <nav className="flex items-center justify-between border-b border-restaurant-rust/20 pb-4 text-sm">
            <Link href="/samples" className="font-bold text-restaurant-rust">
              Sample LP
            </Link>
            <span className="text-xs tracking-[0.18em] text-restaurant-rust/72">架空店舗</span>
          </nav>
          <div>
            <p className="mb-5 w-fit bg-restaurant-rust px-4 py-2 text-xs font-bold tracking-[0.2em] text-restaurant-cream">
              HARBOR DINER
            </p>
            <h1 className="font-[family-name:var(--font-restaurant-display)] text-[4rem] font-bold leading-[0.98] text-restaurant-rust sm:text-7xl lg:text-8xl">
              島凪
              <br />
              食堂
            </h1>
            <p className="mt-7 max-w-md text-base leading-8 text-restaurant-ink/72 md:text-lg">
              港から歩いて三分。炊きたてのごはんと、今日の魚でつくる定食を用意して待っています。
            </p>
          </div>
          <div className="grid gap-3 text-sm text-restaurant-ink/72 sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <MapPin size={17} className="text-restaurant-rust" />
              海辺通り2-4-1
            </p>
            <p className="flex items-center gap-2">
              <Phone size={17} className="text-restaurant-rust" />
              11:00-20:00 / 水曜休み
            </p>
          </div>
        </div>

        <div className="relative min-h-[420px] overflow-hidden md:min-h-full">
          <Image
            src="/images/namako.jpg"
            alt="島凪食堂の小皿料理"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 54vw"
          />
          <div className="absolute bottom-5 left-5 max-w-[240px] bg-restaurant-cream px-5 py-4 shadow-lg">
            <p className="text-xs font-bold tracking-[0.18em] text-restaurant-rust">TODAY</p>
            <p className="mt-2 font-[family-name:var(--font-restaurant-display)] text-2xl font-bold">
              本日の小鉢つき定食
            </p>
          </div>
        </div>
      </section>

      <section className="bg-restaurant-rust px-5 py-14 text-restaurant-cream md:px-8 md:py-20">
        <div className="mx-auto grid max-w-content gap-10 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.22em]">
              <Menu size={16} />
              MENU
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-restaurant-display)] text-4xl font-bold leading-tight md:text-6xl">
              迷ったら、
              <br />
              定食で。
            </h2>
          </div>
          <div className="grid gap-4">
            {menuItems.map((item) => (
              <div key={item.name} className="grid gap-2 border-t border-restaurant-cream/22 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline">
                <h3 className="font-[family-name:var(--font-restaurant-display)] text-2xl font-bold">
                  {item.name}
                </h3>
                <p className="text-lg font-bold">{item.price}</p>
                <p className="text-sm leading-7 text-restaurant-cream/72 sm:col-span-2">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-content gap-10 md:grid-cols-[1.15fr_0.85fr] md:items-center">
          <div className="relative aspect-[5/3] overflow-hidden">
            <Image
              src="/images/island.jpg"
              alt="島凪食堂の近くにある港"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 58vw"
            />
          </div>
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-restaurant-rust">ABOUT</p>
            <h2 className="mt-4 font-[family-name:var(--font-restaurant-display)] text-4xl font-bold leading-tight md:text-6xl">
              観光の日も、
              <br />
              いつもの昼も。
            </h2>
            <p className="mt-6 text-base leading-8 text-restaurant-ink/72">
              一人でも入りやすく、家族でも腰を落ち着けられる食堂です。派手な料理より、
              ちゃんと温かくて、また食べたくなる一皿を大切にしています。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
