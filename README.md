# MORIYUKA Site

愛媛の離島で家業のナマコ屋を継いだ「もりゆか」の公式ランディングページ。

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- lucide-react

## セットアップ

```bash
cd /Users/yukamori/moriyuka-site
npm install
npm run dev
```

ブラウザで http://localhost:3000 を開く。

## 主要スクリプト

- `npm run dev` — 開発サーバー起動
- `npm run build` — 本番ビルド
- `npm run start` — 本番サーバー起動
- `npm run lint` — Lint

## Vercel デプロイ手順

1. GitHub にリポジトリを push
2. https://vercel.com/new でリポジトリをインポート
3. Framework Preset は自動で「Next.js」が選ばれるのでそのまま Deploy
4. 独自ドメインを使う場合は Project Settings → Domains で追加

## コンテンツ差し替え場所

| 内容 | ファイル |
| --- | --- |
| メタデータ（title / description / OG） | `app/layout.tsx` |
| ナビゲーションリンク | `components/Nav.tsx` |
| ヒーロー見出し / 画像 | `components/Hero.tsx` |
| KPI 数値 | `components/Kpi.tsx` |
| メルマガ告知バナー | `components/PromoBanner.tsx` |
| 自己紹介本文 / 画像 | `components/About.tsx` |
| 商品カード / EC リンク | `components/Products.tsx` |
| 無料ガイド一覧 | `components/FreeGuides.tsx` |
| メルマガ登録 | `components/Newsletter.tsx` |
| SNS リンク | `components/SocialLinks.tsx`, `components/Footer.tsx` |
| お問い合わせフォーム | `components/Contact.tsx` |
| フッター | `components/Footer.tsx` |

## 画像について

仮素材として Unsplash と picsum.photos の URL を入れています。差し替える場合：

1. `next.config.mjs` の `images.remotePatterns` に新しいホストを追加
2. 各コンポーネントの `<Image src="...">` を更新

## メモ

- フォーム（メルマガ / お問い合わせ）は見た目のみで送信先未接続。Formspree / Resend / 自作 API などに繋いでください。
- フォントは Google Fonts の Noto Sans JP を `next/font/google` で読み込み。
