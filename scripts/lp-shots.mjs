#!/usr/bin/env node
/**
 * 実在する LP / Web サイトを、ページ全体まるごとスクリーンショットに撮る。
 * 「良いページはどう組まれているか」を、診断ページの型づくりの материал にするため。
 *
 *   node scripts/lp-shots.mjs https://example.com https://example.jp
 *   node scripts/lp-shots.mjs --from .x-scan/terasu-design/posts.json   # 投稿中のURLを拾う
 *
 * 出力は .lp-shots/<ホスト名>.png（gitignore 済み）。
 * ファーストビューだけの版も -fv.png として保存する。型を見るならこちらが速い。
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT = path.join(process.cwd(), ".lp-shots");
mkdirSync(OUT, { recursive: true });

const args = process.argv.slice(2);
let urls = [];
if (args[0] === "--from") {
  const posts = JSON.parse(readFileSync(args[1], "utf8"));
  const found = new Set();
  for (const p of posts) {
    for (const m of (p.text || "").replace(/\n/g, "").matchAll(/[a-z0-9.-]+\.[a-z]{2,}\/[a-z0-9\-/]+/gi)) {
      const u = m[0].replace(/\/+$/, "");
      if (!u.includes("x.com") && !u.includes("t.co")) found.add(`https://${u}`);
    }
  }
  urls = [...found];
} else {
  urls = args;
}
if (!urls.length) {
  console.error("URL を渡してください");
  process.exit(1);
}

const browser = await chromium.launch();
const results = [];
for (const [i, url] of urls.entries()) {
  const name = url.replace(/^https?:\/\//, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60);
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
    // 遅延読み込みの画像を起こすため、一度下まで送ってから戻す
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 800) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(OUT, `${name}-fv.png`) });
    await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
    const h = await page.evaluate(() => document.body.scrollHeight);
    results.push({ url, name, height: h });
    console.log(`✓ ${i + 1}/${urls.length} ${url} （縦 ${h}px）`);
  } catch (e) {
    console.log(`× ${i + 1}/${urls.length} ${url} — ${String(e.message).slice(0, 80)}`);
  }
  await page.close();
}
writeFileSync(path.join(OUT, "index.json"), JSON.stringify(results, null, 2));
console.log(`\n${results.length} 件を .lp-shots/ に保存しました`);
await browser.close();
