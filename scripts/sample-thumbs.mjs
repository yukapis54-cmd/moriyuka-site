#!/usr/bin/env node
/**
 * 公開中のサンプルLPを撮って、一覧ページ用のサムネイルを作る。
 *
 *   node scripts/sample-thumbs.mjs [ベースURL]
 *
 * 出力は public/samples/thumb-<キー>.jpg（ファーストビュー）と
 * thumb-<キー>-full.jpg（全体）。一覧のカードで使う。
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import path from "node:path";

const BASE = process.argv[2] || "https://moriyuka-site.moriyukasite.workers.dev";
const OUT = path.join(process.cwd(), "public/samples");
mkdirSync(OUT, { recursive: true });

const pages = [
  ["restaurant", "/samples/restaurant"],
  ["salon", "/samples/salon"],
  ["koumuten", "/samples/koumuten"],
  ["goal-shop-page", "/samples/goal/shop"],
  ["goal-lead-page", "/samples/goal/lead"],
  ["goal-brand-page", "/samples/goal/brand"],
  ["goal-fan-page", "/samples/goal/fan"],
];

const b = await chromium.launch();
for (const [key, url] of pages) {
  const p = await b.newPage({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1 });
  try {
    await p.goto(BASE + url, { waitUntil: "networkidle", timeout: 45000 });
    // 遅延読み込みを起こしてから戻す
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 800) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 90));
      }
      window.scrollTo(0, 0);
    });
    await p.waitForTimeout(900);
    await p.screenshot({ path: path.join(OUT, `thumb-${key}.jpg`), type: "jpeg", quality: 74 });
    console.log(`✓ ${key}`);
  } catch (e) {
    console.log(`× ${key} — ${String(e.message).slice(0, 60)}`);
  }
  await p.close();
}
await b.close();
