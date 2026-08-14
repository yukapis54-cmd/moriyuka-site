#!/usr/bin/env node
/**
 * デザイン画像を「部品」の単位まで細かく切り出す。
 *
 * slice-design.mjs は横一列（セクション）に切るだけなので、
 * 4つ並んだ商品写真が1枚の素材になってしまう。こちらは
 * セクションの中をさらに縦にも切って、写真1枚・カード1枚まで分解する。
 *
 *   node scripts/slice-parts.mjs guides/references/*.png
 *
 * 出力は .lp-assets/parts/<画像名>/p-001.png … と index.json。
 *
 * 切れ目の探し方は縦横とも同じで、
 * 「その行（列）の画素のばらつきが小さい＝背景だけ」の連続を境目とみなす。
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const files = process.argv.slice(2).filter((a) => !a.startsWith("--"));
if (!files.length) {
  console.error("使い方: node scripts/slice-parts.mjs <画像...>");
  process.exit(1);
}
const OUT_ROOT = path.join(process.cwd(), ".lp-assets", "parts");
mkdirSync(OUT_ROOT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
let total = 0;

for (const src of files) {
  const name = path.basename(src).replace(/\.[^.]+$/, "").replace(/\s+/g, "-");
  const dir = path.join(OUT_ROOT, name);
  mkdirSync(dir, { recursive: true });
  const dataUrl = `data:image/png;base64,${readFileSync(src).toString("base64")}`;

  const parts = await page.evaluate(async (u) => {
    const img = new Image();
    img.src = u;
    await img.decode();
    const W = img.width;
    const H = img.height;
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const D = ctx.getImageData(0, 0, W, H).data;
    const lum = (i) => 0.2126 * D[i] + 0.7152 * D[i + 1] + 0.0722 * D[i + 2];

    /** 範囲内で、指定軸の「無地の帯」を境目として切る */
    const cutsOf = (x0, y0, x1, y1, axis, minGap) => {
      const outer = axis === "y" ? [y0, y1] : [x0, x1];
      const inner = axis === "y" ? [x0, x1] : [y0, y1];
      const step = Math.max(1, Math.floor((inner[1] - inner[0]) / 120));
      const flat = [];
      for (let a = outer[0]; a < outer[1]; a++) {
        let s = 0, sq = 0, n = 0;
        for (let b = inner[0]; b < inner[1]; b += step) {
          const i = axis === "y" ? (a * W + b) * 4 : (b * W + a) * 4;
          const v = lum(i);
          s += v; sq += v * v; n++;
        }
        const m = s / n;
        flat.push(Math.sqrt(Math.max(0, sq / n - m * m)) < 7 ? 1 : 0);
      }
      const cuts = [outer[0]];
      let run = 0;
      for (let k = 0; k < flat.length; k++) {
        if (flat[k]) run++;
        else { if (run >= minGap) cuts.push(outer[0] + k - Math.floor(run / 2)); run = 0; }
      }
      cuts.push(outer[1]);
      return cuts;
    };

    const out = [];
    const rows = cutsOf(0, 0, W, H, "y", 5);
    for (let r = 0; r < rows.length - 1; r++) {
      const y0 = rows[r], y1 = rows[r + 1];
      if (y1 - y0 < 60) continue;
      const cols = cutsOf(0, y0, W, y1, "x", 5);
      for (let c = 0; c < cols.length - 1; c++) {
        const x0 = cols[c], x1 = cols[c + 1];
        const w = x1 - x0, h = y1 - y0;
        if (w < 60 || h < 60) continue;
        // ほぼ無地の部品は捨てる（余白を切り出しても仕方ない）
        let s = 0, sq = 0, n = 0;
        for (let y = y0; y < y1; y += 3) for (let x = x0; x < x1; x += 3) {
          const v = lum((y * W + x) * 4); s += v; sq += v * v; n++;
        }
        const m = s / n;
        if (Math.sqrt(Math.max(0, sq / n - m * m)) < 9) continue;
        const c2 = document.createElement("canvas");
        c2.width = w; c2.height = h;
        c2.getContext("2d").drawImage(cv, x0, y0, w, h, 0, 0, w, h);
        out.push({ x: x0, y: y0, w, h, 縦横比: +(w / h).toFixed(2), url: c2.toDataURL("image/png") });
      }
    }
    return out;
  }, dataUrl);

  const meta = [];
  for (const [i, pt] of parts.entries()) {
    const f = `p-${String(i + 1).padStart(3, "0")}.png`;
    writeFileSync(path.join(dir, f), Buffer.from(pt.url.split(",")[1], "base64"));
    meta.push({ file: f, x: pt.x, y: pt.y, w: pt.w, h: pt.h, 縦横比: pt.縦横比 });
  }
  writeFileSync(path.join(dir, "index.json"), JSON.stringify(meta, null, 2));
  console.log(`${name}: ${meta.length} 部品`);
  total += meta.length;
}
console.log(`\n合計 ${total} 部品`);
await browser.close();
