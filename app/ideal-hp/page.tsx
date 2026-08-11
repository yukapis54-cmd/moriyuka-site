import type { Metadata } from "next";
import Link from "next/link";
import { Noto_Serif_JP, Shippori_Mincho } from "next/font/google";
import IdealHpBuilder from "@/components/IdealHpBuilder";

// 完成イメージの見出しに使う明朝。これがあるだけで「素人のワイヤー」感が消える。
// 日本語グリフが必要なので japanese サブセットを明示する（latin だけだと明朝にならない）
const serifJP = Noto_Serif_JP({
  subsets: ["latin"], // CJK は Google が unicode-range で自動分割配信するため latin 指定で足りる
  weight: ["400", "500"],
  variable: "--font-serif-jp",
  display: "swap",
  preload: false,
});
const displayJP = Shippori_Mincho({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display-jp",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "あなたの理想のHPは？ | 30秒デザイン診断",
  description:
    "6つの質問に答えるだけで、あなたの理想のホームページのイメージ画像がその場で完成。画像はダウンロードして制作の相談にそのまま使えます。",
};

export default function IdealHpPage() {
  return (
    <main className={`min-h-screen bg-white ${serifJP.variable} ${displayJP.variable}`}>
      <section className="border-b border-slate-100 bg-gradient-to-b from-ocean-50 to-white">
        <div className="mx-auto w-full max-w-3xl px-5 py-14 text-center">
          <p className="text-xs font-semibold tracking-widest text-ocean-600">DESIGN DIAGNOSIS</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            あなたの理想のHPは？
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            選んでいくだけ。6問で、あなたのイメージにいちばん近いホームページの
            <br className="hidden sm:block" />
            完成イメージ画像がその場でできあがります。
          </p>
        </div>
      </section>

      <IdealHpBuilder />

      <div className="mx-auto w-full max-w-3xl px-5 pb-16 text-center">
        <Link href="/" className="text-sm text-slate-500 underline hover:text-slate-800">
          ← トップページに戻る
        </Link>
      </div>
    </main>
  );
}
