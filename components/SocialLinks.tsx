import {
  Instagram,
  Facebook,
  Youtube,
  AtSign,
  MessageCircle,
  FileText,
  Music2,
  Send,
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
];

export default function SocialLinks() {
  return (
    <section className="section bg-ocean-50/40">
      <div className="container-base">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-3 text-sm font-medium tracking-widest text-sand-600">
            FOLLOW
          </p>
          <h2 className="section-title">SNSで日々の様子を発信中</h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:gap-4 lg:grid-cols-8">
          {socials.map(({ name, handle, href, Icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center rounded-2xl border border-ocean-100 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <Icon size={26} className="text-ocean-700" />
              <p className="mt-3 text-xs font-semibold text-ocean-950 md:text-sm">
                {name}
              </p>
              <p className="mt-1 text-[11px] text-ocean-700 md:text-xs">
                {handle}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
