import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Gift, PackageCheck, ShoppingBag, Sparkles } from "lucide-react";
import { Shippori_Mincho } from "next/font/google";

const displayJP = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display-jp",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "天然なまこ産直 | もりゆか",
  description:
    "愛媛の離島の家業「もりゆか」から、瀬戸内の天然なまこを産地直送。贈答用にも選びやすい通販ランディングページです。",
};

const promises = [
  {
    title: "島で見て選ぶ",
    text: "水揚げ後の状態を一つひとつ確認し、贈りものに出せるものだけを丁寧に仕分けます。",
  },
  {
    title: "食べやすく整える",
    text: "下処理の手間を減らし、こりっとした歯ざわりと磯の香りを家庭で楽しめる形に整えます。",
  },
  {
    title: "産地からまっすぐ",
    text: "愛媛の離島から冷蔵便で発送。作り手の顔が見える小さな家業としてお届けします。",
  },
];

const voices = [
  "父の誕生日に贈りました。珍しさだけでなく、食卓で話が弾む贈りものになりました。",
  "硬すぎず、香りがきれいでした。年末の集まりに出したらすぐになくなりました。",
  "作っている人の顔が見えるので、目上の方への贈答にも安心して選べました。",
];

export default function SampleLpPage() {
  return (
    <main className={`min-h-screen bg-namako-black text-namako-ivory ${displayJP.variable}`}>
      <section className="relative isolate min-h-[92svh] overflow-hidden">
        <Image
          src="/images/hero.jpg"
          alt="愛媛の離島から届ける天然なまこ"
          fill
          priority
          className="object-cover object-center opacity-[0.55]"
          sizes="100vw"
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-namako-black/35 via-namako-black/55 to-namako-black" />
        <div className="relative z-10 mx-auto flex min-h-[92svh] w-full max-w-content flex-col justify-end px-5 pb-14 pt-20 md:px-8 md:pb-20">
          <p className="mb-5 w-fit border-l-2 border-namako-gold pl-4 text-xs font-semibold tracking-[0.28em] text-namako-gold">
            EHIME ISLAND DIRECT
          </p>
          <div className="relative max-w-[760px]">
            <h1 className="relative z-0 -ml-3 font-[family-name:var(--font-display-jp)] text-[4.2rem] font-bold leading-[0.95] tracking-normal text-namako-ivory/95 sm:text-8xl lg:text-[8.8rem]">
              天然
              <br />
              なまこ
            </h1>
            <div className="pointer-events-none absolute -right-8 top-8 z-10 h-[58%] w-[42%] overflow-hidden border border-namako-gold/45 opacity-[0.85] sm:w-[34%] md:h-[76%]">
              <Image
                src="/images/namako.jpg"
                alt="贈答用に整えた天然なまこ"
                fill
                className="object-cover"
                sizes="260px"
              />
            </div>
            <p className="relative z-20 mt-6 max-w-md text-base leading-8 text-namako-ivory/82 md:mt-8 md:text-lg">
              愛媛の離島の家業「もりゆか」から、瀬戸内で育った天然なまこを産地直送。
              大切な方へ、派手さより確かさが残る一品を。
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="https://setouchi-seafood.com/products/namako"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-namako-gold px-7 py-4 text-sm font-bold text-namako-black transition hover:opacity-90"
            >
              <ShoppingBag size={18} />
              通販で購入する
            </a>
            <Link
              href="#gift"
              className="inline-flex items-center justify-center border border-namako-ivory/25 px-7 py-4 text-sm font-semibold text-namako-ivory/85 transition hover:border-namako-gold hover:text-namako-gold"
            >
              贈答向けの内容を見る
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-namako-ivory/10 bg-namako-black px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-content gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-namako-gold">THREE PROMISES</p>
            <h2 className="mt-4 font-[family-name:var(--font-display-jp)] text-4xl font-bold leading-tight text-namako-ivory md:text-6xl">
              贈りものに
              <br />
              迷わない、
              <br />
              三つの約束。
            </h2>
          </div>
          <div className="grid gap-4">
            {promises.map((promise, index) => (
              <div key={promise.title} className="border-l border-namako-ivory/14 py-5 pl-6">
                <p className="text-sm text-namako-gold">0{index + 1}</p>
                <h3 className="mt-2 font-[family-name:var(--font-display-jp)] text-2xl font-bold text-namako-ivory">
                  {promise.title}
                </h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-namako-ivory/66 md:text-base">
                  {promise.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gift" className="bg-namako-ivory px-5 py-16 text-namako-black md:px-8 md:py-24">
        <div className="mx-auto grid max-w-content gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/namako.jpg"
              alt="天然なまこの商品写真"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 52vw"
            />
            <div className="absolute bottom-5 left-5 bg-namako-black px-5 py-4 text-namako-ivory">
              <p className="text-xs tracking-[0.22em] text-namako-gold">DIRECT BOX</p>
              <p className="mt-1 font-[family-name:var(--font-display-jp)] text-xl font-bold">天然なまこ 産直便</p>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-namako-gold">PRODUCT</p>
            <h2 className="mt-4 bg-namako-ivory/92 py-3 font-[family-name:var(--font-display-jp)] text-4xl font-bold leading-tight md:text-6xl">
              目上の方へ。
              <br />
              食通の方へ。
            </h2>
            <p className="mt-6 max-w-lg text-base leading-8 text-namako-black/72">
              島の冬の味覚を、必要な分だけ使いやすく。酢の物、ぽん酢、酒肴に合わせやすい天然なまこです。
              華美な包装よりも、産地と作り手が伝わる贈りものとしてお届けします。
            </p>
            <dl className="mt-8 grid grid-cols-3 border-y border-namako-black/15 py-5 text-sm">
              <div>
                <dt className="text-namako-black/48">産地</dt>
                <dd className="mt-1 font-semibold">愛媛の離島</dd>
              </div>
              <div>
                <dt className="text-namako-black/48">配送</dt>
                <dd className="mt-1 font-semibold">冷蔵便</dd>
              </div>
              <div>
                <dt className="text-namako-black/48">用途</dt>
                <dd className="mt-1 font-semibold">贈答・食卓</dd>
              </div>
            </dl>
            <a
              href="https://setouchi-seafood.com/products/namako"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 bg-namako-gold px-7 py-4 text-sm font-bold text-namako-black transition hover:opacity-90"
            >
              <PackageCheck size={18} />
              商品ページへ進む
            </a>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-content gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div className="relative z-10 md:pb-10">
            <p className="text-xs font-semibold tracking-[0.28em] text-namako-gold">MAKER</p>
            <h2 className="mt-4 font-[family-name:var(--font-display-jp)] text-4xl font-bold leading-tight md:text-6xl">
              島に戻り、
              <br />
              家業を継ぐ。
            </h2>
            <p className="mt-6 max-w-md text-base leading-8 text-namako-ivory/68">
              もりゆかは、愛媛の離島で続く家業のなまこを全国へ届けるために立ち上げた小さな産直の窓口です。
              仕入れて売るだけではなく、島の暮らし、海の状態、作り手の手元まで見える形でお届けします。
            </p>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden md:aspect-[5/4]">
            <Image
              src="/images/about.jpg"
              alt="もりゆかの作り手"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 56vw"
            />
            <Image
              src="/images/island.jpg"
              alt="愛媛の離島の海"
              width={260}
              height={195}
              className="absolute -bottom-1 -left-1 hidden border border-namako-gold/45 object-cover md:block"
            />
          </div>
        </div>
      </section>

      <section className="bg-namako-black px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-content">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.28em] text-namako-gold">VOICES</p>
            <h2 className="mt-4 font-[family-name:var(--font-display-jp)] text-4xl font-bold leading-tight md:text-6xl">
              選ばれている理由は、
              <br />
              食卓に残ること。
            </h2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {voices.map((voice) => (
              <figure key={voice} className="border border-namako-ivory/12 p-6">
                <Sparkles size={18} className="text-namako-gold" />
                <blockquote className="mt-5 text-sm leading-7 text-namako-ivory/72">
                  「{voice}」
                </blockquote>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="relative mx-auto max-w-content overflow-hidden bg-namako-ivory px-6 py-12 text-namako-black md:px-12 md:py-16">
          <Image
            src="/images/island.jpg"
            alt="天然なまこを届ける島の風景"
            fill
            className="object-cover opacity-[0.18] mix-blend-multiply"
            sizes="100vw"
          />
          <div className="relative z-10 max-w-2xl">
            <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.28em] text-namako-gold">
              <Gift size={16} />
              GIFT ORDER
            </p>
            <h2 className="mt-4 font-[family-name:var(--font-display-jp)] text-4xl font-bold leading-tight md:text-6xl">
              今年の贈りものは、
              <br />
              島から直送で。
            </h2>
            <p className="mt-6 text-base leading-8 text-namako-black/72">
              熨斗や到着日の希望がある場合は、購入時の備考欄にご記入ください。
              在庫は水揚げ状況に左右されるため、贈答の予定がある方は早めのご注文をおすすめします。
            </p>
            <a
              href="https://setouchi-seafood.com/products/namako"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center justify-center gap-2 bg-namako-gold px-8 py-4 text-sm font-bold text-namako-black transition hover:opacity-90"
            >
              <ShoppingBag size={18} />
              天然なまこを注文する
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-namako-ivory/10 px-5 py-8 text-sm text-namako-ivory/52 md:px-8">
        <div className="mx-auto flex max-w-content flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-[family-name:var(--font-display-jp)] text-lg text-namako-ivory">もりゆか</p>
          <p>愛媛の離島から、天然なまこを産地直送。</p>
        </div>
      </footer>
    </main>
  );
}
