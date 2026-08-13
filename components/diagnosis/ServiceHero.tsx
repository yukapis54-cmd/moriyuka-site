import Image from "next/image";

type ServiceHeroProps = {
  ctaHref?: string;
};

const samples = [
  {
    src: "/samples/goal-shop.jpg",
    alt: "商品販売を目的にしたWebデザインサンプル",
    className:
      "left-4 top-12 h-28 w-40 rotate-[-7deg] sm:h-36 sm:w-56 md:left-8 md:top-24 lg:left-16",
  },
  {
    src: "/samples/layout-fullhero.jpg",
    alt: "大きな写真を使ったWebデザインサンプル",
    className:
      "right-4 top-10 h-32 w-36 rotate-[6deg] sm:h-44 sm:w-52 md:right-10 md:top-20 lg:right-20",
  },
  {
    src: "/samples/hero-person.jpg",
    alt: "人物写真を中心にしたWebデザインサンプル",
    className:
      "bottom-20 left-2 hidden h-36 w-28 rotate-[9deg] sm:block md:bottom-24 md:left-14 md:h-48 md:w-36",
  },
  {
    src: "/samples/tone-modern.jpg",
    alt: "モダンなトーンのWebデザインサンプル",
    className:
      "bottom-10 right-2 h-24 w-36 rotate-[-5deg] sm:h-32 sm:w-48 md:bottom-20 md:right-12 lg:right-24",
  },
  {
    src: "/samples/tone-patisserie.jpg",
    alt: "パティスリー向けのWebデザインサンプル",
    className:
      "left-[18%] top-4 hidden h-24 w-32 rotate-[4deg] md:block lg:left-[20%] lg:top-10 lg:h-32 lg:w-44",
  },
  {
    src: "/samples/layout-magazine.jpg",
    alt: "雑誌のように組んだWebデザインサンプル",
    className:
      "right-[22%] top-4 hidden h-24 w-36 rotate-[-9deg] md:block lg:right-[20%] lg:top-12 lg:h-32 lg:w-48",
  },
  {
    src: "/samples/goal-lead.jpg",
    alt: "問い合わせ導線を重視したWebデザインサンプル",
    className:
      "bottom-6 left-[28%] hidden h-28 w-44 rotate-[-3deg] lg:block",
  },
  {
    src: "/samples/tone-natural.jpg",
    alt: "自然な雰囲気のWebデザインサンプル",
    className:
      "bottom-12 right-[30%] hidden h-28 w-40 rotate-[7deg] xl:block",
  },
];

export default function ServiceHero({ ctaHref = "#start" }: ServiceHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#fbfaf6] px-5 py-16 text-ocean-950 sm:py-20 md:px-8 md:py-28">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {samples.map((sample, index) => (
          <div
            key={sample.src}
            className={`absolute overflow-hidden rounded-md bg-white shadow-xl shadow-ocean-950/10 ring-1 ring-ocean-950/10 ${sample.className}`}
            style={{ zIndex: index % 2 === 0 ? 0 : 1 }}
          >
            <Image
              src={sample.src}
              alt={sample.alt}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 160px, (max-width: 1024px) 220px, 260px"
              priority={index < 2}
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 mx-auto flex min-h-[620px] max-w-content items-center justify-center py-8 sm:min-h-[680px] md:min-h-[720px]">
        <div className="max-w-4xl text-left sm:text-center">
          <p className="text-xs font-bold tracking-[0.28em] text-ocean-700">
            DESIGN DIAGNOSIS
          </p>
          <h1 className="mt-5 text-[3.25rem] font-bold leading-[1.02] tracking-normal text-ocean-950 sm:text-7xl md:text-8xl">
            あなたの&quot;好き&quot;から、
            <span className="block">ホームページをつくろう。</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-ocean-950/70 sm:mx-auto md:text-lg">
            専門用語は必要ありません。好きなデザインを選んでいくだけで、あなたの理想のホームページが見えてきます。
          </p>
          <div className="mt-10">
            <a
              href={ctaHref}
              className="inline-flex w-full items-center justify-center rounded-full bg-ocean-700 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-ocean-900/15 transition hover:-translate-y-0.5 hover:bg-ocean-800 sm:w-auto md:text-base"
            >
              無料でデザイン診断をはじめる
            </a>
            <p className="mt-4 text-xs font-medium tracking-[0.18em] text-ocean-950/55">
              約3分 / 登録不要
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
