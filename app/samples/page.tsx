import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Hammer, Scissors, Utensils } from "lucide-react";

export const metadata: Metadata = {
  title: "業種別サンプルLP一覧 | Web制作サンプル",
  description:
    "飲食店・美容室・工務店の業種別、および目的別に作成した架空店舗のランディングページサンプル一覧です。",
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

/**
 * 同じ店・同じ配色のまま、目的だけを変えた4本。
 * 業種で見せると雰囲気の違いに目が行くので、目的の違いはこちらで見せる。
 */
const goals = [
  { href: "/samples/goal/shop", title: "商品を売りたい", description: "商品を最上部に。価格・カート・追従する購入バー" },
  { href: "/samples/goal/lead", title: "問い合わせを増やしたい", description: "電話番号と3項目のフォームを早い位置に" },
  { href: "/samples/goal/brand", title: "世界観を伝えたい", description: "大きな写真と余白。商品は並べず、価格も出さない" },
  { href: "/samples/goal/fan", title: "ファンを集めたい", description: "LINE・メルマガ・更新情報で、また来る理由を作る" },
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

        {/* 業種ではなく「目的」で構造がどう変わるかを見せる面 */}
        <div className="mt-20 border-t border-ocean-950/10 pt-12">
          <h2 className="text-2xl font-bold leading-tight md:text-4xl">
            同じお店でも、目的が変われば構造が変わる。
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-ocean-950/68">
            架空のパン屋を題材に、配色も写真もそのままで、目的だけを変えた4本です。
            並べて見ると、置くべきものと置く順番が目的で決まることが分かります。
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {goals.map((g) => (
              <Link
                key={g.href}
                href={g.href}
                className="group flex flex-col justify-between rounded-lg bg-ocean-50 p-5 ring-1 ring-ocean-950/10 transition duration-200 hover:-translate-y-1 hover:bg-white hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold leading-snug">{g.title}</h3>
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 text-ocean-600 transition group-hover:translate-x-1 group-hover:-translate-y-1"
                  />
                </div>
                <p className="mt-6 text-sm leading-7 text-ocean-950/70">{g.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
