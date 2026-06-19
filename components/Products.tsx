import Image from "next/image";
import { ShoppingBag } from "lucide-react";

export default function Products() {
  return (
    <section id="products" className="section bg-white">
      <div className="container-base">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-medium tracking-widest text-sand-600">
            PRODUCTS
          </p>
          <h2 className="section-title">島から届ける、こだわりの一品</h2>
        </div>

        <div className="mx-auto grid max-w-4xl items-center gap-10 rounded-3xl border border-ocean-100 bg-ocean-50/40 p-6 md:grid-cols-2 md:p-10">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-md">
            <Image
              src="/images/namako.jpg"
              alt="ナマコ食べ比べセット"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-sand-600">
              SIGNATURE
            </p>
            <h3 className="mt-2 text-xl font-bold text-ocean-950 md:text-2xl">
              こだわりナマコ食べ比べセット
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-ocean-900 md:text-base">
              瀬戸内の島で水揚げした天然ナマコを、加工方法別に食べ比べできるセット。贈答にも自家用にも。
            </p>
            <div className="mt-8">
              <a
                href="https://setouchi-seafood.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <ShoppingBag size={18} className="mr-2" />
                setouchi-seafood.com で購入
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
