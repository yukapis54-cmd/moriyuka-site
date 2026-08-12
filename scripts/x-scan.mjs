#!/usr/bin/env node
/**
 * X（旧Twitter）のアカウントやポストを読んで、本文・画像・スクリーンショットを保存する。
 * デザインの参考にしている発信者を定点観測して、HP に反映するための材料集め。
 *
 *   node scripts/x-scan.mjs                       # WATCHING の全アカウント
 *   node scripts/x-scan.mjs goodfreefonts         # 1アカウントだけ
 *   node scripts/x-scan.mjs https://x.com/xxx/status/123   # 個別ポスト
 *
 * 出力は .x-scan/<アカウント名>/ に posts.json と shot-*.png（gitignore 済み）。
 *
 * 前提: ~/.claude-x-profile に X のログイン状態が保存されていること。
 * 未ログインならブラウザが開くので、そこで1回だけログインすれば以降は自動。
 * X は自動操作を検知してログインを弾くため、検知対策を入れてある。
 * 負荷をかけるとアカウントが凍結されうるので、スクロールは既定8回までに抑えている。
 */
import { chromium } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";

const PROFILE = path.join(os.homedir(), ".claude-x-profile");
const OUT_ROOT = path.join(process.cwd(), ".x-scan");
const SCROLLS = Number(process.env.X_SCROLLS) || 8;

/** 定点観測するアカウント。増やすときはここに足す */
const WATCHING = [
  { handle: "thingnld", why: "デザインの「なんか良い」を言語化している" },
  { handle: "goodfreefonts", why: "日本語フリーフォントの紹介" },
  { handle: "terasu_design", why: "実在サイトの良デザイン紹介と、制作者視点の話" },
];

const args = process.argv.slice(2);
const targets = args.length
  ? args.map((a) => (a.startsWith("http") ? { url: a, handle: slug(a) } : { handle: a }))
  : WATCHING;

function slug(s) {
  return s.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60);
}

const ctx = await chromium.launchPersistentContext(PROFILE, {
  headless: false,
  channel: "chrome",
  viewport: null,
  locale: "ja-JP",
  timezoneId: "Asia/Tokyo",
  // 自動操作の痕跡を消す。X はこれを見てログインを弾いてくる
  args: ["--disable-blink-features=AutomationControlled", "--window-size=1280,1000"],
  ignoreDefaultArgs: ["--enable-automation"],
});
await ctx.addInitScript(() => {
  Object.defineProperty(navigator, "webdriver", { get: () => undefined });
});

const page = ctx.pages()[0] ?? (await ctx.newPage());
let total = 0;

for (const t of targets) {
  const url = t.url ?? `https://x.com/${t.handle}`;
  const dir = path.join(OUT_ROOT, slug(t.handle));
  mkdirSync(dir, { recursive: true });
  console.log(`\n▼ ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

  // 未ログインならここで人間の操作を待つ（初回のみ）
  let ready = false;
  for (let i = 0; i < 180; i++) {
    if ((await page.locator('article[data-testid="tweet"]').count().catch(() => 0)) > 0) {
      ready = true;
      break;
    }
    if (i === 0) console.log("  ログイン待機中… 開いた窓で X にログインしてください");
    await page.waitForTimeout(5000);
  }
  if (!ready) {
    console.log("  × 読めませんでした（未ログイン／凍結／存在しないアカウント）");
    continue;
  }

  const seen = new Map();
  for (let s = 0; s < SCROLLS; s++) {
    for (const a of await page.locator('article[data-testid="tweet"]').all()) {
      const text = (await a.locator('[data-testid="tweetText"]').first().innerText().catch(() => "")).trim();
      const images = await a
        .locator('[data-testid="tweetPhoto"] img')
        .evaluateAll((els) => els.map((e) => e.src))
        .catch(() => []);
      const time = await a.locator("time").first().getAttribute("datetime").catch(() => null);
      const link = await a.locator('a[href*="/status/"]').first().getAttribute("href").catch(() => null);
      const key = (time ?? "") + text.slice(0, 60);
      if (!seen.has(key) && (text || images.length)) {
        seen.set(key, { time, text, images, url: link ? `https://x.com${link}` : null });
        // 画像つきの投稿は見た目が本体なので、そのままスクショも残す
        if (images.length && seen.size <= 12) {
          await a
            .screenshot({ path: path.join(dir, `shot-${String(seen.size).padStart(2, "0")}.png`) })
            .catch(() => {});
        }
      }
    }
    await page.mouse.wheel(0, 2400);
    await page.waitForTimeout(1800);
  }

  const posts = [...seen.values()];
  writeFileSync(path.join(dir, "posts.json"), JSON.stringify(posts, null, 2));
  console.log(`  ✓ ${posts.length} 件 → ${path.relative(process.cwd(), dir)}/`);
  total += posts.length;
  await page.waitForTimeout(2000); // 連続アクセスを避ける
}

console.log(`\n合計 ${total} 件を取得しました`);
await ctx.close();
