import {
  Instagram,
  Facebook,
  Youtube,
  AtSign,
  MessageCircle,
  FileText,
  Music2,
  Send,
  Podcast,
} from "lucide-react";

const socials = [
  { name: "Instagram", handle: "@moriyukapi", href: "https://www.instagram.com/moriyukapi/", Icon: Instagram },
  { name: "Facebook", handle: "フォロー", href: "https://www.facebook.com/yukapis5454", Icon: Facebook },
  { name: "TikTok", handle: "@moriyukapi", href: "https://www.tiktok.com/@moriyukapi", Icon: Music2 },
  { name: "YouTube", handle: "@moriyukapis", href: "https://www.youtube.com/@moriyukapis", Icon: Youtube },
  { name: "Threads", handle: "@moriyukapi", href: "https://www.threads.com/@moriyukapi", Icon: AtSign },
  { name: "NOTE", handle: "@moriyukapi", href: "https://note.com/moriyukapi", Icon: FileText },
  { name: "LINE公式", handle: "友だち追加", href: "https://lin.ee/5obSpak", Icon: MessageCircle },
  { name: "Substack", handle: "フォロー", href: "https://substack.com/@1234291644", Icon: Send },
  { name: "Podcast", handle: "島で1人起業", href: "https://open.spotify.com/show/7oSt6iiHur0BCj0UpBiACh", Icon: Podcast },
];

export default function SocialLinks() {
  return (
    <section className="section bg-white">
      <div className="container-base">
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-3 text-sm font-medium tracking-widest text-sand-600">
            FOLLOW
          </p>
          <h2 className="section-title">SNSで日々の様子を発信中</h2>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {socials.map(({ name, handle, href, Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name}（${handle}）`}
              title={`${name}（${handle}）`}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ocean-100 bg-white text-ocean-700 shadow-sm transition hover:-translate-y-0.5 hover:text-sand-600 hover:shadow-md md:h-14 md:w-14"
            >
              <Icon size={22} />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
