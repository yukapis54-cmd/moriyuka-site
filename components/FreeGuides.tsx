import { BookOpen } from "lucide-react";

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

        <div className="mx-auto max-w-xl rounded-2xl border border-ocean-100 bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ocean-100 text-ocean-700">
            <BookOpen size={22} />
          </div>
          <p className="text-lg font-bold text-ocean-950">準備中です</p>
          <p className="mt-3 text-sm leading-relaxed text-ocean-800 md:text-base">
            メルマガ「島から、もりゆか」6/29 創刊。
            脱サラ・SNS・EC・LINE公式のノウハウをまとめた無料ガイドも準備中です。
            事前登録いただいた方に、完成しだいいち早くお届けします。
          </p>
          <div className="mt-7">
            <a href="#newsletter" className="btn-accent">
              事前登録する
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
