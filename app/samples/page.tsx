import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Hammer, Scissors, Utensils } from "lucide-react";

export const metadata: Metadata = {
  title: "業種別サンプルLP一覧 | Web制作サンプル",
  description:
    "飲食店、美容室、工務店向けに作成した架空店舗のランディングページサンプル一覧です。",
};

const samples = [
  {
    href: "/samples/restaurant",
    title: "島の小さな食堂・定食屋",
    description: "大きな料理写真と手書き感のある温度で、今日食べたい理由を伝えるLP。",
    icon: Utensils,
    className: "bg-restaurant-cream text-restaurant-ink ring-restaurant-rust/18",
    accent: "text-restaurant-rust",
  },
  {
    href: "/samples/salon",
    title: "個人経営の美容室",
    description: "白い余白、細い線、小さな言葉で、静かな信頼感を見せるLP。",
    icon: Scissors,
    className: "bg-salon-white text-salon-ink ring-salon-line",
    accent: "text-salon-ink/55",
  },
  {
    href: "/samples/koumuten",
    title: "地域の工務店・リフォーム",
    description: "濃紺と木の色で、施工実績と相談しやすさを前面に出すLP。",
    icon: Hammer,
    className: "bg-koumuten-navy text-koumuten-mist ring-koumuten-wood/35",
    accent: "text-koumuten-wood",
  },
];

export default function SamplesPage() {
  return (
    <main className="min-h-screen bg-white px-5 py-12 text-ocean-950 md:px-8 md:py-20">
      <section className="mx-auto max-w-content">
        <p className="text-xs font-bold tracking-[0.24em] text-ocean-700">SAMPLE LANDING PAGES</p>
        <div className="mt-5 max-w-3xl">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            業種ごとに見え方を変えた、営業用サンプルLP。
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-ocean-950/68 md:text-lg">
            架空店舗を題材に、写真の置き方、余白、色の強さを変えた3つのサンプルです。
            提案先の業種に近い見え方を選んで確認できます。
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {samples.map((sample) => {
            const Icon = sample.icon;

            return (
              <Link
                key={sample.href}
                href={sample.href}
                className={`${sample.className} group flex min-h-[300px] flex-col justify-between rounded-lg p-6 ring-1 transition duration-200 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <Icon size={30} className={sample.accent} strokeWidth={1.6} />
                    <ArrowUpRight
                      size={22}
                      className={`${sample.accent} transition group-hover:translate-x-1 group-hover:-translate-y-1`}
                    />
                  </div>
                  <h2 className="mt-10 text-2xl font-bold leading-snug">{sample.title}</h2>
                </div>
                <p className="mt-8 text-sm leading-7 opacity-[0.72]">{sample.description}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
