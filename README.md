# MORIYUKA Site

愛媛の離島で家業のナマコ屋を継いだ「もりゆか」の公式ランディングページ。

- Next.js 16 (App Router) / React 19
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

## デプロイ（Cloudflare Workers）

`@opennextjs/cloudflare` で Next.js をそのまま Workers 上に載せています。

```bash
npx wrangler login          # 初回のみ
npm run preview             # ローカルの workerd で本番同等の動作確認
npm run deploy              # 本番デプロイ
```

- 設定は `wrangler.jsonc` / `open-next.config.ts`。`nodejs_compat` フラグが必須です。
- **環境変数の置き場所が2つに分かれます**
  - `NEXT_PUBLIC_*`（ConvertKit フォーム ID / Web3Forms キー）は**ビルド時**にコードへ埋め込まれるため、ビルドを実行する環境の `.env.local` か CI の環境変数に必要です。
  - サーバー側のキー（`UNSPLASH_ACCESS_KEY` / `PEXELS_API_KEY` / `PIXABAY_API_KEY` / `KIT_API_KEY`）は
    `npx wrangler secret put UNSPLASH_ACCESS_KEY` のように**Secret として登録**します。
- 独自ドメインは Cloudflare ダッシュボード → Workers & Pages → 該当 Worker → Settings → Domains & Routes で追加。
  切り替え後は `app/layout.tsx` の `metadataBase` と OG の `url` を新ドメインへ更新してください。

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

## 理想HP診断ページ（/ideal-hp）

- 完成イメージの写真は Unsplash API から取得します。https://unsplash.com/developers で無料の Access Key を発行してください。
- `.env.local` に `UNSPLASH_ACCESS_KEY=xxxxx` を設定して dev サーバーを再起動すると実写真に切り替わります。
- 写真は Unsplash → Pexels → Pixabay → Openverse の順に取得を試みます。どれか1つでもキーがあれば実写真になります。
  - Pexels: https://www.pexels.com/api/ （無料・審査なし・200req/時）→ `PEXELS_API_KEY`
  - Pixabay: https://pixabay.com/api/docs/ （無料・ほぼ無制限）→ `PIXABAY_API_KEY`
- 検索語は `data/photo-queries.json`（業種 × 空気感の味つけ）に集約。ページとウォームアップ script が同じ定義を読みます。
- 取得した写真は `data/photo-cache.json` に永続保存され、以降は API を叩きません。`node scripts/warm-photos.mjs` で一括取得できます（dev サーバー起動が前提。`WARM_BASE` でポート変更可）。
- Unsplash は Demo キーが 50req/時のため、1回のウォームアップでは大半が Pexels になります。Unsplash 比率を上げたい場合は、キャッシュから該当キーを消して1時間おきに再実行してください。
- キーが1つも無い場合は Openverse（CC画像）、それも失敗すれば canvas 手描きにフォールバックします。

### 完成イメージの写真を AI 生成に差し替える

ストックフォトの代わりに Gemini で作り置きした画像を使えます。訪問者のリクエスト中は
API を叩かず、`public/generated/` の PNG を同一オリジンで配信します。

```bash
# https://aistudio.google.com/apikey で無料キーを発行（カード登録不要・1日500枚）
GEMINI_API_KEY=xxx node scripts/gen-photos.mjs --limit 5   # まず5枚で出来を見る
GEMINI_API_KEY=xxx node scripts/gen-photos.mjs             # 残り全部（計156枚）
npm run dev   # /ideal-hp で確認
npm run deploy
```

- `--force` で既存も作り直し。429（日次上限）に当たった時点で打ち切り、そこまでを保存します。
- 生成物は `data/photo-cache.json` に `source: "gemini"` として記録され、ストックフォトより優先されます。
