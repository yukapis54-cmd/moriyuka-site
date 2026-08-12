#!/usr/bin/env node
/**
 * 理想HP診断の写真を Gemini で先に作り置きして、data/photo-cache.json に焼き込む。
 *
 * 訪問者のリクエスト中には一切 API を叩かない（無料枠 500枚/日 はすぐ枯れるし、
 * 生成を待たせると診断が止まる）。ここで作った PNG は public/generated/ に置くので
 * 同一オリジンで配信され、canvas も汚染されない。
 *
 *   GEMINI_API_KEY=xxx node scripts/gen-photos.mjs            # 未生成のぶんだけ作る
 *   GEMINI_API_KEY=xxx node scripts/gen-photos.mjs --limit 20 # 20枚だけ試す
 *   GEMINI_API_KEY=xxx node scripts/gen-photos.mjs --force    # 既存も作り直す
 *
 * 無料枠の目安: Gemini 2.5 Flash Image で 1日500枚。全種類そろえても 156枚。
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const QUERIES = JSON.parse(readFileSync(path.join(ROOT, "data/photo-queries.json"), "utf8"));
const CACHE_FILE = path.join(ROOT, "data/photo-cache.json");
const OUT_DIR = path.join(ROOT, "public/generated");
const MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("GEMINI_API_KEY が要ります。https://aistudio.google.com/apikey で発行してください。");
  process.exit(1);
}

const args = process.argv.slice(2);
const FORCE = args.includes("--force");
const LIMIT = Number(args[args.indexOf("--limit") + 1]) || Infinity;

/** 検索語（stock 写真向け）を、生成AI に効く指示文へ言い換える */
function toPrompt(subject, style, orientation) {
  const shape = orientation === "portrait" ? "縦位置 3:4" : "横位置 16:9";
  return [
    `A high-end editorial photograph: ${subject}.`,
    `Mood and treatment: ${style}, cinematic depth of field, soft natural light, film grain.`,
    `Composition: ${shape}, generous negative space on one side so headline text can be placed there.`,
    `Muted, cohesive color palette. Photorealistic. No text, no logos, no watermarks, no people looking at the camera unless the subject is a portrait.`,
  ].join(" ");
}

/** 全パターン。warm-photos.mjs と同じ組み合わせ方 */
function buildJobs() {
  const jobs = [];
  for (const [industry, q] of Object.entries(QUERIES.industries)) {
    jobs.push({ key: `portrait|${q.person}`, subject: q.person, style: "", orientation: "portrait", industry });
    for (const style of Object.values(QUERIES.styles)) {
      for (const kind of ["product", "scenery", "interior"]) {
        jobs.push({
          key: `landscape|${q[kind]} ${style}`,
          subject: q[kind],
          style,
          orientation: "landscape",
          industry,
        });
      }
    }
  }
  return jobs;
}

async function generate(prompt) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "x-goog-api-key": KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
  );
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status} ${body.slice(0, 200)}`);
  }
  const json = await res.json();
  const parts = json.candidates?.[0]?.content?.parts ?? [];
  const img = parts.find((p) => p.inlineData?.data);
  if (!img) throw new Error("画像が返ってこなかった（安全フィルタの可能性）");
  return Buffer.from(img.inlineData.data, "base64");
}

function slug(s) {
  return s.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60).toLowerCase();
}

mkdirSync(OUT_DIR, { recursive: true });
const cache = existsSync(CACHE_FILE) ? JSON.parse(readFileSync(CACHE_FILE, "utf8")) : {};

const jobs = buildJobs();
const todo = jobs.filter((j) => FORCE || cache[j.key]?.photos?.[0]?.source !== "gemini").slice(0, LIMIT);
console.log(`全 ${jobs.length} パターン中、${todo.length} 件を生成します（モデル: ${MODEL}）`);

let ok = 0;
let failed = 0;
for (const [i, job] of todo.entries()) {
  const name = `${slug(job.key)}.png`;
  const file = path.join(OUT_DIR, name);
  try {
    const buf = await generate(toPrompt(job.subject, job.style || "natural light, editorial", job.orientation));
    writeFileSync(file, buf);
    const url = `/generated/${name}`;
    cache[job.key] = {
      at: Date.now(),
      photos: [
        {
          id: slug(job.key),
          url,
          thumb: url,
          author: "Gemini で生成",
          authorUrl: "https://deepmind.google/technologies/gemini/",
          downloadLocation: "",
          source: "gemini",
        },
      ],
    };
    ok += 1;
    console.log(`✓ ${i + 1}/${todo.length} ${Math.round(buf.length / 1024)}KB ${job.key}`);
  } catch (e) {
    failed += 1;
    console.log(`× ${i + 1}/${todo.length} ${job.key} — ${String(e.message).slice(0, 120)}`);
    // 429 は日次上限。粘っても無駄なので打ち切って、取れた分を保存する
    if (String(e.message).startsWith("429")) {
      console.log("→ レート上限に達しました。ここまでを保存して終了します。");
      break;
    }
  }
  // 途中で落ちても成果が残るよう都度保存する
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  await new Promise((r) => setTimeout(r, 1500));
}

writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
console.log(`\n生成できた: ${ok} 件 / 失敗: ${failed} 件`);
console.log("確認: npm run dev で /ideal-hp を開く → 良ければ npm run deploy");
