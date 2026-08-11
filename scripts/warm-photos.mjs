#!/usr/bin/env node
/**
 * 理想HP診断ページで使う写真をまとめて取得し、data/photo-cache.json を作る。
 * 自前の /api/photos を叩くので、Unsplash → Pexels → Pixabay → Openverse の
 * フォールバックと永続キャッシュ書き込みがそのまま効く。
 *
 *   npx next dev を起動した状態で:  node scripts/warm-photos.mjs
 */
const BASE = process.env.WARM_BASE || "http://localhost:3000";

// 検索語は components/IdealHpBuilder.tsx と共有（data/photo-queries.json）
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const QUERIES = JSON.parse(
  readFileSync(fileURLToPath(new URL("../data/photo-queries.json", import.meta.url)), "utf8"),
);
const INDUSTRY_QUERIES = QUERIES.industries;
const STYLES = Object.values(QUERIES.styles);

// サーバー側キャッシュは n を含めないので、n=4 で温めればサムネ用 n=2 も当たる
const jobs = new Map();
const add = (orientation, q) => jobs.set(`${orientation}|${q}`, { q, orientation });
for (const q of Object.values(INDUSTRY_QUERIES)) {
  add("portrait", q.person); // 人物には味つけを足さない
  for (const style of STYLES) {
    add("landscape", `${q.product} ${style}`);
    add("landscape", `${q.scenery} ${style}`);
    add("landscape", `${q.interior} ${style}`);
  }
}

console.log(`検索語 ${jobs.size} 件を取得します`);
const bySource = {};
let ok = 0;
for (const [, { q, orientation }] of jobs) {
  const url = `${BASE}/api/photos?q=${encodeURIComponent(q)}&n=4&orientation=${orientation}`;
  try {
    const res = await fetch(url);
    const json = await res.json();
    const count = json.photos?.length ?? 0;
    bySource[json.source ?? "none"] = (bySource[json.source ?? "none"] ?? 0) + 1;
    if (count) ok += 1;
    console.log(`${count ? "✓" : "×"} [${json.source ?? "-"}] ${q} (${count})`);
  } catch (e) {
    console.log(`× ${q} — ${String(e).slice(0, 60)}`);
  }
  await new Promise((r) => setTimeout(r, 200));
}
console.log(`\n取得できた検索語: ${ok}/${jobs.size}`);
console.log("供給元の内訳:", bySource);
