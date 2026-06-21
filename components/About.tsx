import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="section bg-ocean-50/40">
      <div className="container-base grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-lg">
          <Image
            src="/images/about.jpg"
            alt="瀬戸内の海辺で過ごすもりゆか"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div>
          <p className="mb-3 text-sm font-medium tracking-widest text-sand-600">
            ABOUT
          </p>
          <h2 className="section-title">
            島から生まれた、
            <br />
            新しい働き方の実験
          </h2>
          <p className="mt-6 text-base leading-relaxed text-ocean-900 md:text-lg">
            愛媛の離島で生まれ育ち、島を出て大阪のIT企業へ就職。安定した会社員生活と年収600万円——それでも心に残っていたのは、実家のナマコと、人口が減りゆくふるさとの島のことでした。
          </p>
          <p className="mt-4 text-base leading-relaxed text-ocean-900 md:text-lg">
            「実家のナマコを全国に届けて、この島をもう一度盛り上げたい」。その思いで会社を辞めてUターン。いまはSNSでの発信と自社ECでの通販を軸に、瀬戸内の天然ナマコを日本全国の食卓へ届ける挑戦を続けています。
          </p>
          <ul className="mt-6 space-y-2 text-sm text-ocean-800 md:text-base">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sand-500" />
              8つのSNSで発信、総フォロワー16,400人超
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sand-500" />
              ホームページもなかったところから、0から1人で通販を立ち上げ
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sand-500" />
              瀬戸内・愛媛の離島から天然ナマコを産地直送
            </li>
          </ul>
          <div className="mt-8">
            <a
              href="https://note.com/moriyukapi"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              noteで詳しいストーリーを読む
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
