import { Megaphone, ShoppingCart, MessageSquare, Mic } from "lucide-react";

const offers = [
  {
    Icon: Megaphone,
    title: "SNS運用・発信サポート",
    desc: "0→1万人超を実現した発信ノウハウで、伸びるアカウント設計・運用をご支援します。",
  },
  {
    Icon: ShoppingCart,
    title: "EC・ネット通販の立ち上げ",
    desc: "ホームページもない状態から1人で立ち上げた経験をもとに、販売の仕組みづくりを伴走します。",
  },
  {
    Icon: MessageSquare,
    title: "LINE公式アカウント構築",
    desc: "ファンを顧客に変えるLINE公式の設計・運用をサポートします。",
  },
  {
    Icon: Mic,
    title: "講演・セミナー・取材",
    desc: "脱サラ・離島Uターン・SNS発信のリアルを、講演や取材でお話しします。",
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
            その実績、御社の発信と販売に。
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-white/80 md:text-base">
            脱サラから6ヶ月で、SNS総フォロワー16,400人・月間105万回再生。ホームページもない状態から、たった1人でEC通販を立ち上げました。その実体験で培ったノウハウで、企業・事業者さまの発信と販売を本気でご支援します。
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
            お仕事のご相談・ご依頼はこちら
          </a>
        </div>
      </div>
    </section>
  );
}
