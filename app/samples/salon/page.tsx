import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Scissors } from "lucide-react";

export const metadata: Metadata = {
  title: "atelier shiro | 業種別サンプルLP",
  description:
    "個人経営の美容室を想定した、白基調で余白を大きく取った架空店舗ランディングページです。",
};

const services = [
  ["cut", "カット", "6,000円"],
  ["color", "カラー", "8,500円から"],
  ["care", "髪質ケア", "5,500円から"],
];

export default function SalonSamplePage() {
  return (
    <main className="min-h-screen bg-salon-white text-salon-ink">
      <section className="mx-auto max-w-content px-5 py-8 md:px-8 md:py-12">
        <nav className="flex items-center justify-between border-b border-salon-line pb-5 text-[11px] tracking-[0.18em] text-salon-ink/52">
          <Link href="/samples">SAMPLE LP</Link>
          <span>FICTIONAL SALON</span>
        </nav>

        <div className="grid gap-16 pb-20 pt-20 md:grid-cols-[0.76fr_1.24fr] md:gap-20 md:pb-28 md:pt-28">
          <div>
            <p className="text-xs tracking-[0.22em] text-salon-ink/48">PRIVATE HAIR SALON</p>
            <h1 className="mt-8 text-5xl font-medium leading-[1.02] tracking-normal md:text-7xl">
              atelier
              <br />
              shiro
            </h1>
          </div>
          <div className="md:pt-28">
            <p className="max-w-lg text-xl leading-10 text-salon-ink/78 md:text-3xl md:leading-[1.7]">
              髪を整える時間が、少し静かに戻る場所。
            </p>
            <p className="mt-10 max-w-md text-sm leading-8 text-salon-ink/54">
              一席ずつ間隔を取り、カウンセリングから仕上げまで一人のスタイリストが担当します。
              変化を急がず、今の暮らしに合う髪を一緒に探します。
            </p>
          </div>
        </div>

        <div className="relative ml-auto aspect-[4/5] w-full max-w-[820px] overflow-hidden md:aspect-[16/9]">
          <Image
            src="/images/about.jpg"
            alt="atelier shiro の施術イメージ"
            fill
            priority
            className="object-cover grayscale"
            sizes="(max-width: 768px) 100vw, 820px"
          />
        </div>
      </section>

      <section className="border-y border-salon-line px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-content">
          <div className="grid gap-12 md:grid-cols-[0.42fr_1fr]">
            <div>
              <Scissors size={20} strokeWidth={1.2} />
              <h2 className="mt-7 text-3xl font-medium leading-tight md:text-5xl">menu</h2>
            </div>
            <div className="grid gap-0">
              {services.map(([key, label, price]) => (
                <div key={key} className="grid grid-cols-[1fr_auto] border-t border-salon-line py-7 text-sm last:border-b">
                  <p className="text-salon-ink/70">{label}</p>
                  <p>{price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-content gap-14 md:grid-cols-[1fr_0.82fr] md:items-end">
          <div>
            <p className="text-[11px] tracking-[0.22em] text-salon-ink/45">RESERVATION</p>
            <h2 className="mt-8 max-w-3xl text-4xl font-medium leading-tight md:text-6xl">
              ひと月先までの予約を、ゆっくり受け付けています。
            </h2>
          </div>
          <div className="border-l border-salon-line pl-6">
            <p className="text-sm leading-8 text-salon-ink/56">
              平日は夕方の時間帯もご案内できます。初めての方は、希望の長さや気になる髪質だけお知らせください。
            </p>
            <a
              href="tel:0000000000"
              className="mt-8 inline-flex items-center gap-3 border-b border-salon-ink pb-2 text-sm"
            >
              <CalendarDays size={17} strokeWidth={1.4} />
              予約の相談をする
              <ArrowRight size={16} strokeWidth={1.4} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
