import { MessageCircle } from "lucide-react";

export default function Newsletter() {
  return (
    <section id="newsletter" className="section bg-white">
      <div className="container-base">
        <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-[#06C755] to-[#04A544] px-6 py-12 text-center text-white shadow-xl md:px-12 md:py-16">
          <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
            <MessageCircle size={22} />
          </div>
          <p className="text-xs font-medium uppercase tracking-widest text-white/80">
            OFFICIAL LINE
          </p>
          <h2 className="mt-3 text-2xl font-bold md:text-3xl">
            公式LINEで、島から。
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/90 md:text-base">
            ナマコの入荷・通販・お得な情報をお届け。
            <br className="hidden md:block" />
            島暮らしの質問なども、公式LINEから直接DMできます。
            <br className="hidden md:block" />
            友だち追加は無料です。
          </p>
          <div className="mt-8">
            <a
              href="https://lin.ee/5obSpak"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-[#06C755] shadow-sm transition hover:bg-white/90 md:text-base"
            >
              <MessageCircle size={18} className="mr-2" />
              公式LINEを友だち追加
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
