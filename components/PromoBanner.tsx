import { Sparkles } from "lucide-react";

export default function PromoBanner() {
  return (
    <section className="py-8 md:py-12">
      <div className="container-base">
        <div className="flex flex-col items-center justify-between gap-5 rounded-3xl bg-gradient-to-r from-sand-400 to-sand-500 px-6 py-8 text-white shadow-lg md:flex-row md:px-10 md:py-10">
          <div className="flex items-start gap-3 md:items-center">
            <Sparkles className="mt-1 shrink-0 md:mt-0" size={24} />
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/80">
                New
              </p>
              <p className="text-lg font-bold md:text-xl">
                メルマガ「島から、もりゆか」6/29 創刊
              </p>
              <p className="mt-1 text-sm text-white/90">
                島暮らしと事業のリアルを月数回お届けします。
              </p>
            </div>
          </div>
          <a
            href="#newsletter"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-sand-700 shadow-sm transition hover:bg-sand-50 md:text-base"
          >
            事前登録する
          </a>
        </div>
      </div>
    </section>
  );
}
