import { BookOpen } from "lucide-react";

const guides = [
  {
    title: "脱サラ女がSNS0→1万フォロワーにした方法",
    desc: "ゼロから始めて1万フォロワーに到達するまでに実践した発信戦略をまとめました。",
  },
  {
    title: "ECサイト立ち上げ完全ロードマップ",
    desc: "個人がECサイトを立ち上げるための手順と、つまずきポイントを実体験ベースで解説。",
  },
  {
    title: "LINE公式 0→250人達成の全施策",
    desc: "無料クーポン施策など、LINE公式の登録者を一気に伸ばすための具体策。",
  },
];

export default function FreeGuides() {
  return (
    <section id="guides" className="section bg-ocean-50/40">
      <div className="container-base">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-medium tracking-widest text-sand-600">
            FREE GUIDES
          </p>
          <h2 className="section-title">無料でダウンロードできるガイド</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {guides.map((g) => (
            <article
              key={g.title}
              className="flex flex-col rounded-2xl border border-ocean-100 bg-white p-6 shadow-sm transition hover:shadow-md md:p-8"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ocean-100 text-ocean-700">
                <BookOpen size={20} />
              </div>
              <h3 className="text-base font-bold text-ocean-950 md:text-lg">
                {g.title}
              </h3>
              <p className="mt-3 flex-grow text-sm leading-relaxed text-ocean-800">
                {g.desc}
              </p>
              <div className="mt-6">
                <a href="#newsletter" className="btn-accent w-full md:w-auto">
                  無料で受け取る
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
