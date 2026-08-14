#!/usr/bin/env node
/**
 * 切り出した部品から「文字の入っていない写真」だけを選り分ける。
 *
 *   node scripts/score-parts.mjs
 *
 * 判定の考え方:
 *  - 文字の部品は、大半が背景色1色で、そこに黒い画素が少しだけ乗っている
 *    → 最頻色が占める割合が高い / 色の種類が少ない
 *  - 写真は明暗と色がなだらかに散らばる
 *    → 最頻色の割合が低い / 色の種類が多い / 隣り合う画素の差が小さい（急峻な輪郭が少ない）
 *
 * 出力は .lp-assets/parts/selected.json（写真らしい順）。
 */
import { chromium } from "playwright";
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), ".lp-assets", "parts");
if (!existsSync(ROOT)) {
  console.error("先に scripts/slice-parts.mjs を実行してください");
  process.exit(1);
}
const browser = await chromium.launch();
const page = await browser.newPage();
const results = [];

for (const design of readdirSync(ROOT).filter((d) => !d.endsWith(".json"))) {
  for (const f of readdirSync(path.join(ROOT, design)).filter((f) => f.endsWith(".png"))) {
    const file = path.join(ROOT, design, f);
    const url = "data:image/png;base64," + readFileSync(file).toString("base64");
    const m = await page.evaluate(async (u) => {
      const img = new Image();
      img.src = u;
      await img.decode();
      const n = 64;
      const cv = document.createElement("canvas");
      cv.width = n; cv.height = n;
      const ctx = cv.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, n, n);
      const d = ctx.getImageData(0, 0, n, n).data;
      const bins = new Map();
      let edge = 0;
      for (let y = 0; y < n; y++) {
        for (let x = 0; x < n; x++) {
          const i = (y * n + x) * 4;
          const key = `${d[i] >> 5},${d[i + 1] >> 5},${d[i + 2] >> 5}`;
          bins.set(key, (bins.get(key) ?? 0) + 1);
          if (x > 0) {
            const j = i - 4;
            const dl = Math.abs(d[i] - d[j]) + Math.abs(d[i + 1] - d[j + 1]) + Math.abs(d[i + 2] - d[j + 2]);
            if (dl > 150) edge++; // 文字の輪郭のような急峻な差
          }
        }
      }
      const total = n * n;
      const top = Math.max(...bins.values()) / total;
      return { 最頻色の割合: +top.toFixed(3), 色の種類: bins.size, 急峻な輪郭: +(edge / total).toFixed(3), w: img.width, h: img.height };
    }, url);

    // 写真らしさ: 最頻色が少なく、色が多く、急峻な輪郭が少ないほど高い
    const score =
      (1 - m.最頻色の割合) * 0.5 + Math.min(1, m.色の種類 / 90) * 0.35 + (1 - Math.min(1, m.急峻な輪郭 * 12)) * 0.15;
    results.push({ design, file: f, path: `${design}/${f}`, score: +score.toFixed(3), ...m });
  }
}
results.sort((a, b) => b.score - a.score);
writeFileSync(path.join(ROOT, "selected.json"), JSON.stringify(results, null, 2));
const good = results.filter((r) => r.score >= 0.62 && r.w >= 120 && r.h >= 120);
console.log(`全 ${results.length} 部品を採点`);
console.log(`写真らしいもの（0.62以上・120px以上）: ${good.length} 個`);
console.log("上位10:");
good.slice(0, 10).forEach((r) => console.log(`  ${r.score} ${r.path} (${r.w}x${r.h})`));
await browser.close();
