import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="section bg-ocean-50/40">
      <div className="container-base grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-lg">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"
            alt="島の風景"
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
            愛媛の離島で育ち、大阪のIT企業に就職。年収600万を捨ててUターンしたのは、家業のナマコ屋を継ぐため。家業のナマコを日本全国の食卓へ届け、そして島そのものをもっと盛り上げたい——その思いで、SNSと通販を軸に挑戦を続けています。
          </p>
          <div className="mt-8">
            <a href="#" className="btn-primary">
              もっと詳しく見る
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
