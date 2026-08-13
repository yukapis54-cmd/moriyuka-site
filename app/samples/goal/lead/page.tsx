import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageSquareText, Phone, Send } from "lucide-react";
import { Shippori_Mincho } from "next/font/google";

const displayJP = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-komugi-display",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "KOMUGI BAKERY | 問い合わせを増やしたいHPサンプル",
  description:
    "架空のパン屋 KOMUGI BAKERY を題材に、相談フォームと電話導線を優先したホームページ目的別サンプルです。",
};

const steps = ["内容を送る", "当日中に返信", "受け取り方法を決定"];
const faqs = [
  ["何日前までに相談できますか", "通常は3日前まで、30個以上の注文は1週間前までにご相談ください。"],
  ["配達はできますか", "店舗から車で20分圏内は配達できます。遠方は冷凍便をご案内します。"],
  ["法人名の領収書は出せますか", "発行できます。フォームの相談内容に宛名を記入してください。"],
];

export default function GoalLeadSamplePage() {
  return (
    <main className={`min-h-screen bg-komugi-cream text-komugi-ink ${displayJP.variable}`}>
      <section id="contact" className="mx-auto max-w-content px-5 pb-12 pt-5 md:px-8 md:pb-16">
        <nav className="flex items-center justify-between border-b border-komugi-rust/20 pb-4 text-sm">
          <Link href="/samples" className="font-bold text-komugi-rust">
            Sample LP
          </Link>
          <span className="text-xs font-bold tracking-[0.2em] text-komugi-rust/70">GOAL: LEAD</span>
        </nav>

        <div className="grid gap-8 pt-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div>
            <p className="mb-4 w-fit bg-komugi-rust px-4 py-2 text-xs font-bold tracking-[0.2em] text-komugi-cream">
              KOMUGI BAKERY
            </p>
            <h1 className="font-[family-name:var(--font-komugi-display)] text-4xl font-bold leading-tight md:text-6xl">
              まとまったパンの相談を、
              <br />
              すぐ受け付けます。
            </h1>
            <a href="tel:0000000000" className="mt-7 flex w-fit items-center gap-3 text-3xl font-bold text-komugi-rust md:text-5xl">
              <Phone size={30} />
              000-0000-0000
            </a>
            <p className="mt-4 max-w-lg text-sm leading-7 text-komugi-ink/68">
              イベント、差し入れ、店舗用の定期納品まで。決まっていない段階でも、必要な数と日時から一緒に整理します。
            </p>
          </div>

          <form className="border border-komugi-rust/25 bg-white/60 p-5 shadow-sm md:p-7">
            <div className="flex items-center gap-3 text-komugi-rust">
              <MessageSquareText size={21} />
              <h2 className="font-[family-name:var(--font-komugi-display)] text-2xl font-bold">相談フォーム</h2>
            </div>
            <div className="mt-5 grid gap-4">
              <label className="grid gap-2 text-sm font-bold">
                お名前
                <input className="min-h-12 border border-komugi-rust/25 bg-komugi-cream px-4 font-normal outline-none" placeholder="例: 山田 花子" />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                連絡先
                <input className="min-h-12 border border-komugi-rust/25 bg-komugi-cream px-4 font-normal outline-none" placeholder="電話番号またはメール" />
              </label>
              <label className="grid gap-2 text-sm font-bold">
                相談内容
                <textarea className="min-h-28 resize-none border border-komugi-rust/25 bg-komugi-cream px-4 py-3 font-normal outline-none" placeholder="必要な数、希望日、用途など" />
              </label>
            </div>
            <button className="mt-5 inline-flex w-full items-center justify-center gap-2 bg-komugi-rust px-5 py-4 text-sm font-bold text-komugi-cream">
              相談を送る
              <Send size={17} />
            </button>
          </form>
        </div>
      </section>

      <section className="bg-komugi-ink px-5 py-12 text-komugi-cream md:px-8 md:py-16">
        <div className="mx-auto grid max-w-content gap-5 md:grid-cols-4">
          {["法人納品 120件", "最短当日返信", "小口20個から", "定期便対応"].map((item) => (
            <p key={item} className="border-t border-komugi-cream/20 pt-4 text-xl font-bold">
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="px-5 py-14 md:px-8 md:py-20">
        <div className="mx-auto grid max-w-content gap-10 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-bold tracking-[0.22em] text-komugi-rust">FLOW</p>
            <h2 className="mt-4 font-[family-name:var(--font-komugi-display)] text-4xl font-bold leading-tight md:text-6xl">
              相談後の
              <br />
              流れ
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="border border-komugi-rust/20 p-5">
                <p className="text-sm font-bold text-komugi-rust">STEP {index + 1}</p>
                <p className="mt-5 font-[family-name:var(--font-komugi-display)] text-2xl font-bold">{step}</p>
                <p className="mt-3 text-sm leading-7 text-komugi-ink/64">必要な確認だけを短く行い、迷いやすい数量と受け取り方法を決めます。</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 md:px-8 md:pb-24">
        <div className="mx-auto grid max-w-content gap-8 md:grid-cols-[1fr_1fr] md:items-start">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image src="/images/hero.jpg" alt="KOMUGI BAKERY の店頭" fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
          </div>
          <div className="grid gap-3">
            {faqs.map(([question, answer]) => (
              <details key={question} className="border-t border-komugi-rust/20 py-4">
                <summary className="cursor-pointer font-bold">{question}</summary>
                <p className="mt-3 text-sm leading-7 text-komugi-ink/64">{answer}</p>
              </details>
            ))}
            <a href="#contact" className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-komugi-rust">
              フォームに戻る
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
        <div className="mx-auto mt-10 grid max-w-content gap-4 sm:grid-cols-3">
          {["/images/about.jpg", "/images/namako.jpg", "/images/island.jpg"].map((src) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden">
              <Image src={src} alt="KOMUGI BAKERY の相談事例写真" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
