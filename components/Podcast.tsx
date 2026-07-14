export default function Podcast() {
  return (
    <section id="podcast" className="section bg-ocean-50/40">
      <div className="container-base">
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-3 text-sm font-medium tracking-widest text-sand-600">
            PODCAST
          </p>
          <h2 className="section-title">龍の雲を見た</h2>
          <p className="mt-4 text-sm leading-relaxed text-ocean-800 md:text-base">
            島暮らしや事業のこと、日々考えていることを音声でお届け。
            <br className="hidden md:block" />
            作業や移動のおともにどうぞ。
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <iframe
            title="龍の雲を見た（Spotify）"
            src="https://open.spotify.com/embed/show/7oSt6iiHur0BCj0UpBiACh"
            width="100%"
            height={352}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="rounded-2xl border border-ocean-100 shadow-sm"
          />
          <div className="mt-6 text-center">
            <a
              href="https://open.spotify.com/show/7oSt6iiHur0BCj0UpBiACh"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              Spotifyで聴く
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
