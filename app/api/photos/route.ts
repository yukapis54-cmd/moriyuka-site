import { NextResponse } from "next/server";
import { cacheGet, cacheSet } from "../photos/cache";
import type { PhotoDto } from "../photos/types";

export const runtime = "nodejs";

type UnsplashPhoto = {
  id: string;
  urls: { regular: string; small: string };
  user: { name: string; links: { html: string } };
  links: { download_location: string };
};

/**
 * GET /api/photos?q=...&n=6&orientation=landscape
 * Unsplash のアクセスキーはサーバー側だけで保持する。
 * キー未設定・失敗時も 200 を返し、呼び出し側は手描きフォールバックに切り替える。
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") || "").trim();
  const n = Math.min(Math.max(Number(searchParams.get("n")) || 6, 1), 12);
  const orientation = searchParams.get("orientation") || "landscape";
  const key = process.env.UNSPLASH_ACCESS_KEY;

  if (!q) return NextResponse.json({ photos: [], fallback: true, reason: "no-query" });

  // 1) 永続キャッシュ（API を叩かない経路）。
  // キーに n は含めない。同じ検索語をサムネ用 n=2 と本番用 n=4 で二度取りに行かないため。
  const cacheKey = `${orientation}|${q}`;
  const cached = cacheGet(cacheKey);
  if (cached && cached.length >= n) {
    return NextResponse.json({ photos: cached.slice(0, n), fallback: false, source: "cache" });
  }

  const fetchN = Math.max(n, 4);
  const providers: ((query: string) => Promise<PhotoDto[]>)[] = [];
  if (key) providers.push((s) => searchUnsplash(s, fetchN, orientation, key));
  if (process.env.PEXELS_API_KEY)
    providers.push((s) => searchPexels(s, fetchN, orientation, process.env.PEXELS_API_KEY!));
  if (process.env.PIXABAY_API_KEY)
    providers.push((s) => searchPixabay(s, fetchN, orientation, process.env.PIXABAY_API_KEY!));

  // 検索語は「主題＋雰囲気の修飾」で長め。ゼロ件なら末尾から語を削って粘る
  // （ここで諦めると質の落ちる Openverse まで落ちてしまう）。
  for (const run of providers) {
    for (const candidate of queryVariants(q)) {
      // 少なめの要求でもまとめて取っておく（次に n=4 で来ても API を叩かずに済む）
      const photos = await run(candidate);
      if (photos.length) {
        cacheSet(cacheKey, photos); // 良い写真が取れたら保存して二度と API を叩かない
        return NextResponse.json({ photos: photos.slice(0, n), fallback: false, source: photos[0].source });
      }
    }
  }

  // どれも駄目なら、キー不要の Openverse（質は落ちるがページは止まらない）
  const alt = await searchOpenverse(q, n);
  return NextResponse.json({ photos: alt, fallback: alt.length === 0, source: "openverse" });
}

async function searchUnsplash(q: string, n: number, orientation: string, key: string): Promise<PhotoDto[]> {
  const endpoint =
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}` +
    `&per_page=${n}&orientation=${encodeURIComponent(orientation)}&content_filter=high&order_by=relevant`;
  try {
    const res = await fetch(endpoint, {
      headers: { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { results?: UnsplashPhoto[] };
    return (json.results || []).map((r) => ({
      id: r.id,
      url: proxied(r.urls.regular),
      thumb: proxied(r.urls.small),
      author: r.user?.name ?? "Unsplash",
      authorUrl: withUtm(r.user?.links?.html ?? "https://unsplash.com"),
      downloadLocation: r.links?.download_location ?? "",
      source: "unsplash" as const,
    }));
  } catch {
    return [];
  }
}

type PexelsPhoto = {
  id: number;
  src: { large2x: string; large: string; medium: string };
  photographer: string;
  photographer_url: string;
};

/** Pexels：無料・審査なし・200req/時。Unsplash が枯れたときの主力。 */
async function searchPexels(q: string, n: number, orientation: string, key: string): Promise<PhotoDto[]> {
  const o = orientation === "portrait" ? "portrait" : "landscape";
  const endpoint = `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${n}&orientation=${o}`;
  try {
    const res = await fetch(endpoint, { headers: { Authorization: key }, next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { photos?: PexelsPhoto[] };
    return (json.photos || []).map((r) => ({
      id: String(r.id),
      url: proxied(r.src.large2x || r.src.large),
      thumb: proxied(r.src.medium),
      author: r.photographer,
      authorUrl: r.photographer_url,
      downloadLocation: "",
      source: "pexels" as const,
    }));
  } catch {
    return [];
  }
}

type PixabayImage = {
  id: number;
  largeImageURL: string;
  webformatURL: string;
  user: string;
  pageURL: string;
};

/** Pixabay：無料・ほぼ無制限。最後の砦。 */
async function searchPixabay(q: string, n: number, orientation: string, key: string): Promise<PhotoDto[]> {
  const o = orientation === "portrait" ? "vertical" : "horizontal";
  const endpoint =
    `https://pixabay.com/api/?key=${encodeURIComponent(key)}&q=${encodeURIComponent(q)}` +
    `&image_type=photo&orientation=${o}&per_page=${Math.max(3, n)}&safesearch=true`;
  try {
    const res = await fetch(endpoint, { next: { revalidate: 86400 } });
    if (!res.ok) return [];
    const json = (await res.json()) as { hits?: PixabayImage[] };
    return (json.hits || []).map((r) => ({
      id: String(r.id),
      url: proxied(r.largeImageURL),
      thumb: proxied(r.webformatURL),
      author: r.user,
      authorUrl: r.pageURL,
      downloadLocation: "",
      source: "pixabay" as const,
    }));
  } catch {
    return [];
  }
}

/** 末尾から1語ずつ削った検索語を、長い順に返す（最短でも2語は残す） */
function queryVariants(q: string): string[] {
  const words = q.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  for (let len = words.length; len >= Math.min(2, words.length); len--) {
    out.push(words.slice(0, len).join(" "));
  }
  return out;
}

/** Unsplash API ガイドライン：撮影者リンクには referral パラメータを付ける */
function withUtm(url: string) {
  try {
    const u = new URL(url);
    u.searchParams.set("utm_source", "ideal_hp");
    u.searchParams.set("utm_medium", "referral");
    return u.toString();
  } catch {
    return url;
  }
}

/** 画像は必ず自前プロキシ経由にする（canvas を汚染させないため） */
function proxied(url: string) {
  return `/api/photos/img?u=${encodeURIComponent(url)}`;
}

type OpenverseImage = {
  id: string;
  url: string;
  thumbnail?: string;
  creator?: string;
  creator_url?: string;
  foreign_landing_url?: string;
  license?: string;
  license_version?: string;
  license_url?: string;
};

/** ヒットしなければ語を落として再検索する（長い検索語はゼロ件になりやすい） */
async function searchOpenverse(q: string, n: number): Promise<PhotoDto[]> {
  const candidates = [...queryVariants(q), q.split(/\s+/)[0]];
  for (const c of candidates) {
    const hit = await openverseOnce(c, n);
    if (hit.length) return hit;
  }
  return [];
}

async function openverseOnce(q: string, n: number): Promise<PhotoDto[]> {
  const endpoint =
    `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}` +
    `&page_size=${n}&license_type=commercial&mature=false`;
  try {
    const res = await fetch(endpoint, {
      headers: { "User-Agent": "moriyuka-site/1.0 (ideal-hp mockup generator)" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { results?: OpenverseImage[] };
    return (json.results || [])
      .filter((r) => r.url)
      .map((r) => ({
        id: r.id,
        url: proxied(r.url),
        thumb: proxied(r.thumbnail || r.url),
        author: r.creator || "Unknown",
        authorUrl: r.creator_url || r.foreign_landing_url || "https://openverse.org",
        downloadLocation: "",
        source: "openverse",
        license: r.license ? `CC ${r.license.toUpperCase()} ${r.license_version ?? ""}`.trim() : undefined,
        licenseUrl: r.license_url,
      }));
  } catch {
    return [];
  }
}
