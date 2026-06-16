import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-ocean-50 via-white to-white pt-24 md:pt-32">
      <div className="container-base grid items-center gap-10 pb-16 md:grid-cols-2 md:gap-12 md:pb-24">
        <div>
          <p className="mb-4 text-sm font-medium tracking-widest text-sand-600">
            MORIYUKA / 島の暮らしと、ナマコと。
          </p>
          <h1 className="section-title text-3xl md:text-5xl">
            愛媛の離島から、
            <br />
            ナマコと向き合う日々を。
          </h1>
          <p className="mt-6 text-base leading-relaxed text-ocean-800 md:text-lg">
            脱サラ・Uターン・SNS発信のリアル。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#newsletter" className="btn-accent">
              メルマガ登録
            </a>
            <a href="#about" className="btn-secondary">
              プロフィールを見る
            </a>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-xl md:aspect-[4/5]">
          <Image
            src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80"
            alt="愛媛の離島の海"
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[140%] -translate-x-1/2 rounded-[100%] bg-ocean-50"
      />
    </section>
  );
}
