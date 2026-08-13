#!/usr/bin/env node
/**
 * LP のデザイン画像（GPT Image などで作った縦長の1枚絵）を、
 * セクションごとの素材ファイルに切り分ける。
 *
 *   node scripts/slice-design.mjs "ChatGPT Image ....png"
 *   node scripts/slice-design.mjs design.png --min-gap 24 --width 1440
 *
 * 出力は .lp-assets/<画像名>/ に
 *   - section-01.png … 横一列で色が揃っている行を境目にして切ったセクション
 *   - full.png       … 実装に渡す用の等倍コピー
 *   - sections.json  … 各セクションの位置と高さ、代表色
 *
 * 切れ目の探し方: 1行ぶんの画素の色のばらつき（分散）が小さい行は、
 * 背景だけの行＝セクションの境目とみなす。写真や文字がある行はばらつきが大きい。
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const src = args.find((a) => !a.startsWith("--"));
if (!src) {
  console.error('使い方: node scripts/slice-design.mjs "デザイン画像.png" [--min-gap 20] [--min-section 200]');
  process.exit(1);
}
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : d;
};
const minGap = opt("min-gap", 20); // 境目とみなすのに必要な、無地の行の連続数
const minSection = opt("min-section", 180); // これより薄いセクションは前とくっつける
// 複数案が横に並んだシート（01〜05 のような比較用の絵）は、先に縦で割ってから扱う
const cols = opt("cols", 1);

const outDir = path.join(process.cwd(), ".lp-assets", path.basename(src).replace(/\.[^.]+$/, "").replace(/\s+/g, "-"));
mkdirSync(outDir, { recursive: true });
const dataUrl = `data:image/png;base64,${readFileSync(src).toString("base64")}`;

const browser = await chromium.launch();
const page = await browser.newPage();
const result = await page.evaluate(
  async ({ dataUrl, minGap, minSection, cols }) => {
    const img = new Image();
    img.src = dataUrl;
    await img.decode();

    // 横並びのシートなら、まず縦に割って1案ずつ返す（各案の中はそのまま1枚として扱う）
    if (cols > 1) {
      const cw = Math.floor(img.width / cols);
      const designs = [];
      for (let c = 0; c < cols; c++) {
        const cc = document.createElement("canvas");
        cc.width = cw;
        cc.height = img.height;
        cc.getContext("2d").drawImage(img, c * cw, 0, cw, img.height, 0, 0, cw, img.height);
        const px = cc.getContext("2d").getImageData(Math.floor(cw * 0.5), Math.floor(img.height * 0.02), 1, 1).data;
        designs.push({
          index: c + 1,
          top: 0,
          height: img.height,
          代表色: `#${[px[0], px[1], px[2]].map((v) => v.toString(16).padStart(2, "0")).join("")}`,
          url: cc.toDataURL("image/png"),
        });
      }
      return { W: img.width, H: img.height, sections: designs, full: null, 縦割り: true };
    }

    const W = img.width;
    const H = img.height;
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0);
    const all = ctx.getImageData(0, 0, W, H).data;

    // 各行の「色のばらつき」を測る。無地の行＝境目の候補
    const flat = new Uint8Array(H);
    const step = Math.max(1, Math.floor(W / 200)); // 横は間引いて速くする
    for (let y = 0; y < H; y++) {
      let sum = 0;
      let sumSq = 0;
      let n = 0;
      for (let x = 0; x < W; x += step) {
        const i = (y * W + x) * 4;
        const v = 0.2126 * all[i] + 0.7152 * all[i + 1] + 0.0722 * all[i + 2];
        sum += v;
        sumSq += v * v;
        n += 1;
      }
      const mean = sum / n;
      const sd = Math.sqrt(Math.max(0, sumSq / n - mean * mean));
      flat[y] = sd < 6 ? 1 : 0;
    }

    // 無地の行が minGap 以上続いたら、その中央を切れ目にする
    const cuts = [0];
    let run = 0;
    for (let y = 0; y < H; y++) {
      if (flat[y]) {
        run += 1;
      } else {
        if (run >= minGap) cuts.push(y - Math.floor(run / 2));
        run = 0;
      }
    }
    cuts.push(H);

    // 薄すぎるセクションは前にくっつける
    const bounds = [];
    for (let i = 0; i < cuts.length - 1; i++) {
      const top = cuts[i];
      const bottom = cuts[i + 1];
      if (bottom - top < minSection && bounds.length) {
        bounds[bounds.length - 1].bottom = bottom;
      } else {
        bounds.push({ top, bottom });
      }
    }

    const out = [];
    for (const [i, b] of bounds.entries()) {
      const h = b.bottom - b.top;
      const c2 = document.createElement("canvas");
      c2.width = W;
      c2.height = h;
      c2.getContext("2d").drawImage(cv, 0, b.top, W, h, 0, 0, W, h);
      // 代表色（左上のあたり）を拾っておくと、実装のときに配色をすぐ渡せる
      const px = ctx.getImageData(Math.floor(W * 0.02), b.top + Math.floor(h * 0.05), 1, 1).data;
      out.push({
        index: i + 1,
        top: b.top,
        height: h,
        代表色: `#${[px[0], px[1], px[2]].map((v) => v.toString(16).padStart(2, "0")).join("")}`,
        url: c2.toDataURL("image/png"),
      });
    }
    return { W, H, sections: out, full: cv.toDataURL("image/png") };
  },
  { dataUrl, minGap, minSection, cols },
);

if (result.full) writeFileSync(path.join(outDir, "full.png"), Buffer.from(result.full.split(",")[1], "base64"));
const meta = [];
for (const s of result.sections) {
  const name = result.縦割り
    ? `design-${String(s.index).padStart(2, "0")}.png`
    : `section-${String(s.index).padStart(2, "0")}.png`;
  writeFileSync(path.join(outDir, name), Buffer.from(s.url.split(",")[1], "base64"));
  meta.push({ file: name, top: s.top, height: s.height, 代表色: s.代表色 });
}
writeFileSync(path.join(outDir, "sections.json"), JSON.stringify({ 元画像: `${result.W}x${result.H}`, sections: meta }, null, 2));

console.log(`元画像 ${result.W}x${result.H}`);
console.log(
  `${meta.length} ${result.縦割り ? "案" : "セクション"}に切り出しました → ${path.relative(process.cwd(), outDir)}/`,
);
meta.forEach((m) => console.log(`  ${m.file}  高さ${m.height}px  代表色 ${m.代表色}`));
await browser.close();
