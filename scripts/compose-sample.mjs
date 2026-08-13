#!/usr/bin/env node
/**
 * 切り出した素材（.lp-assets/**\/section-*.png）を積み上げて、
 * 診断の選択肢に出す「LPサンプル」を1枚の画像に組み立てる。
 *
 *   node scripts/compose-sample.mjs
 *
 * どの素材をどう積むかは下の RECIPES に書く。
 * 出力は public/samples/<キー>.jpg。診断の選択肢はこのファイル名で引く。
 *
 * 素材の幅はバラバラなので、いちばん狭いものに合わせて中央でトリミングする。
 * 継ぎ目が目立たないよう、境目に細い線を1本入れる。
 */
import { chromium } from "playwright";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ASSETS = path.join(ROOT, ".lp-assets");
const OUT = path.join(ROOT, "public/samples");
mkdirSync(OUT, { recursive: true });

/**
 * 目的の4パターン。
 * 当初は「目的以外を揃える」ために全部同じブランドから採ったが、
 * 4枚ともほぼ同じ絵になり、選んでも違いが分からなかった。
 * 目的に合う素材を別々のブランドから採り、パッと見で違うようにする。
 */
const RECIPES = {
  // 売る: 商品が並んでいること自体が答え。カード列とベネフィット帯を厚く
  "goal-shop": [
    "girly-mellty-lp/section-01.png",
    "girly-mellty-lp/section-03.png",
    "girly-mellty-lp/section-05.png",
    "girly-mellty-lp/section-06.png",
  ],
  // 相談: 落ち着いた信頼の見せ方。店の紹介 → 大切にしていること → 予約
  "goal-lead": [
    "cafe-harmonie-lp/section-01.png",
    "cafe-harmonie-lp/section-02.png",
    "cafe-harmonie-lp/section-05.png",
    "cafe-harmonie-lp/section-07.png",
  ],
  // 世界観: 商品を並べない。大きな写真と一文だけで押す
  "goal-brand": [
    "mode-lunea-lp/section-01.png",
    "mode-lunea-lp/section-02.png",
    "mode-lunea-lp/section-05.png",
  ],
  // ファン: 読み物と更新情報。また来る理由を作る面
  "goal-fan": [
    "adult-mellty-lp/section-01.png",
    "adult-mellty-lp/section-05.png",
    "adult-mellty-lp/section-07.png",
    "adult-mellty-lp/section-08.png",
  ],

  // メインビジュアルの主役。1枚目に何が写っているかで選ぶ
  "hero-person": ["mode-lunea-lp/section-02.png", "mode-lunea-lp/section-05.png"],
  "hero-product": ["korean-moru-cafe-lp/section-03.png", "korean-moru-cafe-lp/section-04.png"],
  "hero-scenery": ["cafe-harmonie-lp/section-01.png", "cafe-harmonie-lp/section-02.png"],
  "hero-logo": ["korean-moru-cafe-lp/section-01.png", "korean-moru-cafe-lp/section-02.png"],

  // 文章の量。積む素材の数がそのままページの丈になるので、違いが一目で分かる
  "density-light": ["cafe-harmonie-lp/section-01.png", "cafe-harmonie-lp/section-07.png"],
  "density-balanced": [
    "cafe-harmonie-lp/section-01.png",
    "cafe-harmonie-lp/section-02.png",
    "cafe-harmonie-lp/section-04.png",
    "cafe-harmonie-lp/section-07.png",
  ],
  "density-heavy": [
    "cafe-harmonie-lp/section-01.png",
    "cafe-harmonie-lp/section-02.png",
    "cafe-harmonie-lp/section-04.png",
    "cafe-harmonie-lp/section-05.png",
    "cafe-harmonie-lp/section-06.png",
    "cafe-harmonie-lp/section-07.png",
  ],

  // 色の方向性。素材のあるものだけ差し替え、残りは手描きのままにする
  "palette-mono": ["mode-lunea-lp/section-01.png", "mode-lunea-lp/section-02.png"],
  "palette-rose": ["girly-mellty-lp/section-01.png", "girly-mellty-lp/section-03.png"],
  "palette-earth": ["cafe-harmonie-lp/section-01.png", "cafe-harmonie-lp/section-04.png"],
  "palette-midnight": ["mode-lumina-lp-1/section-01.png", "mode-lumina-lp-1/section-02.png"],

  // トップページの組み方。ヒーローの型が違うものを別ブランドから採る
  "layout-fullhero": ["mode-lunea-lp/section-01.png", "mode-lunea-lp/section-03.png", "mode-lunea-lp/section-04.png"],
  "layout-split": ["adult-mellty-lp/section-01.png", "adult-mellty-lp/section-05.png", "adult-mellty-lp/section-08.png"],
  "layout-card": ["girly-mellty-lp/section-01.png", "girly-mellty-lp/section-03.png", "girly-mellty-lp/section-06.png"],
  "layout-magazine": [
    "korean-moru-cafe-lp/section-01.png",
    "korean-moru-cafe-lp/section-02.png",
    "korean-moru-cafe-lp/section-05.png",
  ],
};

const browser = await chromium.launch();
const page = await browser.newPage();
let made = 0;

for (const [key, files] of Object.entries(RECIPES)) {
  const parts = [];
  for (const f of files) {
    const p = path.join(ASSETS, f);
    if (!existsSync(p)) {
      console.log(`× ${key}: 素材が見つかりません ${f}`);
      parts.length = 0;
      break;
    }
    parts.push("data:image/png;base64," + readFileSync(p).toString("base64"));
  }
  if (!parts.length) continue;

  const dataUrl = await page.evaluate(async (srcs) => {
    const imgs = [];
    for (const s of srcs) {
      const im = new Image();
      im.src = s;
      await im.decode();
      imgs.push(im);
    }
    // 幅はいちばん狭い素材に合わせ、他は中央でトリミングする
    const W = Math.min(...imgs.map((i) => i.width));
    const scaled = imgs.map((i) => ({ img: i, h: Math.round((i.height * W) / i.width) }));
    const H = scaled.reduce((a, s) => a + s.h, 0);
    const cv = document.createElement("canvas");
    cv.width = W;
    cv.height = H;
    const ctx = cv.getContext("2d");
    let y = 0;
    for (const s of scaled) {
      ctx.drawImage(s.img, 0, 0, s.img.width, s.img.height, 0, y, W, s.h);
      y += s.h;
      if (y < H) {
        // 継ぎ目に細い線。素材の切り替わりが不自然に見えるのを抑える
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(0, y - 1, W, 1);
      }
    }
    return cv.toDataURL("image/jpeg", 0.82);
  }, parts);

  writeFileSync(path.join(OUT, `${key}.jpg`), Buffer.from(dataUrl.split(",")[1], "base64"));
  made += 1;
  console.log(`✓ ${key}.jpg  （${files.length}素材）`);
}

console.log(`\n${made} 枚を public/samples/ に書き出しました`);
await browser.close();
