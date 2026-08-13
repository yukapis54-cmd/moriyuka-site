import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Bell, Instagram, Mail, MessageCircle, Music2 } from "lucide-react";
import { Shippori_Mincho } from "next/font/google";

const displayJP = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-komugi-display",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "KOMUGI BAKERY | ファンを集めたいHPサンプル",
  description:
    "架空のパン屋 KOMUGI BAKERY を題材に、LINE・メルマガ・SNS登録を主役にしたホームページ目的別サンプルです。",
};

const updates = [
  "金曜日限定の塩バターあんぱんを焼きます",
  "来月のパン教室、先行案内を配信しました",
  "雨の日はLINE登録者に小さな焼き菓子を添えます",
];

const channels = [
  { name: "LINE", note: "限定パンと取り置き案内", icon: MessageCircle },
  { name: "MAIL", note: "月2回の読みものと先行予約", icon: Mail },
  { name: "SNS", note: "焼き上がりの写真と日々の記録", icon: Instagram },
];

export default function GoalFanSamplePage() {
  return (
    <main className={`min-h-screen bg-komugi-cream text-komugi-ink ${displayJP.variable}`}>
      <section className="mx-auto max-w-content px-5 pb-12 pt-5 md:px-8 md:pb-16">
        <nav className="flex items-center justify-between border-b border-komugi-rust/20 pb-4 text-sm">
          <Link href="/samples" className="font-bold text-komugi-rust">
            Sample LP
          </Link>
          <span className="text-xs font-bold tracking-[0.2em] text-komugi-rust/70">GOAL: FAN</span>
        </nav>

        <div className="grid gap-8 pt-8 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="mb-4 w-fit bg-komugi-rust px-4 py-2 text-xs font-bold tracking-[0.2em] text-komugi-cream">
              KOMUGI BAKERY
            </p>
            <h1 className="font-[family-name:var(--font-komugi-display)] text-4xl font-bold leading-tight md:text-7xl">
              次の焼き上がりを、
              <br />
              待つ人へ。
            </h1>
            <p className="mt-6 max-w-lg text-base leading-8 text-komugi-ink/68">
              売り切れの日も、店に来られない日も、また思い出してもらうための登録導線を先に見せます。
            </p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src="/images/hero.jpg" alt="KOMUGI BAKERY の焼き上がり" fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 52vw" />
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {channels.map((channel) => {
            const Icon = channel.icon;

            return (
              <a key={channel.name} href="#register" className="group border border-komugi-rust/20 bg-white/55 p-5 transition hover:-translate-y-1 hover:shadow-lg">
                <Icon size={26} className="text-komugi-rust" />
                <h2 className="mt-6 font-[family-name:var(--font-komugi-display)] text-3xl font-bold">{channel.name}</h2>
                <p className="mt-3 text-sm leading-7 text-komugi-ink/64">{channel.note}</p>
              </a>
            );
          })}
        </div>
      </section>

      <section id="register" className="bg-komugi-ink px-5 py-12 text-komugi-cream md:px-8 md:py-16">
        <div className="mx-auto grid max-w-content gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-komugi-rust">
              <Bell size={16} />
              REGISTER
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-komugi-display)] text-4xl font-bold leading-tight md:text-6xl">
              登録特典は、
              <br />
              先に知れること。
            </h2>
          </div>
          <div className="grid gap-3">
            {["限定パンの販売日", "イベントの先行予約", "雨の日の小さな特典"].map((benefit) => (
              <p key={benefit} className="border-t border-komugi-cream/20 py-4 text-lg font-bold">
                {benefit}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-content gap-10 md:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-komugi-rust">NEWS</p>
            <h2 className="mt-4 font-[family-name:var(--font-komugi-display)] text-4xl font-bold leading-tight md:text-6xl">
              また来る
              <br />
              理由
            </h2>
          </div>
          <div className="grid gap-0">
            {updates.map((update) => (
              <article key={update} className="grid gap-3 border-t border-komugi-rust/20 py-5 sm:grid-cols-[120px_1fr]">
                <p className="text-xs font-bold tracking-[0.16em] text-komugi-rust">UPDATE</p>
                <p className="text-base font-bold leading-7">{update}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 md:px-8 md:pb-24">
        <div className="mx-auto grid max-w-content gap-5 md:grid-cols-4">
          {[
            ["LINE登録", "2,400人"],
            ["メルマガ", "月2回"],
            ["Instagram", "8,600 followers"],
            ["イベント", "年18回"],
          ].map(([label, value]) => (
            <div key={label} className="border-t border-komugi-rust/25 pt-5">
              <p className="text-xs font-bold tracking-[0.18em] text-komugi-rust">{label}</p>
              <p className="mt-3 font-[family-name:var(--font-komugi-display)] text-3xl font-bold">{value}</p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 grid max-w-content gap-4 sm:grid-cols-3">
          {["/images/about.jpg", "/images/namako.jpg", "/images/island.jpg"].map((src) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden">
              <Image src={src} alt="KOMUGI BAKERY の発信写真" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
          ))}
        </div>
      </section>

      <div className="sticky bottom-0 border-t border-komugi-rust/20 bg-komugi-cream/96 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-content items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-sm font-bold">
            <Music2 size={17} className="text-komugi-rust" />
            焼き上がりの知らせを受け取る
          </p>
          <a href="#register" className="bg-komugi-rust px-5 py-3 text-sm font-bold text-komugi-cream">
            登録
          </a>
        </div>
      </div>
    </main>
  );
}
