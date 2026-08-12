"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import PHOTO_QUERIES from "../data/photo-queries.json";
import { patternsFor, promptFor, reasonsFor, type DesignReason, type UiPattern } from "./uiPatterns";

/* ================================ questions =============================== */

type Question = {
  key: "industry" | "goal" | "tone" | "palette" | "layout" | "hero" | "density";
  title: string;
  hint: string;
  options: { id: string; label: string; desc: string; swatch?: string[] }[];
};

const QUESTIONS: Question[] = [
  {
    key: "industry",
    title: "どんなお仕事ですか？",
    hint: "ここで写真の中身が決まります。いちばん近いものを。",
    options: [
      { id: "seafood", label: "水産・食品の生産／加工", desc: "漁業・農産・加工品・産直" },
      { id: "sweets", label: "菓子・パン・カフェ", desc: "和菓子・洋菓子・喫茶" },
      { id: "restaurant", label: "飲食店", desc: "レストラン・居酒屋・ラーメン" },
      { id: "salon", label: "美容・サロン", desc: "美容室・ネイル・エステ・整体" },
      { id: "craft", label: "ものづくり・工房", desc: "陶器・木工・染織・作家" },
      { id: "pro", label: "士業・コンサル・IT", desc: "相談業・サポート・制作" },
      { id: "school", label: "教室・スクール", desc: "習い事・講座・ワークショップ" },
      { id: "stay", label: "宿泊・観光", desc: "民宿・ゲストハウス・体験" },
      { id: "construction", label: "建設・工務店", desc: "新築・リフォーム・設備" },
      { id: "clinic", label: "治療院・クリニック", desc: "整体・鍼灸・歯科・接骨" },
      { id: "farm", label: "農業・果樹", desc: "産直・観光農園・加工" },
      { id: "retail", label: "雑貨・アパレル", desc: "セレクトショップ・小売" },
    ],
  },
  {
    key: "goal",
    title: "そのHP、いちばんの目的は？",
    hint: "ゴールが決まると、置くべきボタンが決まります。",
    options: [
      { id: "shop", label: "商品を売りたい", desc: "通販・ECへの導線が主役" },
      { id: "lead", label: "問い合わせを増やしたい", desc: "相談・見積もりへ誘導" },
      { id: "brand", label: "世界観を伝えたい", desc: "ブランディング・作品紹介" },
      { id: "fan", label: "ファンを集めたい", desc: "SNS・メルマガ・LINE登録" },
    ],
  },
  {
    key: "tone",
    title: "全体の空気感は？",
    hint: "余白・角の丸み・文字の細さが変わります。",
    options: [
      { id: "natural", label: "やさしい・ナチュラル", desc: "丸み強め／ゆったり余白" },
      { id: "modern", label: "モダン・ミニマル", desc: "直線的／余白広め" },
      { id: "premium", label: "上質・落ち着き", desc: "細い明朝／静かな配色" },
      { id: "pop", label: "元気・ポップ", desc: "コントラスト強め／密度高め" },
      { id: "wamodern", label: "和モダン・老舗", desc: "縦書き／アーチ写真／サイドレール" },
      { id: "patisserie", label: "洋菓子店・アーチ", desc: "生成り＋金／中央カラム／縦組ロゴ" },
      { id: "popwa", label: "ポップ和・極太", desc: "極太ロゴ／ブロブ写真／吹き出し／日英併記" },
      { id: "cinema", label: "シネマ・ダーク", desc: "黒背景／明朝の一文／全面映像／余白最大" },
    ],
  },
  {
    key: "palette",
    title: "色の方向性は？",
    hint: "メイン1色＋差し色1色で組みます。",
    options: [
      { id: "ocean", label: "海・ブルー", desc: "清潔感・信頼・爽やか", swatch: ["#0b6fb8", "#4fc3f7", "#eaf6fe"] },
      { id: "earth", label: "土・ベージュ", desc: "温かみ・手仕事・food系", swatch: ["#8a5a2b", "#d9a05b", "#f4ece1"] },
      { id: "mono", label: "モノトーン", desc: "写真が主役になる配色", swatch: ["#151515", "#8c8c8c", "#ededed"] },
      { id: "forest", label: "森・グリーン", desc: "自然・健康・ていねい", swatch: ["#2f6b4f", "#7fbf9a", "#e8f2ec"] },
      { id: "rose", label: "桜・ピンク", desc: "やわらかい・親しみ・女性向け", swatch: ["#c2536f", "#f0aebf", "#fdeef2"] },
      { id: "sunset", label: "夕焼け・オレンジ", desc: "元気・食欲・あたたかさ", swatch: ["#c9541f", "#f0954a", "#fdf0e4"] },
      { id: "navy", label: "紺＋金", desc: "格式・信頼・老舗の高級感", swatch: ["#12233f", "#b99a5b", "#f3f1ea"] },
      { id: "plum", label: "葡萄・パープル", desc: "上品・個性・クリエイティブ", swatch: ["#5b3a67", "#a982b8", "#f3edf6"] },
      { id: "charcoal", label: "墨＋朱", desc: "凛とした・和・力強さ", swatch: ["#1c1c1c", "#c8402f", "#f2efe9"] },
      { id: "mint", label: "ミント・淡青緑", desc: "清潔・軽やか・医療/美容", swatch: ["#12796e", "#7fd0c4", "#e9f6f4"] },
    ],
  },
  {
    key: "layout",
    title: "トップページの組み方は？",
    hint: "ファーストビューの型を選びます。",
    options: [
      { id: "fullhero", label: "全面ビジュアル", desc: "写真1枚でガツンと" },
      { id: "split", label: "左右2分割", desc: "写真とコピーを並べる" },
      { id: "card", label: "カード並べ", desc: "商品・メニューが多い人向け" },
      { id: "magazine", label: "雑誌風", desc: "読み物・ストーリー重視" },
    ],
  },
  {
    key: "hero",
    title: "メインビジュアルの主役は？",
    hint: "1枚目に何を映すかで印象が決まります。",
    options: [
      { id: "person", label: "人物", desc: "顔が見える安心感" },
      { id: "product", label: "商品", desc: "シズル感で購買につなぐ" },
      { id: "scenery", label: "風景・現場", desc: "産地・空気感を伝える" },
      { id: "logo", label: "ロゴ・文字", desc: "写真がなくても成立" },
    ],
  },
  {
    key: "density",
    title: "文章の量は？",
    hint: "スクロールの長さが変わります。",
    options: [
      { id: "light", label: "少なめ", desc: "見て伝わる。短いページ" },
      { id: "balanced", label: "ふつう", desc: "画像と文章が半々" },
      { id: "heavy", label: "しっかり読ませる", desc: "想いや実績を丁寧に" },
    ],
  },
];

type Answers = Partial<Record<Question["key"], string>>;
type Full = Required<Answers>;

/** 未回答の項目はこの値でプレビューする */
const DEFAULTS: Full = {
  industry: "seafood",
  goal: "shop",
  tone: "natural",
  palette: "ocean",
  layout: "split",
  hero: "scenery",
  density: "balanced",
};

/* ================================= theme ================================== */

type Palette = {
  name: string;
  bg: string;
  soft: string;
  line: string;
  primary: string;
  primaryDeep: string;
  accent: string;
  text: string;
  sub: string;
  dark: string;
};

const PALETTES: Record<string, Palette> = {
  ocean: {
    name: "Ocean Blue",
    bg: "#ffffff",
    soft: "#eef7fd",
    line: "#dbeafe",
    primary: "#0b6fb8",
    primaryDeep: "#064a7c",
    accent: "#4fc3f7",
    text: "#0d2436",
    sub: "#5c7c92",
    dark: "#08283d",
  },
  earth: {
    name: "Earth Beige",
    bg: "#fffdfa",
    soft: "#f6efe4",
    line: "#ebdcc7",
    primary: "#96602f",
    primaryDeep: "#663f1c",
    accent: "#dfa961",
    text: "#33261a",
    sub: "#8a7761",
    dark: "#2c2118",
  },
  mono: {
    name: "Monotone",
    bg: "#ffffff",
    soft: "#f2f2f2",
    line: "#e2e2e2",
    primary: "#171717",
    primaryDeep: "#000000",
    accent: "#9a9a9a",
    text: "#141414",
    sub: "#7a7a7a",
    dark: "#111111",
  },
  rose: {
    name: "Sakura Rose",
    bg: "#fffdfe",
    soft: "#fceff3",
    line: "#f4dbe3",
    primary: "#c2536f",
    primaryDeep: "#8c2f47",
    accent: "#f0aebf",
    text: "#3a222a",
    sub: "#8d6c76",
    dark: "#2c1a20",
  },
  sunset: {
    name: "Sunset Orange",
    bg: "#fffdfa",
    soft: "#fdf0e4",
    line: "#f6ddc6",
    primary: "#c9541f",
    primaryDeep: "#8e3610",
    accent: "#f0954a",
    text: "#3a2418",
    sub: "#8b6a55",
    dark: "#2b190f",
  },
  navy: {
    name: "Navy & Gold",
    bg: "#fffefb",
    soft: "#f3f1ea",
    line: "#e3ddcd",
    primary: "#12233f",
    primaryDeep: "#0a1526",
    accent: "#b99a5b",
    text: "#16202f",
    sub: "#6b7484",
    dark: "#0d1626",
  },
  plum: {
    name: "Plum Purple",
    bg: "#fffdff",
    soft: "#f3edf6",
    line: "#e2d5e9",
    primary: "#5b3a67",
    primaryDeep: "#3a2243",
    accent: "#a982b8",
    text: "#2c1f31",
    sub: "#77687e",
    dark: "#231729",
  },
  charcoal: {
    name: "Sumi & Vermilion",
    bg: "#fffefc",
    soft: "#f2efe9",
    line: "#e2ded4",
    primary: "#1c1c1c",
    primaryDeep: "#000000",
    accent: "#c8402f",
    text: "#141414",
    sub: "#6f6c66",
    dark: "#121212",
  },
  mint: {
    name: "Mint",
    bg: "#fffffe",
    soft: "#e9f6f4",
    line: "#cfe8e3",
    primary: "#12796e",
    primaryDeep: "#0a4d46",
    accent: "#7fd0c4",
    text: "#15302c",
    sub: "#5f7d78",
    dark: "#0f2b27",
  },
  forest: {
    name: "Forest Green",
    bg: "#fffffe",
    soft: "#eaf3ed",
    line: "#d3e6da",
    primary: "#2f6b4f",
    primaryDeep: "#1d4633",
    accent: "#7fbf9a",
    text: "#17281f",
    sub: "#5f7a6b",
    dark: "#132b1f",
  },
};

type Tone = { radius: number; card: number; head: number; weightHead: number; weightBody: number; track: number; air: number };

const TONES: Record<string, Tone> = {
  natural: { radius: 999, card: 24, head: 56, weightHead: 700, weightBody: 400, track: 0, air: 1.1 },
  modern: { radius: 2, card: 2, head: 60, weightHead: 600, weightBody: 300, track: 2, air: 1.25 },
  premium: { radius: 0, card: 0, head: 54, weightHead: 300, weightBody: 300, track: 6, air: 1.4 },
  pop: { radius: 999, card: 20, head: 64, weightHead: 800, weightBody: 500, track: 0, air: 0.9 },
  wamodern: { radius: 0, card: 0, head: 46, weightHead: 400, weightBody: 300, track: 8, air: 1.5 },
  patisserie: { radius: 999, card: 0, head: 44, weightHead: 400, weightBody: 300, track: 6, air: 1.4 },
  popwa: { radius: 999, card: 28, head: 58, weightHead: 900, weightBody: 500, track: 0, air: 0.95 },
  cinema: { radius: 0, card: 0, head: 40, weightHead: 300, weightBody: 300, track: 10, air: 2.0 },
};

const COPY: Record<string, { kicker: string; h1: string; h2: string; lead: string; cta: string; sec: string; band: string }> = {
  shop: {
    kicker: "ONLINE STORE",
    h1: "つくり手の顔が見える、",
    h2: "本気の一品を。",
    lead: "産地から直送。数量限定でお届けします。",
    cta: "商品を見る",
    sec: "PRODUCTS",
    band: "気になったら、まずはひとつ。",
  },
  lead: {
    kicker: "CONSULTING",
    h1: "はじめの一歩を、",
    h2: "いっしょに。",
    lead: "初回相談は無料。オンラインで全国対応しています。",
    cta: "無料で相談する",
    sec: "SERVICE",
    band: "まずは話を聞かせてください。",
  },
  brand: {
    kicker: "OUR STORY",
    h1: "ここにしかない、",
    h2: "物語がある。",
    lead: "小さな島から、まっすぐな仕事を続けています。",
    cta: "ストーリーを読む",
    sec: "WORKS",
    band: "続きは、この先で。",
  },
  fan: {
    kicker: "COMMUNITY",
    h1: "毎日をちょっと、",
    h2: "面白くする。",
    lead: "登録者限定の裏話とプレゼントを配信中。",
    cta: "LINEに登録する",
    sec: "CONTENTS",
    band: "続きは LINE / メルマガで。",
  },
};

/* ================================ utilities =============================== */

function mulberry(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mix(a: string, b: string, t: number) {
  const pa = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5, 7), 16)];
  const pb = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5, 7), 16)];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function rgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const k = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + k, y);
  ctx.arcTo(x + w, y, x + w, y + h, k);
  ctx.arcTo(x + w, y + h, x, y + h, k);
  ctx.arcTo(x, y + h, x, y, k);
  ctx.arcTo(x, y, x + w, y, k);
  ctx.closePath();
}

function box(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, shadow = 0) {
  ctx.save();
  // ドロップシャドウは使わない（面と罫線で構造を出す）
  void shadow;
  ctx.fillStyle = fill;
  rr(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.restore();
}

function lines(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, n: number, color: string, lh: number, weight = 8) {
  ctx.fillStyle = color;
  for (let i = 0; i < n; i++) {
    const width = i === n - 1 ? w * 0.58 : w * (0.92 + ((i * 37) % 8) / 100);
    rr(ctx, x, y + i * lh, Math.min(width, w), weight, weight / 2);
    ctx.fill();
  }
  return n * lh;
}

/* ============================== 実写真（Unsplash） ============================= */

type PhotoKind = "person" | "product" | "scenery" | "logo" | "abstract";
type Credit = {
  author: string;
  authorUrl: string;
  license?: string;
  licenseUrl?: string;
  source?: "unsplash" | "pexels" | "pixabay" | "openverse" | "gemini";
};
type PhotoSet = { images: Partial<Record<PhotoKind, HTMLImageElement[]>>; credits: Credit[] };

/** 描画関数は同期なので、読み込み済みの写真をモジュール変数で共有する */
let PHOTOS: PhotoSet | null = null;
/** 写真セットは業種ごとに別物。選択肢サムネが全部同じ写真になるのを防ぐ。 */
const PHOTO_SETS = new Map<string, PhotoSet>();
function photoKey(a: Full): string {
  return `${a.industry}|${a.tone === "wamodern" ? "wa" : "-"}`;
}
/** 描画関数の先頭で、その回答に対応する写真セットに切り替える */
function usePhotosFor(a: Full) {
  PHOTOS = PHOTO_SETS.get(photoKey(a)) ?? null;
}
/** 「別パターンを生成」用のシード変分 */
let VARIANT = 0;
/** 明朝のフォントスタック（プローブ要素から実測して共有する） */
const SERIF_STACK = { value: '' };
const PHOTO_CACHE = new Map<string, Promise<PhotoSet | null>>();
/** 検索語ごとの結果キャッシュ。レート制限の消費を抑える。 */
const QUERY_CACHE = new Map<string, Promise<{ images: HTMLImageElement[]; credits: Credit[] }>>();

/** モノトーン配色のときだけ写真の彩度を落とす */
let DESATURATE = false;
function a_desaturate(_kind: string): boolean {
  return DESATURATE;
}

/** 業種ごとの写真検索語。scripts/warm-photos.mjs と JSON を共有する */
const INDUSTRY_QUERIES = PHOTO_QUERIES.industries as Record<
  string,
  { person: string; product: string; scenery: string; interior: string }
>;
/** 空気感ごとの写真の“味つけ”。同じ業種でも雑誌っぽさの方向を変える */
const STYLES = PHOTO_QUERIES.styles as Record<string, string>;
const STYLE_BY_TONE = PHOTO_QUERIES.styleByTone as Record<string, string>;

/**
 * 回答から写真の検索語を組み立てる（業種が主、トーンで味つけ）。
 * 味つけ語は person（人物）には付けない。修飾が強いと人物写真が別物になるため。
 */
function queriesFor(a: Full): Record<PhotoKind, string> {
  const base = INDUSTRY_QUERIES[a.industry] ?? INDUSTRY_QUERIES.seafood;
  const style = STYLES[STYLE_BY_TONE[a.tone]] ?? "";
  const flavor = (q: string) => (style ? `${q} ${style}` : q);
  return {
    person: base.person,
    product: flavor(base.product),
    scenery: flavor(base.scenery),
    logo: flavor(base.interior),
    abstract: flavor(base.interior),
  };
}

function loadImage(src: string, timeoutMs = 8000): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    let settled = false;
    const done = (v: HTMLImageElement | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(v);
    };
    // 応答が返ってこない相手で「生成中…」が固まらないよう必ず打ち切る
    const timer = setTimeout(() => {
      img.src = "";
      done(null);
    }, timeoutMs);
    img.crossOrigin = "anonymous";
    img.onload = () => done(img);
    img.onerror = () => done(null);
    img.src = src;
  });
}


/** 1つの検索語で写真を取得して読み込む */
async function fetchOneQuery(
  query: string,
  orientation: string,
  n = 4,
): Promise<{ images: HTMLImageElement[]; credits: Credit[] }> {
  try {
    const res = await fetch(`/api/photos?q=${encodeURIComponent(query)}&n=${n}&orientation=${orientation}`);
    const json = (await res.json()) as {
      source?: string;
      photos: {
        url: string;
        thumb: string;
        author: string;
        authorUrl: string;
        downloadLocation: string;
        license?: string;
        licenseUrl?: string;
        source?: "unsplash" | "pexels" | "pixabay" | "openverse" | "gemini";
      }[];
    };
    if (!json.photos?.length) return { images: [], credits: [] };
    // 許可外ホストなどで原寸が取れない場合はサムネイルで代替する
    const loaded = await Promise.all(
      json.photos.map(async (ph) => (await loadImage(ph.url)) ?? (ph.thumb ? await loadImage(ph.thumb) : null)),
    );
    const ok = loaded
      .map((img, i) => ({ img, meta: json.photos[i] }))
      .filter((l): l is { img: HTMLImageElement; meta: (typeof json.photos)[0] } => !!l.img);
    if (!ok.length) return { images: [], credits: [] };

    const credits: Credit[] = [];
    ok.forEach((l) => {
      if (!credits.some((c) => c.author === l.meta.author && c.authorUrl === l.meta.authorUrl)) {
        credits.push({
          author: l.meta.author,
          authorUrl: l.meta.authorUrl,
          license: l.meta.license,
          licenseUrl: l.meta.licenseUrl,
          source: l.meta.source,
        });
      }
    });
    // Unsplash ガイドライン：実際に使う分だけ記録する。
    // ただしサーバーの永続キャッシュから返ってきた分は API を消費しないので記録もしない。
    const used = ok[0];
    if (json.source !== "cache" && used?.meta.downloadLocation) {
      void fetch("/api/photos/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ downloadLocation: used.meta.downloadLocation }),
      }).catch(() => {});
    }
    return { images: ok.map((l) => l.img), credits };
  } catch {
    return { images: [], credits: [] };
  }
}

/** 回答に合う写真をまとめて取得して読み込む。キー未設定・失敗時は null（手描きにフォールバック） */
async function fetchPhotoSet(a: Full, only?: PhotoKind[], perQuery = 4): Promise<PhotoSet | null> {
  const queries = queriesFor(a);
  const kinds = (only ?? (Object.keys(queries) as PhotoKind[])) as PhotoKind[];
  const credits: Credit[] = [];
  const images: PhotoSet["images"] = {};
  let any = false;

  await Promise.all(
    kinds.map(async (kind) => {
      const orientation = kind === "person" ? "portrait" : "landscape";
      const cacheKey = `${orientation}|${queries[kind]}|${perQuery}`;
      let pending = QUERY_CACHE.get(cacheKey);
      if (!pending) {
        pending = fetchOneQuery(queries[kind], orientation, perQuery);
        QUERY_CACHE.set(cacheKey, pending);
        // 取得できなかった場合はキャッシュを残さない（一時的な失敗で永久に手描きになるのを防ぐ）
        void pending.then((r) => {
          if (!r.images.length) QUERY_CACHE.delete(cacheKey);
        });
      }
      const got = await pending;
      if (!got.images.length) return;
      any = true;
      images[kind] = got.images;
      got.credits.forEach((c) => {
        if (!credits.some((x) => x.author === c.author && x.authorUrl === c.authorUrl)) credits.push(c);
      });
    }),
  );

  if (!any) return null;
  // 部分取得（サムネ用）と全取得が混ざるので、既存セットにマージする
  const prev = PHOTO_SETS.get(photoKey(a));
  const merged: PhotoSet = prev
    ? { images: { ...prev.images, ...images }, credits: [...prev.credits, ...credits.filter((c) => !prev.credits.some((x) => x.authorUrl === c.authorUrl))] }
    : { images, credits };
  PHOTO_SETS.set(photoKey(a), merged);
  return merged;
}

/** クリップ済みの領域に object-fit: cover 相当で写真を敷く */
function drawPhotoCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const ir = img.naturalWidth / img.naturalHeight;
  const br = w / h;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;
  let sx = 0;
  let sy = 0;
  if (ir > br) {
    sw = img.naturalHeight * br;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / br;
    sy = (img.naturalHeight - sh) * 0.38; // 少し上寄りにクロップ（人物の顔が切れにくい）
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

/* =============================== image maker ============================== */
/** 選択内容から決定的に「それっぽい写真」を描く。灰色の箱ではなく実画像を生成する。 */
function artwork(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
  p: Palette,
  kind: string,
  seed: number,
  font: string,
  initial: string,
) {
  // 近い seed でも結果が相関しないよう撹拌する
  const scrambled = (Math.imul(seed ^ 0x9e3779b9, 2654435761) ^ (seed >>> 13)) >>> 0;
  const rand = mulberry(scrambled);
  ctx.save();
  rr(ctx, x, y, w, h, r);
  ctx.clip();

  // 実写真があれば最優先で使う（Unsplash）
  const pool = PHOTOS?.images[kind as PhotoKind] ?? PHOTOS?.images.scenery;
  if (pool && pool.length) {
    // seed だけだと剰余が衝突して同じ写真が並ぶので、撹拌した値を2段で混ぜる
    const spread = (scrambled ^ (scrambled >>> 5) ^ (scrambled >>> 11)) >>> 0;
    const img = pool[spread % pool.length];
    drawPhotoCover(ctx, img, x, y, w, h);
    // 写真は素のまま見せる（色かぶりを乗せると一気に安っぽくなる）。
    // モノトーン配色のときだけ彩度を落とす。
    if (a_desaturate(kind)) {
      ctx.save();
      ctx.globalCompositeOperation = "saturation";
      ctx.fillStyle = "hsl(0, 0%, 50%)";
      ctx.fillRect(x, y, w, h);
      ctx.restore();
    }
    ctx.restore();
    return;
  }

  const deep = kind === "scenery" ? p.primaryDeep : mix(p.primaryDeep, p.dark, 0.35);
  const g = ctx.createLinearGradient(x, y, x + w * 0.4, y + h);
  g.addColorStop(0, mix(p.accent, "#ffffff", 0.25));
  g.addColorStop(0.55, p.primary);
  g.addColorStop(1, deep);
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);

  // 有機的な光のかたまり
  for (let i = 0; i < 7; i++) {
    const cx = x + rand() * w;
    const cy = y + rand() * h;
    const rad = (0.18 + rand() * 0.5) * Math.max(w, h);
    const tint = [p.accent, "#ffffff", p.primaryDeep, mix(p.accent, p.primary, 0.5)][i % 4];
    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    rg.addColorStop(0, rgba(tint, 0.34));
    rg.addColorStop(1, rgba(tint, 0));
    ctx.fillStyle = rg;
    ctx.fillRect(x, y, w, h);
  }

  if (kind === "scenery") {
    const hz = y + h * (0.56 + rand() * 0.08);
    const sky = ctx.createLinearGradient(x, y, x, hz);
    sky.addColorStop(0, rgba(mix(p.accent, "#ffffff", 0.55), 0.85));
    sky.addColorStop(1, rgba(p.accent, 0.15));
    ctx.fillStyle = sky;
    ctx.fillRect(x, y, w, hz - y);
    // 太陽
    const sx = x + w * (0.24 + rand() * 0.5);
    const sunG = ctx.createRadialGradient(sx, hz - h * 0.22, 0, sx, hz - h * 0.22, h * 0.3);
    sunG.addColorStop(0, "rgba(255,255,255,0.95)");
    sunG.addColorStop(0.25, "rgba(255,255,255,0.5)");
    sunG.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sunG;
    ctx.fillRect(x, y, w, h);
    // 遠景の島影
    ctx.fillStyle = rgba(deep, 0.55);
    ctx.beginPath();
    ctx.moveTo(x, hz);
    for (let i = 0; i <= 6; i++) {
      const px = x + (w / 6) * i;
      ctx.lineTo(px, hz - (0.03 + rand() * 0.09) * h);
    }
    ctx.lineTo(x + w, hz);
    ctx.closePath();
    ctx.fill();
    // 海
    const sea = ctx.createLinearGradient(x, hz, x, y + h);
    sea.addColorStop(0, rgba(p.primary, 0.95));
    sea.addColorStop(1, rgba(deep, 1));
    ctx.fillStyle = sea;
    ctx.fillRect(x, hz, w, y + h - hz);
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    for (let i = 0; i < 14; i++) {
      const ly = hz + rand() * (y + h - hz);
      ctx.lineWidth = 1 + rand() * 2;
      ctx.beginPath();
      ctx.moveTo(x + rand() * w * 0.7, ly);
      ctx.lineTo(x + rand() * w * 0.7 + w * (0.06 + rand() * 0.2), ly);
      ctx.stroke();
    }
  } else if (kind === "person") {
    const cx = x + w * (0.42 + rand() * 0.12);
    const base = y + h;
    const headR = Math.min(w, h) * 0.115;
    const hy = y + h * 0.44;
    // 背景のボケ玉
    ctx.save();
    if ("filter" in ctx) ctx.filter = "blur(14px)";
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = rgba("#ffffff", 0.12 + rand() * 0.1);
      ctx.beginPath();
      ctx.arc(x + rand() * w, y + rand() * h * 0.7, Math.min(w, h) * (0.05 + rand() * 0.07), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    // 上半身（やわらかいグラデーション）
    const bodyG = ctx.createLinearGradient(cx - headR * 3, hy, cx + headR * 3, base);
    bodyG.addColorStop(0, rgba(mix(p.dark, p.primaryDeep, 0.25), 0.95));
    bodyG.addColorStop(1, rgba(p.dark, 0.98));
    ctx.fillStyle = bodyG;
    ctx.beginPath();
    ctx.moveTo(cx - headR * 3.4, base);
    ctx.bezierCurveTo(cx - headR * 3.0, hy + headR * 1.9, cx - headR * 1.5, hy + headR * 1.15, cx, hy + headR * 1.1);
    ctx.bezierCurveTo(cx + headR * 1.5, hy + headR * 1.15, cx + headR * 3.0, hy + headR * 1.9, cx + headR * 3.4, base);
    ctx.closePath();
    ctx.fill();
    // 首
    ctx.fillStyle = rgba(mix(p.dark, p.primaryDeep, 0.35), 0.95);
    ctx.fillRect(cx - headR * 0.34, hy + headR * 0.5, headR * 0.68, headR * 0.8);
    // 頭
    const headG = ctx.createLinearGradient(cx - headR, hy - headR, cx + headR, hy + headR);
    headG.addColorStop(0, rgba(mix(p.dark, p.primaryDeep, 0.15), 0.98));
    headG.addColorStop(1, rgba(p.dark, 1));
    ctx.fillStyle = headG;
    ctx.beginPath();
    ctx.ellipse(cx, hy, headR * 0.92, headR * 1.12, 0, 0, Math.PI * 2);
    ctx.fill();
    // 髪
    ctx.fillStyle = rgba(p.dark, 1);
    ctx.beginPath();
    ctx.ellipse(cx, hy - headR * 0.34, headR * 0.98, headR * 0.86, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    if (rand() > 0.45) {
      ctx.beginPath();
      ctx.ellipse(cx - headR * 0.86, hy + headR * 0.16, headR * 0.3, headR * 0.75, 0.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + headR * 0.86, hy + headR * 0.16, headR * 0.3, headR * 0.75, -0.2, 0, Math.PI * 2);
      ctx.fill();
    }
    // リムライト
    ctx.save();
    ctx.strokeStyle = rgba("#ffffff", 0.42);
    ctx.lineWidth = Math.max(1.5, headR * 0.08);
    ctx.beginPath();
    ctx.ellipse(cx, hy, headR * 0.94, headR * 1.14, 0, Math.PI * 1.08, Math.PI * 1.76);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - headR * 1.9, base - headR * 0.4);
    ctx.quadraticCurveTo(cx - headR * 2.2, hy + headR * 2.0, cx - headR * 2.9, base);
    ctx.stroke();
    ctx.restore();
  } else if (kind === "abstract") {
    // 写真ではなく、抽象的なビジュアル（サービス紹介などに）
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.strokeStyle = rgba("#ffffff", 0.3 - i * 0.07);
      ctx.lineWidth = Math.max(1.5, Math.min(w, h) * 0.012);
      ctx.beginPath();
      ctx.arc(
        x + w * (0.25 + rand() * 0.5),
        y + h * (0.25 + rand() * 0.5),
        Math.min(w, h) * (0.16 + i * 0.13),
        rand() * Math.PI,
        Math.PI * (1.2 + rand()),
      );
      ctx.stroke();
      ctx.restore();
    }
    const fx = x + w * (0.3 + rand() * 0.4);
    const fy = y + h * (0.35 + rand() * 0.3);
    const fr = Math.min(w, h) * (0.14 + rand() * 0.1);
    const fg = ctx.createLinearGradient(fx - fr, fy - fr, fx + fr, fy + fr);
    fg.addColorStop(0, "rgba(255,255,255,0.9)");
    fg.addColorStop(1, rgba(p.accent, 0.65));
    ctx.fillStyle = fg;
    ctx.beginPath();
    if (rand() > 0.5) {
      ctx.arc(fx, fy, fr, 0, Math.PI * 2);
    } else {
      rr(ctx, fx - fr, fy - fr, fr * 2, fr * 2, fr * 0.35);
    }
    ctx.fill();
  } else if (kind === "product") {
    const cx = x + w * 0.5;
    const cy = y + h * 0.5;
    const rw = Math.min(w, h) * 0.42;
    // スポット
    const sp = ctx.createRadialGradient(cx, cy - rw * 0.3, 0, cx, cy, rw * 2.1);
    sp.addColorStop(0, "rgba(255,255,255,0.55)");
    sp.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = sp;
    ctx.fillRect(x, y, w, h);
    // 影
    ctx.fillStyle = rgba(deep, 0.5);
    ctx.beginPath();
    ctx.ellipse(cx, cy + rw * 0.95, rw * 1.15, rw * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    const bg2 = ctx.createLinearGradient(cx - rw, cy - rw, cx + rw, cy + rw);
    bg2.addColorStop(0, "rgba(255,255,255,0.95)");
    bg2.addColorStop(1, rgba(mix(p.soft, p.accent, 0.35), 1));
    const dark2 = rgba(mix(p.primary, p.dark, 0.25), 0.92);
    const form = Math.floor(rand() * 3);
    if (form === 0) {
      // 器に盛られた料理
      ctx.fillStyle = bg2;
      ctx.beginPath();
      ctx.ellipse(cx, cy + rw * 0.15, rw * 1.05, rw * 0.78, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = dark2;
      ctx.beginPath();
      ctx.ellipse(cx, cy + rw * 0.1, rw * 0.72, rw * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (form === 1) {
      // 箱・パッケージ
      const bw2 = rw * 1.25;
      const bh2 = rw * 1.5;
      ctx.fillStyle = bg2;
      rr(ctx, cx - bw2 / 2, cy - bh2 / 2 + rw * 0.1, bw2, bh2, rw * 0.12);
      ctx.fill();
      ctx.fillStyle = dark2;
      ctx.fillRect(cx - bw2 / 2, cy - rw * 0.1, bw2, rw * 0.42);
      ctx.fillStyle = rgba("#ffffff", 0.5);
      rr(ctx, cx - bw2 * 0.3, cy + rw * 0.5, bw2 * 0.6, rw * 0.12, rw * 0.06);
      ctx.fill();
    } else {
      // 瓶
      const bw2 = rw * 0.9;
      ctx.fillStyle = bg2;
      rr(ctx, cx - bw2 / 2, cy - rw * 0.5, bw2, rw * 1.6, rw * 0.22);
      ctx.fill();
      ctx.fillStyle = dark2;
      rr(ctx, cx - bw2 * 0.28, cy - rw * 1.05, bw2 * 0.56, rw * 0.6, rw * 0.1);
      ctx.fill();
      ctx.fillStyle = rgba(p.accent, 0.75);
      ctx.fillRect(cx - bw2 / 2, cy + rw * 0.1, bw2, rw * 0.45);
    }
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.ellipse(cx - rw * 0.3, cy - rw * 0.15, rw * 0.22, rw * 0.1, -0.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // logo / typography
    ctx.fillStyle = rgba("#ffffff", 0.14);
    ctx.beginPath();
    ctx.arc(x + w * 0.5, y + h * 0.5, Math.min(w, h) * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `700 ${Math.min(w, h) * 0.3}px ${font}`;
    ctx.fillText(initial, x + w * 0.5, y + h * 0.5 + Math.min(w, h) * 0.01);
    ctx.restore();
  }

  // フィルムグレイン + ビネット
  for (let i = 0; i < Math.floor((w * h) / 2600); i++) {
    ctx.fillStyle = rand() > 0.5 ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)";
    ctx.fillRect(x + rand() * w, y + rand() * h, 2, 2);
  }
  const vg = ctx.createRadialGradient(x + w / 2, y + h / 2, Math.min(w, h) * 0.25, x + w / 2, y + h / 2, Math.max(w, h) * 0.78);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.32)");
  ctx.fillStyle = vg;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

/* ============================== 和モダン parts ============================= */

const ROTATE_CHARS = "ー〜（）「」『』【】—-…：;=＝";

/** 縦書きテキスト。約物は回転させる。 */
function vtext(
  ctx: CanvasRenderingContext2D,
  s: string,
  x: number,
  y: number,
  size: number,
  color: string,
  font: string,
  weight = 400,
  lh = size * 1.42,
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const chars = Array.from(s);
  chars.forEach((ch, i) => {
    const cy = y + size / 2 + i * lh;
    if (ROTATE_CHARS.includes(ch)) {
      ctx.save();
      ctx.translate(x, cy);
      ctx.rotate(Math.PI / 2);
      ctx.fillText(ch, 0, 0);
      ctx.restore();
    } else {
      ctx.fillText(ch, x, cy);
    }
  });
  ctx.restore();
  return chars.length * lh;
}

/** 扇の家紋風マーク */
function fanMark(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(cx, cy + r * 0.42, r, r * 0.62, 0, Math.PI, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function asanoha(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, step = 46) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  for (let gy = y; gy < y + h + step; gy += step) {
    for (let gx = x; gx < x + w + step; gx += step) {
      ctx.beginPath();
      ctx.moveTo(gx, gy);
      ctx.lineTo(gx + step, gy + step);
      ctx.moveTo(gx + step, gy);
      ctx.lineTo(gx, gy + step);
      ctx.moveTo(gx + step / 2, gy);
      ctx.lineTo(gx + step / 2, gy + step);
      ctx.moveTo(gx, gy + step / 2);
      ctx.lineTo(gx + step, gy + step / 2);
      ctx.stroke();
    }
  }
  ctx.restore();
}

function railIcons(ctx: CanvasRenderingContext2D, x: number, y: number, ink: string) {
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.fillStyle = ink;
  ctx.lineWidth = 1.4;
  // ||| メニュー
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(x - 8 + i * 8, y - 11);
    ctx.lineTo(x - 8 + i * 8, y + 11);
    ctx.stroke();
  }
  // カート
  const cy = y + 58;
  ctx.beginPath();
  ctx.moveTo(x - 11, cy - 8);
  ctx.lineTo(x - 7, cy - 8);
  ctx.lineTo(x - 3, cy + 6);
  ctx.lineTo(x + 11, cy + 6);
  ctx.lineTo(x + 13, cy - 4);
  ctx.lineTo(x - 5, cy - 4);
  ctx.stroke();
  [-1, 7].forEach((dx) => {
    ctx.beginPath();
    ctx.arc(x + dx, cy + 11, 2, 0, Math.PI * 2);
    ctx.fill();
  });
  // 人
  const py = y + 116;
  ctx.beginPath();
  ctx.arc(x, py - 4, 5.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, py + 14, 11, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
  // 虫めがね
  const sy = y + 172;
  ctx.beginPath();
  ctx.arc(x - 1, sy - 2, 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + 5, sy + 4);
  ctx.lineTo(x + 11, sy + 10);
  ctx.stroke();
  ctx.restore();
}

function snsIcons(ctx: CanvasRenderingContext2D, x: number, y: number, ink: string, font: string) {
  ctx.save();
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  rr(ctx, x - 11, y - 11, 22, 22, 7);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y, 6, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = "#06c755";
  ctx.beginPath();
  rr(ctx, x - 11, y + 29, 22, 22, 7);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `700 10px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("LINE", x, y + 40);
  ctx.restore();
}

/* ================================ page draw =============================== */

const W = 1200;
const MAXH = 5600;
/** iOS Safari の canvas 面積上限に対する安全値 */
const MAX_CANVAS_PX = 16_000_000;

/** 上辺がアーチのクリップ領域を作る */
function archClip(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rise: number) {
  ctx.beginPath();
  ctx.moveTo(x, y + rise);
  ctx.quadraticCurveTo(x + w / 2, y - rise * 0.9, x + w, y + rise);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
}

/** はちとワルツ風のループ罫 */
function loopBorder(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  len: number,
  color: string,
  vertical: boolean,
  size = 26,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.1;
  const n = Math.ceil(len / (size * 0.62));
  for (let i = 0; i < n; i++) {
    const t = i * size * 0.62;
    ctx.beginPath();
    if (vertical) ctx.ellipse(x, y + t, size * 0.42, size * 0.6, 0, 0, Math.PI * 2);
    else ctx.ellipse(x + t, y, size * 0.6, size * 0.42, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

/* --------------------------- 和モダン（老舗）レンダラー -------------------------- */
function drawWa(ctx: CanvasRenderingContext2D, a: Full, siteName: string, font: string): number {
  const p = PALETTES[a.palette];
  const k = buildCopy(a);
  const c = { ...COPY[a.goal], cta: k.cta, sec: k.secLabel, band: k.bandTitle, lead: k.lead, h1: k.h1[0], h2: k.h1[1], kicker: k.eyebrow };
  const seed = hashString(JSON.stringify(a) + siteName + VARIANT);
  const paper = "#ebebeb";
  const ink = "#1c1c1c";
  const sub = "#6d6d6d";
  const railL = 96;
  const railR = 112;
  const cx0 = railL;
  const cw = W - railL - railR;

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = paper;
  ctx.fillRect(0, 0, W, MAXH);

  // 左レール
  railIcons(ctx, 48, 78, ink);

  // 右：家紋＋縦組ロゴ
  fanMark(ctx, W - 56, 44, 26, ink);
  const nameChars = Array.from(siteName.trim() || "扇屋");
  if (nameChars.length >= 4) {
    // 「那須 / 扇屋」のように冠部分と屋号を分けて組む
    const cut = nameChars.length - 2;
    vtext(ctx, nameChars.slice(0, cut).join(""), W - 56, 96, 19, ink, font, 400, 25);
    vtext(ctx, nameChars.slice(cut).join(""), W - 56, 96 + cut * 25 + 14, 30, ink, font, 500, 36);
  } else {
    vtext(ctx, nameChars.join(""), W - 56, 100, 30, ink, font, 500, 36);
  }

  // お知らせ
  let y = 236;
  ctx.fillStyle = ink;
  ctx.beginPath();
  ctx.arc(cx0 + 40, y - 4, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.font = `400 13px ${font}`;
  ctx.fillStyle = sub;
  ctx.fillText("2026.07.25", cx0 + 54, y);
  ctx.fillStyle = ink;
  ctx.fillText("2026年8月　休業日について", cx0 + 176, y);
  y += 64;

  // アーチ抜きヒーロー
  const hh = 640;
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(W * 0.42, y + 760, W * 1.02, 760, 0, 0, Math.PI * 2);
  ctx.clip();
  artwork(ctx, 0, y, W, hh, 0, p, a.hero, seed, font, nameChars[0] || "扇");
  ctx.restore();
  y += hh + 96;

  // 商品グリッド（縦書きタイトル）
  ctx.save();
  ctx.textAlign = "center";
  ctx.letterSpacing = "6px";
  ctx.fillStyle = sub;
  ctx.font = `400 12px ${font}`;
  ctx.fillText(c.sec, W / 2, y);
  ctx.restore();
  y += 216; // 縦書き商品名を置くための余白
  const gap = 26;
  const iw = (cw - 60 - gap * 3) / 4;
  const indc = INDUSTRY_COPY[a.industry];
  const names = indc
    ? [...indc.items.map((i) => i.name), indc.items[0].name]
    : ["丹波篠山産 新栗蒸し羊羹", "黒糖ようかん", "塩羊羹", "栗大納言羊羹"];
  const prices = indc
    ? [...indc.items.map((i) => i.price), indc.items[0].price]
    : ["¥3,510", "¥720", "¥1,700", "¥1,890"];
  for (let i = 0; i < 4; i++) {
    const x = cx0 + 30 + i * (iw + gap);
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x, y, iw, iw);
    artwork(ctx, x, y, iw, iw, 0, p, "product", seed + i * 331, font, "菓");
    // 縦書き商品名：長い名前は画像内に収まる位置から始める
    // 縦書き商品名は画像の上に置く（参考サイトと同じ組み方）
    const nm = Array.from(names[i]).filter((ch) => ch !== " ").slice(0, 9);
    const lhN = 17;
    vtext(ctx, nm.join(""), x + iw - 18, y - 12 - nm.length * lhN, 13, ink, font, 400, lhN);
    ctx.fillStyle = ink;
    ctx.font = `500 17px ${font}`;
    ctx.textAlign = "left";
    ctx.fillText(prices[i], x, y + iw + 32);
    ctx.font = `400 10px ${font}`;
    ctx.fillStyle = sub;
    ctx.fillText("（税込）", x + 62, y + iw + 32);
    if (i % 3 === 0) {
      ctx.strokeStyle = "#c9c9c9";
      ctx.strokeRect(x + 0.5, y + iw + 48.5, iw - 1, 22);
      ctx.fillStyle = sub;
      ctx.font = `400 11px ${font}`;
      ctx.textAlign = "center";
      ctx.fillText("在庫切れ", x + iw / 2, y + iw + 63);
      ctx.textAlign = "left";
    }
  }
  y += iw + 130;

  // 歴史（写真＋縦組本文＋麻の葉）
  const sh = 540;
  const phw = cw * 0.52;
  artwork(ctx, cx0 - 20, y, phw, sh, 0, p, "scenery", seed + 7, font, "史");
  const tx0 = cx0 - 20 + phw;
  const tw = W - railR - tx0;
  asanoha(ctx, tx0, y, tw, sh, "rgba(0,0,0,0.055)");
  vtext(ctx, `${siteName.trim() || "扇屋"}の歴史 一`, tx0 + tw - 66, y + 40, 26, ink, font, 500, 32);
  const cols = a.density === "light" ? 3 : a.density === "balanced" ? 5 : 7;
  const bodyStr = "創業は大正十五年。街道沿いの湯本で茶屋のような商いをしておりました。訪れる人々に軽食を提供する店として営業を開始し、温泉地の発展に合わせて商いを広げてきました。";
  for (let i = 0; i < cols; i++) {
    const cxp = tx0 + tw - 130 - i * 30;
    const from = i * 13;
    vtext(ctx, bodyStr.slice(from, from + 13), cxp, y + 96, 14, "#2a2a2a", font, 300, 19);
  }
  y += sh + 110;

  // CTA（線のボタン）
  const bw = 300;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1;
  ctx.strokeRect(W / 2 - bw / 2 + 0.5, y + 0.5, bw, 56);
  ctx.save();
  ctx.fillStyle = ink;
  ctx.font = `400 15px ${font}`;
  ctx.letterSpacing = "4px";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(c.cta, W / 2, y + 29);
  ctx.restore();
  y += 56 + 110;

  // 右レール下部の SNS ＋ 左下の縦コピーライト
  snsIcons(ctx, W - 56, y - 190, ink, font);
  ctx.save();
  ctx.translate(36, y - 150);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = sub;
  ctx.font = `400 10px ${font}`;
  ctx.letterSpacing = "2px";
  ctx.fillText(`© 2026 ${(siteName.trim() || "OHGIYA").toUpperCase()}`, 0, 0);
  ctx.restore();

  ctx.strokeStyle = "#d3d3d3";
  ctx.beginPath();
  ctx.moveTo(cx0, y - 40);
  ctx.lineTo(W - railR, y - 40);
  ctx.stroke();
  return y;
}

/* --------------------------- 洋菓子店レンダラー --------------------------- */
function drawPatisserie(ctx: CanvasRenderingContext2D, a: Full, siteName: string, font: string): number {
  const p = PALETTES[a.palette];
  const k = buildCopy(a);
  const c = { ...COPY[a.goal], cta: k.cta, sec: k.secLabel, band: k.bandTitle, lead: k.lead, h1: k.h1[0], h2: k.h1[1], kicker: k.eyebrow };
  const seed = hashString(JSON.stringify(a) + siteName + VARIANT);
  const cream = "#fdf8ee";
  const blush = "#fdf1e7";
  const gold = "#b3924f";
  const ink = "#4b3a26";

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = cream;
  ctx.fillRect(0, 0, W, MAXH);

  // 上部ループ罫
  loopBorder(ctx, 10, 34, W, gold, false, 30);

  let y = 96;
  ctx.save();
  ctx.fillStyle = gold;
  ctx.font = `400 12px ${font}`;
  ctx.letterSpacing = "6px";
  ctx.fillText("SENDAI", 60, y);
  ctx.textAlign = "center";
  ctx.fillText((siteName.trim() || "PATISSERIE").toUpperCase(), W / 2, y);
  ctx.textAlign = "right";
  ctx.fillText("AKIU", W - 60, y);
  ctx.restore();

  // アーチ天面のヒーロー
  y += 22;
  const hh = 690;
  ctx.save();
  archClip(ctx, 0, y, W, hh, 74);
  ctx.clip();
  artwork(ctx, 0, y - 40, W, hh + 40, 0, p, a.hero, seed, font, (siteName.trim()[0] || "W").toUpperCase());
  ctx.fillStyle = "rgba(255,250,240,0.14)";
  ctx.fillRect(0, y, W, hh);
  ctx.restore();

  // ヒーロー内：タグ３枚
  const tags = ["宮城・仙台の奥座敷", "秋保温泉にある", "カステラサンドの店"];
  tags.forEach((tg, i) => {
    const tw2 = 148;
    const ty = y + 300 + i * 36;
    ctx.fillStyle = "rgba(253,248,238,0.94)";
    ctx.fillRect(180, ty, tw2, 26);
    ctx.fillStyle = ink;
    ctx.font = `400 12px ${font}`;
    ctx.fillText(tg, 190, ty + 18);
  });

  // ヒーロー右：大きな縦組ロゴ（2列）
  const logo = Array.from(siteName.trim() || "はちとワルツ");
  const half = Math.ceil(logo.length / 2);
  vtext(ctx, logo.slice(0, half).join(""), W - 90, y + 250, 62, "#2c2118", font, 400, 84);
  vtext(ctx, logo.slice(half).join(""), W - 200, y + 300, 62, "#2c2118", font, 400, 84);
  y += hh + 10;
  loopBorder(ctx, 10, y, W, gold, false, 30);
  y += 70;

  // 左ナビ／中央カラム／両脇ループ
  const colW = 420;
  const colX = W / 2 - colW / 2;
  const secTop = y;
  ["ABOUT", "MENU", "ACCESS", "NEWS"].forEach((m, i) => {
    ctx.save();
    ctx.fillStyle = gold;
    ctx.font = `400 26px ${font}`;
    ctx.letterSpacing = "10px";
    ctx.fillText(m, 84, y + 40 + i * 78);
    ctx.restore();
  });
  ctx.save();
  ctx.strokeStyle = gold;
  ctx.lineWidth = 1.2;
  [0, 1].forEach((i) => {
    rr(ctx, 84, y + 356 + i * 38, 18, 18, 5);
    ctx.stroke();
  });
  ctx.fillStyle = ink;
  ctx.font = `400 13px ${font}`;
  ctx.fillText("Instagram", 114, y + 370);
  ctx.fillText("Contact", 114, y + 408);
  ctx.restore();

  // 中央カラム本文
  const colH = 620;
  ctx.fillStyle = blush;
  ctx.fillRect(colX, secTop - 30, colW, colH);
  loopBorder(ctx, colX - 22, secTop - 20, colH, gold, true, 26);
  loopBorder(ctx, colX + colW + 22, secTop - 20, colH, gold, true, 26);

  const paras = [
    ["秋保の工房には、", "今日も甘くやさしい香りが満ちている。"],
    ["はちみつの配合を工夫して、", "しっとり感を引き出したこだわりの生地。", "色とりどりの餡を挟んだら", "カステラサンドのできあがり。"],
    ["ひとくち目は、カステラを。", "ふたくち目は、餡と一緒に。", "さんくち目は、好きな飲み物と。"],
  ];
  const shown = a.density === "light" ? paras.slice(0, 2) : paras;
  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = ink;
  ctx.font = `300 15px ${font}`;
  let ty2 = secTop + 24;
  shown.forEach((group) => {
    group.forEach((ln) => {
      ctx.fillText(ln, W / 2, ty2);
      ty2 += 30;
    });
    ty2 += 26;
  });
  ctx.restore();

  // ピル型 CTA
  const pw = 300;
  const ph = 58;
  box(ctx, W / 2 - pw / 2, ty2 + 6, pw, ph, ph / 2, "#f3e3c8");
  ctx.save();
  ctx.fillStyle = ink;
  ctx.font = `400 15px ${font}`;
  ctx.textBaseline = "middle";
  ctx.fillText(c.cta, W / 2 - pw / 2 + 40, ty2 + 6 + ph / 2);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 + pw / 2 - 84, ty2 + 6 + ph / 2);
  ctx.lineTo(W / 2 + pw / 2 - 40, ty2 + 6 + ph / 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(W / 2 + pw / 2 - 50, ty2 + ph / 2 - 1);
  ctx.lineTo(W / 2 + pw / 2 - 40, ty2 + 6 + ph / 2);
  ctx.lineTo(W / 2 + pw / 2 - 50, ty2 + ph / 2 + 13);
  ctx.stroke();
  ctx.restore();
  y = Math.max(secTop + colH, ty2 + ph + 40);

  // アーチ写真（MENU）
  const mh2 = 420;
  ctx.save();
  archClip(ctx, colX, y, colW, mh2, 52);
  ctx.clip();
  artwork(ctx, colX, y - 30, colW, mh2 + 30, 0, p, "product", seed + 99, font, "M");
  ctx.fillStyle = "rgba(0,0,0,0.18)";
  ctx.fillRect(colX, y, colW, mh2);
  ctx.restore();
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.font = `400 30px ${font}`;
  ctx.letterSpacing = "12px";
  ctx.textAlign = "center";
  ctx.fillText(c.sec === "PRODUCTS" ? "MENU" : c.sec, W / 2, y + 118);
  ctx.restore();
  loopBorder(ctx, colX - 22, y, mh2, gold, true, 26);
  loopBorder(ctx, colX + colW + 22, y, mh2, gold, true, 26);

  // 右の大きな縦組ロゴ（2周目）
  vtext(ctx, logo.slice(0, half).join(""), W - 90, y - 120, 58, "#2c2118", font, 400, 78);
  vtext(ctx, logo.slice(half).join(""), W - 196, y - 70, 58, "#2c2118", font, 400, 78);

  y += mh2 + 70;
  loopBorder(ctx, 10, y, W, gold, false, 30);
  y += 60;
  ctx.save();
  ctx.fillStyle = gold;
  ctx.font = `400 11px ${font}`;
  ctx.letterSpacing = "3px";
  ctx.textAlign = "center";
  ctx.fillText(`© 2026 ${(siteName.trim() || "PATISSERIE").toUpperCase()}`, W / 2, y);
  ctx.restore();
  return y + 40;
}

/* --------------------------- 実文字組みのユーティリティ -------------------------- */

const NO_LINE_START = "、。，．」』）】〉ーぁぃぅぇぉっゃゅょゕゖァィゥェォッャュョ！？・：；";
const NO_LINE_END = "「『（【〈";

function wrapJa(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const out: string[] = [];
  text.split("\n").forEach((block) => {
    let line = "";
    Array.from(block).forEach((ch) => {
      const test = line + ch;
      if (ctx.measureText(test).width > maxW && line.length > 0) {
        if (NO_LINE_START.includes(ch)) {
          out.push(test);
          line = "";
          return;
        }
        if (NO_LINE_END.includes(line[line.length - 1])) {
          out.push(line.slice(0, -1));
          line = line[line.length - 1] + ch;
          return;
        }
        out.push(line);
        line = ch;
      } else {
        line = test;
      }
    });
    if (line) out.push(line);
  });
  return out;
}

function para(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxW: number,
  size: number,
  lh: number,
  color: string,
  font: string,
  weight = 400,
  align: CanvasTextAlign = "left",
  maxLines = 99,
): number {
  ctx.save();
  ctx.font = `${weight} ${size}px ${font}`;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = "alphabetic";
  const ls = wrapJa(ctx, text, maxW).slice(0, maxLines);
  ls.forEach((ln, i) => ctx.fillText(ln, x, y + i * lh));
  ctx.restore();
  return ls.length * lh;
}

function hairline(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y + 0.5);
  ctx.lineTo(x + w, y + 0.5);
  ctx.stroke();
  ctx.restore();
}

function arrowLink(ctx: CanvasRenderingContext2D, label: string, x: number, y: number, color: string, font: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `600 14px ${font}`;
  ctx.textBaseline = "middle";
  ctx.fillText(label, x, y);
  const w = ctx.measureText(label).width;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(x + w + 12, y);
  ctx.lineTo(x + w + 40, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + w + 33, y - 4.5);
  ctx.lineTo(x + w + 40, y);
  ctx.lineTo(x + w + 33, y + 4.5);
  ctx.stroke();
  hairline(ctx, x, y + 14, w, rgba(color, 0.3));
  ctx.restore();
}

/* --------------------------------- 原稿 ---------------------------------- */

type Item = { name: string; desc: string; price: string };
type Content = {
  eyebrow: string;
  h1: string[];
  lead: string;
  cta: string;
  ctaNote: string;
  secLabel: string;
  secTitle: string;
  secLead: string;
  items: Item[];
  stats: [string, string][];
  aboutTitle: string;
  aboutBody: string;
  quote: string;
  voice: string;
  who: string;
  bandTitle: string;
  bandBody: string;
};

const CONTENT: Record<string, Content> = {
  shop: {
    eyebrow: "ONLINE STORE",
    h1: ["つくれる分だけを、", "ていねいに。"],
    lead: "その日の分だけを手作業で仕上げ、産地から直接お届けしています。",
    cta: "商品を見る",
    ctaNote: "5,000円以上で送料無料／最短翌日発送",
    secLabel: "PRODUCTS",
    secTitle: "定番の三品",
    secLead: "はじめての方には、まずこの三つを。味の輪郭がいちばん分かりやすい組み合わせです。",
    items: [
      { name: "ひとしお 300g", desc: "塩だけで仕上げた定番。素材の甘みがまっすぐ出ます。", price: "¥3,240" },
      { name: "こんぶ仕立て 200g", desc: "利尻昆布でゆっくり漬け込みました。ご飯にも酒にも。", price: "¥2,160" },
      { name: "詰め合わせ 化粧箱", desc: "贈りものに。のし・手提げ袋を無料でお付けします。", price: "¥5,400" },
    ],
    stats: [
      ["1926", "創業"],
      ["3,400", "累計出荷（件）"],
      ["4.8", "レビュー平均"],
    ],
    aboutTitle: "小さくつくり、まっすぐ届ける。",
    aboutBody:
      "毎朝いちばんに揚がったものだけを使い、その日つくれる分だけを手作業で仕上げています。数はつくれませんが、届いたときにいちばんおいしい状態であることを、何よりも大切にしています。売り場を増やすより、同じ人にもう一度選んでもらえることを目指してきました。",
    quote: "「箱を開けた瞬間の香りが違いました。」",
    voice: "贈答用に注文しましたが、先方からすぐに電話がかかってきました。包みも丁寧で、こちらの顔が立ちます。毎年の定番にします。",
    who: "◯◯県・50代・リピーター",
    bandTitle: "本日出荷分、残りわずかです。",
    bandBody: "14時までのご注文で当日発送いたします。",
  },
  lead: {
    eyebrow: "CONSULTING",
    h1: ["はじめの一歩を、", "いっしょに。"],
    lead: "初回のご相談は無料です。オンラインで全国どこからでもご利用いただけます。",
    cta: "無料で相談する",
    ctaNote: "所要30分／その場で概算をお伝えします",
    secLabel: "SERVICE",
    secTitle: "できること",
    secLead: "小さくはじめて、続けられる形に整えるところまでを一貫してお手伝いします。",
    items: [
      { name: "現状の棚卸し", desc: "いまの数字と手間を洗い出し、やめることから決めます。", price: "¥0〜" },
      { name: "仕組みづくり", desc: "続けられる運用に落とし込み、手順書まで作成します。", price: "¥80,000〜" },
      { name: "伴走サポート", desc: "月2回の定例で、詰まったところをその場で解消します。", price: "¥30,000/月" },
    ],
    stats: [
      ["120", "支援実績（社）"],
      ["92", "継続率（％）"],
      ["30", "初回相談（分）"],
    ],
    aboutTitle: "現場が回る形まで、いっしょに。",
    aboutBody:
      "きれいな資料をつくって終わり、にはしません。実際に手を動かす人が明日から使える形まで落とし込むことを前提に設計します。まずは今の困りごとを、順番に整理するところから始めましょう。",
    quote: "「三年悩んだことが、二回の面談で片づきました。」",
    voice: "何から手をつけるべきかが明確になり、社内でも同じ言葉で話せるようになりました。判断が速くなったのがいちばんの効果です。",
    who: "製造業・代表取締役",
    bandTitle: "まずは話を聞かせてください。",
    bandBody: "無理な提案はいたしません。相談だけでも歓迎です。",
  },
  brand: {
    eyebrow: "OUR STORY",
    h1: ["ここにしかない、", "仕事がある。"],
    lead: "小さな島の工房から、手のあとが残るものだけをつくっています。",
    cta: "ストーリーを読む",
    ctaNote: "工房見学は事前予約制で受け付けています",
    secLabel: "WORKS",
    secTitle: "これまでの仕事",
    secLead: "土地の素材と、その日の天気を見ながら。同じものは二つとありません。",
    items: [
      { name: "潮の器", desc: "海砂を釉薬に混ぜて焼いた、青みのある器です。", price: "2024" },
      { name: "島の紙", desc: "地元の楮を使い、冬の水で漉いた和紙。", price: "2025" },
      { name: "常設展示", desc: "旧郵便局を改装した工房で常設しています。", price: "2026" },
    ],
    stats: [
      ["100", "年つづく技法"],
      ["12", "人の職人"],
      ["1", "点ずつ手仕事"],
    ],
    aboutTitle: "急がないことを、選んできた。",
    aboutBody:
      "効率だけを追えば、この仕事は続きません。時間のかかる工程をそのまま残しているのは、そこにしか出ない表情があるからです。使うほどに変わっていくものを、長く手元に置いてもらえたらと思っています。",
    quote: "「十年使って、やっと自分のものになった。」",
    voice: "買ったときよりも、いまのほうが好きです。欠けた縁も含めて、暮らしの記録になっていくのが面白い。",
    who: "◯◯県・愛用者",
    bandTitle: "続きは、この先で。",
    bandBody: "つくり手の記録を、月に一度お届けしています。",
  },
  fan: {
    eyebrow: "COMMUNITY",
    h1: ["毎日をちょっと、", "面白くする。"],
    lead: "登録者だけに、うまくいかなかった話まで包み隠さず配信しています。",
    cta: "LINEに登録する",
    ctaNote: "登録特典：PDF「はじめの30日でやったこと」",
    secLabel: "CONTENTS",
    secTitle: "配信していること",
    secLead: "きれいごとは書きません。数字も失敗も、そのまま置いておきます。",
    items: [
      { name: "週刊コラム", desc: "毎週金曜。その週に考えたことをそのまま。", price: "無料" },
      { name: "限定PDF", desc: "登録直後にお送りする、30日間の記録です。", price: "特典" },
      { name: "質問箱", desc: "いただいた質問には、翌週の配信で答えます。", price: "随時" },
    ],
    stats: [
      ["8,200", "登録者"],
      ["62", "開封率（％）"],
      ["毎週金", "配信日"],
    ],
    aboutTitle: "いいことも、そうでないことも。",
    aboutBody:
      "うまくいった話ばかりを並べても、参考にはならないと思っています。やめた施策、外した読み、戻ってきた数字。順番に書いていきますので、気が向いたときに読んでください。",
    quote: "「毎週これだけは読んでいます。」",
    voice: "宣伝ばかりのメールが多いなかで、ここだけは中身があります。数字を出してくれるのがありがたい。",
    who: "個人事業主・30代",
    bandTitle: "続きは LINE とメルマガで。",
    bandBody: "登録は30秒。いつでも解除できます。",
  },
};


/** 業種ごとの原稿。写真だけでなく文言も合わせないと「自分ごと」にならない。 */
const INDUSTRY_COPY: Record<
  string,
  { secTitle: string; items: Item[]; aboutTitle: string; quote: string; who: string }
> = {
  seafood: {
    secTitle: "今日の水揚げから",
    items: [
      { name: "朝どれ鮮魚 セット", desc: "その日いちばん状態のよいものだけを箱に詰めます。", price: "¥3,240" },
      { name: "一夜干し 3枚組", desc: "潮風と天日だけで、ゆっくり水分を抜きました。", price: "¥1,800" },
      { name: "詰め合わせ 化粧箱", desc: "贈答用。のし・手提げ袋を無料でお付けします。", price: "¥5,400" },
    ],
    aboutTitle: "獲れた分だけを、その日のうちに。",
    quote: "「開けた瞬間に海の匂いがしました。」",
    who: "◯◯県・50代・贈答用に",
  },
  sweets: {
    secTitle: "定番の三品",
    items: [
      { name: "季節の生菓子", desc: "その日の朝に仕上げた分だけをお出しします。", price: "¥480" },
      { name: "栗蒸し羊羹", desc: "丹波産の新栗をたっぷり。秋冬限定です。", price: "¥3,510" },
      { name: "焼き菓子詰合せ", desc: "手土産に。個包装なので配りやすいです。", price: "¥2,160" },
    ],
    aboutTitle: "小さくつくり、その日に売り切る。",
    quote: "「箱を開けた瞬間の香りが違いました。」",
    who: "◯◯県・40代・リピーター",
  },
  restaurant: {
    secTitle: "お品書き",
    items: [
      { name: "特製ラーメン", desc: "毎朝炊く鶏白湯に、自家製の細麺を合わせて。", price: "¥1,100" },
      { name: "季節の一品", desc: "その日の仕入れで決まる、店主のおまかせ。", price: "¥780" },
      { name: "夜の晩酌セット", desc: "小鉢三種とドリンク一杯。仕事帰りに。", price: "¥1,500" },
    ],
    aboutTitle: "昼はラーメン、夜は酒場にも。",
    quote: "「近所にあったら毎週来ます。」",
    who: "会社員・30代",
  },
  salon: {
    secTitle: "メニュー",
    items: [
      { name: "カット", desc: "骨格と生え癖を見て、乾かすだけで決まる形に。", price: "¥5,500" },
      { name: "カラー", desc: "髪の負担を抑えた薬剤を選んでいます。", price: "¥8,800" },
      { name: "ヘッドスパ", desc: "首肩までほぐす40分。指名料はいただきません。", price: "¥4,400" },
    ],
    aboutTitle: "毎朝が、少し楽になる髪に。",
    quote: "「はじめて“朝がラク”を実感しました。」",
    who: "会社員・30代・2年通っています",
  },
  craft: {
    secTitle: "これまでの仕事",
    items: [
      { name: "潮の器", desc: "海砂を釉薬に混ぜて焼いた、青みのある器です。", price: "¥6,600" },
      { name: "しのぎ花入", desc: "地元の土だけで成形しました。一点ものです。", price: "¥12,000" },
      { name: "常設展示", desc: "旧郵便局を改装した工房で常設しています。", price: "見学可" },
    ],
    aboutTitle: "急がないことを、選んできた。",
    quote: "「十年使って、やっと自分のものになった。」",
    who: "◯◯県・愛用者",
  },
  pro: {
    secTitle: "できること",
    items: [
      { name: "現状の棚卸し", desc: "いまの数字と手間を洗い出し、やめることから決めます。", price: "¥0〜" },
      { name: "仕組みづくり", desc: "続けられる運用に落とし込み、手順書まで作ります。", price: "¥80,000〜" },
      { name: "伴走サポート", desc: "月2回の定例で、詰まったところをその場で解消。", price: "¥30,000/月" },
    ],
    aboutTitle: "現場が回る形まで、いっしょに。",
    quote: "「三年悩んだことが、二回の面談で片づきました。」",
    who: "製造業・代表取締役",
  },
  school: {
    secTitle: "講座のご案内",
    items: [
      { name: "体験レッスン", desc: "道具はすべてお貸しします。手ぶらでどうぞ。", price: "¥2,000" },
      { name: "月2回コース", desc: "同じ曜日・同じ時間で、無理なく続けられます。", price: "¥6,600/月" },
      { name: "オンライン講座", desc: "録画を配信。あとから何度でも見返せます。", price: "¥3,300" },
    ],
    aboutTitle: "できるようになるまで、ずっと。",
    quote: "「不器用な私でも、形になりました。」",
    who: "主婦・50代",
  },
  construction: {
    secTitle: "施工のご案内",
    items: [
      { name: "新築・注文住宅", desc: "土地探しから引き渡しまで、担当が変わりません。", price: "見積無料" },
      { name: "リフォーム", desc: "水まわりだけ、一部屋だけ。小さな工事も承ります。", price: "¥300,000〜" },
      { name: "点検・メンテナンス", desc: "お引き渡し後も年1回、無料で伺います。", price: "¥0" },
    ],
    aboutTitle: "顔が見える家を、地元で。",
    quote: "「工事中も、毎日きれいに片づいていました。」",
    who: "◯◯市・30代・注文住宅",
  },
  clinic: {
    secTitle: "施術メニュー",
    items: [
      { name: "初回カウンセリング", desc: "触って確かめ、原因を説明してから始めます。", price: "¥5,500" },
      { name: "骨盤・姿勢調整", desc: "痛みの出にくい体の使い方までお伝えします。", price: "¥6,600" },
      { name: "回数券（5回）", desc: "有効期限なし。ご家族と分け合えます。", price: "¥28,000" },
    ],
    aboutTitle: "その場しのぎで、終わらせない。",
    quote: "「原因を説明してもらえたのが初めてでした。」",
    who: "◯◯市・50代・腰痛",
  },
  farm: {
    secTitle: "旬のお届けもの",
    items: [
      { name: "旬の野菜セット", desc: "その週に採れたものを詰め合わせてお送りします。", price: "¥3,000" },
      { name: "訳ありセット", desc: "見た目だけの理由で市場に出せないもの。味は同じです。", price: "¥1,800" },
      { name: "収穫体験", desc: "土日限定。長靴とハサミはお貸しします。", price: "¥1,500" },
    ],
    aboutTitle: "採れたてを、採れた人から。",
    quote: "「子どもが野菜を食べるようになりました。」",
    who: "◯◯県・40代・定期便",
  },
  retail: {
    secTitle: "取り扱い",
    items: [
      { name: "暮らしの道具", desc: "毎日使って、長くもつものだけを選んでいます。", price: "¥1,200〜" },
      { name: "作家もの", desc: "少量しか入りません。入荷はSNSでお知らせします。", price: "¥4,800〜" },
      { name: "ギフト包装", desc: "無料。メッセージカードもお付けできます。", price: "¥0" },
    ],
    aboutTitle: "選ぶ理由を、言葉にできるものだけ。",
    quote: "「置きたいものが、必ず見つかります。」",
    who: "◯◯市・30代・常連",
  },
  stay: {
    secTitle: "お部屋と体験",
    items: [
      { name: "一日一組の宿", desc: "古民家を一棟まるごとお使いいただけます。", price: "¥18,000〜" },
      { name: "朝ごはん付き", desc: "地のものでつくる、素朴な朝食をお出しします。", price: "+¥1,500" },
      { name: "漁体験", desc: "早朝の船に同乗できます（要予約・季節限定）。", price: "¥5,000" },
    ],
    aboutTitle: "何もしない時間を、贈りたい。",
    quote: "「時間の流れ方が違いました。」",
    who: "◯◯県・ご夫婦",
  },
};


/**
 * シグネチャ＝「一点だけ過剰にする」ブロック。
 * 余白・3色以内・見やすさ…の定番だけを守ったサイトは、正しいが記憶に残らない。
 * 記憶に残るサイトは必ずどこか1箇所が過剰なので、回答から決定的に1つ選んで必ず入れる。
 */
type Signature = "oversizedType" | "verticalBand" | "fullBleedWord" | "giantNumber" | "edgeIndex" | "collage";

const SIGNATURES: Signature[] = ["collage", "oversizedType", "fullBleedWord", "giantNumber", "edgeIndex", "verticalBand"];

function signatureFor(a: Full, seed: number): Signature {
  if (a.tone === "wamodern") return "verticalBand";
  if (a.tone === "pop") return "collage";
  // 見せ方が命の業種は、写真1枚より編集されたコラージュのほうが効く
  if (a.industry === "retail" || a.industry === "sweets" || a.industry === "salon") return "collage";
  return SIGNATURES[seed % SIGNATURES.length];
}


/**
 * 業種ごとの「その店自身の言葉」。
 * 目的（売る/問い合わせ/世界観/ファン）は行動の種類を決めるだけで、
 * 主語は必ずお客様の商売側にする。制作側の営業文言をここに混ぜない。
 */
const INDUSTRY_VOICE: Record<
  string,
  { h1: [string, string]; lead: string; actions: Record<string, string>; band: Record<string, string> }
> = {
  seafood: {
    h1: ["獲れた分だけを、", "その日のうちに。"],
    lead: "港からそのまま、氷締めにしてお送りします。",
    actions: { shop: "商品を見る", lead: "在庫を確認する", brand: "港の話を読む", fan: "入荷情報を受け取る" },
    band: { shop: "本日出荷分、残りわずかです。", lead: "数量・発送日はお気軽にお尋ねください。", brand: "続きは、この先で。", fan: "入荷日はLINEでお知らせします。" },
  },
  sweets: {
    h1: ["つくれる分だけを、", "ていねいに。"],
    lead: "その日の朝に仕上げた分だけをお出ししています。",
    actions: { shop: "お取り寄せする", lead: "ご予約・ご相談はこちら", brand: "菓子の話を読む", fan: "新作情報を受け取る" },
    band: { shop: "本日分、まもなく売り切れます。", lead: "ご予算とご用途をお聞かせください。", brand: "続きは、この先で。", fan: "新作は先にLINEでお知らせします。" },
  },
  restaurant: {
    h1: ["昼はラーメン、", "夜は酒場にも。"],
    lead: "毎朝炊くスープと、その日の仕入れでお待ちしています。",
    actions: { shop: "お品書きを見る", lead: "ご予約はこちら", brand: "店の話を読む", fan: "今日の一杯を見る" },
    band: { shop: "テイクアウトも承っています。", lead: "宴会・貸切のご相談も承ります。", brand: "続きは、この先で。", fan: "その日の限定はLINEで流します。" },
  },
  salon: {
    h1: ["毎朝が、", "少し楽になる髪に。"],
    lead: "乾かすだけで決まる形に整えます。指名料はいただきません。",
    actions: { shop: "メニューを見る", lead: "空き状況を見る", brand: "サロンの考え方", fan: "空席情報を受け取る" },
    band: { shop: "商品のお取り置きも承ります。", lead: "当日のご予約もお問い合わせください。", brand: "続きは、この先で。", fan: "急な空きはLINEでお知らせします。" },
  },
  craft: {
    h1: ["ここにしかない、", "仕事がある。"],
    lead: "土も釉薬も、この土地のものだけを使っています。",
    actions: { shop: "うつわを見る", lead: "工房見学のご予約", brand: "つくり方を見る", fan: "窯出し情報を受け取る" },
    band: { shop: "一点ものにつき、在庫は入れ替わります。", lead: "見学は事前予約制です。", brand: "続きは、この先で。", fan: "窯出しの日はLINEでお知らせします。" },
  },
  pro: {
    h1: ["現場が回る形まで、", "いっしょに。"],
    lead: "資料をつくって終わりにはしません。明日から使える形にします。",
    actions: { shop: "料金を見る", lead: "無料相談はこちら", brand: "私たちの考え方", fan: "お役立ち情報を受け取る" },
    band: { shop: "見積もりは無料です。", lead: "まずは現状をお聞かせください。", brand: "続きは、この先で。", fan: "事例は週1でお送りします。" },
  },
  school: {
    h1: ["できるようになるまで、", "ずっと。"],
    lead: "道具はすべてお貸しします。はじめての方が半分です。",
    actions: { shop: "講座を見る", lead: "体験レッスンのご予約", brand: "教室について", fan: "開講日のお知らせ" },
    band: { shop: "体験だけのご参加も歓迎です。", lead: "日程はご相談に応じます。", brand: "続きは、この先で。", fan: "次回の募集はLINEで先行案内します。" },
  },
  stay: {
    h1: ["何もしない時間を、", "贈りたい。"],
    lead: "一日一組。古民家を一棟まるごとお使いいただけます。",
    actions: { shop: "空室を見る", lead: "空室状況を見る", brand: "宿について", fan: "直前割を受け取る" },
    band: { shop: "連泊割引をご用意しています。", lead: "人数・日程をお聞かせください。", brand: "続きは、この先で。", fan: "直前の空きはLINEで流します。" },
  },
  construction: {
    h1: ["顔が見える家を、", "地元で。"],
    lead: "土地探しから引き渡しまで、担当が変わりません。",
    actions: { shop: "施工事例を見る", lead: "無料見積もりを依頼", brand: "家づくりの考え方", fan: "見学会の案内を受け取る" },
    band: { shop: "小さな工事もお受けしています。", lead: "図面がなくても概算をお出しします。", brand: "続きは、この先で。", fan: "見学会の日程を先にお知らせします。" },
  },
  clinic: {
    h1: ["その場しのぎで、", "終わらせない。"],
    lead: "触って確かめ、原因を説明してから施術します。",
    actions: { shop: "料金を見る", lead: "ご予約はこちら", brand: "施術方針について", fan: "健康情報を受け取る" },
    band: { shop: "回数券は有効期限なしです。", lead: "当日のご予約もお電話でどうぞ。", brand: "続きは、この先で。", fan: "セルフケアは週1でお送りします。" },
  },
  farm: {
    h1: ["採れたてを、", "採れた人から。"],
    lead: "その週に採れたものを、そのまま箱に詰めます。",
    actions: { shop: "定期便のお申し込み", lead: "収穫体験のご予約", brand: "畑について", fan: "収穫情報を受け取る" },
    band: { shop: "天候により内容が変わります。", lead: "団体・学校のご相談も承ります。", brand: "続きは、この先で。", fan: "旬の入れ替わりをLINEでお知らせします。" },
  },
  retail: {
    h1: ["選ぶ理由を、", "言葉にできるものだけ。"],
    lead: "毎日使って、長くもつものだけを置いています。",
    actions: { shop: "オンラインストアへ", lead: "在庫を確認する", brand: "選び方を見る", fan: "入荷情報を受け取る" },
    band: { shop: "ギフト包装は無料です。", lead: "お取り置きも承ります。", brand: "続きは、この先で。", fan: "入荷はLINEでお知らせします。" },
  },
};

/** 業種の言葉を主にした原稿を組む（全レンダラー共通） */
function buildCopy(a: Full): Content {
  const base = CONTENT[a.goal];
  const ind = INDUSTRY_COPY[a.industry];
  const voice = INDUSTRY_VOICE[a.industry];
  return {
    ...base,
    ...(ind ? { secTitle: ind.secTitle, items: ind.items, aboutTitle: ind.aboutTitle, quote: ind.quote, who: ind.who } : {}),
    ...(voice
      ? {
          h1: voice.h1,
          lead: voice.lead,
          cta: voice.actions[a.goal] ?? base.cta,
          bandTitle: voice.band[a.goal] ?? base.bandTitle,
          bandBody: voice.lead,
          ctaNote: voice.band[a.goal] ?? base.ctaNote,
        }
      : {}),
  };
}


/* --------------------------- ポップ和（極太）レンダラー -------------------------- */
/** 有機的なブロブ形状のパスを作る */
function blobPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: number,
  points = 8,
) {
  const rand = mulberry((Math.imul(seed ^ 0x85ebca6b, 2246822507) >>> 0) || 1);
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < points; i++) {
    const ang = (Math.PI * 2 * i) / points;
    const wob = 0.82 + rand() * 0.32;
    pts.push({ x: cx + Math.cos(ang) * rx * wob, y: cy + Math.sin(ang) * ry * wob });
  }
  ctx.beginPath();
  for (let i = 0; i < pts.length; i++) {
    const cur = pts[i];
    const next = pts[(i + 1) % pts.length];
    const midX = (cur.x + next.x) / 2;
    const midY = (cur.y + next.y) / 2;
    if (i === 0) ctx.moveTo(midX, midY);
    else ctx.quadraticCurveTo(cur.x, cur.y, midX, midY);
  }
  const first = pts[0];
  const firstMid = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
  ctx.quadraticCurveTo(first.x, first.y, firstMid.x, firstMid.y);
  ctx.closePath();
}

/** 吹き出し（丸い雲形の枠線） */
function speechBubble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  color: string,
  seed: number,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.6;
  blobPath(ctx, x + w / 2, y + h / 2, w / 2, h / 2, seed, 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + w * 0.24, y + h + 12, 9, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + w * 0.18, y + h + 30, 5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** 極太の見出しを、字面を潰して描く */
function fatText(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  targetW: number,
  color: string,
  font: string,
  squash = 1.18,
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let size = 300;
  ctx.font = `900 ${size}px ${font}`;
  while (ctx.measureText(text).width * squash > targetW && size > 20) {
    size -= 4;
    ctx.font = `900 ${size}px ${font}`;
  }
  ctx.translate(cx, cy);
  ctx.scale(squash, 1);
  ctx.fillText(text, 0, 0);
  ctx.restore();
  return size;
}

/** ダブルトーン：写真を2色に置き換えて、色面と馴染ませる合成 */
function duotone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  shadow: string,
  light: string,
) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.globalCompositeOperation = "saturation";
  ctx.fillStyle = "hsl(0,0%,50%)";
  ctx.fillRect(x, y, w, h);
  ctx.globalCompositeOperation = "multiply";
  ctx.fillStyle = shadow;
  ctx.fillRect(x, y, w, h);
  ctx.globalCompositeOperation = "lighten";
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = light;
  ctx.fillRect(x, y, w, h);
  ctx.globalAlpha = 1;
  ctx.restore();
}

/**
 * コラージュ（ムードボード）ブロック。
 * 写真を1枚だけ大きく置く代わりに、色面と複数の写真を組み合わせて“編集された絵”をつくる。
 */
function collageBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  p: Palette,
  a: Full,
  seed: number,
  font: string,
  initial: string,
  radius: number,
) {
  const gap = 14;
  const colW = (w - gap * 2) / 3;
  const rowH = (h - gap) / 2;
  const accent = p.accent;
  const deep = p.primaryDeep;

  artwork(ctx, x, y, colW * 2 + gap, rowH, radius, p, "product", seed + 3, font, initial);
  ctx.save();
  ctx.fillStyle = accent;
  rr(ctx, x + colW * 2 + gap * 2, y, colW, rowH, radius);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = `800 15px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("NEW", x + colW * 2 + gap * 2 + colW / 2, y + rowH / 2);
  ctx.restore();
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";

  const by = y + rowH + gap;
  artwork(ctx, x, by, colW, rowH, radius, p, "person", seed + 9, font, initial);
  duotone(ctx, x, by, colW, rowH, deep, accent);

  ctx.save();
  ctx.fillStyle = rgba(accent, 0.35);
  rr(ctx, x + colW + gap, by, colW, rowH, radius);
  ctx.fill();
  ctx.restore();
  const cr = Math.min(colW, rowH) * 0.36;
  ctx.save();
  ctx.beginPath();
  ctx.arc(x + colW + gap + colW / 2, by + rowH / 2, cr, 0, Math.PI * 2);
  ctx.clip();
  artwork(ctx, x + colW + gap + colW / 2 - cr, by + rowH / 2 - cr, cr * 2, cr * 2, 0, p, "product", seed + 27, font, initial);
  ctx.restore();

  artwork(ctx, x + (colW + gap) * 2, by, colW, rowH, radius, p, "scenery", seed + 41, font, initial);
  ctx.save();
  ctx.fillStyle = "#ffffff";
  rr(ctx, x + (colW + gap) * 2 + 14, by + rowH - 62, colW - 28, 48, radius ? 10 : 0);
  ctx.fill();
  ctx.fillStyle = p.text;
  ctx.font = `700 12px ${font}`;
  ctx.fillText(INDUSTRY_COPY[a.industry]?.items[0].name ?? "ITEM 01", x + (colW + gap) * 2 + 26, by + rowH - 32);
  ctx.restore();
}

function drawPopWa(ctx: CanvasRenderingContext2D, a: Full, siteName: string, font: string): number {
  const p = PALETTES[a.palette];
  const k = buildCopy(a);
  const k0 = k;
  const seed = hashString(JSON.stringify(a) + siteName + VARIANT);
  const cream = "#f4f1e8";
  // ポップ和のメインカラーは、選んだ配色の主色をそのまま使う（モノトーンだけ墨に寄せる）
  const teal = a.palette === "mono" ? "#1b1b1b" : p.primary;
  const red = "#e2553c";
  const pad = 64;

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = cream;
  ctx.fillRect(0, 0, W, MAXH);

  const pill = (x: number, y2: number, label: string, w: number) => {
    ctx.save();
    ctx.strokeStyle = teal;
    ctx.lineWidth = 1.4;
    rr(ctx, x, y2, w, 34, 17);
    ctx.stroke();
    ctx.fillStyle = teal;
    ctx.font = `600 13px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + w / 2, y2 + 18);
    ctx.restore();
  };
  pill(pad, 26, "Facebook", 108);
  pill(W - pad - 108, 26, "Instagram", 108);
  ctx.save();
  ctx.fillStyle = teal;
  ctx.font = `600 13px ${font}`;
  ctx.textAlign = "center";
  ctx.fillText("◯◯県◯◯市 1-5-11", W / 2, 48);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = teal;
  ctx.font = `800 17px ${font}`;
  ctx.textAlign = "center";
  ctx.fillText(k.lead, W / 2, 96);
  ctx.restore();

  const rawName = siteName.trim() || "SEAVEGE";
  const logo = rawName.length <= 10 ? rawName : rawName.split(/\s+/)[0] || rawName.slice(0, 10);
  const logoSize = fatText(ctx, logo, W / 2, 200, W * 0.82, teal, font, 1.2);

  const photoTop = 200 + logoSize * 0.18;
  const photoH = 620;
  ctx.save();
  blobPath(ctx, W / 2 - 60, photoTop + photoH / 2, W * 0.44, photoH * 0.52, seed, 9);
  ctx.clip();
  artwork(ctx, 60, photoTop - 40, W - 120, photoH + 80, 0, p, "person", seed, font, logo[0] ?? "S");
  ctx.restore();

  vtext(ctx, "ご予約はこちらから。ぜひ登録お願いします！", W - 40, photoTop - 40, 13, teal, font, 600, 17);
  vtext(ctx, "We accept online bookings. Follow us!", W - 66, photoTop - 40, 12, teal, font, 500, 15);

  const cols = [k.secTitle.slice(0, 4), "本日開店", "地産地消", "笑門来福"];
  cols.forEach((c, i) => {
    vtext(ctx, c, W - 150 - i * 74, photoTop + photoH * 0.52, 44, teal, font, 900, 52);
  });

  ctx.save();
  ctx.fillStyle = red;
  const mx = 96;
  const my = photoTop + photoH - 30;
  [0, 1].forEach((i) => {
    ctx.beginPath();
    ctx.ellipse(mx + i * 26, my - i * 8, 11, 26, i ? 0.3 : -0.2, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = "#ffffff";
  [0, 1].forEach((i) => {
    ctx.beginPath();
    ctx.arc(mx + i * 26 - 3, my - i * 8 - 12, 2.4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  let y = photoTop + photoH + 90;

  const bw = W * 0.62;
  speechBubble(ctx, pad, y, bw, 190, teal, seed + 7);
  ctx.save();
  ctx.fillStyle = teal;
  ctx.font = `800 26px ${font}`;
  ctx.fillText(k.aboutTitle, pad + 46, y + 74);
  ctx.font = `500 15px ${font}`;
  ctx.fillText(k0.lead, pad + 46, y + 116);
  ctx.font = `400 13px ${font}`;
  ctx.fillStyle = rgba(teal, 0.75);
  ctx.fillText("From our shop. All handmade, every single day.", pad + 46, y + 148);
  ctx.restore();
  y += 250;

  const half = (W - pad * 2 - 60) / 2;
  ctx.save();
  rr(ctx, pad, y, half, 300, 28);
  ctx.clip();
  artwork(ctx, pad, y, half, 300, 28, p, "product", seed + 11, font, "S");
  ctx.restore();
  let ty = y + 26;
  ty += para(ctx, k0.aboutBody, pad + half + 60, ty, half, 15, 30, teal, font, 500, "left", 5) + 22;
  para(
    ctx,
    "We keep the batch small so that everything reaches you at its best. Please drop by anytime.",
    pad + half + 60,
    ty,
    half,
    13,
    24,
    rgba(teal, 0.7),
    font,
    400,
    "left",
    4,
  );
  y += 340;

  const cw = (W - pad * 2 - 48) / 3;
  k.items.forEach((it, i) => {
    const cx = pad + i * (cw + 24);
    ctx.save();
    rr(ctx, cx, y, cw, cw * 0.8, 24);
    ctx.clip();
    artwork(ctx, cx, y, cw, cw * 0.8, 24, p, "product", seed + i * 97, font, "S");
    ctx.restore();
    ctx.save();
    ctx.fillStyle = teal;
    ctx.beginPath();
    ctx.arc(cx + 46, y + cw * 0.8 - 40, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 11px ${font}`;
    ctx.textAlign = "center";
    ctx.fillText(i === 0 ? "定番" : i === 1 ? "限定" : "人気", cx + 46, y + cw * 0.8 - 36);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = teal;
    ctx.font = `800 17px ${font}`;
    ctx.textAlign = "left";
    ctx.fillText(it.name, cx, y + cw * 0.8 + 34);
    ctx.restore();
    para(ctx, it.desc, cx, y + cw * 0.8 + 58, cw, 12, 20, rgba(teal, 0.75), font, 400, "left", 2);
  });
  y += cw * 0.8 + 130;

  const pw = 380;
  ctx.save();
  ctx.fillStyle = teal;
  rr(ctx, W / 2 - pw / 2, y, pw, 76, 38);
  ctx.fill();
  ctx.fillStyle = cream;
  ctx.font = `800 21px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(k0.cta, W / 2, y + 39);
  ctx.restore();
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  y += 76 + 70;

  ctx.save();
  ctx.fillStyle = teal;
  ctx.fillRect(0, y, W, 120);
  ctx.fillStyle = cream;
  ctx.font = `900 22px ${font}`;
  ctx.fillText(logo, pad, y + 52);
  ctx.font = `400 12px ${font}`;
  ctx.fillText("◯◯県◯◯市 1-5-11 / 11:00-22:00", pad, y + 82);
  ctx.textAlign = "right";
  ctx.font = `400 11px ${font}`;
  ctx.fillText(`© 2026 ${logo.toUpperCase()}`, W - pad, y + 82);
  ctx.restore();
  ctx.textAlign = "left";
  return y + 120;
}

/* --------------------------- シネマ・ダーク レンダラー -------------------------- */
/** 黒地・明朝・全面映像。読ませるより「間」で見せる型。 */
function drawCinema(ctx: CanvasRenderingContext2D, a: Full, siteName: string, font: string, serif: string): number {
  usePhotosFor(a);
  DESATURATE = true;
  const p = PALETTES[a.palette];
  const k = buildCopy(a);
  const k0 = k;
  const seed = hashString(JSON.stringify(a) + siteName + VARIANT);
  const ink = "#0a0906";
  const paper = "rgba(255,255,255,0.86)";
  const faint = "rgba(255,255,255,0.34)";
  const pad = 120;
  const initial = (siteName.trim()[0] || "I").toUpperCase();

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = ink;
  ctx.fillRect(0, 0, W, MAXH);

  ctx.save();
  ctx.fillStyle = paper;
  ctx.font = `300 22px ${serif}`;
  ctx.letterSpacing = "2px";
  ctx.fillText(k.aboutTitle.split(/[、。]/)[0], pad, 300);
  ctx.fillStyle = faint;
  ctx.font = `400 11px ${font}`;
  ctx.fillText("100", pad, 600);
  ctx.restore();
  let y = 660;

  const hh = 700;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, y, W, hh);
  ctx.clip();
  artwork(ctx, 0, y - 60, W, hh + 120, 0, p, a.hero, seed, font, initial);
  const g = ctx.createLinearGradient(0, y, 0, y + hh);
  g.addColorStop(0, "rgba(10,9,6,0.55)");
  g.addColorStop(0.5, "rgba(10,9,6,0.25)");
  g.addColorStop(1, "rgba(10,9,6,0.8)");
  ctx.fillStyle = g;
  ctx.fillRect(0, y, W, hh);
  ctx.restore();

  ctx.save();
  ctx.fillStyle = paper;
  ctx.font = `300 54px ${serif}`;
  ctx.letterSpacing = "6px";
  ctx.textAlign = "center";
  ctx.fillText(k.h1[0], W / 2, y + hh / 2 - 8);
  ctx.fillText(k.h1[1], W / 2, y + hh / 2 + 74);
  ctx.restore();
  y += hh + 200;

  para(ctx, k0.aboutBody, W / 2, y, W * 0.46, 15, 40, "rgba(255,255,255,0.62)", serif, 300, "center", 6);
  y += 320;

  k.items.forEach((it, i) => {
    const ih = 420;
    ctx.save();
    ctx.beginPath();
    ctx.rect(pad, y, W - pad * 2, ih);
    ctx.clip();
    artwork(ctx, pad, y - 30, W - pad * 2, ih + 60, 0, p, i % 2 ? "scenery" : "product", seed + i * 191, font, initial);
    ctx.fillStyle = "rgba(10,9,6,0.35)";
    ctx.fillRect(pad, y, W - pad * 2, ih);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = faint;
    ctx.font = `400 11px ${font}`;
    ctx.letterSpacing = "4px";
    ctx.fillText(String(i + 1).padStart(2, "0"), pad, y + ih + 44);
    ctx.fillStyle = paper;
    ctx.font = `300 24px ${serif}`;
    ctx.letterSpacing = "3px";
    ctx.fillText(it.name, pad + 56, y + ih + 44);
    ctx.restore();
    y += ih + 130;
  });

  ctx.save();
  ctx.fillStyle = paper;
  ctx.font = `300 32px ${serif}`;
  ctx.letterSpacing = "8px";
  ctx.textAlign = "center";
  ctx.fillText(k0.bandTitle, W / 2, y + 40);
  ctx.restore();
  const bw2 = 300;
  ctx.strokeStyle = "rgba(255,255,255,0.45)";
  ctx.lineWidth = 1;
  ctx.strokeRect(W / 2 - bw2 / 2 + 0.5, y + 96.5, bw2, 60);
  ctx.save();
  ctx.fillStyle = paper;
  ctx.font = `400 13px ${font}`;
  ctx.letterSpacing = "5px";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(k0.cta, W / 2, y + 127);
  ctx.restore();
  ctx.textBaseline = "alphabetic";
  y += 250;

  ctx.save();
  ctx.fillStyle = faint;
  ctx.font = `400 10px ${font}`;
  ctx.letterSpacing = "4px";
  ctx.textAlign = "center";
  ctx.fillText(`© 2026 ${siteName.toUpperCase()}`, W / 2, y);
  ctx.restore();
  ctx.textAlign = "left";
  return y + 80;
}

/* ------------------------------ プロ仕様レンダラー ----------------------------- */

/** "never enough" → "Never Enough"。全部大文字より、頭だけ大文字のほうが柔らかく今っぽい */
function titleCase(text: string): string {
  return text
    .toLowerCase()
    .split(/(\s+)/)
    .map((w) => (/\s/.test(w) ? w : w.charAt(0).toUpperCase() + w.slice(1)))
    .join("");
}

/**
 * ロゴ（ワードマーク）を描く。
 * 全部大文字＋太いサンセリフは無難だが野暮ったくなりやすいので、
 * 落ち着いた空気感を選んだときは細い明朝のイタリック＋大文字小文字混在にする。
 */
function wordmark(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  color: string,
  font: string,
  serif: string,
  tone: string,
  track = 3,
) {
  const elegant = tone === "premium" || tone === "modern" || tone === "patisserie" || tone === "cinema";
  ctx.save();
  ctx.fillStyle = color;
  if (elegant) {
    // 明朝のイタリックは字面が小さく見えるので、少し大きめに置く
    ctx.font = `italic 300 ${Math.round(size * 1.34)}px ${serif}`;
    ctx.letterSpacing = "0px";
    ctx.fillText(titleCase(text), x, y);
  } else {
    ctx.font = `${tone === "pop" || tone === "popwa" ? 800 : 700} ${size}px ${font}`;
    ctx.letterSpacing = `${track}px`;
    ctx.fillText(text.toUpperCase(), x, y);
  }
  ctx.restore();
}

function drawSite(ctx: CanvasRenderingContext2D, a: Full, siteName: string, font: string, serif: string): number {
  DESATURATE = a.palette === "mono";
  usePhotosFor(a);
  if (a.tone === "wamodern") return drawWa(ctx, a, siteName, serif);
  if (a.tone === "patisserie") return drawPatisserie(ctx, a, siteName, serif);
  if (a.tone === "popwa") return drawPopWa(ctx, a, siteName, font);
  if (a.tone === "cinema") return drawCinema(ctx, a, siteName, font, serif);
  const p = PALETTES[a.palette];
  const t = TONES[a.tone];
  const k = buildCopy(a);
  const seed = hashString(JSON.stringify(a) + siteName + VARIANT);
  // 目的だけを変えたときも必ず別の写真になるよう、明示的にずらす
  const goalOffset = ["shop", "lead", "brand", "fan"].indexOf(a.goal) * 7919;
  const heroSeed = seed + goalOffset;
  const pad = 88;
  const inner = W - pad * 2;
  const air = t.air;
  const rule = rgba(p.text, 0.12);
  const initial = (siteName.trim()[0] || "M").toUpperCase();
  const bodyLines = a.density === "light" ? 3 : a.density === "balanced" ? 5 : 8;
  // 文章量は「行数」だけでなく、載せる項目数と写真の大きさにも効かせる
  const itemCount = a.density === "light" ? 2 : a.density === "balanced" ? 3 : 4;
  const bodySize = 15;
  const bodyLh = a.tone === "pop" ? 28 : 31;
  // トーンで「構図」そのものを変える。太さや角丸だけだと、選んでも変わった気がしない。
  const heroStyle =
    a.tone === "premium"
      ? { align: "center" as CanvasTextAlign, imgRatio: 0.44, heroH: 700, band: false, tilt: 0 }
      : a.tone === "modern"
        ? { align: "left" as CanvasTextAlign, imgRatio: 0.62, heroH: 620, band: false, tilt: 0 }
        : a.tone === "pop"
          ? { align: "left" as CanvasTextAlign, imgRatio: 0.5, heroH: 600, band: true, tilt: -0.03 }
          : { align: "left" as CanvasTextAlign, imgRatio: 0.52, heroH: 660, band: false, tilt: 0 };
  const secKinds =
    a.goal === "shop"
      ? ["product", "product", "scenery"]
      : a.goal === "brand"
        ? ["scenery", "product", "abstract"]
        : a.goal === "fan"
          ? ["abstract", "person", "scenery"]
          : ["abstract", "scenery", "abstract"];

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, W, MAXH);

  const eyebrow = (label: string, x: number, y: number, align: CanvasTextAlign = "left", color = p.primary) => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `600 11px ${font}`;
    ctx.letterSpacing = "4px";
    ctx.textAlign = align;
    ctx.fillText(label, x, y);
    ctx.restore();
  };
  // 見出しは明朝。日本語サイトで一番効く「格」の作り方。
  const headFont = a.tone === "pop" ? font : serif;
  const headWeight = a.tone === "pop" ? 800 : a.tone === "premium" ? 300 : 500;
  const display = (text: string, x: number, y: number, size: number, color: string, align: CanvasTextAlign = "left") => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = `${headWeight} ${size}px ${headFont}`;
    ctx.letterSpacing = `${t.track * 0.3 + 1}px`;
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    ctx.restore();
  };
  /** 指定幅に収まる最大の見出しサイズを返す */
  const fitHead = (text: string, maxW: number, base: number) => {
    ctx.save();
    let size = base;
    for (let i = 0; i < 40; i++) {
      ctx.font = `${headWeight} ${size}px ${headFont}`;
      if (ctx.measureText(text).width <= maxW || size <= 22) break;
      size -= 2;
    }
    ctx.restore();
    return size;
  };

  let sectionNo = 0;
  /** 01 / LABEL ——— 見出し。実際の制作物っぽさはこの「通し番号＋罫」で出る。 */
  const sectionHead = (label: string, title: string, yy: number, lead?: string) => {
    sectionNo += 1;
    hairline(ctx, pad, yy, inner, rule);
    ctx.save();
    ctx.fillStyle = p.sub;
    ctx.font = `500 11px ${font}`;
    ctx.letterSpacing = "2px";
    ctx.fillText(String(sectionNo).padStart(2, "0"), pad, yy + 30);
    ctx.fillStyle = p.primary;
    ctx.font = `600 11px ${font}`;
    ctx.letterSpacing = "4px";
    ctx.fillText(label, pad + 46, yy + 30);
    ctx.restore();
    display(title, pad, yy + 84, 32, p.text);
    let used = 104;
    if (lead) used += para(ctx, lead, pad, yy + 118, inner * 0.46, 14, 25, p.sub, font, 400, "left", 2) + 8;
    return used;
  };

  const solidBtn = (x: number, y: number, label: string, bg: string, fg: string, w = 240, h = 58) => {
    box(ctx, x, y, w, h, t.radius ? h / 2 : 0, bg, 20);
    ctx.save();
    ctx.fillStyle = fg;
    ctx.font = `600 16px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + w / 2, y + h / 2 + 1);
    ctx.restore();
  };
  const ghostBtn = (x: number, y: number, label: string, color: string, w = 150, h = 40) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    rr(ctx, x, y, w, h, t.radius ? h / 2 : 0);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = `600 13px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + w / 2, y + h / 2 + 1);
    ctx.restore();
  };

  /* ---- （ブラウザ枠は使わない。デザインカンプとして見せる） ---- */

  /* ---- ヘッダー：CTAの配置を目的で出し分ける（ベタ／文字色＋ベタ／反転＋ベタ／TEL＋ベタ） ---- */
  let y = 0;
  const navH = a.goal === "lead" ? 112 : 104;
  wordmark(ctx, siteName, pad, y + navH / 2 + 8, 22, p.text, font, serif, a.tone, 3 + t.track * 0.2);

  // 目的別のヘッダーCTAパターン
  const navPattern =
    a.goal === "lead" ? "telSolid" : a.goal === "shop" ? "outlineSolid" : a.goal === "fan" ? "textSolid" : "solid";

  const solidBtn2 = (x: number, yy: number, label: string, w = 132, h = 38) => {
    box(ctx, x, yy, w, h, t.radius ? h / 2 : 2, p.primaryDeep);
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = `600 12px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(label, x + w / 2, yy + h / 2);
    ctx.restore();
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
  };

  let rightEdge = W - pad;
  const cy = y + navH / 2;
  solidBtn2(rightEdge - 132, cy - 19, k.cta);
  rightEdge -= 132 + 12;

  if (navPattern === "outlineSolid") {
    ghostBtn(rightEdge - 118, cy - 19, "資料請求", p.primary, 118, 38);
    rightEdge -= 118 + 12;
  } else if (navPattern === "textSolid") {
    ctx.save();
    ctx.fillStyle = p.accent;
    ctx.font = `700 12px ${font}`;
    ctx.textAlign = "right";
    ctx.fillText("メルマガ登録", rightEdge, cy + 4);
    ctx.restore();
    rightEdge -= 92;
  } else if (navPattern === "telSolid") {
    ctx.save();
    ctx.fillStyle = p.text;
    ctx.font = `700 19px ${font}`;
    ctx.textAlign = "right";
    ctx.fillText("0120-000-000", rightEdge, cy - 2);
    ctx.fillStyle = p.sub;
    ctx.font = `400 10px ${font}`;
    ctx.fillText("平日9:00-18:00", rightEdge, cy + 15);
    ctx.restore();
    rightEdge -= 150;
  }

  const menu = ["ABOUT", k.secLabel, "VOICE", "NEWS"];
  ctx.save();
  ctx.font = `500 12px ${font}`;
  ctx.letterSpacing = "1.5px";
  const menuW = menu.map((m) => ctx.measureText(m).width + 34);
  let mx = rightEdge - 20 - menuW.reduce((sum, v) => sum + v, 0);
  menu.forEach((m, i) => {
    ctx.fillStyle = i === 0 ? p.text : p.sub;
    ctx.fillText(m, mx, cy + 4);
    if (i === 0) hairline(ctx, mx, cy + 12, menuW[0] - 34, rgba(p.text, 0.5));
    mx += menuW[i];
  });
  ctx.restore();
  hairline(ctx, 0, y + navH, W, rule);
  y += navH;

  /** ヒーロー内に置く目的別の要素。ファーストビューで目的の違いが出るようにする。 */
  const heroGoalOverlay = (ix: number, iy: number, iw: number, ih: number, onPhoto: boolean) => {
    const fg = onPhoto ? "#ffffff" : p.text;
    if (a.goal === "shop") {
      // 価格バッジを写真に重ねる
      const bw2 = 132;
      const bh2 = 56;
      box(ctx, ix + iw - bw2 - 20, iy + 20, bw2, bh2, t.radius ? bh2 / 2 : 0, "#ffffff");
      ctx.save();
      ctx.fillStyle = p.text;
      ctx.font = `700 20px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(k.items[0].price, ix + iw - bw2 / 2 - 20, iy + 20 + bh2 / 2 - 5);
      ctx.font = `400 10px ${font}`;
      ctx.fillStyle = p.sub;
      ctx.fillText("税込・送料無料", ix + iw - bw2 / 2 - 20, iy + 20 + bh2 / 2 + 14);
      ctx.restore();
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
    } else if (a.goal === "lead") {
      // 写真の上に問い合わせカードを重ねる
      const cw2 = Math.min(300, iw - 40);
      const ch2 = 170;
      box(ctx, ix + 20, iy + ih - ch2 - 20, cw2, ch2, t.card, "#ffffff");
      ctx.save();
      ctx.fillStyle = p.text;
      ctx.font = `700 14px ${font}`;
      ctx.fillText("30秒で無料相談", ix + 38, iy + ih - ch2 + 12);
      ctx.restore();
      [0, 1].forEach((i) => {
        box(ctx, ix + 38, iy + ih - ch2 + 28 + i * 34, cw2 - 36, 26, t.radius ? 13 : 2, p.soft);
      });
      solidBtn(ix + 38, iy + ih - 62, k.cta, p.primary, "#ffffff", cw2 - 36, 40);
    } else if (a.goal === "fan") {
      // SNS の丸と LINE ボタン
      const names = ["IG", "TT", "YT", "X"];
      names.forEach((n, i) => {
        const cx2 = ix + 34 + i * 46;
        ctx.save();
        ctx.strokeStyle = onPhoto ? "rgba(255,255,255,0.8)" : rgba(p.text, 0.4);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(cx2, iy + ih - 46, 17, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = fg;
        ctx.font = `700 10px ${font}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n, cx2, iy + ih - 46);
        ctx.restore();
      });
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "left";
    }
  };

  /* ---- ヒーロー ---- */
  if (a.layout === "fullhero") {
    const hh = 760;
    artwork(ctx, 0, y, W, hh, 0, p, a.hero, heroSeed, font, initial);
    const scrim = ctx.createLinearGradient(0, y, 0, y + hh);
    scrim.addColorStop(0, "rgba(0,0,0,0.30)");
    scrim.addColorStop(0.55, "rgba(0,0,0,0.18)");
    scrim.addColorStop(1, "rgba(0,0,0,0.52)");
    ctx.fillStyle = scrim;
    ctx.fillRect(0, y, W, hh);
    const hSize = Math.min(
      t.head * 1.5,
      fitHead(k.h1[0], W - pad * 4, t.head * 1.5),
      fitHead(k.h1[1], W - pad * 4, t.head * 1.5),
    ); // 見出しは思い切って大きく（ただし必ず収める）
    eyebrow(k.eyebrow, W / 2, y + 190, "center", "rgba(255,255,255,0.8)");
    display(k.h1[0], W / 2, y + 288, hSize, "#ffffff", "center");
    display(k.h1[1], W / 2, y + 288 + hSize * 1.18, hSize, "#ffffff", "center");
    para(ctx, k.lead, W / 2, y + 350 + hSize * 1.18, 720, 15, 28, "rgba(255,255,255,0.88)", font, 400, "center", 2);
    heroGoalOverlay(pad, y + 40, W - pad * 2, hh - 80, true);
    // CTA を何度も置くのは定番だが、押されるのは1つ。ここは「売る/相談」目的のときだけ。
    if (a.goal === "shop" || a.goal === "lead") {
      solidBtn(W / 2 - 125, y + hh - 168, k.cta, "#ffffff", p.primaryDeep, 250);
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.78)";
      ctx.font = `400 12px ${font}`;
      ctx.textAlign = "center";
      ctx.fillText(k.ctaNote, W / 2, y + hh - 78);
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      ctx.font = `400 12px ${font}`;
      ctx.textAlign = "center";
      ctx.letterSpacing = "3px";
      ctx.fillText("SCROLL", W / 2, y + hh - 92);
      ctx.restore();
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.beginPath();
      ctx.moveTo(W / 2, y + hh - 78);
      ctx.lineTo(W / 2, y + hh - 44);
      ctx.stroke();
    }
    y += hh + 110 * air;
  } else if (a.layout === "split") {
    const hh = heroStyle.heroH;
    const imgW = inner * heroStyle.imgRatio;
    const textW = heroStyle.align === "center" ? inner * 0.62 : inner - imgW - 76;
    if (heroStyle.band) {
      // ポップ：色ベタの帯を背景に敷く
      ctx.fillStyle = rgba(p.accent, 0.22);
      ctx.fillRect(0, y, W, hh - 40);
    }
    const hSize = Math.min(
      t.head * 1.18,
      fitHead(k.h1[0], inner * 0.44, t.head * 1.18),
      fitHead(k.h1[1], inner * 0.44, t.head * 1.18),
    );
    const hx = heroStyle.align === "center" ? W / 2 : pad;
    eyebrow(k.eyebrow, hx, y + 92, heroStyle.align);
    display(k.h1[0], hx, y + 178, hSize, p.text, heroStyle.align);
    display(k.h1[1], hx, y + 178 + hSize * 1.16, hSize, p.text, heroStyle.align);
    let ty = y + 236 + hSize * 1.16;
    ty += para(ctx, k.lead, hx, ty, textW, 15, 30, p.sub, font, 400, heroStyle.align, 3) + 26;
    ty += para(ctx, k.aboutBody, hx, ty, textW, bodySize, bodyLh, p.sub, font, 400, heroStyle.align, Math.min(bodyLines, 4)) + 30;
    // 目的でボタンの見え方を変える（世界観はボタンを置かず、線のリンクだけ）
    const bx = heroStyle.align === "center" ? W / 2 - 120 : pad;
    if (a.goal === "brand") {
      arrowLink(ctx, k.cta, bx, ty + 24, p.text, font);
    } else if (a.goal === "fan") {
      solidBtn(bx, ty, "LINEで受け取る", "#06c755", "#ffffff", 240);
    } else {
      solidBtn(bx, ty, k.cta, p.primary, "#ffffff", 240);
    }
    ctx.save();
    ctx.fillStyle = p.sub;
    ctx.font = `400 12px ${font}`;
    ctx.fillText(k.ctaNote, pad, ty + 82);
    ctx.restore();
    if (heroStyle.align === "center") {
      // 上質：テキストを中央に置き、写真は下に大きく敷く
      artwork(ctx, pad, ty + 96, inner, hh - (ty - y) - 60, t.card, p, a.hero, heroSeed, font, initial);
    } else {
      ctx.save();
      if (heroStyle.tilt) {
        ctx.translate(W - pad - imgW / 2, y + 46 + (hh - 60) / 2);
        ctx.rotate(heroStyle.tilt);
        ctx.translate(-(W - pad - imgW / 2), -(y + 46 + (hh - 60) / 2));
      }
      artwork(ctx, W - pad - imgW, y + 46, imgW, hh - 60, t.card, p, a.hero, heroSeed, font, initial);
      ctx.restore();
      heroGoalOverlay(W - pad - imgW, y + 46, imgW, hh - 60, true);
    }
    // 写真の下に小さなキャプション（囲みを置かず、罫で処理する）
    const capY = heroStyle.align === "center" ? y + hh + 26 : y + hh - 14;
    hairline(ctx, W - pad - imgW, capY, imgW, rgba(p.text, 0.2));
    ctx.save();
    ctx.fillStyle = p.sub;
    ctx.font = `400 11px ${font}`;
    ctx.letterSpacing = "1px";
    ctx.fillText(`${k.stats[0][0]} ${k.stats[0][1]} — ${siteName.toUpperCase()}`, W - pad - imgW, capY + 20);
    ctx.restore();
    y += hh + 90 * air;
  } else if (a.layout === "card") {
    const hh = 380;
    artwork(ctx, 0, y, W, hh, 0, p, a.hero, heroSeed, font, initial);
    ctx.fillStyle = "rgba(0,0,0,0.40)";
    ctx.fillRect(0, y, W, hh);
    eyebrow(k.eyebrow, W / 2, y + 132, "center", "rgba(255,255,255,0.85)");
    display(k.h1[0] + k.h1[1], W / 2, y + 208, fitHead(k.h1[0] + k.h1[1], inner, t.head * 0.9), "#ffffff", "center");
    para(ctx, k.lead, W / 2, y + 252, 680, 14, 26, "rgba(255,255,255,0.88)", font, 400, "center", 2);
    y += hh + 76;
    const cw = (inner - 56) / 3;
    k.items.forEach((it, i) => {
      const cx = pad + i * (cw + 28);
      box(ctx, cx, y, cw, 396, t.card, "#ffffff", 28);
      artwork(ctx, cx, y, cw, 226, t.card, p, secKinds[i % 3], seed + i * 613, font, initial);
      ctx.save();
      ctx.fillStyle = p.text;
      ctx.font = `700 17px ${font}`;
      ctx.fillText(it.name, cx + 22, y + 266);
      ctx.restore();
      para(ctx, it.desc, cx + 22, y + 292, cw - 44, 13, 22, p.sub, font, 400, "left", 2);
      hairline(ctx, cx + 22, y + 346, cw - 44, rule);
      ctx.save();
      ctx.fillStyle = p.text;
      ctx.font = `600 16px ${font}`;
      ctx.fillText(it.price, cx + 22, y + 376);
      ctx.textAlign = "right";
      ctx.fillStyle = p.primary;
      ctx.font = `600 13px ${font}`;
      ctx.fillText("詳しく見る →", cx + cw - 22, y + 376);
      ctx.restore();
    });
    y += 396 + 96 * air;
  } else {
    eyebrow(k.eyebrow, pad, y + 84);
    display(k.h1[0] + k.h1[1], pad, y + 150, fitHead(k.h1[0] + k.h1[1], inner, t.head * 0.95), p.text);
    hairline(ctx, pad, y + 182, 96, rgba(p.text, 0.5));
    const colw = (inner - 72) / 2;
    let ty = y + 226;
    // 2段組は前半／後半に分けて流す（同じ段落を両側に出さない）
    const flow = `${k.lead}${k.aboutBody}`;
    ctx.save();
    ctx.font = `400 ${bodySize}px ${font}`;
    const allLines = wrapJa(ctx, flow, colw);
    ctx.restore();
    const half = Math.ceil(Math.min(allLines.length, bodyLines * 2) / 2);
    para(ctx, allLines.slice(0, half).join(""), pad, ty, colw, bodySize, bodyLh, p.sub, font, 400, "left", bodyLines);
    para(
      ctx,
      allLines.slice(half, half + bodyLines).join(""),
      pad + colw + 72,
      ty,
      colw,
      bodySize,
      bodyLh,
      p.sub,
      font,
      400,
      "left",
      bodyLines,
    );
    ty += bodyLines * bodyLh + 34;
    artwork(ctx, pad, ty, inner, 460, t.card, p, a.hero, heroSeed, font, initial);
    ctx.save();
    ctx.fillStyle = p.sub;
    ctx.font = `400 11px ${font}`;
    ctx.fillText(`— ${k.secTitle}／${siteName}`, pad, ty + 484);
    ctx.restore();
    y = ty + 504 + 80 * air;
  }

  /* ---- 目的ブロック：ヒーローの直下に置き、目的の違いが一目で分かるようにする ---- */
  if (a.goal === "shop") {
    // 売る：商品カードを最上部に並べる
    const gcw = (inner - 48) / 3;
    k.items.forEach((it, i) => {
      const gx = pad + i * (gcw + 24);
      artwork(ctx, gx, y, gcw, gcw * 0.72, t.card, p, "product", seed + i * 811, font, initial);
      ctx.save();
      ctx.fillStyle = p.text;
      ctx.font = `600 15px ${font}`;
      ctx.fillText(it.name, gx, y + gcw * 0.72 + 30);
      ctx.textAlign = "right";
      ctx.fillText(it.price, gx + gcw, y + gcw * 0.72 + 30);
      ctx.restore();
      hairline(ctx, gx, y + gcw * 0.72 + 46, gcw, rule);
    });
    y += gcw * 0.72 + 80 * air;
  } else if (a.goal === "lead") {
    // 相談：問い合わせ導線を最上部に
    box(ctx, pad, y, inner, 150, t.card, p.soft);
    display(k.bandTitle, pad + 40, y + 62, 24, p.text);
    para(ctx, k.ctaNote, pad + 40, y + 92, inner * 0.5, 13, 22, p.sub, font, 400, "left", 1);
    solidBtn(W - pad - 260, y + 46, k.cta, p.primary, "#ffffff", 220, 56);
    y += 150 + 80 * air;
  } else if (a.goal === "brand") {
    // 世界観：大きな一文だけを置く
    ctx.save();
    ctx.textAlign = "center";
    display(k.aboutTitle, W / 2, y + 60, 34, p.text, "center");
    ctx.restore();
    para(ctx, k.lead, W / 2, y + 104, inner * 0.6, 14, 26, p.sub, font, 400, "center", 2);
    y += 150 + 70 * air;
  } else {
    // ファン：SNSとLINEを最上部に
    const names = ["IG", "TT", "YT", "X", "note"];
    names.forEach((n, i) => {
      const cx = pad + 30 + i * 78;
      box(ctx, cx - 26, y + 14, 52, 52, t.radius ? 26 : 4, i % 2 ? p.accent : p.primary);
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.font = `700 13px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n, cx, y + 40);
      ctx.restore();
    });
    box(ctx, W - pad - 280, y + 14, 280, 52, t.radius ? 26 : 4, "#06c755");
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 15px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("LINE友だち追加", W - pad - 140, y + 40);
    ctx.restore();
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "left";
    y += 80 + 80 * air;
  }

  /* ---- シグネチャ：一点だけ過剰にする ---- */
  const sig = signatureFor(a, seed);
  if (sig === "oversizedType") {
    // 画面幅いっぱいの極大タイポ。読ませる前に「殴る」。
    const word = k.h1[1].replace(/[。、]/g, "");
    ctx.save();
    let size = 300;
    ctx.font = `${headWeight} ${size}px ${headFont}`;
    while (ctx.measureText(word).width > W - 40 && size > 40) {
      size -= 4;
      ctx.font = `${headWeight} ${size}px ${headFont}`;
    }
    ctx.fillStyle = rgba(p.primary, a.tone === "pop" ? 1 : 0.14);
    ctx.textAlign = "center";
    ctx.fillText(word, W / 2, y + size * 0.82);
    ctx.restore();
    y += size * 0.95 + 70 * air;
  } else if (sig === "verticalBand") {
    // 縦書きの一行を、余白の中に一本だけ通す
    const h2 = 420;
    artwork(ctx, pad, y, inner * 0.58, h2, t.card, p, secKinds[0], seed + 21, font, initial);
    vtext(ctx, k.aboutTitle.replace(/[。]/g, ""), W - pad - 40, y + 20, 30, p.text, serif, 500, 40);
    vtext(ctx, k.lead.replace(/[。]/g, ""), W - pad - 110, y + 40, 14, p.sub, serif, 400, 20);
    y += h2 + 90 * air;
  } else if (sig === "fullBleedWord") {
    // 全面写真に、白抜きの一語だけ
    const h2 = 380;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, y, W, h2);
    ctx.clip();
    artwork(ctx, 0, y - 40, W, h2 + 80, 0, p, "scenery", seed + 33, font, initial);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, y, W, h2);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.letterSpacing = "14px";
    ctx.font = `${headWeight} 56px ${headFont}`;
    // 途中で切れた文字列を置くと事故に見えるので、読点までの一句をそのまま使う
    const clause = k.aboutTitle.split(/[、。]/).filter(Boolean)[0] ?? k.h1[1];
    const word = clause.length > 12 ? (k.h1[1].replace(/[。、]/g, "") || clause.slice(0, 8)) : clause;
    ctx.fillText(word, W / 2, y + h2 / 2 + 18);
    ctx.restore();
    y += h2 + 90 * air;
  } else if (sig === "giantNumber") {
    // 数字を並べるのではなく、1つだけ巨大に置く
    const [num, label] = k.stats[0];
    ctx.save();
    ctx.fillStyle = p.text;
    ctx.font = `300 200px ${headFont}`;
    ctx.fillText(num, pad, y + 170);
    const nw = ctx.measureText(num).width;
    ctx.restore();
    ctx.save();
    ctx.fillStyle = p.sub;
    ctx.font = `500 13px ${font}`;
    ctx.letterSpacing = "3px";
    ctx.fillText(label, pad + nw + 28, y + 80);
    ctx.restore();
    para(ctx, k.aboutBody, pad + nw + 28, y + 112, inner - nw - 28, 15, 30, p.sub, font, 400, "left", 3);
    y += 210 + 90 * air;
  } else if (sig === "collage") {
    // 色面と複数写真を組み合わせた“編集された絵”
    collageBlock(ctx, pad, y, inner, 460, p, a, seed, font, initial, t.card);
    y += 460 + 90 * air;
  } else {
    // 端に寄せた索引。中央揃えの安全な構図を捨てる。
    hairline(ctx, pad, y, inner, rule);
    const rows = k.items;
    rows.forEach((it, i) => {
      const ry = y + 40 + i * 76;
      ctx.save();
      ctx.fillStyle = p.sub;
      ctx.font = `500 11px ${font}`;
      ctx.letterSpacing = "2px";
      ctx.fillText(String(i + 1).padStart(2, "0"), pad, ry + 26);
      ctx.restore();
      display(it.name, pad + 70, ry + 32, 26, p.text);
      ctx.save();
      ctx.textAlign = "right";
      ctx.fillStyle = p.sub;
      ctx.font = `400 13px ${font}`;
      ctx.fillText(it.price, W - pad, ry + 32);
      ctx.restore();
      hairline(ctx, pad, ry + 56, inner, rule);
    });
    y += 40 + rows.length * 76 + 80 * air;
  }

  /* ---- ABOUT（非対称レイアウト） ---- */
  const aw = inner * 0.46;
  const tw = inner - aw - 76;
  artwork(ctx, pad, y, aw, 420, t.card, p, a.hero === "product" ? "scenery" : "person", seed + 41, font, initial);
  const tx = pad + aw + 76;
  eyebrow("ABOUT", tx, y + 34);
  display(k.aboutTitle, tx, y + 96, 32, p.text);
  let ay = y + 136;
  ay += para(ctx, k.aboutBody, tx, ay, tw, bodySize, bodyLh, p.sub, font, 400, "left", bodyLines) + 34;
  arrowLink(ctx, "わたしたちについて", tx, ay, p.primary, font);
  y += Math.max(420, ay - y + 40) + 96 * air;

  /* ---- 目的別セクション ---- */
  if (a.goal === "lead") {
    box(ctx, pad, y, inner, 372, t.card, p.soft);
    eyebrow("CONTACT", W / 2, y + 56, "center");
    display("お問い合わせ", W / 2, y + 106, 28, p.text, "center");
    para(ctx, "内容を確認のうえ、1営業日以内にご返信いたします。", W / 2, y + 138, 560, 13, 22, p.sub, font, 400, "center", 1);
    const fw = 560;
    const fx = W / 2 - fw / 2;
    ["お名前", "メールアドレス", "ご相談内容"].forEach((lb, i) => {
      const fy = y + 166 + i * 52;
      box(ctx, fx, fy, fw, 42, t.radius ? 21 : 2, "#ffffff");
      ctx.save();
      ctx.fillStyle = rgba(p.sub, 0.8);
      ctx.font = `400 13px ${font}`;
      ctx.textBaseline = "middle";
      ctx.fillText(lb, fx + 18, fy + 21);
      ctx.restore();
    });
    solidBtn(W / 2 - 110, y + 322 - 2, "送信する", p.primary, "#ffffff", 220, 46);
    y += 372 + 96 * air;
  } else if (a.goal === "fan") {
    eyebrow("FOLLOW", W / 2, y, "center");
    display("SNSでも発信しています", W / 2, y + 50, 28, p.text, "center");
    const names = ["Instagram", "TikTok", "YouTube", "X", "note"];
    names.forEach((n, i) => {
      const cx = W / 2 - (names.length - 1) * 60 + i * 120;
      box(ctx, cx - 34, y + 88, 68, 68, t.radius ? 34 : 4, i % 2 ? p.accent : p.primary);
      ctx.save();
      ctx.fillStyle = "#ffffff";
      ctx.font = `700 15px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(n.slice(0, 2), cx, y + 123);
      ctx.fillStyle = p.sub;
      ctx.font = `400 11px ${font}`;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(n, cx, y + 178);
      ctx.restore();
    });
    box(ctx, W / 2 - 160, y + 208, 320, 58, t.radius ? 29 : 2, "#06c755", 20);
    ctx.save();
    ctx.fillStyle = "#ffffff";
    ctx.font = `700 17px ${font}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("LINE友だち追加", W / 2, y + 237);
    ctx.restore();
    y += 300 + 96 * air;
  }

  /* ---- 一覧セクション ---- */
  if (a.layout !== "card") {
    const used = sectionHead(k.secLabel, k.secTitle, y, k.secLead);
    ctx.save();
    ctx.textAlign = "right";
    ctx.fillStyle = p.primary;
    ctx.font = `600 13px ${font}`;
    ctx.fillText("すべて見る →", W - pad, y + 84);
    ctx.restore();
    y += used + 44;
    const shown = itemCount <= k.items.length ? k.items.slice(0, itemCount) : [...k.items, k.items[0]].slice(0, itemCount);
    const cw = (inner - 28 * (shown.length - 1)) / shown.length;
    shown.forEach((it, i) => {
      const cx = pad + i * (cw + 28);
      artwork(ctx, cx, y, cw, cw * 1.15, t.card, p, secKinds[i % 3], seed + i * 613, font, initial);
      ctx.save();
      ctx.fillStyle = p.text;
      ctx.font = `700 17px ${font}`;
      ctx.fillText(it.name, cx, y + cw * 1.15 + 40);
      ctx.restore();
      para(ctx, it.desc, cx, y + cw * 1.15 + 68, cw, 13, 22, p.sub, font, 400, "left", a.density === "heavy" ? 3 : 2);
      hairline(ctx, cx, y + cw * 1.15 + 124, cw, rule);
      ctx.save();
      ctx.fillStyle = p.text;
      ctx.font = `600 15px ${font}`;
      ctx.fillText(it.price, cx, y + cw * 1.15 + 152);
      ctx.restore();
    });
    y += cw * 1.15 + 190 + 90 * air;
  }

  /* ---- お客様の声：全サイトに必ず置くのをやめ、本当に効く業種だけに ---- */
  const needsProof = a.goal === "lead" || a.industry === "salon" || a.industry === "stay" || a.industry === "school";
  if (needsProof) {
    hairline(ctx, pad, y, inner, rule);
    ctx.save();
    ctx.fillStyle = rgba(p.primary, 0.25);
    ctx.font = `700 64px ${serif}`;
    ctx.fillText("“", pad, y + 74);
    ctx.restore();
    display(k.quote, pad + 74, y + 78, 26, p.text);
    para(ctx, k.voice, pad + 74, y + 122, inner * 0.56, 14, 27, p.sub, font, 400, "left", 3);
    ctx.save();
    ctx.fillStyle = p.sub;
    ctx.font = `500 12px ${font}`;
    ctx.letterSpacing = "1px";
    ctx.fillText(k.who, pad + 74, y + 224);
    ctx.restore();
    artwork(ctx, W - pad - 200, y + 40, 200, 200, 0, p, "person", seed + 77, font, initial);
    hairline(ctx, pad, y + 268, inner, rule);
    y += 268 + 92 * air;

  }

  /* ---- CTA（フルブリードの写真帯） ---- */
  const bandH = 340;
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, y, W, bandH);
  ctx.clip();
  artwork(ctx, 0, y - 60, W, bandH + 120, 0, p, a.hero === "logo" ? "scenery" : a.hero, seed + 555, font, initial);
  const cscrim = ctx.createLinearGradient(0, y, 0, y + bandH);
  cscrim.addColorStop(0, "rgba(0,0,0,0.52)");
  cscrim.addColorStop(1, "rgba(0,0,0,0.62)");
  ctx.fillStyle = cscrim;
  ctx.fillRect(0, y, W, bandH);
  ctx.restore();
  eyebrow(k.eyebrow, W / 2, y + 92, "center", "rgba(255,255,255,0.75)");
  display(k.bandTitle, W / 2, y + 156, 34, "#ffffff", "center");
  para(ctx, k.bandBody, W / 2, y + 192, 620, 14, 24, "rgba(255,255,255,0.82)", font, 400, "center", 1);
  ctx.save();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  const cbw = 280;
  ctx.strokeRect(W / 2 - cbw / 2 + 0.5, y + 224.5, cbw, 56);
  ctx.fillStyle = "#ffffff";
  ctx.font = `600 15px ${font}`;
  ctx.letterSpacing = "2px";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(k.cta, W / 2, y + 253);
  ctx.restore();
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  y += bandH + 100 * air;

  /* ---- フッター ---- */
  const fh = 268;
  ctx.fillStyle = p.dark;
  ctx.fillRect(0, y, W, fh);
  wordmark(ctx, siteName, pad, y + 68, 20, "#ffffff", font, serif, a.tone, 3);
  para(
    ctx,
    "〒000-0000 ◯◯県◯◯市◯◯町1-2-3\n営業時間 9:00–17:00（土日祝を除く）",
    pad,
    y + 100,
    300,
    12,
    22,
    "rgba(255,255,255,0.6)",
    font,
    400,
  );
  const cols: [string, string[]][] = [
    ["ABOUT", ["わたしたちについて", "工房のこと", "採用情報"]],
    [k.secLabel, [k.items[0].name, k.items[1].name, k.items[2].name]],
    ["SUPPORT", ["よくあるご質問", "特定商取引法", "プライバシー"]],
  ];
  cols.forEach(([title, links], i) => {
    const cx = W - pad - 3 * 190 + i * 190;
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = `600 11px ${font}`;
    ctx.letterSpacing = "2px";
    ctx.fillText(title, cx, y + 62);
    ctx.restore();
    links.forEach((l, j) => {
      ctx.save();
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.font = `400 12px ${font}`;
      ctx.fillText(l.length > 12 ? l.slice(0, 12) + "…" : l, cx, y + 92 + j * 26);
      ctx.restore();
    });
  });
  hairline(ctx, pad, y + fh - 56, inner, "rgba(255,255,255,0.14)");
  ctx.save();
  ctx.fillStyle = "rgba(255,255,255,0.45)";
  ctx.font = `400 11px ${font}`;
  ctx.fillText(`© 2026 ${siteName.toUpperCase()}`, pad, y + fh - 26);
  ctx.textAlign = "right";
  ctx.fillText(`${p.name} / ${a.tone} / ${a.layout}`, W - pad, y + fh - 26);
  ctx.restore();

  return y + fh;
}


/* ============================== thumbnail draw ============================ */
/** 選択肢カードに出す小さな完成イメージ。本番と同じ artwork エンジンを使う。 */
function drawThumb(ctx: CanvasRenderingContext2D, a: Full, w: number, h: number, font: string) {
  DESATURATE = a.palette === "mono";
  usePhotosFor(a); // サムネでも配色ごとに正しい色で見せる
  const p = PALETTES[a.palette];
  const t = TONES[a.tone];
  const r = Math.min(10, t.card === 0 ? 1 : t.card / 2);
  const seed = hashString(JSON.stringify(a));
  const pad = w * 0.07;
  const inner = w - pad * 2;
  const rows = a.density === "light" ? 2 : a.density === "balanced" ? 3 : 4;

  ctx.clearRect(0, 0, w, h);

  if (a.tone === "wamodern") {
    ctx.fillStyle = "#ebebeb";
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "#1c1c1c";
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.moveTo(10 + i * 4, 12);
      ctx.lineTo(10 + i * 4, 22);
      ctx.stroke();
    }
    fanMark(ctx, w - 16, 10, 8, "#1c1c1c");
    vtext(ctx, "扇屋", w - 16, 24, 9, "#1c1c1c", font, 500, 11);
    ctx.fillStyle = "#6d6d6d";
    rr(ctx, 34, 30, 90, 3, 1.5);
    ctx.fill();
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(w * 0.42, 44 + h * 0.62, w * 1.02, h * 0.62, 0, 0, Math.PI * 2);
    ctx.clip();
    artwork(ctx, 0, 44, w, h * 0.42, 0, p, a.hero, seed, font, "扇");
    ctx.restore();
    const gy = 44 + h * 0.42 + 22;
    const iw2 = (w - 60) / 4 - 5;
    for (let i = 0; i < 4; i++) {
      const x = 30 + i * (iw2 + 5);
      artwork(ctx, x, gy, iw2, iw2, 0, p, "product", seed + i * 331, font, "菓");
      vtext(ctx, "羊羹", x + iw2 - 5, gy - 16, 6, "#1c1c1c", font, 400, 7.5);
      ctx.fillStyle = "#1c1c1c";
      rr(ctx, x, gy + iw2 + 5, iw2 * 0.6, 3, 1.5);
      ctx.fill();
    }
    return;
  }

  if (a.tone === "patisserie") {
    ctx.fillStyle = "#fdf8ee";
    ctx.fillRect(0, 0, w, h);
    const gold = "#b3924f";
    loopBorder(ctx, 4, 8, w, gold, false, 11);
    ctx.save();
    archClip(ctx, 0, 20, w, h * 0.44, 16);
    ctx.clip();
    artwork(ctx, 0, 12, w, h * 0.5, 0, p, a.hero, seed, font, "W");
    ctx.restore();
    vtext(ctx, "はちと", w - 14, 40, 13, "#2c2118", font, 400, 17);
    vtext(ctx, "ワルツ", w - 34, 48, 13, "#2c2118", font, 400, 17);
    const cy2 = 20 + h * 0.44 + 14;
    const colW2 = w * 0.42;
    const colX2 = w / 2 - colW2 / 2;
    ctx.fillStyle = "#fdf1e7";
    ctx.fillRect(colX2, cy2, colW2, h - cy2 - 10);
    loopBorder(ctx, colX2 - 7, cy2 + 4, h - cy2 - 16, gold, true, 10);
    loopBorder(ctx, colX2 + colW2 + 7, cy2 + 4, h - cy2 - 16, gold, true, 10);
    ctx.fillStyle = gold;
    ["ABOUT", "MENU", "NEWS"].forEach((m, i) => {
      rr(ctx, 14, cy2 + 6 + i * 16, 34, 5, 2);
      ctx.fill();
    });
    ctx.fillStyle = "rgba(75,58,38,0.55)";
    for (let i = 0; i < 4; i++) {
      rr(ctx, colX2 + colW2 * 0.15, cy2 + 12 + i * 11, colW2 * 0.7, 3.5, 1.75);
      ctx.fill();
    }
    box(ctx, w / 2 - 34, cy2 + 62, 68, 16, 8, "#f3e3c8");
    return;
  }

  ctx.fillStyle = p.bg;
  ctx.fillRect(0, 0, w, h);

  // nav
  ctx.fillStyle = p.text;
  rr(ctx, pad, h * 0.055, inner * 0.24, 5, 2.5);
  ctx.fill();
  ctx.fillStyle = p.line;
  for (let i = 0; i < 3; i++) {
    rr(ctx, pad + inner - 62 + i * 22, h * 0.058, 16, 4, 2);
    ctx.fill();
  }

  let y = h * 0.13;
  const txt = (x: number, yy: number, ww: number, n: number, lh: number, col = p.line) => {
    ctx.fillStyle = col;
    for (let i = 0; i < n; i++) {
      rr(ctx, x, yy + i * lh, i === n - 1 ? ww * 0.6 : ww, 3.5, 1.75);
      ctx.fill();
    }
  };

  if (a.layout === "fullhero") {
    const hh = h * 0.42;
    artwork(ctx, 0, y, w, hh, 0, p, a.hero, seed, font, "A");
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(0, y, w, hh);
    ctx.fillStyle = "#fff";
    rr(ctx, w / 2 - inner * 0.24, y + hh * 0.38, inner * 0.48, 7, 3.5);
    ctx.fill();
    rr(ctx, w / 2 - inner * 0.15, y + hh * 0.55, inner * 0.3, 5, 2.5);
    ctx.fill();
    box(ctx, w / 2 - 26, y + hh * 0.74, 52, 13, t.radius ? 6.5 : 1, "#ffffff");
    y += hh + h * 0.06;
  } else if (a.layout === "split") {
    const hh = h * 0.4;
    const cw = (inner - 8) / 2;
    ctx.fillStyle = p.text;
    rr(ctx, pad, y + 8, cw * 0.85, 7, 3.5);
    ctx.fill();
    rr(ctx, pad, y + 21, cw * 0.6, 7, 3.5);
    ctx.fill();
    txt(pad, y + 38, cw, 2, 8);
    box(ctx, pad, y + 62, 40, 12, t.radius ? 6 : 1, p.primary);
    artwork(ctx, pad + cw + 8, y, cw, hh, r, p, a.hero, seed, font, "A");
    y += hh + h * 0.06;
  } else if (a.layout === "card") {
    const hh = h * 0.2;
    artwork(ctx, 0, y, w, hh, 0, p, a.hero, seed, font, "A");
    ctx.fillStyle = "rgba(0,0,0,0.32)";
    ctx.fillRect(0, y, w, hh);
    ctx.fillStyle = "#fff";
    rr(ctx, w / 2 - inner * 0.2, y + hh * 0.42, inner * 0.4, 6, 3);
    ctx.fill();
    y += hh + 8;
    const cw = (inner - 12) / 3;
    for (let i = 0; i < 3; i++) {
      const cx = pad + i * (cw + 6);
      box(ctx, cx, y, cw, h * 0.26, r, "#ffffff", 6);
      artwork(ctx, cx, y, cw, h * 0.15, r, p, a.hero, seed + i * 977, font, "A");
      txt(cx + 4, y + h * 0.18, cw - 8, 2, 7);
    }
    y += h * 0.26 + h * 0.05;
  } else {
    ctx.fillStyle = p.accent;
    rr(ctx, pad, y + 2, 24, 4, 2);
    ctx.fill();
    ctx.fillStyle = p.text;
    rr(ctx, pad, y + 12, inner * 0.62, 7, 3.5);
    ctx.fill();
    artwork(ctx, pad, y + 26, inner, h * 0.3, r, p, a.hero, seed, font, "A");
    y += h * 0.3 + 34;
    txt(pad, y, inner * 0.46, 2, 8);
    txt(pad + inner * 0.54, y, inner * 0.46, 2, 8);
    y += 26;
  }

  // 目的別モジュール（ここで goal の違いが絵として出る）
  const mh = Math.max(20, h * 0.17);
  if (a.goal === "shop") {
    const cw = (inner - 12) / 3;
    for (let i = 0; i < 3; i++) {
      const cx = pad + i * (cw + 6);
      artwork(ctx, cx, y, cw, mh * 0.62, r, p, "product", seed + i * 131, font, "A");
      ctx.fillStyle = p.text;
      rr(ctx, cx, y + mh * 0.7, cw * 0.42, 4, 2);
      ctx.fill();
      box(ctx, cx + cw - 16, y + mh * 0.66, 16, 10, t.radius ? 5 : 1, p.primary);
    }
  } else if (a.goal === "lead") {
    box(ctx, pad, y, inner, mh, r, p.soft);
    for (let i = 0; i < 2; i++) {
      box(ctx, pad + 8, y + 6 + i * 14, inner - 16, 10, 3, "#ffffff");
    }
    box(ctx, pad + inner / 2 - 26, y + mh - 16, 52, 12, t.radius ? 6 : 1, p.primary);
  } else if (a.goal === "fan") {
    box(ctx, pad, y, inner, mh, r, p.soft);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = i % 2 ? p.accent : p.primary;
      ctx.beginPath();
      ctx.arc(pad + inner * (0.16 + i * 0.17), y + mh * 0.38, 8, 0, Math.PI * 2);
      ctx.fill();
    }
    box(ctx, pad + inner / 2 - 34, y + mh - 16, 68, 12, t.radius ? 6 : 1, "#06c755");
  } else {
    const aw2 = (inner - 8) / 2;
    artwork(ctx, pad, y, aw2, mh, r, p, "scenery", seed + 41, font, "A");
    txt(pad + aw2 + 8, y + 4, aw2, rows, 8);
  }
  y += mh + h * 0.05;

  // CTA バンド
  const bh = Math.max(16, h * 0.11);
  ctx.save();
  rr(ctx, pad, y, inner, bh, r);
  ctx.clip();
  const g = ctx.createLinearGradient(pad, y, pad + inner, y + bh);
  g.addColorStop(0, p.primary);
  g.addColorStop(1, p.primaryDeep);
  ctx.fillStyle = g;
  ctx.fillRect(pad, y, inner, bh);
  ctx.restore();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  rr(ctx, w / 2 - inner * 0.16, y + bh / 2 - 2.5, inner * 0.32, 5, 2.5);
  ctx.fill();
  y += bh + 8;

  // footer
  ctx.fillStyle = p.dark;
  ctx.fillRect(0, Math.min(y, h - 14), w, h - Math.min(y, h - 14));
}

const OptionThumb = memo(function OptionThumb({ preview, version }: { preview: Full; version: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  // preview は毎レンダー新しいオブジェクトなので、中身が同じなら再描画しない
  const key = JSON.stringify(preview);
  useEffect(() => {
    void version; // 写真が届いたら描き直す
    const c = ref.current;
    if (!c) return;
    const w = 320;
    const h = 216;
    const s = 2;
    c.width = w * s;
    c.height = h * s;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    const font = getComputedStyle(c).fontFamily || "sans-serif";
    const serif =
      (SERIF_STACK.value || '"Noto Serif JP", serif');

    // 本番とまったく同じ描画エンジンで描いて、上部を縮小して見せる。
    // ワイヤーフレーム風の代用表現をやめることで、選ぶ前から実物が分かる。
    const cropH = Math.round((W * h) / w);
    const draw = () => {
      const off = document.createElement("canvas");
      off.width = W;
      off.height = cropH;
      const octx = off.getContext("2d");
      if (!octx) return;
      try {
        drawSite(octx, preview, "YOUR SITE", font, serif);
      } catch {
        drawThumb(octx, preview, W, cropH, font);
      }
      ctx.clearRect(0, 0, w * s, h * s);
      ctx.drawImage(off, 0, 0, W, cropH, 0, 0, w * s, h * s);
    };
    draw();
    const fonts = (document as unknown as { fonts?: FontFaceSet }).fonts;
    fonts?.ready?.then(draw).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, version]);
  return <canvas ref={ref} className="block h-auto w-full rounded-lg ring-1 ring-black/5" />;
})

/* ================================ component =============================== */

export default function IdealHpBuilder() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [siteNameInput, setSiteNameInput] = useState("YOUR SITE");
  const [siteName, setSiteName] = useState("YOUR SITE");
  const [busy, setBusy] = useState(false);
  const [credits, setCredits] = useState<Credit[]>([]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const serifRef = useRef<HTMLSpanElement | null>(null);

  const [copied, setCopied] = useState(false);
  const [photoVersion, setPhotoVersion] = useState(0);
  const [variant, setVariant] = useState(0);
  const previewRef = useRef<HTMLCanvasElement | null>(null);
  /** 未回答はデフォルトで埋めた、いま時点の「仮の完成形」 */
  const merged = useMemo(() => ({ ...DEFAULTS, ...answers }) as Full, [answers]);
  const complete = useMemo(() => QUESTIONS.every((q) => answers[q.key]), [answers]);
  const done = step >= QUESTIONS.length && complete;
  const current = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];

  /** 完成イメージが使っている UI パターンと、そのまま AI に貼れる指示文 */
  const patterns = useMemo(() => patternsFor(merged), [merged]);
  const reasons = useMemo(
    () => reasonsFor(merged, PALETTES[merged.palette]?.name ?? ""),
    [merged],
  );
  const aiPrompt = useMemo(() => {
    const toneLabel = QUESTIONS.find((q) => q.key === "tone")?.options.find((o) => o.id === merged.tone)?.label ?? "";
    return promptFor(merged, siteName.trim(), toneLabel, PALETTES[merged.palette]?.name ?? "");
  }, [merged, siteName]);

  const copyPrompt = useCallback(() => {
    void navigator.clipboard
      .writeText(aiPrompt)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        /* 権限が無い環境ではテキストを手で選んでもらう */
      });
  }, [aiPrompt]);

  const render = useCallback(() => {
    VARIANT = variant;
    const visible = canvasRef.current;
    if (!visible || !complete) return;
    const font =
      (typeof window !== "undefined" && getComputedStyle(visible).fontFamily) || '"Noto Sans JP", sans-serif';
    const serif =
      (typeof window !== "undefined" && serifRef.current && getComputedStyle(serifRef.current).fontFamily) ||
      '"Noto Serif JP", serif';
    SERIF_STACK.value = serif;

    // まず等倍で高さを測る（iOS Safari は canvas 面積 ~16.7M px で描画が消えるため）
    const probe = document.createElement("canvas");
    probe.width = W;
    probe.height = MAXH;
    const pctx = probe.getContext("2d");
    if (!pctx) return;
    const measured = drawSite(pctx, answers as Full, siteName.trim() || "YOUR SITE", font, serif);
    const height = Math.min(Math.round(measured), MAXH);
    const scale = Math.max(1, Math.min(2, Math.sqrt(MAX_CANVAS_PX / (W * height))));

    const off = document.createElement("canvas");
    off.width = Math.round(W * scale);
    off.height = Math.round(height * scale);
    const octx = off.getContext("2d");
    if (!octx) return;
    octx.scale(scale, scale);
    drawSite(octx, answers as Full, siteName.trim() || "YOUR SITE", font, serif);

    visible.width = off.width;
    visible.height = off.height;
    const vctx = visible.getContext("2d");
    if (!vctx) return;
    vctx.drawImage(off, 0, 0);
  }, [answers, complete, siteName, variant]);

  // 入力中は再描画しない（1文字ごとに全ページ描き直すと重い）
  useEffect(() => {
    const id = setTimeout(() => setSiteName(siteNameInput), 400);
    return () => clearTimeout(id);
  }, [siteNameInput]);

  // いま表示している選択肢すべてぶんの写真を先読みする。
  // 業種の質問では選択肢ごとに写真が変わるので、まとめて取らないとサムネが全部同じ絵になる。
  useEffect(() => {
    let alive = true;
    const q = QUESTIONS[Math.min(step, QUESTIONS.length - 1)];
    const variants: Full[] = [merged];
    if (!done && (q.key === "industry" || q.key === "tone")) {
      q.options.forEach((o) => variants.push({ ...merged, [q.key]: o.id } as Full));
    }
    // 同じ写真セットを二度取りしない
    const uniq = new Map<string, Full>();
    variants.forEach((v) => uniq.set(photoKey(v), v));

    const load = (v: Full, light: boolean) => {
      const key = JSON.stringify({ i: v.industry, t: v.tone === "wamodern" ? "wa" : "-", light });
      let pending = PHOTO_CACHE.get(key);
      if (!pending) {
        // サムネ用は必要な2種類・2枚だけ。全部取ると開いた瞬間に数十リクエストが飛ぶ。
        pending = light
          ? fetchPhotoSet(v, [v.hero as PhotoKind, "scenery", "product"], 4)
          : fetchPhotoSet(v);
        PHOTO_CACHE.set(key, pending);
        void pending.then((r) => {
          if (!r) PHOTO_CACHE.delete(key);
        });
      }
      return pending;
    };

    // 同時実行を絞る（開発サーバーを詰まらせない）
    const runLimited = async (jobs: (() => Promise<PhotoSet | null>)[], limit = 3) => {
      const out: (PhotoSet | null)[] = [];
      let i = 0;
      const workers = Array.from({ length: Math.min(limit, jobs.length) }, async () => {
        while (i < jobs.length) {
          const idx = i++;
          out[idx] = await jobs[idx]();
        }
      });
      await Promise.all(workers);
      return out;
    };

    const entries = [...uniq.entries()];
    const jobs = entries.map(([k, v]) => () => load(v, k !== photoKey(merged)));
    runLimited(jobs).then((sets) => {
      if (!alive) return;
      const own = PHOTO_SETS.get(photoKey(merged));
      if (own) setCredits(own.credits);
      else {
        const first = sets.find(Boolean);
        if (first) setCredits(first.credits);
      }
      setPhotoVersion((v) => v + 1);
    });
    return () => {
      alive = false;
    };
  }, [merged, step, done]);

  // ライブプレビュー（質問中もいまの選択で完成形を描き続ける）
  useEffect(() => {
    VARIANT = variant;
    const c = previewRef.current;
    if (!c) return;
    const font = getComputedStyle(c).fontFamily || '"Noto Sans JP", sans-serif';
    const serif =
      (serifRef.current && getComputedStyle(serifRef.current).fontFamily) || '"Noto Serif JP", serif';
    SERIF_STACK.value = serif;
    const off = document.createElement("canvas");
    off.width = W;
    off.height = MAXH;
    const octx = off.getContext("2d");
    if (!octx) return;
    const h = drawSite(octx, merged, siteName.trim() || "YOUR SITE", font, serif);
    c.width = W;
    c.height = Math.round(h);
    c.getContext("2d")?.drawImage(off, 0, 0, W, h, 0, 0, W, h);
  }, [merged, photoVersion, siteName, step, variant]);

  // 回答が確定したら、高解像度で本番描画する
  useEffect(() => {
    if (!done) return;
    let alive = true;
    setBusy(true);
    (async () => {
      const key = JSON.stringify(answers);
      // StrictMode の二重実行でも取りこぼさないよう、進行中の Promise ごとキャッシュする
      let pending = PHOTO_CACHE.get(key);
      if (!pending) {
        pending = fetchPhotoSet(answers as Full);
        PHOTO_CACHE.set(key, pending);
        void pending.then((r) => {
          if (!r) PHOTO_CACHE.delete(key);
        });
      }
      const set = await pending;
      if (!alive) return;
      if (set) {
        PHOTOS = set;
        setCredits(set.credits);
      }
      const fonts = (document as unknown as { fonts?: FontFaceSet }).fonts;
      if (fonts?.ready) await fonts.ready.catch(() => {});
      if (!alive) return;
      requestAnimationFrame(() => {
        if (!alive) return;
        render();
        setBusy(false);
      });
    })();
    return () => {
      alive = false;
    };
  }, [done, render, answers]);

  const download = () => {
    const c = canvasRef.current;
    if (!c) return;
    const name = `ideal-hp-${siteName.trim().toLowerCase().replace(/\s+/g, "-") || "mysite"}.png`;
    const save = (href: string, revoke?: () => void) => {
      const link = document.createElement("a");
      link.download = name;
      link.href = href;
      link.click();
      if (revoke) setTimeout(revoke, 10000);
    };
    if (typeof c.toBlob === "function") {
      c.toBlob((blob) => {
        if (!blob) {
          save(c.toDataURL("image/png"));
          return;
        }
        const url = URL.createObjectURL(blob);
        save(url, () => URL.revokeObjectURL(url));
      }, "image/png");
    } else {
      save(c.toDataURL("image/png"));
    }
  };

  const shuffleSeed = () => setVariant((v) => v + 1);

  return (
    <div className="mx-auto w-full max-w-5xl px-5 py-10">
      {/* canvas に渡す明朝のフォントスタックを実測するためのプローブ */}
      <span
        ref={serifRef}
        aria-hidden
        className="pointer-events-none absolute -left-[9999px] top-0"
        style={{ fontFamily: "var(--font-display-jp), var(--font-serif-jp), serif" }}
      >
        明朝
      </span>
      <div className="mb-8 mx-auto max-w-3xl">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
          <span>
            STEP {Math.min(step + 1, QUESTIONS.length)} / {QUESTIONS.length}
          </span>
          {step > 0 && (
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} className="underline hover:text-slate-800">
              ← 前に戻る
            </button>
          )}
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-ocean-600 transition-all duration-300"
            style={{ width: `${(Math.min(step, QUESTIONS.length) / QUESTIONS.length) * 100}%` }}
          />
        </div>
      </div>

      {!done ? (
        <div key={current.key} className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{current.title}</h2>
          <p className="mt-2 text-sm text-slate-500">{current.hint}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {current.options.map((o) => {
              const selected = answers[current.key] === o.id;
              const preview = { ...DEFAULTS, ...answers, [current.key]: o.id } as Full;
              return (
                <button
                  key={o.id}
                  onClick={() => {
                    setAnswers((prev) => ({ ...prev, [current.key]: o.id }));
                    // すでに全問埋まっている＝チップからの修正なので、結果画面に戻す
                    setStep((s) => (complete ? QUESTIONS.length : s + 1));
                  }}
                  className={`overflow-hidden rounded-2xl border p-3 text-left transition hover:-translate-y-0.5 hover:border-ocean-500 hover:shadow-lg ${
                    selected ? "border-ocean-600 ring-2 ring-ocean-200" : "border-slate-200 bg-white"
                  }`}
                >
                  <div className="overflow-hidden rounded-lg bg-slate-100">
                    <OptionThumb preview={preview} version={photoVersion} />
                  </div>
                  <div className="mt-3 flex items-center gap-2 px-1">
                    <span className="font-bold text-slate-900">{o.label}</span>
                    {o.swatch && (
                      <span className="flex gap-1">
                        {o.swatch.map((s) => (
                          <span
                            key={s}
                            className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                            style={{ backgroundColor: s }}
                          />
                        ))}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 px-1 pb-1 text-sm text-slate-500">{o.desc}</div>
                </button>
              );
            })}
          </div>
          </div>

          {/* いまの選択で作った完成形を、質問中もずっと見せておく */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="mb-2 flex items-baseline justify-between">
              <p className="text-xs font-semibold tracking-widest text-slate-500">現在の完成イメージ</p>
              <p className="text-[10px] text-slate-400">選ぶたびに更新</p>
            </div>
            <div className="max-h-[70vh] overflow-y-auto rounded-xl border border-slate-200 bg-slate-50">
              <canvas ref={previewRef} className="block h-auto w-full" />
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
              未回答の項目は仮の設定で埋めています。最後まで答えると高解像度で書き出せます。
            </p>
          </aside>
        </div>
      ) : (
        <div>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">これがあなたの理想のHPです</h2>
            <p className="mt-2 text-sm text-slate-500">
              サイト名を入れると、ロゴ・URL・メインビジュアルまで作り直されます。画像はそのまま保存して制作の相談に使えます。
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <input
                value={siteNameInput}
                onChange={(e) => setSiteNameInput(e.target.value.slice(0, 24))}
                placeholder="サイト名"
                className="w-56 rounded-xl border border-slate-300 px-4 py-2 text-sm focus:border-ocean-500 focus:outline-none"
              />
              <button
                onClick={download}
                className="rounded-xl bg-ocean-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ocean-700"
              >
                画像をダウンロード
              </button>
              <button
                onClick={shuffleSeed}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                別パターンを生成
              </button>
              <button
                onClick={() => {
                  setAnswers({});
                  setStep(0);
                }}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                やり直す
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {QUESTIONS.map((q) => {
                const opt = q.options.find((o) => o.id === answers[q.key]);
                return (
                  <button
                    key={q.key}
                    onClick={() => setStep(QUESTIONS.indexOf(q))}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 hover:border-ocean-400 hover:bg-white"
                    title="ここを選び直す"
                  >
                    {opt?.label} <span className="text-slate-400">✎</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative mt-8 overflow-hidden rounded-3xl bg-slate-100 p-3 shadow-xl ring-1 ring-slate-200 sm:p-6">
            {busy && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70 text-sm text-slate-500">
                生成中…
              </div>
            )}
            <canvas ref={canvasRef} className="block h-auto w-full rounded-xl shadow-2xl" />
            {credits.length > 0 && (
              <p className="mt-3 px-1 text-[11px] leading-relaxed text-slate-500">
                Photos:{" "}
                {credits.map((c, i) => (
                  <span key={`${c.authorUrl}-${i}`}>
                    {i > 0 && "、"}
                    <a
                      href={c.authorUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-slate-800"
                    >
                      {c.author}
                    </a>
                    {c.license && c.licenseUrl ? (
                      <>
                        {" ("}
                        <a href={c.licenseUrl} target="_blank" rel="noreferrer" className="underline">
                          {c.license}
                        </a>
                        {")"}
                      </>
                    ) : c.license ? (
                      ` (${c.license})`
                    ) : null}
                  </span>
                ))}{" "}
                via{" "}
                {(() => {
                  const src = credits.find((c) => c.source)?.source ?? "unsplash";
                  const site =
                    src === "gemini"
                      ? { href: "https://deepmind.google/technologies/gemini/", label: "Gemini（AI生成）" }
                      : src === "openverse"
                      ? { href: "https://openverse.org", label: "Openverse" }
                      : src === "pexels"
                        ? { href: "https://www.pexels.com", label: "Pexels" }
                        : src === "pixabay"
                          ? { href: "https://pixabay.com", label: "Pixabay" }
                          : { href: "https://unsplash.com/?utm_source=ideal_hp&utm_medium=referral", label: "Unsplash" };
                  return (
                    <a href={site.href} target="_blank" rel="noreferrer" className="underline hover:text-slate-800">
                      {site.label}
                    </a>
                  );
                })()}
              </p>
            )}
          </div>

          <PatternGuide
            patterns={patterns}
            reasons={reasons}
            prompt={aiPrompt}
            onCopy={copyPrompt}
            copied={copied}
          />
        </div>
      )}
    </div>
  );
}

/**
 * 「あのUI、なんて頼めばいい？」を解消するセクション。
 * 完成イメージに使われている型に名前を与え、そのまま AI に貼れる指示文まで作る。
 */
function PatternGuide({
  patterns,
  reasons,
  prompt,
  onCopy,
  copied,
}: {
  patterns: UiPattern[];
  reasons: DesignReason[];
  prompt: string;
  onCopy: () => void;
  copied: boolean;
}) {
  const categories = Array.from(new Set(patterns.map((p) => p.category)));
  return (
    <section className="mx-auto mt-12 max-w-3xl">
      <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">「なんか良い」の正体</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        上のイメージが良く見えるとしたら、それはセンスではなく理由があります。種明かしします。
      </p>
      <ol className="mt-6 space-y-4">
        {reasons.map((r, i) => (
          <li key={r.title} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="flex items-baseline gap-3">
              <span className="font-mono text-sm text-ocean-600">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-bold text-slate-900">{r.title}</span>
            </p>
            <p className="mt-2 pl-8 text-sm leading-relaxed text-slate-600">{r.body}</p>
          </li>
        ))}
      </ol>

      <h3 className="mt-14 text-xl font-bold text-slate-900 sm:text-2xl">この画面の「部品の名前」</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        作りたい画面が浮かんでも、名前を知らないと頼めません。上のイメージに使われている型を並べました。
        この名前で伝えれば、AI にも制作会社にも「それっぽい画面」ではなく必要なものが届きます。
      </p>

      <div className="mt-6 space-y-6">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-xs font-semibold tracking-widest text-ocean-700">{cat}</p>
            <ul className="mt-2 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
              {patterns
                .filter((p) => p.category === cat)
                .map((p) => (
                  <li key={p.en} className="px-4 py-3">
                    <p className="flex flex-wrap items-baseline gap-x-2">
                      <span className="font-mono text-sm font-bold text-slate-900">{p.en}</span>
                      <span className="text-xs text-slate-500">{p.ja}</span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-600">{p.desc}</p>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-ocean-200 bg-ocean-50/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-bold text-slate-900">そのままAIに貼れる指示文</p>
            <p className="mt-1 text-xs text-slate-500">
              ChatGPT や Claude に貼り付けると、この構成のページを作らせられます。
            </p>
          </div>
          <button
            onClick={onCopy}
            className="rounded-xl bg-ocean-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-ocean-700"
          >
            {copied ? "コピーしました" : "指示文をコピー"}
          </button>
        </div>
        <pre className="mt-4 max-h-72 overflow-auto rounded-xl bg-white p-4 text-xs leading-relaxed text-slate-700 ring-1 ring-slate-200">
          {prompt}
        </pre>
      </div>
    </section>
  );
}
