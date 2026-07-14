import Image from "next/image";

export default function Podcast() {
  return (
    <section id="podcast" className="section bg-ocean-50/40">
      <div className="container-base">
        <div className="flex justify-center">
          <a
            href="https://open.spotify.com/show/7oSt6iiHur0BCj0UpBiACh"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="ポッドキャスト「龍の雲を見た」をSpotifyで聴く"
            className="group inline-block"
          >
            <Image
              src="/images/podcast.jpg"
              alt="ポッドキャスト 龍の雲を見た"
              width={200}
              height={200}
              className="h-40 w-40 rounded-2xl shadow-md transition group-hover:-translate-y-0.5 group-hover:shadow-lg md:h-48 md:w-48"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
