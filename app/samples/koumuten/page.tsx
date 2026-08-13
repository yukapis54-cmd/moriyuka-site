import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Home, Ruler } from "lucide-react";

export const metadata: Metadata = {
  title: "青葉工務店 | 業種別サンプルLP",
  description:
    "地域の工務店・リフォーム会社を想定した、濃紺と木の色で信頼感を出す架空店舗ランディングページです。",
};

const works = [
  { title: "築32年の台所改修", image: "/images/hero.jpg", span: "md:col-span-2" },
  { title: "玄関まわりの断熱工事", image: "/images/about.jpg", span: "" },
  { title: "家族で使う造作棚", image: "/images/island.jpg", span: "" },
];

const strengths = ["現地調査から見積もりまで一貫対応", "小さな修繕も相談しやすい体制", "工事後の点検日まで事前に共有"];

export default function KoumutenSamplePage() {
  return (
    <main className="min-h-screen bg-koumuten-navy text-koumuten-mist">
      <section className="grid min-h-[88svh] md:grid-cols-[0.52fr_0.48fr]">
        <div className="flex flex-col justify-between px-5 py-6 md:px-10 lg:px-16">
          <nav className="flex items-center justify-between text-sm">
            <Link href="/samples" className="font-bold text-koumuten-wood">
              Sample LP
            </Link>
            <span className="text-xs tracking-[0.2em] text-koumuten-mist/55">架空工務店</span>
          </nav>

          <div className="py-20 md:py-24">
            <p className="mb-6 flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-koumuten-wood">
              <Home size={16} />
              LOCAL BUILDER
            </p>
            <h1 className="max-w-xl text-5xl font-bold leading-[1.05] md:text-7xl lg:text-8xl">
              暮らしを直す。
              <br />
              家を育てる。
            </h1>
            <p className="mt-8 max-w-lg text-base leading-8 text-koumuten-mist/70 md:text-lg">
              青葉工務店は、修繕、断熱、間取り変更まで相談できる地域密着の架空工務店です。
              住みながら進める工事も、工程を見える形で案内します。
            </p>
            <a
              href="tel:0000000000"
              className="mt-10 inline-flex items-center gap-3 bg-koumuten-wood px-6 py-4 text-sm font-bold text-koumuten-navy"
            >
              住まいの相談をする
              <ArrowRight size={18} />
            </a>
          </div>

          <div className="grid gap-4 border-t border-koumuten-mist/12 pt-6 sm:grid-cols-3">
            {strengths.map((strength) => (
              <p key={strength} className="flex gap-2 text-xs leading-6 text-koumuten-mist/68">
                <CheckCircle2 size={16} className="mt-1 shrink-0 text-koumuten-wood" />
                {strength}
              </p>
            ))}
          </div>
        </div>

        <div className="relative min-h-[380px] bg-koumuten-wood">
          <Image
            src="/images/hero.jpg"
            alt="青葉工務店の施工イメージ"
            fill
            priority
            className="object-cover opacity-[0.82] mix-blend-luminosity"
            sizes="(max-width: 768px) 100vw, 48vw"
          />
          <div className="absolute bottom-6 left-6 bg-koumuten-navy/92 p-5">
            <p className="text-xs tracking-[0.2em] text-koumuten-wood">AREA</p>
            <p className="mt-2 text-2xl font-bold">半径20kmの家を丁寧に</p>
          </div>
        </div>
      </section>

      <section className="bg-koumuten-mist px-5 py-16 text-koumuten-navy md:px-8 md:py-24">
        <div className="mx-auto max-w-content">
          <div className="grid gap-8 md:grid-cols-[0.72fr_1.28fr] md:items-end">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold tracking-[0.22em] text-koumuten-wood">
                <Ruler size={16} />
                WORKS
              </p>
              <h2 className="mt-4 text-4xl font-bold leading-tight md:text-6xl">
                最近の
                <br />
                施工事例
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-8 text-koumuten-navy/64 md:text-base">
              写真、工期、費用感を整理して載せることで、問い合わせ前の不安を減らします。
              大規模な改修だけでなく、小さな修繕も見せ方を変えて掲載できます。
            </p>
          </div>

          <div className="mt-10 grid auto-rows-[260px] gap-4 md:grid-cols-3">
            {works.map((work) => (
              <article key={work.title} className={`group relative overflow-hidden ${work.span}`}>
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-koumuten-navy/82 via-koumuten-navy/20 to-transparent" />
                <h3 className="absolute bottom-5 left-5 right-5 text-2xl font-bold text-koumuten-mist">
                  {work.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
