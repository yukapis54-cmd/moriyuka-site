import {
  Instagram,
  Music2,
  Youtube,
  AtSign,
  Hash,
  FileText,
  MessageCircle,
  Send,
} from "lucide-react";

const sitemap = [
  { href: "#about", label: "プロフィール" },
  { href: "#newsletter", label: "メルマガ" },
  { href: "#products", label: "通販" },
  { href: "#guides", label: "無料ガイド" },
  { href: "#contact", label: "お問い合わせ" },
];

const footerSocials = [
  { href: "https://www.instagram.com/moriyukapi/", Icon: Instagram, label: "Instagram" },
  { href: "https://www.tiktok.com/@moriyukapi", Icon: Music2, label: "TikTok" },
  { href: "https://www.youtube.com/@moriyukapis", Icon: Youtube, label: "YouTube" },
  { href: "https://www.threads.com/@moriyukapi", Icon: AtSign, label: "Threads" },
  { href: "https://x.com/namako_moriyuka", Icon: Hash, label: "X" },
  { href: "https://note.com/moriyukapi", Icon: FileText, label: "note" },
  { href: "https://line.me/R/ti/p/@346bmdxx?ts=04022056&oat_content=url", Icon: MessageCircle, label: "LINE" },
  { href: "https://substack.com/@1234291644", Icon: Send, label: "Substack" },
];

export default function Footer() {
  return (
    <footer className="bg-ocean-950 text-white">
      <div className="container-base py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold tracking-widest">MORIYUKA</p>
            <p className="mt-3 text-sm text-white/70">
              愛媛の離島から、ナマコと暮らしを発信しています。
            </p>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">
              SITEMAP
            </p>
            <ul className="space-y-2">
              {sitemap.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    className="text-sm text-white/80 transition hover:text-sand-300"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/60">
              SNS
            </p>
            <div className="flex flex-wrap gap-3">
              {footerSocials.map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:bg-white/10"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/60">
          © 2026 MORIYUKA. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
