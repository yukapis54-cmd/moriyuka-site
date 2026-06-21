import { Megaphone, ShoppingCart, MessageSquare, Mic } from "lucide-react";

const offers = [
  {
    Icon: Megaphone,
    title: "SNS運用・発信のサポート",
    desc: "AIも使いながら、0→1万人超まで伸ばした発信のコツを一緒に。専門用語ぬきで進めます。",
  },
  {
    Icon: ShoppingCart,
    title: "EC・ネット通販の立ち上げ",
    desc: "ホームページもないところから1人で立ち上げた経験で、ネット販売の始め方をやさしく伴走します。",
  },
  {
    Icon: MessageSquare,
    title: "LINE公式アカウント",
    desc: "ファンをお客さんに変えるLINEの作り方・続け方を、ムリなくサポートします。",
  },
  {
    Icon: Mic,
    title: "講演・セミナー・取材",
    desc: "脱サラ・離島Uターン・AI×SNSのリアルを、肩の力を抜いてお話しします。",
  },
];

export default function Business() {
  return (
    <section id="business" className="section bg-ocean-950 text-white">
      <div className="container-base">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-sm font-medium tracking-widest text-sand-300">
            FOR BUSINESS
          </p>
          <h2 className="text-2xl font-bold md:text-4xl">
            AIを味方に。非エンジニアでも、ここまでできました。
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
            わたし自身、プログラミングはまったくできません。それでもAIを相棒にしたら、脱サラから6ヶ月でSNSフォロワー16,400人・月間105万回再生、ホームページもないところから1人でネット通販まで立ち上げられました。「むずかしそう」を「これならできそう」に。企業・事業者さんの発信や販売も、いっしょに前へ進めます。
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-2">
          {offers.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-sand-500/20 text-sand-300">
                <Icon size={20} />
              </div>
              <h3 className="text-base font-bold md:text-lg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#contact"
            className="inline-flex items-center justify-center rounded-full bg-sand-500 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sand-600 md:text-base"
          >
            まずは気軽にご相談ください
          </a>
        </div>
      </div>
    </section>
  );
}
