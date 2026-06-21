import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://moriyuka-site.vercel.app"),
  title: "MORIYUKA | 愛媛の離島から、ナマコと向き合う日々を。",
  description:
    "脱サラ・Uターン・SNS発信のリアル。愛媛の離島から実家のナマコを全国へ届ける、もりゆかの公式サイト。",
  openGraph: {
    title: "MORIYUKA | 愛媛の離島から、ナマコと向き合う日々を。",
    description:
      "脱サラ・Uターン・SNS発信のリアル。愛媛の離島から天然ナマコを産地直送。",
    url: "https://moriyuka-site.vercel.app",
    siteName: "MORIYUKA",
    images: [
      { url: "/images/og.jpg", width: 1200, height: 630, alt: "MORIYUKA もりゆか" },
    ],
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "MORIYUKA | 愛媛の離島から、ナマコと向き合う日々を。",
    description: "脱サラ・Uターン・SNS発信のリアル。",
    images: ["/images/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <body className="bg-white font-sans text-ocean-950 antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
