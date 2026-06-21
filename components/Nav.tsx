"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#about", label: "プロフィール" },
  { href: "#newsletter", label: "メルマガ" },
  { href: "#products", label: "通販" },
  { href: "#business", label: "事業者の方へ" },
  { href: "#contact", label: "お問い合わせ" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all ${
        scrolled
          ? "bg-white/95 shadow-sm backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <div className="container-base flex h-16 items-center justify-between md:h-20">
        <a
          href="#"
          className="text-lg font-bold tracking-widest text-ocean-950 md:text-xl"
        >
          MORIYUKA
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ocean-900 transition hover:text-sand-600"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <button
          aria-label="メニュー"
          className="md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ocean-100 bg-white md:hidden">
          <nav className="container-base flex flex-col py-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-ocean-900"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
