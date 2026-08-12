#!/usr/bin/env node
/**
 * ChatGPT に出させた「素材シート」（グリッドに素材を並べた1枚絵）を、
 * 1マスずつの PNG に切り分けて、白背景を透過する。
 *
 *   node scripts/split-sheet.mjs sheet.png --cols 4 --rows 4
 *   node scripts/split-sheet.mjs sheet.png --cols 4 --rows 4 --trim 8 --tolerance 40
 *
 * 出力は .lp-assets/<シート名>/01.png …（gitignore 済み）。
 *
 * 透過は「四隅から白の領域を辿って外側だけ抜く」方式。
 * 画像全体の白を抜くと、図形の内側の白まで穴が開いてしまうため。
 *
 * 画像処理はブラウザの canvas でやる（playwright は既に入っている）。
 * sharp などのネイティブ依存を増やさずに済む。
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const src = args.find((a) => !a.startsWith("--"));
if (!src) {
  console.error("使い方: node scripts/split-sheet.mjs <素材シート.png> [--cols 4] [--rows 4] [--trim 0] [--tolerance 24]");
  process.exit(1);
}
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : def;
};
const cols = opt("cols", 4);
const rows = opt("rows", 4);
const trim = opt("trim", 0);
const tolerance = opt("tolerance", 24);

const outDir = path.join(process.cwd(), ".lp-assets", path.basename(src).replace(/\.[^.]+$/, ""));
mkdirSync(outDir, { recursive: true });

const dataUrl = `data:image/${path.extname(src).slice(1) || "png"};base64,${readFileSync(src).toString("base64")}`;

const browser = await chromium.launch();
const page = await browser.newPage();
const tiles = await page.evaluate(
  async ({ dataUrl, cols, rows, trim, tolerance }) => {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    const tw = Math.floor(img.width / cols);
    const th = Math.floor(img.height / rows);
    const out = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const w = tw - trim * 2;
        const h = th - trim * 2;
        if (w <= 0 || h <= 0) continue;
        const cv = document.createElement("canvas");
        cv.width = w;
        cv.height = h;
        const ctx = cv.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, c * tw + trim, r * th + trim, w, h, 0, 0, w, h);

        const id = ctx.getImageData(0, 0, w, h);
        const d = id.data;
        const isWhite = (i) => d[i] >= 255 - tolerance && d[i + 1] >= 255 - tolerance && d[i + 2] >= 255 - tolerance;

        // 四隅から白を塗りつぶすように辿る。素材の内側の白は残す
        const stack = [];
        const seen = new Uint8Array(w * h);
        const push = (x, y) => {
          if (x < 0 || y < 0 || x >= w || y >= h) return;
          const pi = y * w + x;
          if (seen[pi]) return;
          seen[pi] = 1;
          stack.push(pi);
        };
        for (let x = 0; x < w; x++) {
          push(x, 0);
          push(x, h - 1);
        }
        for (let y = 0; y < h; y++) {
          push(0, y);
          push(w - 1, y);
        }
        let cleared = 0;
        while (stack.length) {
          const pi = stack.pop();
          const i = pi * 4;
          if (!isWhite(i)) continue;
          d[i + 3] = 0;
          cleared += 1;
          const x = pi % w;
          const y = (pi / w) | 0;
          push(x + 1, y);
          push(x - 1, y);
          push(x, y + 1);
          push(x, y - 1);
        }
        ctx.putImageData(id, 0, 0);

        // 中身が無いマス（ほぼ全部が透明）は捨てる
        const kept = w * h - cleared;
        if (kept < w * h * 0.005) continue;

        out.push({ index: r * cols + c + 1, url: cv.toDataURL("image/png"), kept });
      }
    }
    return out;
  },
  { dataUrl, cols, rows, trim, tolerance },
);

for (const t of tiles) {
  const buf = Buffer.from(t.url.split(",")[1], "base64");
  writeFileSync(path.join(outDir, `${String(t.index).padStart(2, "0")}.png`), buf);
}
console.log(`${tiles.length} / ${cols * rows} マスを書き出しました → ${path.relative(process.cwd(), outDir)}/`);
if (tiles.length < cols * rows) {
  console.log("（空のマスは捨てています。欠けすぎている場合は --trim を小さく、--tolerance を大きくしてください）");
}
await browser.close();
