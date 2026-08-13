const steps = [
  {
    step: "STEP 01",
    title: "診断結果を送信",
    description: "選んだデザインの傾向と相談内容を、制作スタッフへ共有します。",
  },
  {
    step: "STEP 02",
    title: "制作スタッフと打ち合わせ",
    description: "目的、見せたい商品やサービス、必要なページを一緒に整理します。",
  },
  {
    step: "STEP 03",
    title: "内容・写真・文章を調整",
    description: "診断結果を土台に、実際に使う素材や言葉へ置き換えていきます。",
  },
  {
    step: "STEP 04",
    title: "本制作",
    description: "スマートフォンでの見え方や問い合わせ導線まで含めて制作します。",
  },
  {
    step: "STEP 05",
    title: "公開",
    description: "最終確認後、公開に必要な設定を行い、運用できる状態にします。",
  },
];

export default function ProcessSteps() {
  return (
    <section className="bg-[#fbfaf6] px-5 py-16 text-ocean-950 md:px-8 md:py-24">
      <div className="mx-auto max-w-content">
        <div className="grid gap-8 border-t border-ocean-950/10 pt-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:pt-12">
          <div>
            <p className="text-xs font-bold tracking-[0.28em] text-ocean-700">
              AFTER DIAGNOSIS
            </p>
            <h2 className="mt-5 text-3xl font-bold leading-tight md:text-5xl">
              制作を依頼するとどうなる？
            </h2>
          </div>

          <ol className="divide-y divide-ocean-950/10 border-b border-ocean-950/10">
            {steps.map((item) => (
              <li key={item.step} className="grid gap-3 py-6 sm:grid-cols-[7rem_1fr] sm:gap-8">
                <p className="text-xs font-bold tracking-[0.22em] text-ocean-700">
                  {item.step}
                </p>
                <div>
                  <h3 className="text-xl font-bold leading-snug md:text-2xl">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-ocean-950/68 md:text-base">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-8 max-w-3xl border-l border-ocean-700/35 pl-4 text-xs leading-6 text-ocean-950/60 md:ml-auto">
          診断で作ったデザインは完成イメージです。これをもとに、実際のサイトとして情報設計・原稿調整・実装を行い、公開できる形へ仕上げます。
        </p>
      </div>
    </section>
  );
}
