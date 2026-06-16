import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MORIYUKA | 愛媛の離島から、ナマコと向き合う日々を。",
  description:
    "脱サラ・Uターン・SNS発信のリアル。愛媛の離島で家業のナマコ屋を継いだ、もりゆかの公式サイト。",
  openGraph: {
    title: "MORIYUKA | 愛媛の離島から、ナマコと向き合う日々を。",
    description: "脱サラ・Uターン・SNS発信のリアル。",
    type: "website",
    locale: "ja_JP",
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
      </body>
    </html>
  );
}
