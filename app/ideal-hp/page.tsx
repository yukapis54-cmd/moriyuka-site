import type { Metadata } from "next";
import Link from "next/link";
import { Kaisei_Decol, Noto_Serif_JP, Shippori_Mincho, Yuji_Syuku } from "next/font/google";
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
// 空気感ごとの見出し書体。書体が変わるだけで印象が変わることを、診断の中で体験してもらう。
// next/font は使う文字だけを切り出して配信するので、日本語でも重くならない。
const waJP = Yuji_Syuku({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-wa-jp",
  display: "swap",
  preload: false,
});
const sweetJP = Kaisei_Decol({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sweet-jp",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "あなたの理想のHPは？ | 30秒デザイン診断",
  description:
    "7つの質問に答えるだけで、あなたの理想のホームページのイメージ画像がその場で完成。画像はダウンロードして制作の相談にそのまま使えます。",
};

export default function IdealHpPage() {
  return (
    <main className={`min-h-screen bg-white ${serifJP.variable} ${displayJP.variable} ${waJP.variable} ${sweetJP.variable}`}>
      <section className="border-b border-slate-100 bg-gradient-to-b from-ocean-50 to-white">
        <div className="mx-auto w-full max-w-3xl px-5 py-14 text-center">
          <p className="text-xs font-semibold tracking-widest text-ocean-600">DESIGN DIAGNOSIS</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
            あなたの理想のHPは？
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
            選んでいくだけ。7問で、あなたのイメージにいちばん近いホームページの
            <br className="hidden sm:block" />
            完成イメージ画像がその場でできあがります。
          </p>
        </div>
      </section>

      <IdealHpBuilder />

      {/* 診断で終わらせない。ここまで分かった人が次に困るのは「で、誰が作るのか」 */}
      <section className="border-t border-slate-100 bg-gradient-to-b from-white to-ocean-50">
        <div className="mx-auto w-full max-w-3xl px-5 py-16">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
            イメージは決まりました。あとは「誰が作るか」だけです。
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            ここまでで、作りたい形と、その部品の名前と、AIへの頼み方が手に入りました。
            ただ実際に公開するには、この先がまだ残っています。
          </p>
          <ul className="mt-5 space-y-2 text-sm leading-relaxed text-slate-600">
            {[
              "自分の商品の写真を撮る（なんとなく撮らず、構図を決めてから撮る。ストック写真のままでは売れません）",
              "自分の言葉で文章を書く（AIが書いた文章は、読めばわかります）",
              "ドメインとサーバーを用意して、公開して、動き続ける状態にする",
              "問い合わせや注文が届く導線をつなぐ",
            ].map((t) => (
              <li key={t} className="flex gap-2">
                <span className="mt-[3px] text-ocean-500">—</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-relaxed text-slate-600">
            いまはAIで、それらしい画面がいくらでも作れます。ただ実際にやってみると分かりますが、
            大変なのは作ることではなく、<strong className="font-semibold text-slate-800">お客さんに出せる状態まで持っていくこと</strong>
            です。文字の揃え、写真の差し替え、スマホでの見え方、表示の速さ。ここに時間がかかります。
          </p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            自分でやるなら、この診断結果とAIへの指示文がそのまま設計図になります。
            人に頼むなら、ダウンロードした画像を見せるだけで話が早く済みます。
            どちらでも、迷ったら聞いてください。
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="rounded-xl bg-ocean-600 px-6 py-3 text-sm font-semibold text-white hover:bg-ocean-700"
            >
              この画像を見せて相談する
            </Link>
            <Link
              href="/sample-lp"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              実際に作ったページを見る
            </Link>
            <Link
              href="/#newsletter"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              作り方をメールで受け取る
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-3xl px-5 py-10 text-center">
        <Link href="/" className="text-sm text-slate-500 underline hover:text-slate-800">
          ← トップページに戻る
        </Link>
      </div>
    </main>
  );
}
